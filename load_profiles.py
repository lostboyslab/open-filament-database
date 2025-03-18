import fileinput
import json
import os
import re
import shutil
from enum import IntEnum
from pathlib import Path
from typing import Union, Optional
from urllib.request import urlretrieve
from zipfile import ZipFile

import iniconfig
from iniconfig import IniConfig, ParseError

iniconfig.COMMENTCHARS = ""

PathLike = Union[str, os.PathLike[str]]


class LoadProfileType(IntEnum):
    Undefined = 0
    Filament = 1
    Printer = 1 << 1
    All = Filament + Printer


run_type = LoadProfileType.Filament
current_type: LoadProfileType

# The output path currently being used. Set by run()
profile_output_path: Path

# The paths as set by the command line
filament_output_path: Optional[Path] = None
printer_output_path: Optional[Path] = None

PRUSASLICER_URL_PRUSA_FFF = "https://github.com/prusa3d/PrusaSlicer-settings-prusa-fff/archive/refs/heads/main.zip"
PRUSASLICER_URL_NON_PRUSA_FFF = "https://github.com/prusa3d/PrusaSlicer-settings-non-prusa-fff/archive/refs/heads/main.zip"
BAMBUSTUDIO_URL = "https://github.com/bambulab/BambuStudio/archive/refs/heads/master.zip"
ORCASLICER_URL = "https://github.com/SoftFever/OrcaSlicer/archive/refs/heads/main.zip"
CURA_FILAMENT_URL = "https://github.com/Ultimaker/fdm_materials/archive/refs/heads/master.zip"
CURA_PRINTER_URL = "https://github.com/Ultimaker/cura/archive/refs/heads/main.zip"

download_cache: dict[str, str] = {}


def download_and_extract(slicer_name: str, url: str, member: str, pattern: str, ignore_existing=False):
    """
    :param slicer_name: The name of the slicer
    :param url: The url to download from
    :param member: The folder, or "member" within the zip file of where to begin extraction.
    :param pattern: The pattern the file needs to match to be extracted. The match will be checked against the end of the string.
    :param ignore_existing: If there is an existing folder at the output path, it is typically removed. This option disables that functionality.
    """
    # Download or get the cached file path
    if url in download_cache:
        zip_file_path = download_cache[url]
    else:
        print(f"Downloading {slicer_name} archive...")
        zip_file_path = urlretrieve(url)[0]
        download_cache[url] = zip_file_path

    print(f"Extracting {slicer_name} archive...")
    slicer_name = slicer_name.lower()
    output_path = profile_output_path.joinpath(slicer_name)

    # The parameter "member" is expected to be a folder
    # This adds the "/" if it isn't there
    if not member.endswith("/"):
        member += "/"

    # Remove the existing folder structure (if not ignoring existing)
    if not ignore_existing and os.path.exists(output_path):
        shutil.rmtree(output_path)

    with ZipFile(zip_file_path) as zip_f:
        if not pattern.endswith("$"):
            pattern = pattern + "$"
        pattern = re.compile(pattern)
        for file in zip_f.namelist():
            if not file.startswith(member) or file.endswith("/") or not re.match(pattern, file):
                continue
            rel_path = Path(file).relative_to(member)
            dest_path = output_path.joinpath(rel_path)

            # Remove unnecessary folders found in Orca/BBL
            if slicer_name in ["orcaslicer", "bambustudio"]:
                parts = dest_path.parts
                idx = None
                if "filament" in parts:
                    idx = parts.index("filament")
                elif "machine" in parts:
                    idx = parts.index("machine")
                if idx is not None:
                    parts = parts[:idx] + parts[idx + 1:]
                    dest_path = Path(*parts)

            # Output the file to the filesystem
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            with zip_f.open(file) as src, open(dest_path, "wb") as dst:
                dst.write(src.read())


