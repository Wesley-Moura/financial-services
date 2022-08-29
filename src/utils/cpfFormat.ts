function cpfFormat(document: string): string {
  const cpfFormatted = document.replace(/\.|-/g, "");

  return cpfFormatted;
}

export { cpfFormat };
