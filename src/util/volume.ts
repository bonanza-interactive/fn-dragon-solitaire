import {trace} from './trace';

// TODO - this is a copy from Viidakkovuori. Refactor if needed when
// template has sounds. Currently waiting for new audio library to be usable.

/**
 * This function is based on the one in "GfxSoundPlayerImpl.cpp".
 */
export function getMasterVolume(volume: number, userVolume: number): number {
  // if either one is 0 or invalid then mute
  if (!volume || !userVolume || volume === 0 || userVolume === 0) return 0;

  if (volume < 0.0 || volume > 128) {
    trace(`Volume ${volume} must be in range [0, 128]!`);
    volume = Math.min(Math.max(volume, 0), 128);
    trace(`  -> clamped to ${volume}.`);
  }

  if (userVolume < 0.0 || userVolume > 5) {
    trace(`User volume ${userVolume} must be in range [0, 5]!`);
    userVolume = Math.min(Math.max(userVolume, 0), 5);
    trace(`  -> clamped to ${userVolume}.`);
  }

  // --------------------------------------------------------
  // 1. Convert SDL volume (0-128) to "service volume" (0-16)

  let serviceVolume = 0;
  if (volume >= 3) {
    serviceVolume = Math.pow((volume - 2.5) / 0.03076171875, 1 / 3);
  } else {
    serviceVolume = volume;
  }

  const negativeStep = serviceVolume / 3;
  let positiveStep = 1;

  if (serviceVolume + 2.0 * positiveStep > 16.0) {
    positiveStep = (16.0 - serviceVolume) / 2;
  }

  let adjustedServiceVolume = serviceVolume;

  switch (userVolume) {
    case 1: // "USER_VOLUME_VERY_LOW"
      adjustedServiceVolume = negativeStep;
      break;
    case 2: // "USER_VOLUME_LOW"
      adjustedServiceVolume = 2 * negativeStep;
      break;
    case 3: // "USER_VOLUME_DEFAULT"
      adjustedServiceVolume = serviceVolume;
      break;
    case 4: // "USER_VOLUME_HIGH"
      adjustedServiceVolume = serviceVolume + positiveStep;
      break;
    case 5: // "USER_VOLUME_VERY_HIGH"
      adjustedServiceVolume = serviceVolume + 2 * positiveStep;
      break;
    default:
      // volume 0 is handled in the beginning of the function
      trace('Error: incorrect user volume!');
      break;
  }

  // --------------------------------------------------------
  // 2. Convert "service volume" back to "SDL volume"

  let adjustedVolume;
  if (adjustedServiceVolume <= 2) {
    adjustedVolume = adjustedServiceVolume;
  } else {
    adjustedVolume = 2.5 + Math.pow(adjustedServiceVolume, 3) * 0.03076171875;
    if (adjustedVolume > 128) adjustedVolume = 128;
  }

  // --------------------------------------------------------
  // 3. Convert "SDL volume" to APILA master gain

  const factor = 1.0;
  const normalizedVolume = factor * (adjustedVolume / 128);

  // if (normalizedVolume < 0) {
  //   console.warn(
  //     'Master volume after normalization is below 0. Clamping to 0.'
  //   );
  // } else if (normalizedVolume > 1) {
  //   console.warn(
  //     'Master volume after normalization is above 1. Clamping to 1.'
  //   );
  // }

  return Math.min(Math.max(normalizedVolume, 0), 1);
}
