import {gfx} from '@apila/engine';
import {EventType} from '@apila/engine/dist/apila-input';

import {CORE} from './game';
import {
  ButtonBlinkMode,
  ButtonBlinkState,
  ButtonMeta,
  ButtonVisualState,
} from './types';
import {IS_MOBILE_DEVICE} from './framework';
import {customInput} from './forward-input';

export interface Button {
  node: gfx.Sprite;
  meta: ButtonMeta;
  state: {
    pressed: boolean;
    active: boolean;
    highlight: boolean;
    hover: boolean;
    listenerId?: number;
    blinkListenerId?: number;
    suiReleasedCallback?: (name: string) => void;
  };
}

const buttons = new Map<string, Button>();

export function registerButton(button: Button): void {
  buttons.set(button.node.name, button);
}

export const handleInputEvent = (
  button: Button,
  type: EventType,
  isMobile: boolean,
  isCabinet: boolean
): void => {
  if (button.node.visible) {
    if (type === EventType.PRESS) {
      handleButtonPressed(button);
    } else if (type === EventType.RELEASE) {
      handleButtonReleased(button);
    } else if (type === EventType.EXIT) {
      handleButtonExited(button);
    } else if (type === EventType.ENTER) {
      handleButtonEntered(button, !isCabinet);
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
    if (button.state.active && button.state.suiReleasedCallback) {
      button.state.suiReleasedCallback(button.node.name);
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

export const setButtonHighlight = (buttonId: string, hl: boolean): void => {
  const button = buttons.get(buttonId);
  if (!button) return;
  button.state.highlight = hl;
  updateButtonState(button);
  updateBlinkState(button, ButtonBlinkState.Normal);
};

export const setButtonActive = (
  button: Button,
  active: boolean,
  blinkState: ButtonBlinkState
): void => {
  if (button.state.active !== active) {
    button.state.active = active;
    updateButtonState(button);
    updateBlinkState(button, blinkState);
  }
};

export const setButtonBlinkMode = (
  button: Button,
  buttonBlinkMode: ButtonBlinkMode,
  blinkState: ButtonBlinkState
): void => {
  button.meta.blinkMode = buttonBlinkMode;
  updateBlinkState(button, blinkState);
};

export const updateBlinkState = (
  button: Button,
  blinkState: ButtonBlinkState
): void => {
  if (button.meta.blinkMode !== undefined) {
    /*
    LED buttons need the 'lamp' parameter to be true in both blink states.
    However, Voltti iDeck and Valtti use 'lamp' for physical button lights
    (true for bright state, false for normal state)
    */
    if (button.state.active) {
      if (button.meta.blinkMode === ButtonBlinkMode.Off) {
        button.state.highlight = false;
      }
      if (button.meta.blinkMode === ButtonBlinkMode.Normal) {
        button.state.highlight = blinkState === ButtonBlinkState.Bright;
      } else if (button.meta.blinkMode === ButtonBlinkMode.Inverted) {
        button.state.highlight = blinkState === ButtonBlinkState.Normal;
      }

      if (button.meta.blinkMode !== ButtonBlinkMode.Off) {
        updateButtonState(button);
      }
    }
  }
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
  buttonIds.forEach((e) => {
    const btn = buttons.get(e) as Button;
    btn.state.active = e === pick;
    btn.state.highlight = e === pick;
    updateButtonState(btn);
    updateBlinkState(btn, ButtonBlinkState.Normal);
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

export function enableButtonsInputListeners(buttonIds: string[]) {
  buttonIds.forEach((id) => {
    const button = buttons.get(id);
    if (!button) return;
    if (!button.state.listenerId) {
      const listenerId = CORE.input.listenNode(button.node, (event) => {
        handleInputEvent(button, event.type, IS_MOBILE_DEVICE, false);
      });
      button.state.listenerId = listenerId;
      button.state.active = true;
      button.state.pressed = false;
      button.state.highlight = false;

      updateButtonState(button);
      updateBlinkState(button, ButtonBlinkState.Normal);
    }
  });
}

export function bindButtonListeners(buttonIds: string[]) {
  buttonIds.forEach((id) => {
    const button = buttons.get(id);
    if (!button) return;
    if (!button.state.listenerId) {
      button.state.listenerId = CORE.input.listenNode(button.node, (event) => {
        handleInputEvent(button, event.type, IS_MOBILE_DEVICE, false);
      });
    }
    button.state.suiReleasedCallback = (_name) => {
      customInput('custom/'.concat(_name));
    };

    button.state.active = true;
    button.state.pressed = false;
    button.state.highlight = false;

    updateButtonState(button);
  });
}

export function unbindButtonListeners(buttonIds: string[]) {
  buttonIds.forEach((id) => {
    const button = buttons.get(id);
    if (!button) return;
    if (button.state.listenerId) {
      CORE.input.removeListener(button.state.listenerId);
      button.state.listenerId = undefined;
    }

    button.state.active = false;
    button.state.pressed = false;
    button.state.highlight = false;
    button.state.hover = false;
    updateButtonState(button);
  });
}
