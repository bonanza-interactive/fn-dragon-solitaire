import {CORE} from './game';
import {gfx} from '@apila/engine';

export function findAllImages(prefix: string) {
  const images = [];
  const tile = (i: number) => prefix + '-' + i.toString();
  for (
    let i = 0;
    CORE.gfx.resourceExists(gfx.ResourceType.Image, tile(i));
    ++i
  ) {
    images.push(tile(i));
  }
  return images;
}
