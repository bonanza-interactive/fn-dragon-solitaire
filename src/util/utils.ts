import {RoundState} from '../config/backend-types';
import {CARD_LOCATION_PREFIX, CardName} from '../config/config';
import {CORE} from '../game';

export function lerp(v0: number, v1: number, t: number) {
  return v0 * (1 - t) + v1 * t;
}

export function roundToNextPowerOfTwo(n: number): number {
  if (n < 2.0) {
    throw new TypeError('Argument must be at least 2.');
  }

  let v: number = n;
  v--;
  v |= v >> 1;
  v |= v >> 2;
  v |= v >> 4;
  v |= v >> 8;
  v |= v >> 16;
  v++;
  return v;
}

export function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    CORE.gameTimer.invoke(milliseconds / 1000, () => resolve());
  });
}

/**
 * Returns the resolution scale for apila gfx config. Main idea of this
 * is to limit the size of Apila framebuffer on retina/4k displays and
 * mobile devices.
 *
 * @param screenWidth Screen width in pixels
 * @param screenHeight Screen height in pixels
 * @param devicePixelRatio Ratio of device physical pixels to CSS pixels
 * @param isMobileDevice Is the device a mobile device?
 * @param maxScreenHeight (for example 1200px)
 * @param maxScreenHeightMobile (for example 720px)
 */
export function getResolutionScale(
  screenWidth: number,
  screenHeight: number,
  devicePixelRatio: number,
  isMobileDevice: boolean,
  maxScreenHeight: number,
  maxScreenHeightMobile: number
): number {
  let resolutionScale = 1;
  const screenLandscapeHeight =
    screenHeight < screenWidth ? screenHeight : screenWidth;

  if (isMobileDevice) {
    if (screenLandscapeHeight > maxScreenHeightMobile) {
      // resolution better than maximum for mobile
      resolutionScale =
        devicePixelRatio * (maxScreenHeightMobile / screenLandscapeHeight);
    } else {
      resolutionScale = devicePixelRatio;
    }
  } else {
    if (screenLandscapeHeight > maxScreenHeight) {
      // resolution better than maximum for desktop
      resolutionScale =
        devicePixelRatio * (maxScreenHeight / screenLandscapeHeight);
    } else {
      resolutionScale = devicePixelRatio;
    }
  }

  return resolutionScale;
}

export function winningRound(round: RoundState): boolean {
  return round !== undefined;
}

/**
 * Wrapper to create a simple void promise and its resolve callback.
 */
export function voidPromise(): {promise: Promise<void>; resolve: () => void} {
  let resolve = () => {};
  const promise = new Promise<void>(
    (resolveCallback) => (resolve = resolveCallback)
  );
  return {promise, resolve};
}

export function getCardNodeName(name: CardName, index?: number): string {
  let nodeName = `${CARD_LOCATION_PREFIX}_${name}`;
  if (index !== undefined) {
    nodeName = nodeName.concat(`_${index}`);
  }

  return nodeName;
}

export const isMobileAndroidFirefox = () =>
  /^(?=.*Mobile)(?=.*Android)(?=.*Firefox).*$/.test(navigator.userAgent);
