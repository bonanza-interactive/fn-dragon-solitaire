import {mat3, vec3} from 'gl-matrix';

import {NodeProperties, WritableArrayLike} from '@apila/engine/dist/apila-gfx';

/**
 * Apila utilities
 */
export class ApilaUtil {
  /**
   * Transform a position from local coordinates into global coordinates.
   * @param position Position to transform
   * @param from Node from which coordinates transform is done.
   */
  public static toWorld(
    position: WritableArrayLike<number>,
    from: NodeProperties
  ): WritableArrayLike<number> {
    return vec3
      .transformMat3(
        [0, 0, 0],
        [position[0], position[1], 1],
        from.worldTransformMatrix as mat3
      )
      .slice(0, 2);
  }

  /**
   * Transform a point to local coordinates.
   * @param position Position to transform
   * @param to To which nodes coordinate system is the point to be transformed.
   * @param from From what node is the point transformed from. If none is given,
   * then the point is transformed from world coordinates.
   */
  public static toLocal(
    position: WritableArrayLike<number>,
    to: NodeProperties,
    from?: NodeProperties
  ): WritableArrayLike<number> {
    if (from) {
      position = this.toWorld(position, from);
    }
    return vec3
      .transformMat3(
        [0, 0, 0],
        [position[0], position[1], 1],
        mat3.invert(mat3.create(), to.worldTransformMatrix as mat3)
      )
      .slice(0, 2);
  }
}
