import {
  bindButtonListeners,
  setButtonReleasedCallback,
  setButtonState,
  unbindButtonListeners,
} from './button-state-handler';
import {CORE} from './game';
import {CLIENT_STATE} from './main';
import {customInput} from './util/forward-input';

export class AutocompleteButton {
  private pressWait?: () => void;

  public constructor() {
    setButtonState('autocomplete', false, true);
  }

  public prepareForSolitairePicking(active: boolean): void {
    if (CLIENT_STATE.replay) {
      unbindButtonListeners(['autocomplete']);
      setButtonReleasedCallback('autocomplete', undefined);
      setButtonState('autocomplete', false, true);
      return;
    }
    if (active) {
      bindButtonListeners(['autocomplete']);
      setButtonReleasedCallback('autocomplete', (name: string) => {
        customInput('custom/'.concat(name));
        this.notifyPressIfWaiting();
      });
      setButtonState('autocomplete', true, true);
    } else {
      unbindButtonListeners(['autocomplete']);
      setButtonReleasedCallback('autocomplete', undefined);
      setButtonState('autocomplete', false, true);
    }
  }

  public waitForPress(): Promise<void> {
    return new Promise((resolve) => {
      this.pressWait = resolve;
    });
  }

  private notifyPressIfWaiting(): void {
    if (this.pressWait) {
      CORE.fx.trigger('fx_button_ui');
    }
    this.pressWait?.();
    this.pressWait = undefined;
  }
}
