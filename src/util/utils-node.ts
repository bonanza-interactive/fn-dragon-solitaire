import {gfx} from '@apila/engine';

function assert(condition: boolean, errMsg?: string): asserts condition {
  if (!condition) {
    throw new Error(errMsg);
  }
}

// Utility types and functions for findX functions
// ----------------------------------------------------------------------

type NodePredicate<T extends gfx.NodeProperties> = (
  node: gfx.NodeProperties,
) => node is T;
type TypeCheck<T> = (v: unknown) => v is T;
type ConditionFunc = (v: unknown) => boolean;

export function createCheck<T>(...funcs: ConditionFunc[]): TypeCheck<T> {
  return (v): v is T =>
    v !== undefined &&
    v !== null &&
    funcs.map((f) => f(v)).reduce((prev, cur) => prev && cur, true);
}

// Pre-made checks

export const isSprite = createCheck<gfx.Sprite>(
  (n) => (n as gfx.Sprite).image !== undefined,
);
export const isSpine = createCheck<gfx.Spine>(
  (n) => (n as gfx.Spine).skeleton !== undefined,
);
export const isBitmapText = createCheck<gfx.BitmapText>(
  (n) => (n as gfx.BitmapText).text !== undefined,
);
export const isClipNode = createCheck<gfx.ClipRect>(
  (n) => (n as gfx.ClipRect).clipRect !== undefined,
);
export const withName = <T extends gfx.NodeProperties>(
  name: string,
): TypeCheck<T> =>
  createCheck<T>((n) => (n as gfx.NodeProperties).name === name);

// Node child iterators
// ----------------------------------------------------------------------

/**
 * Creates a preorder DFS iterator of {@link gfx.NodeProperties} children.
 * @param parent The parent node
 * @returns An iteratable object
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function DFSChildIterator(
  parent: gfx.NodeProperties,
): Iterable<gfx.NodeProperties> {
  return {
    *[Symbol.iterator]() {
      function* dfs(node: gfx.NodeProperties): Iterable<gfx.NodeProperties> {
        yield node;
        for (const child of node.children) {
          yield* dfs(child);
        }
      }
      yield* dfs(parent);
    },
  };
}

/**
 * Creates a BFS iterator of {@link gfx.NodeProperties} children.
 * @param parent The parent node
 * @returns An iteratable object
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function BFSChildIterator(
  parent: gfx.NodeProperties,
): Iterable<gfx.NodeProperties> {
  return {
    *[Symbol.iterator]() {
      const stack: gfx.NodeProperties[] = [parent];
      let head;
      while ((head = stack.shift())) {
        yield head;
        stack.push(...head.children);
      }
    },
  };
}

// ManagedNodes get node by name functions, using DFSNodeIterator
// ----------------------------------------------------------------------

/**
 * Gets a node by name, throws an error if not found.
 * @param parent The parent node to search through
 * @param name The name of the node
 * @returns The found node
 * @throws An error if no node with the name was found
 */
export function getNode(
  parent: gfx.NodeProperties,
  name: string,
): gfx.NodeProperties {
  const iter = DFSChildIterator(parent);
  const node = findByName(iter, name);
  assert(node !== null, `Node '${name}' is null`);
  return node;
}

/**
 * Gets a sprite by name, throws an error if not found.
 * @param parent The parent node to search through
 * @param name The name of the sprite
 * @returns The found sprite
 * @throws An error if no sprite with the name was found
 */
export function getSprite(
  parent: gfx.NodeProperties,
  name: string,
): gfx.Sprite {
  const iter = DFSChildIterator(parent);
  const node = findSprite(iter, name);
  assert(node !== null, `Sprite '${name}' is null`);
  return node;
}

/**
 * Gets a spine by name, throws an error if not found.
 * @param parent The parent node to search through
 * @param name The name of the spine
 * @returns The found spine
 * @throws An error if no spine with the name was found
 */
export function getSpine(parent: gfx.NodeProperties, name: string): gfx.Spine {
  const iter = DFSChildIterator(parent);
  const node = findSpine(iter, name);
  assert(node !== null, `Spine '${name}' is null`);
  return node;
}

/**
 * Gets a text node by name, throws an error if not found.
 * @param parent The parent node to search through
 * @param name The name of the bitmap text
 * @returns The found bitmap text node
 * @throws An error if no text node with the name was found
 */
export function getBitmapText(
  parent: gfx.NodeProperties,
  name: string,
): gfx.BitmapText {
  const iter = DFSChildIterator(parent);
  const node = findBitmapText(iter, name);
  assert(node !== null, `BitmapText '${name}' is null`);
  return node;
}

/**
 * Gets a clip node by name, throws an error if not found.
 * @param parent The parent node to search through
 * @param name The name of the clip node
 * @returns The found clip node
 * @throws An error if no clip node with the name was found
 */
export function getClipNode(
  parent: gfx.NodeProperties,
  name: string,
): gfx.ClipRect {
  const iter = DFSChildIterator(parent);
  const node = findClipNode(iter, name);
  assert(node !== null, `ClipRect '${name}' is null`);
  return node;
}

// General findX functions
// ----------------------------------------------------------------------