def split_prusaslicer_bundle(path: Path):
    """
    Split PrusaSlicer's ini config bundles into individual JSON config files
    :param path: Path to the ini config bundle
    """
    if path.suffix != ".ini":
        return

    try:
        config = IniConfig(path)
    except ParseError as e:
        # Temporary workaround for malformed ini files
        if e.msg == "unexpected value continuation":
            with fileinput.FileInput(path, inplace=True) as f:
                for line in f:
                    print(line.strip())
            config = IniConfig(path)
        else:
            raise

    profiles: dict[str, dict[str, str]] = {}

    # Gather all the profiles from the bundle
    for section in config:
        name: str
        if current_type == LoadProfileType.Filament:
            if not section.name.startswith("filament:"):
                continue
            name = section.name.removeprefix("filament:")
        elif current_type == LoadProfileType.Printer:
            if section.name.startswith("printer_model:"):
                name = section.name.removeprefix("printer_model:")
            elif section.name.startswith("printer:"):
                name = section.name.removeprefix("printer:")
            else:
                continue
        else:
            continue
        profiles[name] = dict(section.items())

    # Cached "squashed" profiles
    squashed_profiles: dict[str, dict[str, str]] = {}

    def squash_inherits(profile_name: str):
        """Recursively "squash" the profiles from inherits so that all settings are contained in a single file"""
        if profile_name in squashed_profiles:
            return squashed_profiles[profile_name]

        if "inherits" not in profiles[profile_name]:
            return profiles[profile_name]

        profile = profiles[profile_name]
        profile_out: dict[str, str] = {}
        inherits = [x.strip() for x in profile["inherits"].split(";")]
        for _ in inherits:
            if _ != "":
                profile_out.update(squash_inherits(_))
        profile_out.update(profile)
        del profile_out["inherits"]
        squashed_profiles[profile_name] = profile_out
        return squashed_profiles[profile_name]

    def cleanse_name(file_name: str) -> str:
        return file_name.replace("/", " ")

    for name, data in profiles.items():
        # Profiles that begin with "*" are only for use within the config bundle and should not be exported
        if name.startswith("*"):
            continue
        out_path = path.parent.joinpath(f"{cleanse_name(name)}.json")
        data_out = squash_inherits(name)
        data_out["filament_settings_id"] = name
        with out_path.open("w") as f:
            json.dump(data_out, f, indent=4)


def unpack_prusaslicer_bundles():
    """
    Finds the latest release for each vendor and runs split_prusaslicer_bundle() on it
    All the ini files are also removed during this process
    """
    print("Unpacking PrusaSlicer bundles...")
    version_re = re.compile("([0-9]+)\\.([0-9]+)\\.([0-9]+)\\.ini", re.RegexFlag.IGNORECASE)
    for vendor_dir in profile_output_path.joinpath("prusaslicer").iterdir():
        if not vendor_dir.is_dir():
            continue
        # Find the latest version that is a release version
        latest: tuple[int, int, int] = (0, 0, 0)
        for config_file in vendor_dir.iterdir():
            match = re.fullmatch(version_re, config_file.name)
            if not match:
                continue
            tmp = (int(match.group(1)), int(match.group(2)), int(match.group(3)))
            if tmp[0] <= latest[0] and tmp[1] <= latest[1] and tmp[2] <= latest[2]:
                continue
            latest = tmp

        latest_file_name = f"{latest[0]}.{latest[1]}.{latest[2]}.ini"

        # Delete all except the latest
        for config_file in vendor_dir.iterdir():
            if config_file.name.lower() != latest_file_name:
                config_file.unlink()

        # Split the latest file into individual configs then delete it
        latest_file = vendor_dir.joinpath(latest_file_name)
        split_prusaslicer_bundle(latest_file)
        latest_file.unlink()


