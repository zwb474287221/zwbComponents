const regexp = /{[0-9]+}/

const replaceString = (text: string, value: string) => {
  return text.replace(regexp, value)
}

export const formatString = (text: string, values: string[] | string | number) => {
  if (Array.isArray(values)) {
    values.forEach(item => {
      text = replaceString(text, item.toString());
    });
    return text;
  }
  return replaceString(text, values.toString());
}

// formatString("hello {1} {2} 123",["zwb","1555555555555"]); //'hello zwb 1555555555555 123'