/**
 * Searches for a node with given predicates (conditions).
 * @param nodes The nodes to search through
 * @param predicate A function checking if a node matches the searched node
 * @param extraPredicates Additional (optional) predicate functions (AND)
 * @returns The found node or null if none of the nodes matched the predicates
 * @example
 * // Using node schema as container
 * const nodes = createManagedNodes(apila.gfx, mySchema);
 * const node = findNode(DFSChildIterator(nodes.root), withName('foo'));
 * if (node === null) {
 *   // handle missing node
 * }
 */
function findNode<T extends gfx.NodeProperties>(
  nodes: Iterable<gfx.NodeProperties>,
  predicate: NodePredicate<T>,
  ...extraPredicates: NodePredicate<T>[]
): T | null {
  const check = createCheck<T>(
    predicate as ConditionFunc,
    ...(extraPredicates as ConditionFunc[]),
  );

  for (const node of nodes) {
    if (check(node)) {
      return node;
    }
  }
  return null;
}

/**
 * Searches for all nodes matching all given predicates (conditions).
 * @param nodes The nodes to search through
 * @param predicate A function checking if a node matches the searched node
 * @param extraPredicates Additional (optional) predicate functions (AND)
 * @returns The found node or null if none of the nodes matched the predicates
 * @example
 * // Using node schema as container
 * const nodes = createManagedNodes(apila.gfx, mySchema);
 * const iter = DFSChildIterator(nodes.root);
 * const withSkeleton = (name: string) =>
 *   createCheck<gfx.Spine>(
 *     isSpine,
 *     (node) => (node as gfx.Spine).skeletonName === name
 *   );
 * const spines = findAllNodes(iter, withSkeleton('foo'));
 */
function findAllNodes<T extends gfx.NodeProperties>(
  nodes: Iterable<gfx.NodeProperties>,
  predicate: NodePredicate<T>,
  ...extraPredicates: NodePredicate<T>[]
): T[] {
  const check = createCheck<T>(
    predicate as ConditionFunc,
    ...(extraPredicates as ConditionFunc[]),
  );

  return [...nodes].filter(check);
}

/**
 * Searches for a {@link gfx.NodeProperties} with a given name.
 *
 * For type-specific searches, check {@link findSprite}, {@link findSpine}
 * and {@link findBitmapText}.
 *
 * @param nodes The nodes to search through
 * @param name The name of the node
 * @returns The found node or null
 */
function findByName(
  nodes: Iterable<gfx.NodeProperties>,
  name: string,
): gfx.NodeProperties | null {
  return findNode(nodes, withName(name));
}

/**
 * Searches for a {@link gfx.Sprite} with a given name.
 * @param nodes The nodes to search through
 * @param name The name of the node
 * @returns The found node or null
 */
function findSprite(
  nodes: Iterable<gfx.NodeProperties>,
  name: string,
): gfx.Sprite | null {
  return findNode(nodes, isSprite, withName(name));
}

/**
 * Searches for a {@link gfx.Spine} with a given name.
 * @param nodes The nodes to search through
 * @param name The name of the node
 * @returns The found node or null
 */
function findSpine(
  nodes: Iterable<gfx.NodeProperties>,
  name: string,
): gfx.Spine | null {
  return findNode(nodes, isSpine, withName(name));
}

/**
 * Searches for a {@link gfx.BitmapText} with a given name.
 * @param nodes The nodes to search through
 * @param name The name of the node
 * @returns The found node or null
 */
function findBitmapText(
  nodes: Iterable<gfx.NodeProperties>,
  name: string,
): gfx.BitmapText | null {
  return findNode(nodes, isBitmapText, withName(name));
}

/**
 * Searches for a {@link gfx.ClipRect} with a given name.
 * @param nodes The nodes to search through
 * @param name The name of the node
 * @returns The found node or null
 */
function findClipNode(
  nodes: Iterable<gfx.NodeProperties>,
  name: string,
): gfx.ClipRect | null {
  return findNode(nodes, isClipNode, withName(name));
}

/**
 * Searches for all {@link gfx.Sprite} nodes.
 * @param nodes The nodes to search through
 * @returns An array of the found nodes
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars*/
function findAllSprites(nodes: Iterable<gfx.NodeProperties>): gfx.Sprite[] {
  return findAllNodes(nodes, isSprite);
}

/**
 * Searches for all {@link gfx.Spine} nodes.
 * @param nodes The nodes to search through
 * @returns An array of the found nodes
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars*/
function findAllSpines(nodes: Iterable<gfx.NodeProperties>): gfx.Spine[] {
  return findAllNodes(nodes, isSpine);
}

/**
 * Searches for all {@link gfx.BitmapText} nodes.
 * @param nodes The nodes to search through
 * @returns An array of the found nodes
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars*/
function findAllBitmapTexts(
  nodes: Iterable<gfx.NodeProperties>,
): gfx.BitmapText[] {
  return findAllNodes(nodes, isBitmapText);
}

/**
 * Iterates tree from given parent node and calls the callback function for
 * every child node.
 * @param node start node for the tree iteration
 * @param cb callback function
 */
export function iterateTree(
  node: gfx.NodeProperties,
  cb: (node: gfx.NodeProperties) => void,
) {
  const nodes = DFSChildIterator(node);
  for (const node of nodes) {
    cb(node);
  }
}

export const exposeObject = {
  getNode,
  getSprite,
  getSpine,
  getBitmapText,
  DFSChildIterator,
};