def run():
    """
    Run the download and extract routine
    Set global var 'run_type' to set what profiles will be extracted
    Set global var 'filament_output_path' to set the output path for filaments
    Set global var 'printer_output_path' to set the output path for printers
    """
    global current_type
    global profile_output_path

    # ----------------------
    # Run Filament
    # ----------------------
    if run_type & LoadProfileType.Filament:
        current_type = LoadProfileType.Filament
        global filament_output_path
        if filament_output_path is None:
            profile_output_path = Path("./profiles")
        else:
            profile_output_path = filament_output_path

        print("Loading filament profiles...")

        # Download and unzip PrusaSlicer profiles
        download_and_extract("PrusaSlicer", PRUSASLICER_URL_PRUSA_FFF, "PrusaSlicer-settings-prusa-fff-main/",
                             r".*\.ini")
        download_and_extract("PrusaSlicer", PRUSASLICER_URL_NON_PRUSA_FFF, "PrusaSlicer-settings-non-prusa-fff-main/",
                             r".*\.ini", True)

        unpack_prusaslicer_bundles()

        # Download and unzip BambuStudio profiles
        download_and_extract("BambuStudio", BAMBUSTUDIO_URL, "BambuStudio-master/resources/profiles", ".*/filament/.*")

        # Download and unzip OrcaSlicer profiles
        download_and_extract("OrcaSlicer", ORCASLICER_URL, "OrcaSlicer-main/resources/profiles/", ".*/filament/.*")

        # Download and unzip Cura profiles
        download_and_extract("Cura", CURA_FILAMENT_URL, "fdm_materials-master", ".*.fdm_material$")

        # TODO: Convert cura XML files to custom json

    # ----------------------
    # Run Printer
    # ----------------------
    if run_type & LoadProfileType.Printer:
        current_type = LoadProfileType.Printer
        global printer_output_path
        if printer_output_path is None:
            profile_output_path = Path("./printer_profiles")
        else:
            profile_output_path = printer_output_path

        print("Loading printer profiles...")

        # Download and unzip PrusaSlicer profiles
        download_and_extract("PrusaSlicer", PRUSASLICER_URL_PRUSA_FFF, "PrusaSlicer-settings-prusa-fff-main/",
                             r".*\.ini")
        download_and_extract("PrusaSlicer", PRUSASLICER_URL_NON_PRUSA_FFF, "PrusaSlicer-settings-non-prusa-fff-main/",
                             r".*\.ini", True)

        unpack_prusaslicer_bundles()

        # Download and unzip BambuStudio profiles
        download_and_extract("BambuStudio", BAMBUSTUDIO_URL, "BambuStudio-master/resources/profiles",
                             r".*/machine/.*")

        # Download and unzip OrcaSlicer profiles
        download_and_extract("OrcaSlicer", ORCASLICER_URL, "OrcaSlicer-main/resources/profiles/",
                             r".*/machine/.*")

        # Download and unzip Cura profiles
        download_and_extract("Cura", CURA_PRINTER_URL, "Cura-main/resources/definitions", r".*\.def\.json$")

        # add temporary fix for errors in the profiles
        with open(profile_output_path.joinpath("prusaslicer/RatRig/RatRig V-Minion-180 0.6Nozzle.json"), "r+") as f:
            data = json.load(f)
            f.seek(0)
            data["printer_variant"] = "0.6"
            json.dump(data, f, indent=4)
            f.truncate()

        with open(profile_output_path.joinpath("bambustudio/Creality/Creality K1 0.8 nozzle.json"), "r+") as f:
            data = json.load(f)
            f.seek(0)
            data["printer_model"] = "Creality K1"
            json.dump(data, f, indent=4)
            f.truncate()


# If running directly, provide argument parsing
if __name__ == "__main__":
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument("-p", "--printers", action="store_true", help="Download and unpack printer profiles")
    parser.add_argument("-f", "--filaments", action="store_true", help="Download and unpack filament profiles")
    parser.add_argument("-a", "--all", action="store_true", help="Download and unpack printer and filament profiles")
    parser.add_argument("--filament-path", help="The path to the parent folder of where to save the filament profiles")
    parser.add_argument("--printer-path", help="The path to the parent folder of where to save the printer profiles")
    args = parser.parse_args()

    if args.all:
        run_type = LoadProfileType.All
    else:
        tmp = 0
        tmp |= int(args.filaments)
        tmp |= int(args.printers) << 1
        if tmp == 0:
            parser.print_help()
            parser.exit(-1, "No arguments were provided")
        run_type = LoadProfileType(tmp)

    if args.printer_path:
        printer_output_path = Path(args.printer_path)

    if args.filament_path:
        filament_output_path = Path(args.filament_path)

    run()
