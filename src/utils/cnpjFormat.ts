function cnpjFormat(document: string): string {
  const cnpjFormatted = document.replace(/\W/g, "");

  return cnpjFormatted;
}

export { cnpjFormat };
