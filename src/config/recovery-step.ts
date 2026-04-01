import {Infer, enums, is, number, object, tuple} from 'superstruct';
import * as Casino from '@apila/casino-frame/types';

export enum RecoveryStepState {
  BASEGAME = 1,
  END_ROUND = 2,
  GAMBLE_ROUND = 3,
  GAMBLE_PICK = 4,
  FREESPIN = 5,
  FREESPINS_SELECTION_EXIT = 6,
  FREESPINS_ENTER = 7,
  FREESPINS_EXIT = 8,
  GAMBLE_END_ROUND = 9,
}

const RecoveryStepStateSchema = enums([
  RecoveryStepState.BASEGAME,
  RecoveryStepState.END_ROUND,
  RecoveryStepState.FREESPIN,
  RecoveryStepState.GAMBLE_ROUND,
  RecoveryStepState.FREESPINS_SELECTION_EXIT,
  RecoveryStepState.FREESPINS_ENTER,
  RecoveryStepState.FREESPINS_EXIT,
  RecoveryStepState.GAMBLE_PICK,
  RecoveryStepState.GAMBLE_END_ROUND,
]);

const RecoveryStepSchema = object({
  state: RecoveryStepStateSchema,
  index: number(),
});

export type RecoveryStep = Infer<typeof RecoveryStepSchema>;

export function eCasinoToGame(
  step: Casino.RecoveryStep,
): RecoveryStep | undefined {
  if (is(step, tuple([RecoveryStepStateSchema, number()]))) {
    return {state: step[0], index: step[1]};
  }
  return undefined;
}

export function gameToECasino(step: RecoveryStep): Casino.RecoveryStep {
  return [step.state, step.index];
}
