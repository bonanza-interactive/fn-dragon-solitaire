import {ClientState} from './client-state';
import {RoundState} from './config/backend-types';
import {Main} from './game-loop';
import {Signal} from './util/signal';
import {createAutoUpdate} from './util/updatable';

export const CLIENT_STATE = new ClientState();

/**
 * Signal emitted whenever screen is about to be rendered.
 */
export const TICK: Signal<number> = new Signal<number>();

/**
 * Signal emitted whenever screen has been drawn. Use this for debug drawing.
 * This signal is only emitted if Config.DEBUG is true.
 */
export const DEBUG_DRAW: Signal<number> = new Signal<number>();
export const AUTO_TICK = createAutoUpdate();

export type StateMachineRoundData = {
  roundState: RoundState;
  bet: number;
};

const m = new Main();
m.initialize();
