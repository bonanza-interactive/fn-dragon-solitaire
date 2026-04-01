import {schema} from '@apila/game-libraries';

//Game schemas
import {BASE_GAME} from './base-schema';
import {GameLayer} from './common-schema';
import {LOADING_SCREEN} from './loading-schema';

export {BASE_GAME, GameLayer, LOADING_SCREEN};

schema.enableHotReload(module, {
  BASE_GAME,
  LOADING_SCREEN,
});
