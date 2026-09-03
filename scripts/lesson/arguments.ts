export function argumentValue(args: readonly string[], name: string): string | undefined {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
}

export function argumentValues(args: readonly string[], name: string): string[] {
  return args.flatMap((arg, index) => (arg === `--${name}` && args[index + 1] ? [args[index + 1]] : []));
}

export function hasFlag(args: readonly string[], name: string): boolean {
  return args.includes(`--${name}`);
}
