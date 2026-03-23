import {gfx} from '@apila/engine';
import {schema} from '@apila/game-libraries';

import {updateButtonStates} from './button-state-handler';
import {AUTO_TICK} from './main';
import {MetaData} from './types';
import {ReelGameKitLayout} from './util/utils-gfx';
import {DFSChildIterator, isSpine} from './util/utils-node';

export type MetaCache = Map<string, MetaData>;

export interface NodeStorageData {
  nodes: schema.ManagedNodes;
  metaCache: MetaCache;
}

export interface NodeStorage {
  stage: gfx.Stage;
  baseGame: NodeStorageData;
  uiCommon: NodeStorageData;
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
  layout: ReelGameKitLayout
): void {
  const opts: schema.UpdateLayoutArgs = {
    options: {
      initial: false,
      landscape: layout.orientation === gfx.Orientation.Landscape,
      portrait: layout.orientation === gfx.Orientation.Portrait,
    },
  };
  // ?: Scenes may not yet exist or have been destroyed
  [nodes.baseGame, nodes.uiCommon].forEach((scene) => {
    scene?.nodes?.updateLayout(opts);
  });

  // Update UI buttons
  updateButtonStates();
}
