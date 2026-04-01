import {gfx} from '@apila/engine';
import {AnimationStateListener, Event, TrackEntry} from '@apila/spine';

type EventData = {
  event: string;
  entry?: TrackEntry;
  animation?: string;
};

export function waitAnimation(spine: gfx.Spine, anim: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const listener: AnimationStateListener = {
      complete: (entry: TrackEntry): void => {
        if (entry.animation && entry.animation.name === anim) {
          spine.state.removeListener(listener);
          resolve();
        }
      },
    };
    spine.state.addListener(listener);
  });
}

export function waitEvent(
  spine: gfx.Spine,
  eventData: EventData,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const listener: AnimationStateListener = {
      event: (entry: TrackEntry, event: Event): void => {
        if (eventData.event !== event.data.name) {
          return;
        }
        if (
          entry.animation &&
          eventData.animation &&
          eventData.animation !== entry.animation.name
        ) {
          return;
        }

        spine.state.removeListener(listener);
        resolve();
      },
      dispose: (entry: TrackEntry): void => {
        if (eventData.entry === entry) {
          spine.state.removeListener(listener);
          reject(`Spine await event rejected for event ${eventData.event}`);
        }
      },
    };
    spine.state.addListener(listener);
  });
}
