import {schema} from '@apila/game-libraries';

//Game schemas
import {BASE_GAME} from './base-schema';
import {GameLayer} from './schema-layers';
import {UI_COMMON_ROOT} from './win-scroller-schema';

export {BASE_GAME, GameLayer, UI_COMMON_ROOT};

schema.enableHotReload(module, {
  BASE_GAME,
  UI_COMMON_ROOT,
});
