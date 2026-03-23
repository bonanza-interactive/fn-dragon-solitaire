import {gfx} from '@apila/engine';
import {schema} from '@apila/game-libraries';
import {AUTO_TICK} from './main';
import {NodeStorageData} from './node-storage';
import {MetaData, MetaType, isMeta} from './types';
import {DFSChildIterator, isSpine} from './util/utils-node';

export class NodeSchemaLoader {
  public load(g: gfx.Gfx, s: schema.NodeSchema): NodeStorageData {
    const nodes = schema.createManagedNodes(g, s);
    nodes.updateLayout({options: {initial: true}});

    const metaCache = new Map<string, MetaData>();
    for (const node of DFSChildIterator(nodes.root)) {
      const schema = nodes.findSchema(node.name);
      if (schema === null) continue;

      if (schema.meta !== null) {
        metaCache.set(node.name, schema.meta as MetaData);
      }

      if (isMeta(schema.meta, MetaType.SpineAnimation)) {
        if (!isSpine(node)) {
          throw new Error('Node with SpineAnimationMeta is not a spine');
        }
        for (const anim of schema.meta.animations) {
          node.state.setAnimation(anim.trackId, anim.animation, anim.loop);
        }
      }

      if (isSpine(node)) {
        AUTO_TICK.add(node, 0);
      }
    }

    return {
      nodes,
      metaCache,
    };
  }
}
