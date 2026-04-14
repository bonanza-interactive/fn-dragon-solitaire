import type {Round, RoundState} from '../config/backend-types';
import type {SolitairePickMove} from '../cards-solitaire';

type Card = RoundState['wastePile'][number];

type RoundWithMove = Round & {
  move?: SolitairePickMove;
  moved?: Card[];
};

export function extractAutocompleteMoveSteps(
  finalRound: RoundState,
  previousRoundsLength: number,
): SolitairePickMove[] {
  const rounds = finalRound.rounds ?? [];
  const out: SolitairePickMove[] = [];
  for (let i = previousRoundsLength; i < rounds.length; i++) {
    const entry = rounds[i] as RoundWithMove;
    if (entry.move?.from && entry.move?.to) {
      out.push(entry.move);
    }
  }
  return out;
}

function cloneCard(card: Card): Card {
  return {
    rank: card.rank,
    suit: card.suit,
    isJoker: card.isJoker,
  };
}

function cloneRoundState(round: RoundState): RoundState {
  return {
    ...round,
    rounds: [...(round.rounds ?? [])],
    picks: [...(round.picks ?? [])],
    wastePile: round.wastePile.map(cloneCard),
    openCards: round.openCards.map((column) => column.map(cloneCard)),
    foundationTops: round.foundationTops.map(cloneCard),
    faceDownCounts: [...round.faceDownCounts],
  };
}

function parseStackIndex(location: string): number {
  if (!location.startsWith('STACK_')) {
    return -1;
  }
  const parsed = Number(location.replace('STACK_', ''));
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 7) {
    return -1;
  }
  return parsed - 1;
}

function removeCardsFromSource(
  state: RoundState,
  from: string,
  count: number,
): Card[] {
  if (from === 'WASTE_PILE') {
    if (state.wastePile.length < count) return [];
    return state.wastePile.splice(state.wastePile.length - count, count);
  }

  const stack = parseStackIndex(from);
  if (stack >= 0) {
    const source = state.openCards[stack];
    if (source.length < count) return [];
    const moved = source.splice(source.length - count, count);
    if (source.length === 0 && state.faceDownCounts[stack] > 0) {
      state.faceDownCounts[stack] -= 1;
    }
    return moved;
  }

  return [];
}

function applyCardsToDestination(
  state: RoundState,
  to: string,
  cards: Card[],
): void {
  if (cards.length === 0) {
    return;
  }
  if (to === 'WASTE_PILE') {
    state.wastePile.push(...cards.map(cloneCard));
    return;
  }
  if (to === 'FOUNDATION') {
    const top = cards[cards.length - 1];
    state.foundationTops = state.foundationTops
      .filter((c) => c.suit !== top.suit)
      .concat([cloneCard(top)]);
    return;
  }
  const stack = parseStackIndex(to);
  if (stack >= 0) {
    state.openCards[stack].push(...cards.map(cloneCard));
  }
}

export function applyAutocompleteMoveStep(
  currentRound: RoundState,
  move: SolitairePickMove,
  moved?: Card[],
): RoundState {
  const next = cloneRoundState(currentRound);
  const cards =
    moved && moved.length > 0
      ? moved.map(cloneCard)
      : removeCardsFromSource(next, move.from, move.count);

  // If "moved" is provided from backend, source still needs to be removed.
  if (moved && moved.length > 0) {
    void removeCardsFromSource(next, move.from, move.count);
  }

  applyCardsToDestination(next, move.to, cards);
  next.picks = [];
  return next;
}

export function extractAutocompleteMoveRounds(
  finalRound: RoundState,
  previousRoundsLength: number,
): RoundWithMove[] {
  const rounds = finalRound.rounds ?? [];
  const out: RoundWithMove[] = [];
  for (let i = previousRoundsLength; i < rounds.length; i++) {
    const entry = rounds[i] as RoundWithMove;
    if (entry.move?.from && entry.move?.to) {
      out.push(entry);
    }
  }
  return out;
}
