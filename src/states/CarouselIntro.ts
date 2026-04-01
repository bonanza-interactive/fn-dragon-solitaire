import {GAMEFW} from '../framework';
import {CORE, GAME} from '../game';
import {StateMachineRoundData} from '../main';
import {onLayoutChanged} from '../node-storage';
import {AnyState, State} from '../state-machine';
import {getReelGameKitLayout} from '../util/utils-gfx';
import {getNode} from '../util/utils-node';
import {PreloadDone} from './PreloadDone';

export class CarouselIntro extends State<StateMachineRoundData | undefined> {
  public async run(data?: StateMachineRoundData): Promise<AnyState> {
    const baseGame = GAME.nodeStorage.baseGame.nodes.root;
    baseGame.visible = true;

    const logo = getNode(baseGame, 'logo');
    const paytable = getNode(baseGame, 'paytable_root');

    logo.visible = false;
    paytable.visible = false;

    onLayoutChanged(GAME.nodeStorage, getReelGameKitLayout(CORE.gfx.layout));

    await GAMEFW.showIntro();

    onLayoutChanged(GAME.nodeStorage, getReelGameKitLayout(CORE.gfx.layout));

    logo.visible = true;
    paytable.visible = true;

    return new PreloadDone(data);
  }
}
