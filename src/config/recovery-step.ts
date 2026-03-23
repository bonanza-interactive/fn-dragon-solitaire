import {Infer, enums, is, number, object, tuple} from 'superstruct';
import * as Casino from '@apila/casino-frame/types';

export enum RecoveryStepState {
  BASEGAME = 1,
}

const RecoveryStepStateSchema = enums([RecoveryStepState.BASEGAME]);

const RecoveryStepSchema = object({
  state: RecoveryStepStateSchema,
  index: number(),
});

export type RecoveryStep = Infer<typeof RecoveryStepSchema>;

export function eCasinoToGame(
  step: Casino.RecoveryStep
): RecoveryStep | undefined {
  if (is(step, tuple([RecoveryStepStateSchema, number()]))) {
    return {state: step[0], index: step[1]};
  }
  return undefined;
}

export function gameToECasino(step: RecoveryStep): Casino.RecoveryStep {
  return [step.state, step.index];
}
