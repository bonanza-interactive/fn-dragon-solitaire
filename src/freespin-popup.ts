import {gfx} from '@apila/engine/dist';
import {anim} from '@apila/game-libraries';
import {CLIENT_STATE} from './main';
import {wait} from './util/utils';
import {getNode, getSprite} from './util/utils-node';
import {LOCALIZER} from './framework';
import {WebfontSprite} from './webfont/sprite';
import {GAME} from './game';
import {FONT, FONT_STYLE} from './webfont/config';

export class FreespinPopup {
  private rootNode: gfx.Empty;
  private nodes: {
    node: gfx.Empty;
    opacity: number;
  }[] = [];

  private freespin_popup_content_1: WebfontSprite;
  private freespin_popup_content_2: WebfontSprite;

  private timeline = new anim.Timeline();

  constructor(root: gfx.NodeProperties) {
    this.rootNode = root;
    this.rootNode.visible = false;
    for (const name of [
      'freespin_popup_content_1',
      'freespin_popup_content_2',
    ]) {
      const node = getNode(root, name);
      if (!node) continue;

      this.nodes.push({node, opacity: node.opacity});
      node.opacity = 0;
    }
    this.freespin_popup_content_1 = new WebfontSprite(
      GAME.canvasTextBuilder,
      getSprite(root, 'freespin_popup_content_1'),
      FONT.freespinPopupContent,
      FONT_STYLE.windisplayText,
    );
    this.freespin_popup_content_1.setMaxSize([1200, 250]);
    this.freespin_popup_content_2 = new WebfontSprite(
      GAME.canvasTextBuilder,
      getSprite(root, 'freespin_popup_content_2'),
      FONT.freespinPopupContent,
      FONT_STYLE.windisplayText,
    );
    this.freespin_popup_content_2.setMaxSize([1200, 250]);
  }

  public async show(): Promise<void> {
    if (!this.rootNode.visible) {
      this.rootNode.visible = true;

      this.freespin_popup_content_1.text = LOCALIZER.get(
        'freespin_popup_content_1',
        CLIENT_STATE.freespinsLeft.toString(),
      );
      this.freespin_popup_content_2.text = LOCALIZER.get(
        'freespin_popup_content_2',
      );
      this.timeline = new anim.Timeline();

      this.nodes.forEach((i) => {
        this.timeline.animate(
          anim.OutQuad(0, i.opacity),
          0.3,
          anim.Property(i.node, 'opacity'),
        );
      });

      await wait(300);
    }
  }

  public async hide(): Promise<void> {
    if (this.rootNode.visible) {
      this.timeline = new anim.Timeline();

      this.nodes.forEach((i) => {
        this.timeline
          .animate(
            anim.OutQuad(i.node.opacity, 0),
            0.3,
            anim.Property(i.node, 'opacity'),
          )
          .after(() => {
            this.rootNode.visible = false;
          });
      });
      await wait(300);
    }
  }

  public update(delta: number): void {
    this.timeline.tick(delta);
  }
}
