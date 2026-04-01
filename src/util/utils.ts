import {
  CARD_LOCATION_PREFIX,
  CardName,
  Recovery,
  miscConfig,
} from '../config/config';
import {CORE} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {computeWinAmount} from './win-amount';

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

export function getRTPString(rtp: number): string {
  return rtp.toLocaleString('fi', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    CORE.gameTimer.invoke(milliseconds / 1000, () => resolve());
  });
}

export function assert(condition: boolean, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
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
  maxScreenHeightMobile: number,
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

export function getAssetsBaseUrl(gameId: string): string {
  let assetsBaseUrl = '';
  const releaseVersion = window.RELEASE_VERSION;

  // add gameId and release versioin to the base url (if not in dev environment)
  const givenAssetsBaseUrl = getURLValue('assetsBaseUrl');
  if (givenAssetsBaseUrl !== undefined) {
    assetsBaseUrl = givenAssetsBaseUrl + gameId + '/' + releaseVersion + '/';
  }

  return assetsBaseUrl;
}

function getURLValue(name: string): string | undefined {
  const re =
    new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
      location.search,
    ) || undefined;

  if (re !== undefined && re[1] !== undefined) {
    return decodeURIComponent(re[1].replace(/\+/g, '%20')) || undefined;
  } else {
    return undefined;
  }
}

export function winningRound(data: StateMachineRoundData): boolean {
  const winAmount = computeWinAmount(data.roundState.winFactor, data.bet);
  return winAmount > 0 || data.roundState.rounds.length > 1;
}

export function maxWinReached(data: StateMachineRoundData): boolean {
  return data.roundState.maxWinFactorReached;
}

export function isRecovery(): boolean {
  return !CLIENT_STATE.replay && miscConfig.recovery.recovery === Recovery.Full;
}

export const isMobileAndroidFirefox = () =>
  /^(?=.*Mobile)(?=.*Android)(?=.*Firefox).*$/.test(navigator.userAgent);

export const isMobileiOSFirefox = () =>
  /^(?=.*Mobile)(?=.*Firefox)(?=.*(?:iPhone|iPad|iPod)).*$/.test(
    navigator.userAgent,
  );

/**
 * Checks if a recovery point should be saved for the given round step.
 *
 * It tries to evenly spread out recovery points among all of the rounds.
 * For simpler logic, use isRecovery() if e.g. roundStep is 0.
 *
 * @note On the last freespin round roundStep === roundCount - 1.
 * @param roundStep The round step index
 * @param maxRoundSteps Number of round steps (base game, each freespin, etc.)
 */
export function isRoundStepRecoverable(
  roundStep: number,
  maxRoundSteps: number,
): boolean {
  if (!isRecovery()) {
    return false;
  }

  const maxRecoveryCount = miscConfig.recovery.maxRecoveryCount;

  if (maxRecoveryCount <= 0) {
    return false;
  }

  if (maxRoundSteps <= maxRecoveryCount) {
    return true;
  }

  // The last freespin round should always be recoverable
  // (prevRecoveryPoint !== curRecoveryPoint).
  // To achieve this, +1 is added so that roundStep / roundCount equals 1.
  const step = roundStep + 1;
  // stepSize guaranteed to be ]0, 1[
  const stepSize = maxRecoveryCount / maxRoundSteps;
  const prevRecoveryPoint = Math.floor((step - 1) * stepSize);
  const curRecoveryPoint = Math.floor(step * stepSize);
  return prevRecoveryPoint !== curRecoveryPoint;
}

/**
 * Wrapper to create a simple void promise and its resolve callback.
 */
export function voidPromise(): {promise: Promise<void>; resolve: () => void} {
  let resolve = () => {};
  const promise = new Promise<void>(
    (resolveCallback) => (resolve = resolveCallback),
  );
  return {promise, resolve};
}

// export function isRecovery(): boolean {
//   return !PLATFORM.isCabinet && miscConfig.recovery === Recovery.Full;
// }

export function getCardNodeName(name: CardName, index?: number): string {
  let nodeName = `${CARD_LOCATION_PREFIX}_${name}`;
  if (index !== undefined) {
    nodeName = nodeName.concat(`_${index}`);
  }

  return nodeName;
}
