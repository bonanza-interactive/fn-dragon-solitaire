import {GameLayer} from '../config/schemas';
import {CORE, GAME} from '../game';
import {StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {EndRound} from './EndRound';

export class FreespinOutro extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    GAME.winScroll.hide();
    GAME.cards.killEffects();
    GAME.cards.discardTable();
    await GAME.cards.discardHand();

    const originalHand = GAME.cards.getBasegameSelectedCards();
    GAME.cards.resetHandCards(originalHand);
    GAME.paytable.updateContent(originalHand.length, false);

    GAME.cards.setHandDepthGroup(GameLayer.FsTransitionBackground);
    CORE.fx.trigger('fx_freespin_exit');
    await GAME.freespinTransition.exit();
    GAME.cards.setHandDepthGroup(GameLayer.Deck);
    GAME.dragonPanel.deactivateBonus();
    GAME.dragonPanel.freespinsEnd();

    return new EndRound(data);
  }
}
