import {State} from '@apila/casino-frame/types';
import {Time, clamp} from '@apila/engine/dist/apila-gfx';
import {GameConfig, debugConfig, miscConfig} from './config/config';
import {forwardInput} from './forward-input';
import {GAMEFW} from './framework';
import {CORE, GAME, initializeApila} from './game';
import {AUTO_TICK, TICK} from './main';
import {onLayoutChanged} from './node-storage';
import {StateMachine} from './state-machine';
import * as States from './states';
import {BackendUtil} from './util/backend-util';
import {RafTimer} from './util/raf-timer';
import {lerp} from './util/utils';
import {getReelGameKitLayout} from './util/utils-gfx';
import {marginLTRB} from './util/utils-schema';

export class Main {
  private stateMachine?: StateMachine;
  private paused = false;

  public createStates(gamble: boolean): void {
    this.stateMachine = new StateMachine(
      [
        // States.Spinning,
        States.ResultNoWin,
        // States.BasegameRound,
        States.PreloadDone,
        States.SettleBet,
        States.Preload,
        States.Replay,
        States.ReplayFinished,
        States.CarouselIntro,
        ...(gamble ? [] : []),
      ],
      new States.Preload()
    );
  }

  public async initialize(): Promise<void> {
    const graphics = GAMEFW.createWebGLContext();
    initializeApila(graphics.webGL.canvas, graphics.webGL.context);

    GAMEFW.configure(
      graphics,
      {
        hasAutoplay: false,
        hasQuickplay: true,
        hasSlamstop: false,
        hasFeature: false,
        hasGamble: true,
        hasStrategy: true,
      },
      {
        mute: () => {
          CORE.sound.mute();
        },
        unmute: () => {
          CORE.sound.unmute();
        },
        volume: (volume: number) => {
          CORE.sound.setMasterVolume(volume);
        },
        pause: () => {
          this.paused = true;
        },
        resume: () => {
          this.paused = false;
        },
        input: (input: string) => {
          forwardInput(input);
        },
        resize: () => {
          onLayoutChanged(
            GAME.nodeStorage,
            getReelGameKitLayout(CORE.gfx.layout)
          );
        },
        state: (state: Partial<State>) => {
          if (state.quickplay !== undefined)
            GAME.cards.timeScale = lerp(
              1,
              miscConfig.quickPlaySpeed,
              state.quickplay
            );

          if (state.bet !== undefined) {
            const index = GAMEFW.settings().game.bets.findIndex(
              (v: number) => v === state.bet
            );
            if (index >= 0) {
              const clampedIndex = clamp(index, 0, 14);
              CORE.fx.trigger(`fx_bet_${clampedIndex}`);
            }
          } else {
            CORE.fx.trigger(`fx_button_release`);
          }
        },
      }
    );

    GameConfig.gameConfig = await BackendUtil.init();

    this.createStates(GAMEFW.settings().game.gamble);

    if (GAMEFW.settings().casino.mute) {
      CORE.sound.mute();
    }

    CORE.gfx.addLayoutChanged((): void => {
      CORE.gfx.updateConfig({
        resolutionScale: window.devicePixelRatio,
      });
    });

    CORE.gfx.run(this.onRender);

    await this.stateMachine?.run();
  }

  private onRender = (time: Time) => {
    time = this.paused ? {...time, delta: 0} : time;
    CORE.messageQueue.flush();

    this.stateMachine?.update(time.delta);

    if (debugConfig.showSafeZone) {
      const rect = marginLTRB();
      CORE.gfx.debugDraw.setDrawColor([1, 0.5, 0.5, 1]);
      CORE.gfx.debugDraw.rect(
        [rect.left, rect.top],
        [
          CORE.gfx.layout.canvasPixelSize[0] - rect.right - 1,
          CORE.gfx.layout.canvasPixelSize[1] - rect.bottom - 1,
        ]
      );
    }

    if (!debugConfig.pause) {
      // Limit delta so that at after 10fps
      // game will start just rendering slower
      time.delta = clamp(time.delta, 0, 1 / 10);

      RafTimer.doStep(time.delta);

      AUTO_TICK.update(time.delta);

      TICK.emit(time.delta);

      GAME.paytable?.updateWinsums(GAMEFW.state().bet);

      CORE.sound.update(time.delta);

      if (GAME.entered) {
        CORE.fx.update(time.delta);
      }
      CORE.gameTimer.update(time);

      CORE.gfx.render(GAME.nodeStorage.stage);
    } else {
      CORE.gfx.render(GAME.nodeStorage.stage);
    }

    if (debugConfig.stepFrames >= 0) {
      --debugConfig.stepFrames;
      debugConfig.pause = debugConfig.stepFrames < 0;
    }
  };
}
