import {gfx} from '@apila/engine';
import {AnimatedImage} from './animated-image';
import {findAllImages} from './image-atlas';
import {CORE} from './game';
import {getNode} from './util/utils-node';

export enum ChipType {
  LEFT,
  RIGHT1,
  RIGHT2,
}

export class Chips {
  private chipAnimFrames: number[][] = [];
  private chips: Record<ChipType, Chip>;

  constructor(nodes: gfx.NodeProperties) {
    this.chips = {
      0: new Chip(0, getNode(nodes, 'chips_left'), 'chips_left'),
      1: new Chip(1, getNode(nodes, 'chips_right1'), 'chips_right1'),
      2: new Chip(1, getNode(nodes, 'chips_right2'), 'chips_right2'),
    };

    // weird calculations from KakkospipoGfx
    for (let j = 0; j < 4; j++) {
      const frames = [];
      if (j < 3) {
        for (let i = 0; i < 17; i++) {
          frames.push(i + 17 * j);
        }
        frames.push(j === 0 ? 0 : 34);
      } else {
        frames.push(34);
        frames.push(34);

        for (let i = 2; i < 16; i++) {
          frames.push(50 + i - 2);
        }
        frames.push(0);
      }

      this.chipAnimFrames.push(frames);
    }
  }

  public playAnimation(chip: ChipType, animation: number): void {
    //const CHIP_ANIM_FRAMES = 18;
    const frames = this.chipAnimFrames[animation];

    this.chips[chip].playAnimation(frames.length, frames);
  }
}

export class Chip {
  public chipImages: string[];
  public chip: gfx.Sprite;
  public image: AnimatedImage;

  constructor(pivot: number, root: gfx.Empty, prefix: string) {
    this.chipImages = findAllImages(prefix);
    this.chip = CORE.gfx.createSprite();
    this.chip.image = this.chipImages[0];
    this.chip.parent = root;
    this.chip.visible = true;
    this.chip.pivot = [pivot, 0];

    this.image = new AnimatedImage(this.chip, this.chipImages, 30);
  }

  public playAnimation(
    length: number,
    frames: number[],
    startIndex = 0,
    loops = 1
  ): void {
    this.image.playAnimation(length, frames, startIndex, loops);
  }
}
