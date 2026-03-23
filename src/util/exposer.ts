/**
 * Exposes given objects to window with namespace.
 * @param to Namespace to expose into. For example "template.Game"
 * @param what Object to expose.
 */
export const expose = (to: string, expose: unknown): void => {
  const split: string[] = to.split('.');

  //Setup path
  let node: Window | Record<string, unknown> = window;
  for (let i = 0; i < split.length - 1; i++) {
    if (Reflect.has(node, split[i])) {
      node = Reflect.get(node, split[i]) as Record<string, unknown>;
    } else {
      const next = {};
      Reflect.set(node, split[i], next);
      node = next;
    }
  }

  //Setup actual expose
  if (Reflect.has(node, split[split.length - 1])) {
    throw new Error('Trying to expose multiple fields with same name');
  } else {
    Reflect.set(node, split[split.length - 1], expose);
  }
};
