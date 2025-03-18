import json
import re
from pathlib import Path
from typing import Any

filament_library_map = {"prusaslicer": "Templates", "orcaslicer": "OrcaFilamentLibrary"}

filament_profile_path = Path("./profiles")


def find_profile(slicer: str, printer_brand: str, printer_data: dict[str, Any], filament_name: str, filament_type: str):
    """
    Find a profile through various methods

    Search order:
    1) Specific profile
    2) Template profile
    3) Printer-specific generic profile
    4) Generic profile

    In each of these searches, a profile is first searched for under `./profiles/custom/{slicer name}`, then the slicer. This allows for custom profiles to effectively override profiles shipped with the slicer
    """
    if slicer == "cura":
        # Cura is not currently supported
        return None

    ret = find_specific_profile(slicer, printer_brand, printer_data, filament_name)
    if ret is not None:
        return ret

    ret = find_template_profile(slicer, filament_name)
    if ret is not None:
        return ret

    ret = find_printer_generic_profile(slicer, printer_brand, printer_data, filament_type)
    if ret is not None:
        return ret

    return find_generic_profile(slicer, filament_type)


def find_specific_profile(slicer: str, printer_brand: str, printer_data: dict[str, Any], filament_name: str):
    """Find a printer specific profile with the provided name"""
    custom_profiles_path = filament_profile_path.joinpath("custom").joinpath(slicer).joinpath(printer_brand)
    if custom_profiles_path.exists():
        matches = search_folder(custom_profiles_path, filament_name)
        match = find_compatible_match(matches, slicer, printer_data)
        if match is not None:
            return match

    slicer_profiles_path = filament_profile_path.joinpath(slicer).joinpath(printer_brand)
    if slicer_profiles_path.exists():
        matches = search_folder(slicer_profiles_path, filament_name)
        match = find_compatible_match(matches, slicer, printer_data)
        if match is not None:
            return match

    return None


def find_template_profile(slicer: str, filament_name: str):
    """Find a "template" profile from a filament library with the provided name"""
    if slicer in filament_library_map:
        filament_library_name = filament_library_map[slicer]
    else:
        filament_library_name = "CustomFilamentLibrary"

    custom_profiles_path = filament_profile_path.joinpath("custom").joinpath(slicer).joinpath(filament_library_name)
    if custom_profiles_path.exists():
        matches = search_folder(custom_profiles_path, filament_name)
        if len(matches) == 1:
            return matches[0]

    slicer_profiles_path = filament_profile_path.joinpath(slicer).joinpath(filament_library_name)
    if slicer_profiles_path.exists():
        matches = search_folder(slicer_profiles_path, filament_name)
        if len(matches) == 1:
            return matches[0]
    return None


def find_printer_generic_profile(slicer: str, printer_brand: str, printer_data: dict[str, Any], filament_type: str):
    """Find a generic profile that is compatible with the provided printer data"""
    custom_profiles_path = filament_profile_path.joinpath("custom").joinpath(slicer).joinpath(printer_brand)
    if custom_profiles_path.exists():
        matches = search_folder(custom_profiles_path, f"Generic {filament_type}")
        match = find_compatible_match(matches, slicer, printer_data)
        if match is not None:
            return match

    slicer_profiles_path = filament_profile_path.joinpath(slicer).joinpath(printer_brand)
    if slicer_profiles_path.exists():
        matches = search_folder(slicer_profiles_path, f"Generic {filament_type}")
        match = find_compatible_match(matches, slicer, printer_data)
        if match is not None:
            return match
    return None


def find_generic_profile(slicer: str, filament_type: str):
    """Find a generic, non-printer specific profile of the provided filament type"""
    return find_template_profile(slicer, f"Generic {filament_type}")


# 1) search the simplyprint vendor folder to see if the profile exists there
# 2) search the slicer vendor folder
# 3) search the simplyprint template/filament library folder
# 4) search the slicer template/filament library folder

