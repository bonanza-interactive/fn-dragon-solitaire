import * as fs from 'fs';
import path from 'path';

interface IInfoPage {
  pay_html: string | undefined;
  help_html: string | undefined;
}

async function main() {
  const dir = 'localizations';
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    const jsonFiles = files.filter(
      (value) => value.endsWith('json') && !value.includes('template')
    );
    const htmlFiles = files.filter((value) => value.endsWith('html'));

    const htmlTemplates: Map<string, string> = new Map();

    htmlFiles.forEach((file) => {
      try {
        const html = fs.readFileSync(path.join(dir, file), 'utf8') as string;
        const singleLineHtml = html
          .split('\n')
          .map((line) => line.trim())
          .join(' ');
        const id = file.split('-')[1].split('.')[0] + '_html';

        htmlTemplates.set(id, singleLineHtml);
      } catch (e) {
        throw Error(
          `Following error occurred when trying to read "${file}": ${e}`
        );
      }
    });

    jsonFiles.forEach((file) => {
      try {
        let changedMade = false;
        const json = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
        if ('__game_rules' in json) {
          const infoPage = json.__game_rules as IInfoPage[];
          for (const info of infoPage) {
            for (const prop in info) {
              const oldValue = htmlTemplates.get(prop);
              if (!oldValue) {
                continue;
              }
              if (info[prop as keyof typeof info] !== oldValue) {
                info[prop as keyof typeof info] = oldValue;
                changedMade = true;
              }
            }

            for (const key of htmlTemplates.keys()) {
              if (!info[key as keyof typeof info]) {
                info[key as keyof typeof info] = htmlTemplates.get(
                  key
                ) as string;
                changedMade = true;
              }
            }
          }
        } else {
          console.log(
            '\x1b[33m%s\x1b[0m: ',
            `__game_rules is missing from: ${file}`
          );
        }

        if (changedMade) {
          fs.writeFileSync(path.join(dir, file), JSON.stringify(json, null, 2));
          console.log(
            '\x1b[32m%s\x1b[0m: ',
            `Successfully updated __game_rules to: ${file}`
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
