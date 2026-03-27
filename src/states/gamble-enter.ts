import {GAME} from '../game';
import {StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {Gamble} from './gamble';

export class GambleEnter extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    GAME.baseGameFrameText.hide();
    GAME.winScroll.hide();
    await GAME.cards.collectCards();

    await GAME.cards.dealDblCard();

    return new Gamble(data);
  }
}
