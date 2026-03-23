/* eslint-disable @typescript-eslint/no-unused-vars */

import * as ap from '@apila/asset-pipeline';

// Controls for engine overlays with their initial values
const OVERLAY_CONTROLS: ap.OverlayControls = {
  checkboxes: {
    verbose: {value: false},
  },
  dropdownmenus: {
    platform: {
      value: 'desktop',
      values: ['desktop', 'mobile', 'slot'],
    },
  },
  buttons: {
    run: {enabled: true},
  },
};

// Variables exposed to entrypoint which determine how daemon works.
// These values are modified in callback functions given to overlay backend.
export const OVERLAY_VALUES = {
  platform: 'desktop',
  runTriggered: false,
};

// How to handle changes of dropdown menu values
const dropdownValueChanged = (
  label: string,
  value: string,
  controls: ap.OverlayControls
) => {
  if (label === 'platform') {
    OVERLAY_VALUES.platform = value;
  }
};

// How to handle changes of checkbox values
const checkboxValueChanged = (
  label: string,
  value: boolean,
  controls: ap.OverlayControls
) => {
  if (label === 'verbose') {
    ap.setLogLevel(value ? ap.Level.INFO : ap.Level.STATUS);
  }
};

// How to handle button clicks
const buttonClicked = (label: string, controls: ap.OverlayControls) => {
  if (label === 'run') {
    OVERLAY_VALUES.runTriggered = true;
    return true;
  }
  return true;
};

export const createAndStartOverlayBackend = () => {
  const res = ap.createOverlayBackend(
    {
      controls: OVERLAY_CONTROLS,
      dropdownValueChanged,
      checkboxValueChanged,
      buttonClicked,
    },
    true
  );
  return res;
};
