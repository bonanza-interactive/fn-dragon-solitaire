let observer: undefined | ((input: string) => void) = undefined;
export function forwardInput(input: string) {
  observer?.(input);
  observer = undefined;
}
export function customInput(input: string) {
  forwardInput(input);
}
export function nextInput(): Promise<string> {
  return new Promise<string>((resolve) => {
    observer = resolve;
  });
}
