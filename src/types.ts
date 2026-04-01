import {gfx} from '@apila/engine';

export enum MetaType {
  SpineAnimation = 0,
  LocalizedText = 1,
  Button = 2,
}

interface MetaProps<T extends MetaType> {
  type: T;
}

export enum ButtonBlinkMode {
  Off,
  Normal,
  Inverted,
}

export enum ButtonLightType {
  Lamp,
  LED,
}

interface ButtonProps {
  //for physical button blinks
  blinkMode?: ButtonBlinkMode;
  lightType?: ButtonLightType;
  colorActive?: number[];
  colorActiveBright?: number[];
  colorInactive?: number[];

  visualUpdateFunc?: ButtonVisualUpdateFunc;
}

export interface SpineAnimationProps {
  animations: {
    animation: string;
    trackId: number;
    skin?: string;
    loop: boolean;
  }[];
}

export interface LocalizedTextProps {
  localizationKey: string;
}

export enum ButtonVisualState {
  ActiveReleased,
  ActivePressed,
  ActiveHighlightReleased,
  ActiveHighlightPressed,
  InactiveReleased,
  InactivePressed,
  InactiveHighlightReleased,
  InactiveHighlightPressed,
}

export enum ButtonBlinkState {
  Bright,
  Normal,
}

export type ButtonVisualUpdateFunc = (
  node: gfx.Sprite,
  state: ButtonVisualState,
  GFX: gfx.Gfx,
) => void;

export type ButtonMeta = ButtonProps & MetaProps<MetaType.Button>;
export type LocalizedTextMeta = LocalizedTextProps &
  MetaProps<MetaType.LocalizedText>;
export type SpineAnimationMeta = SpineAnimationProps &
  MetaProps<MetaType.SpineAnimation>;

export type MetaData = ButtonMeta | LocalizedTextMeta | SpineAnimationMeta;

export function createButtonMeta(init: ButtonProps): ButtonMeta {
  return {...{type: MetaType.Button}, ...init};
}

export function createLocalizedTextMeta(
  init: LocalizedTextProps,
): LocalizedTextMeta {
  return {...{type: MetaType.LocalizedText}, ...init};
}

export function createSpineAnimationMeta(
  init: SpineAnimationProps,
): SpineAnimationMeta {
  return {...{type: MetaType.SpineAnimation}, ...init};
}

export function isMeta<T extends MetaType>(
  meta: unknown | null | undefined,
  type: T,
): meta is MetaData & {type: T} {
  if (meta === null || meta === undefined) return false;

  switch (type) {
    case MetaType.Button:
      return isButtonMeta(meta);
    case MetaType.LocalizedText:
      return isLocalizedTextMeta(meta);
    case MetaType.SpineAnimation:
      return isSpineAnimationMeta(meta);
    default:
      return false;
  }
}

// Type guards
function isButtonMeta(meta: unknown): meta is ButtonMeta {
  return (meta as ButtonMeta).type === MetaType.Button;
}

function isLocalizedTextMeta(meta: unknown): meta is LocalizedTextMeta {
  return (meta as LocalizedTextMeta).type === MetaType.LocalizedText;
}

function isSpineAnimationMeta(meta: unknown): meta is SpineAnimationMeta {
  return (meta as SpineAnimationMeta).type === MetaType.SpineAnimation;
}
