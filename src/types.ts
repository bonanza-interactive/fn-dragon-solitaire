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
  GFX: gfx.Gfx
) => void;

export type ButtonMeta = ButtonProps & MetaProps<MetaType.Button>;
export type SpineAnimationMeta = SpineAnimationProps &
  MetaProps<MetaType.SpineAnimation>;

export type MetaData = ButtonMeta | SpineAnimationMeta;

export function createButtonMeta(init: ButtonProps): ButtonMeta {
  return {...{type: MetaType.Button}, ...init};
}

export function createSpineAnimationMeta(
  init: SpineAnimationProps
): SpineAnimationMeta {
  return {...{type: MetaType.SpineAnimation}, ...init};
}

export function isMeta<T extends MetaType>(
  meta: unknown | null | undefined,
  type: T
): meta is MetaData & {type: T} {
  if (meta === null || meta === undefined) return false;

  switch (type) {
    case MetaType.Button:
      return isButtonMeta(meta);
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

function isSpineAnimationMeta(meta: unknown): meta is SpineAnimationMeta {
  return (meta as SpineAnimationMeta).type === MetaType.SpineAnimation;
}
