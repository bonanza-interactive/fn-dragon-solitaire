import {gfx} from '@apila/engine';
import {schema} from '@apila/game-libraries';

import {updateButtonStates} from './button-state-handler';
import {AUTO_TICK} from './main';
import {MetaData} from './types';
import {ReelGameKitLayout} from './util/utils-gfx';
import {DFSChildIterator, isSpine} from './util/utils-node';
// import {IS_MOBILE_DEVICE} from './framework';

export type MetaCache = Map<string, MetaData>;

export interface NodeStorageData {
  nodes: schema.ManagedNodes;
  metaCache: MetaCache;
}

export interface NodeStorage {
  stage: gfx.Stage;
  baseGame: NodeStorageData;
  loading: NodeStorageData;
  uiGamble: NodeStorageData;
}

export function deleteStorageData(data: NodeStorageData): void {
  for (const node of DFSChildIterator(data.nodes.root)) {
    if (isSpine(node)) {
      AUTO_TICK.remove(node);
    }
  }

  data.nodes.destroy();
  data.metaCache.clear();
  data.nodes = undefined as unknown as schema.ManagedNodes;
}

export function onLayoutChanged(
  nodes: NodeStorage,
  layout: ReelGameKitLayout,
): void {
  // const squareThresholdMin = 1170 / 1600;
  // const squareThresholdMax = 1600 / 1600;

  const landscape = layout.orientation === gfx.Orientation.Landscape;
  const portrait = layout.orientation === gfx.Orientation.Portrait;
  // const square =
  //   layout.aspectRatio >= squareThresholdMin &&
  //   layout.aspectRatio <= squareThresholdMax; // small phones

  const opts: schema.UpdateLayoutArgs = {
    options: {
      initial: false,
      landscape,
      portrait,
      // landscapeMobile: landscape && IS_MOBILE_DEVICE,
      // portraitMobile: portrait && IS_MOBILE_DEVICE,
      // square,
      // squareMobile: square && IS_MOBILE_DEVICE,
    },
  };
  // ?: Scenes may not yet exist or have been destroyed
  [
    nodes.loading,
    nodes.baseGame,
    //nodes.uiGamble,
  ].forEach((scene) => {
    scene?.nodes?.updateLayout(opts);
  });

  // Update UI buttons
  updateButtonStates();
}
