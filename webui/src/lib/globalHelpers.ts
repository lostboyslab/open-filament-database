const illegal_characters = [
  "#","%","&","{","}","\\","<",
  ">","*","?","/","$","!","'",
  '"',":","@","+","`","|","="
]; // TODO: Add emojis and alt codes
// This should at all times be the same as /data_validator.py:22

export const stripOfIllegalChars = (input: string): string => {
  let value = input;

  illegal_characters.forEach((char) => {
    value = value.replaceAll(char, "");
  })

  return value;
};