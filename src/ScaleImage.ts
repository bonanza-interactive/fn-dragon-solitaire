import {gfx} from '@apila/engine';
import {anim} from '@apila/game-libraries';

import {AUTO_TICK} from './main';

export class ScaleImage {
  private timeline = new anim.Timeline();
  private node: gfx.NodeProperties;

  constructor(node: gfx.NodeProperties) {
    this.node = node;
    AUTO_TICK.add(this);
  }

  public scale(
    startWidth: number,
    startHeight: number,
    endWidth: number,
    endHeight: number,
    time: number,
    delay: number,
    //,bool pingPong
  ): void {
    this.node.scale = [startWidth, startHeight];
    this.timeline
      .animate(
        anim.OutCubic([startWidth, startHeight], [endWidth, endHeight]),
        time / 2,
        anim.Property(this.node, 'scale'),
      )
      .delay(delay);

    //
    /*
if (animation->isRunning()) animation->stop();

if (pingPong)
animation->setPlaybackMode(gfx::ANIM_PINGPONG);
else
animation->setPlaybackMode(gfx::ANIM_ONCE);

mutator->getMutatorFunction().clearKeyframes();
if (delay > 0)
{
if (mutator->getMutatorFunction().getInterpolationType()
== mutator::IT_SPLINE)
{
// scale 67% at 50% time
int splineW = (int)(startWidth + ((endWidth - startWidth) * 0.67));
int splineH =
(int)(startHeight + ((endHeight - startHeight) * 0.67));
mutator->getMutatorFunction().addKeyframe(
0.0, gfx2d::Vector(startWidth, startHeight));
mutator->getMutatorFunction().addKeyframe(
delay, gfx2d::Vector(startWidth, startHeight));
mutator->getMutatorFunction().addKeyframe(
delay + 0.5 * time, gfx2d::Vector(splineW, splineH));
mutator->getMutatorFunction().addKeyframe(
delay + time, gfx2d::Vector(endWidth, endHeight));
}
else
{
mutator->getMutatorFunction().addKeyframe(
0.0, gfx2d::Vector(startWidth, startHeight));
mutator->getMutatorFunction().addKeyframe(
delay, gfx2d::Vector(startWidth, startHeight));
mutator->getMutatorFunction().addKeyframe(
delay + time, gfx2d::Vector(endWidth, endHeight));
}
}
else
{
if (mutator->getMutatorFunction().getInterpolationType()
== mutator::IT_SPLINE)
{
// scale 67% at 50% time
int splineW = (int)(startWidth + ((endWidth - startWidth) * 0.67));
int splineH =
(int)(startHeight + ((endHeight - startHeight) * 0.67));
mutator->getMutatorFunction().addKeyframe(
0.0, gfx2d::Vector(startWidth, startHeight));
mutator->getMutatorFunction().addKeyframe(
0.5 * time, gfx2d::Vector(splineW, splineH));
mutator->getMutatorFunction().addKeyframe(
time, gfx2d::Vector(endWidth, endHeight));
}
else
{
mutator->getMutatorFunction().addKeyframe(
0.0, gfx2d::Vector(startWidth, startHeight));
mutator->getMutatorFunction().addKeyframe(
time, gfx2d::Vector(endWidth, endHeight));
}
}
animation->start();*/
  }

  public pulse(min: number, max: number, time: number, delay: number): void {
    this.node.scale = [min, min];
    this.timeline
      .animate(
        anim.Linear([min, min], [max, max]),
        time / 2,
        anim.Property(this.node, 'scale'),
      )
      .delay(delay)
      .chain(
        anim.Linear([max, max], [min, min]),
        time / 2,
        anim.Property(this.node, 'scale'),
      );

    //   mutator->getMutatorFunction().addKeyframe(
    //     0.0, gfx2d::Vector(minWidth, minHeight));
    // mutator->getMutatorFunction().addKeyframe(
    //     delay, gfx2d::Vector(minWidth, minHeight));
    // mutator->getMutatorFunction().addKeyframe(
    //     delay + time / 2, gfx2d::Vector(maxWidth, maxHeight));
    // mutator->getMutatorFunction().addKeyframe(
    //     delay + time, gfx2d::Vector(minWidth, minHeight));
  }

  public update(delta: number): void {
    this.timeline.tick(delta);
  }
}
