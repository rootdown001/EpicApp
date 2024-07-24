// type guard function
export function isString(value: any): value is string {
  return typeof value === "string";
}

// run check on env variables before used in a block. avoid ts error of can't be string || undefined
export function checkEnvVariables(...vars: (string | undefined)[]): void {
  vars.forEach((variable, index) => {
    if (!isString(variable)) {
      throw new Error(`Environment variable at index ${index} is undefined.`);
    }
  });
}
