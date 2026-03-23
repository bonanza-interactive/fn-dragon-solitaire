import {ClientState} from './client-state';
import {RoundState} from './config/backend-types';
import {Main} from './game-loop';
import {Signal} from './util/signal';
import {createAutoUpdate} from './util/updatable';
import {CORE} from './game';
import {expose} from './util/exposer';

/**
 * Build slot apis
 */
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
  round: RoundState;
  bet: number;
};

const m = new Main();
void m.initialize();

// Expose the main instance & NEMO to window for console access.
if (process.env.NODE_ENV === 'development') {
  expose('Main', m);
  expose('Core', CORE);
}