def search_folder(path: Path, search_name: str):
    """Search the specified path recursively and find all profiles with the same name"""
    matches: list[tuple[Path, dict]] = []
    for _item in path.iterdir():
        if _item.is_dir():
            matches.extend(search_folder(_item, search_name))
            continue
        with _item.open() as f:
            file_data = json.load(f)
        name: str
        if "name" in file_data:
            name = file_data["name"]
        elif "filament_settings_id" in file_data:
            name = file_data["filament_settings_id"]
        else:
            continue

        if "@" in name:
            name = name[:name.rfind("@")].rstrip()

        if name == search_name:
            matches.append((_item, file_data))

    return matches


def find_compatible_match(matches: list[tuple[Path, dict]], slicer: str, printer_data: dict[str, Any]):
    """Takes a list of matches and returns the first one that is compatible with the provided printer data"""
    if slicer == "prusaslicer":
        printer_name = printer_data.get("printer_settings_id")
    else:
        printer_name = printer_data.get("name")
    for match_path, match_data in matches:
        if slicer == "prusaslicer":
            compatible_printers: str = match_data.get("compatible_printers")
            if compatible_printers:
                compatible_printers: list[str] = [x.strip('"').strip() for x in compatible_printers.split(";")]
                # iterate through and determine if the printer matches. It seems that PS uses printer models, not the full printer name
                for compatible_printer in compatible_printers:
                    if printer_name == compatible_printer:
                        return match_path, match_data

            # evaluate compatible printer condition
            if "compatible_printers_condition" not in match_data:
                continue
            if parse_compatible_printer_condition(slicer, match_data["compatible_printers_condition"], printer_data):
                return match_path, match_data
        else:
            compatible_printers: list[str] = match_data.get("compatible_printers")
            if not compatible_printers:
                continue
            for compatible_printer in compatible_printers:
                if printer_name == compatible_printer:
                    return match_path, match_data
    return None


def parse_compatible_printer_condition(slicer: str, compatible_printer_condition: str, printer_data: dict[str, Any]):
    """Parses PrusaSlicer's `compatible_printer_condition` and indicates if the provided printer_data is compatible"""
    if " or " in compatible_printer_condition:
        raise NotImplementedError("The expression contains an `or` expression which is not currently supported")

    var_re = re.compile(r"(?P<key>\w+)(?:\[(?P<index>[0-9]+)])?")

    def get_value_from_config(key: str):
        match = var_re.fullmatch(key)
        if not match:
            raise ValueError("The provided key is malformed")
        match = match.groupdict()
        if match["key"] not in printer_data:
            raise ValueError("The provided key is not in the printer_data dict")
        value = printer_data[match["key"]]
        if match["index"] is not None:
            if slicer == "prusaslicer":  # Handle PS vectors
                value = value.split(";")
            value = value[int(match["index"])]
        return value

    def get_operands(operator: str):
        operands = condition.split(operator)
        if len(operands) != 2:
            raise ValueError("Multiple operands found within the same condition")
        op1, op2 = operands
        op1 = get_value_from_config(op1)
        return op1, op2

    conditions = [x for x in compatible_printer_condition.split(" and ")]
    ret = True
    for condition in conditions:
        if "=~" in condition:  # regex contains
            config_value, check_condition = get_operands("=~")
            ret = re.match(check_condition.strip("/"), config_value) is not None
        elif "!~" in condition:
            config_value, check_condition = get_operands("!~")
            ret = re.match(check_condition.strip("/"), config_value) is None
        elif "==" in condition:
            config_value, check_condition = get_operands("==")
            ret = config_value == check_condition
        elif ">=" in condition:
            config_value, check_condition = get_operands(">=")
            ret = float(config_value) >= float(check_condition)
        elif "<=" in condition:
            config_value, check_condition = get_operands("<=")
            ret = float(config_value) <= float(check_condition)
        elif ">" in condition:
            config_value, check_condition = get_operands(">")
            ret = float(config_value) > float(check_condition)
        elif "<" in condition:
            config_value, check_condition = get_operands("<")
            ret = float(config_value) < float(check_condition)
        else:
            raise ValueError("No known operators were present in the condition", condition)
        if ret is not True:
            return ret
    return ret
