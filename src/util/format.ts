/**
 * Formats money sums.
 * TODO - new game frame offers localized money formatting.
 * TODO - apila/game-components has upcoming localization module
 * TODO - determine which to use and then remove this.
 * @param cents Amount of money in cents
 * @param alwaysUseDecimals Should decimals be used even if value is x,00.
 */
export function formatMoney(cents: number, alwaysUseDecimals = true): string {
  const ints = Math.floor(cents / 100);
  const dec = Math.floor(cents - ints * 100);

  // TODO - use localization data
  if (alwaysUseDecimals || dec !== 0) {
    return `${ints},${dec.toString().padStart(2, '0')}`;
  } else {
    return ints.toString();
  }
}
