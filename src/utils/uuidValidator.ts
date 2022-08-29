function uuidValidator(uuid: string): boolean {
  const match = /[\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}/;

  return match.test(uuid);
}

export { uuidValidator };
