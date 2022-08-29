function cardNumberValidator(number: string): boolean {
  const match = /[\d]{4} [\d]{4} [\d]{4} [\d]{4}$/;

  return match.test(number);
}

export { cardNumberValidator };
