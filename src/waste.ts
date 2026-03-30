import {gfx} from '@apila/engine';
import {Card} from './card';
import {CardName} from './config/config';
import {cardToIndex, rankToIndex} from './util/utils-game';
import {getNode} from './util/utils-node';
import {getCardNodeName} from './util/utils';


export class Waste {
  private root: gfx.Empty;
  private card: Card;

  private wastePile: {rank: string; suit: string; isJoker: boolean}[] = [];

  constructor(root: gfx.Empty, timeline: any) {
    this.root = root;
    this.card = new Card(this.root, timeline);
  }

  public setWastePile(data: typeof this.wastePile): void {
    this.wastePile = data;
    
  }

  public show(): void {
    if (!this.wastePile || this.wastePile.length === 0) return;

    const topCard = this.wastePile[this.wastePile.length - 1];

    if (topCard.isJoker) {
      this.card.cardIndex =
        53 + Math.floor(rankToIndex(topCard.rank) / 13);
    } else {
      this.card.cardIndex = cardToIndex(topCard.rank, topCard.suit);
    }

    this.card.visible = true;

    this.card.parent = this.getNode(CardName.Waste, 0);
  }

private getNode(name: CardName, index?: number): gfx.Empty {
  const nodeName = getCardNodeName(name, index);
  return getNode(this.root, nodeName);
}
}