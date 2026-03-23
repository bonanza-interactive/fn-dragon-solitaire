import * as fs from 'fs';
import path from 'path';
import {IntroData} from '@apila/casino-frame/types';

function buildIntroHtml(json: IntroData): string {
  let html = /*html*/ `
  <style>
    .cf-intro-page {
      position: absolute;
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
    }
    .game-intro-page-img {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: contain;

    }
    .game-intro-page-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .game-intro-page-h {
      position: absolute;
      top: 0.666em;
      left: 0.666em;
      right: 0.666em;
      color: white;
      text-align: center;
      font-size: 1.5em;
    }
    .game-intro-page-p {
      position: absolute;
      bottom: 1em;
      left: 1em;
      right: 1em;
      color: white;
      text-align: start;
      overflow: hidden;
    }
  </style>
  `;
  html = html + '<div>';
  json.pages.forEach((page) => {
    const pageHtml =
      page.text !== undefined && page.header !== undefined
        ? /*html*/ `
      <div class="cf-intro-page">
        <img class="game-intro-page-bg" src="{assets_url}${page.background}"/>
        <img class="game-intro-page-img" src="{assets_url}${page.image}"/>
        <p class="game-intro-page-h">${page.header}</p>
        <p class="game-intro-page-p">${page.text}</p>
      </div>`
        : /*html*/ `
      <div class="cf-intro-page">
        <img class="game-intro-page-bg" src="{assets_url}${page.background}"/>
        <img class="game-intro-page-img" src="{assets_url}${page.image}"/>
      </div>`;
    html = html + pageHtml;
  });
  html = html + '</div>';
  return html;
}

async function main() {
  const dir = 'localizations';
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    const jsonFiles = files.filter((value) => value.endsWith('json'));
    const langFiles = jsonFiles.filter(
      (value) => !value.endsWith('template-intro.json')
    );

    const html = buildIntroHtml(
      JSON.parse(fs.readFileSync(path.join(dir, 'template-intro.json'), 'utf8'))
    );
    langFiles.forEach((file) => {
      try {
        let changedMade = false;
        const json = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
        json['__intro'] = [{html}];
        changedMade = true;

        if (changedMade) {
          fs.writeFileSync(path.join(dir, file), JSON.stringify(json, null, 2));
          console.log(
            '\x1b[32m%s\x1b[0m: ',
            `Successfully updated __intro to: ${file}`
          );
        } else {
          console.log(`No changes made to: ${file}`);
        }
      } catch (e) {
        throw Error(
          `Following error occurred when trying to read "${file}": ${e}`
        );
      }
    });
  }
}

main();
