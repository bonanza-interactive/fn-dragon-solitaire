import {gfx} from '@apila/engine';
import {EventType} from '@apila/engine/dist/apila-input';

import {CORE} from './game';
import {customInput} from './util/forward-input';
import {IS_MOBILE_DEVICE} from './framework';
import {ButtonMeta, ButtonVisualState} from './types';
import {CLIENT_STATE} from './main';

export interface Button {
  node: gfx.Sprite;
  meta: ButtonMeta;
  state: {
    pressed: boolean;
    active: boolean;
    highlight: boolean;
    hover: boolean;
    listenerId?: number;
    releasedCallback?: (name: string) => void;
  };
}

const buttons = new Map<string, Button>();

export function registerButton(button: Button): void {
  buttons.set(button.node.name, button);
}

export const handleInputEvent = (
  button: Button,
  type: EventType,
  _isMobile: boolean,
): void => {
  if (button.node.visible) {
    if (type === EventType.PRESS) {
      handleButtonPressed(button);
    } else if (type === EventType.RELEASE) {
      handleButtonReleased(button);
    } else if (type === EventType.EXIT) {
      handleButtonExited(button);
    } else if (type === EventType.ENTER) {
      handleButtonEntered(button, true);
    }
  }
};

export const handleButtonPressed = (button: Button): void => {
  button.state.pressed = true;
  button.state.hover = true;
  updateButtonState(button);
};

export const handleButtonReleased = (button: Button): void => {
  if (button.state.pressed) {
    button.state.pressed = false;
    if (button.state.active && button.state.releasedCallback) {
      button.state.releasedCallback(button.node.name);
    }
  }
  button.state.hover = false;
  updateButtonState(button);
};

export const handleButtonEntered = (button: Button, hover: boolean): void => {
  if (hover) {
    button.state.hover = true;
  }

  updateButtonState(button);
};
export const handleButtonHighlight = handleButtonEntered;

export const handleButtonExited = (button: Button): void => {
  button.state.hover = false;
  button.state.pressed = false;
  updateButtonState(button);
};

export const setButtonVisible = (button: Button, visible: boolean): void => {
  button.node.visible = visible;

  if (!visible) {
    button.state.hover = false;
    button.state.highlight = false;
  }
};

export const setButtonState = (
  buttonId: string,
  active: boolean,
  visible: boolean,
): void => {
  const button = buttons.get(buttonId);
  if (!button) return;
  const activeAllowed = CLIENT_STATE.replay ? false : active;
  setButtonVisible(button, visible);
  setButtonActive(button, activeAllowed);
};

export const setButtonHighlight = (buttonId: string, hl: boolean): void => {
  const button = buttons.get(buttonId);
  if (!button) return;
  button.state.highlight = hl;
  updateButtonState(button);
};

export const setButtonActive = (button: Button, active: boolean): void => {
  if (button.state.active !== active) {
    button.state.active = active;
  }
  updateButtonState(button);
};

export function updateButtonStates(): void {
  buttons.forEach(updateButtonState);
}

export const updateButtonState = (button: Button): void => {
  let state: ButtonVisualState | undefined = undefined;

  if (button.state.active) {
    if (button.state.highlight || button.state.hover) {
      if (button.state.pressed) {
        state = ButtonVisualState.ActiveHighlightPressed;
      } else {
        state = ButtonVisualState.ActiveHighlightReleased;
      }
    } else {
      if (button.state.pressed) {
        state = ButtonVisualState.ActivePressed;
      } else {
        state = ButtonVisualState.ActiveReleased;
      }
    }
  } else {
    if (button.state.highlight || button.state.hover) {
      if (button.state.pressed) {
        state = ButtonVisualState.InactiveHighlightPressed;
      } else {
        state = ButtonVisualState.InactiveHighlightReleased;
      }
    } else {
      if (button.state.pressed) {
        state = ButtonVisualState.InactivePressed;
      } else {
        state = ButtonVisualState.InactiveReleased;
      }
    }
  }

  if (state !== undefined) {
    button.meta.visualUpdateFunc?.(button.node, state, CORE.gfx);
  }
};

export function setPickedGambleButton(buttonIds: string[], pick: string): void {
  buttonIds.forEach((id) => {
    const button = buttons.get(id);
    if (!button) return;
    button.state.active = id === pick;
    button.state.highlight = id === pick;
    updateButtonState(button);
  });
}

export function disableButtonInputListeners(buttons: Button[]) {
  buttons.forEach((button) => {
    if (button.state.listenerId) {
      CORE.input.removeListener(button.state.listenerId);
      button.state.listenerId = undefined;
    }
  });
}

export function bindButtonListeners(buttonIds: string[]) {
  if (CLIENT_STATE.replay) {
    return;
  }
  buttonIds.forEach((id) => {
    const button = buttons.get(id);
    if (!button) return;
    if (!button.state.listenerId) {
      button.state.active = true;
      button.state.listenerId = CORE.input.listenNode(button.node, (event) => {
        handleInputEvent(button, event.type, IS_MOBILE_DEVICE);
      });
    }
    button.state.releasedCallback = (name) => {
      customInput('custom/'.concat(name));
    };
  });
}

export function unbindButtonListeners(buttonIds: string[]) {
  buttonIds.forEach((id) => {
    const button = buttons.get(id);
    if (!button) return;
    if (button.state.listenerId) {
      CORE.input.removeListener(button.state.listenerId);
      button.state.listenerId = undefined;
      button.state.active = false;
      button.state.pressed = false;
      button.state.highlight = false;
      button.state.hover = false;
      updateButtonState(button);
    }
  });
}
