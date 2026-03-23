import {GameConfig} from '../config/config';

function createSubject(header?: string): string {
  return header !== undefined ? `<h1 class="subject">{${header}}</h1>` : '';
}

function createPayTable(
  classes?: Partial<{
    tr: string;
    td: string;
    table: string;
  }>
): string {
  let html = `<table class="${classes?.table ?? ''}">`;
  const pays = GameConfig.gameConfig.paytable;

  pays.forEach(
    (e) =>
      (html += `<tr class="${classes?.tr ?? ''}">
         <td class="${classes?.td ?? ''}">{${e.rank}}</td>
         <td class="cf-help-win-factor ${classes?.td ?? ''}" win-factor="${e.winFactor}">-</td>
       </tr>`)
  );

  html += '</table>';

  return html;
}

export function generatePays(): string {
  return (
    `
  <style>
    .subject {
      margin-bottom: 0px;
    }
    .vk-pays-table {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;        
    }
    .vk-pays-table-cell {
        font-size: x-large;
        padding-right: 4rem;
    }
    </style>` +
    `<div class="section">` +
    createSubject('pays_header') +
    `</div>` +
    `<div class="vk-pays-table">
      ${createPayTable({td: 'vk-pays-table-cell'})}
    </div>`
  );
}

type InfoParagraph = {
  img?: string;
  text?: string;
  html?: string;
  cssStyleOverride?: string;
};

type InfoHeader = {
  text: string;
  htmlTag?: string;
};

type PaytableElement = {
  id: string;
  header?: InfoHeader;
  content?: InfoParagraph[];
  description?: string;
};

export function generateHelp(): string {
  const INSTRUCTIONS: PaytableElement[] = [
    {
      id: 'title_0',
      header: {text: 'help_header'},
    },
    {
      id: 'title_1',
      description: 'help_description',
    },
    {
      id: 'how_to_play',
      header: {text: 'help_header_how_to_play', htmlTag: 'h2'},
      description: 'help_description_how_to_play',
    },
    {
      id: 'wins',
      header: {text: 'help_header_wins', htmlTag: 'h2'},
      description: 'help_description_wins',
    },
    {
      id: 'deck',
      header: {text: 'help_header_deck', htmlTag: 'h2'},
      description: 'help_description_deck',
      content: [
        {
          text: 'help_content_deck',
        },
      ],
    },
    {
      id: 'cardswap',
      header: {text: 'help_header_cardswap', htmlTag: 'h2'},
      description: 'help_description_cardswap',
      content: [
        {
          img: 'slot-ui/paytable/swap_button.png',
        },
      ],
    },
    {
      id: 'superround',
      header: {text: 'help_header_superround', htmlTag: 'h2'},
      description: 'help_description_superround',
    },
    {
      id: 'gamble_selections',
      header: {text: 'help_header_gamble', htmlTag: 'h2'},
      description: 'help_description_gamble_selections',
      content: [
        {
          text: 'help_content_gamble_selections',
        },
      ],
    },
    {
      id: 'gamble_cards',
      description: 'help_description_gamble_cards',
    },
    {
      id: 'gamble_result',
      description: 'help_description_gamble_result',
      content: [
        {
          text: 'help_content_gamble_result',
        },
      ],
    },
  ];

  let helpContent = /*css*/ `
    <style>
      .section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin-top: 1em;
      }
      .section-description {
        max-width: 500px;
        width: 100%;
        text-align: start;
        margin-bottom: 1em;
      }
      .section h1 {
        width: 100%;
      }
      .content {
        max-width: 500px;
        text-align: start;
      }
      .section img {
        width:128px;
      }
      .feature-info {
        margin-bottom: 2em;
        max-width:300px;
      }
    </style>`;

  for (const instruction of INSTRUCTIONS) {
    let classString = 'section';
    if (instruction.id?.includes('gamble')) {
      classString += ' cf-help-optional--gamble';
    }
    helpContent += `<div class="${classString}">`;

    if (instruction.header) {
      const tag = instruction.header.htmlTag ?? 'h1';
      helpContent += `<br/><${tag}>{${instruction.header.text}}</${tag}>`;
    }
    if (instruction.description) {
      helpContent += `<div class="section-description">{${instruction.description}}</div>`;
    }
    if (instruction.content) {
      for (const content of instruction.content) {
        if (content.img) {
          helpContent += `<img src="{assets_url}${content.img}" style="${content.cssStyleOverride ?? ''}">`;
        }

        if (content.html) {
          helpContent += content.html;
        }

        if (content.text) {
          helpContent += `
        <div class="content">
            <div class="feature-info">
            {${content.text}}
            </div>
        </div>`;
        }
      }
    }
    helpContent += `</div>`;
  }

  return helpContent;
}
