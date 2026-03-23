import {gfx} from '@apila/engine';
import {anim} from '@apila/game-libraries';
import {AUTO_TICK} from './main';

export class MoveAnimation {
  private timeline = new anim.Timeline();
  public node: gfx.NodeProperties;

  constructor(node: gfx.NodeProperties) {
    this.node = node;
    AUTO_TICK.add(this);
  }

  public set(x: number, y: number): void {
    this.node.visible = true;
    this.node.position = [x, y];
  }

  public move(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    time: number,
    delay = 0
  ): void {
    this.node.visible = true;
    this.node.position = [fromX, fromY];

    this.timeline
      .animate(
        anim.Linear([fromX, fromY], [toX, toY]),
        time,
        anim.Property(this.node, 'position')
      )
      .delay(delay);
  }

  public moveWorld(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    time: number,
    delay = 0
  ): void {
    this.node.visible = true;
    this.node.worldPosition = [fromX, fromY];

    this.timeline
      .animate(
        anim.Linear([fromX, fromY], [toX, toY]),
        time,
        anim.Property(this.node, 'worldPosition')
      )
      .delay(delay);
  }

  public arcMove(
    fromX: number,
    fromY: number,
    midX: number,
    midY: number,
    toX: number,
    toY: number,
    time: number,
    delay = 0
  ): void {
    this.node.visible = true;
    this.timeline
      .animate(
        anim.Linear([fromX, fromY], [midX, midY]),
        time / 2,
        anim.Property(this.node, 'position')
      )
      .delay(delay)
      .chain(
        anim.Linear([midX, midY], [toX, toY]),
        time / 2,
        anim.Property(this.node, 'position')
      );
    //mover->arcMove(x1, y1, x2, y2, x3, y3, time, delay);
  }

  public update(delta: number): void {
    this.timeline.tick(delta);
  }
}
