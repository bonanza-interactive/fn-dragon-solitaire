import {Time, clamp} from '@apila/engine/dist/apila-gfx';
import {CORE, GAME, initializeApila} from './game';
import {AUTO_TICK, TICK} from './main';
import {StateMachine} from './state-machine';
import * as States from './states';
import {RafTimer} from './util/raf-timer';
import {onLayoutChanged} from './node-storage';
import {getReelGameKitLayout} from './util/utils-gfx';
import {forwardInput} from './util/forward-input';
import {GameConfig} from './config/config';
import {BackendUtil} from './util/backend-util';
import {GAMEFW} from './framework';
import {State} from '@apila/casino-frame/types';

export class Main {
  private stateMachine?: StateMachine;
  private paused = false;

  public createStates(): void {
    const states = [
      States.EndRound,
      States.Spinning,
      States.FreespinSpinning,
      States.ResultNoWin,
      States.Autocomplete,
      States.BasegameRound,
      States.Preload,
      States.PreloadDone,
      States.MaxWin,
      States.LoadingRecovery,
      States.ReadyRecovery,
      States.SettleBet,
      States.Ready,
      // States.FreespinIntro,
      States.FreespinOutro,
      States.FreespinRound,
      States.ResultFreespins,
      States.ResultWinBasegame,
      // States.ResultWinFreespins,
      States.CardSelection,
      States.FreespinMaxWin,
      States.CarouselIntro,
      States.Replay,
      States.ReplayFinished,
    ];

    // const gambleStates = [
    //   States.Gamble,
    //   States.GamblePick,
    //   States.GambleContinue,
    //   States.GambleQuery,
    //   States.GambleRound,
    //   States.GambleEnter,
    //   States.GambleExit,
    //   States.GambleMaxWin,
    // ];

    this.stateMachine = new StateMachine([...states], new States.Preload());
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
            getReelGameKitLayout(CORE.gfx.layout),
          );
        },
        state: (state: Partial<State>) => {
          if (state.bet) {
            GAME?.paytable?.updateContentBetChanged();
          }
        },
      },
    );
    if (GAMEFW.settings().casino.mute) {
      CORE.sound.mute();
    }

    GameConfig.gameConfig = await BackendUtil.init();

    this.createStates();

    CORE.gfx.run(this.onRender);

    await this.stateMachine?.run();
  }

  private onRender = (time: Time) => {
    let delta = this.paused ? 0 : time.delta;

    CORE.messageQueue.flush();

    this.stateMachine?.update(delta);

    // Limit delta so that at after 10fps
    // game will start just rendering slower
    delta = clamp(time.delta, 0, 1 / 10);

    RafTimer.doStep(delta);

    AUTO_TICK.update(delta);

    TICK.emit(delta);

    CORE.sound.update(delta);

    if (GAME.entered) {
      CORE.fx.update(delta);
    }
    CORE.gameTimer.update(time);

    CORE.gfx.render(GAME.nodeStorage.stage);
  };
}
