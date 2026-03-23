import {makeBackendOp} from './remote-backend';

const Yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const Cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;

(async () => {
  if (process.argv.length < 3) {
    console.log(Yellow(`Give op as an argument`));
  }
  const op: string = process.argv[2];
  try {
    await makeBackendOp(op, {});
    console.log(Cyan(`Successful: remote backend ${op}`));
  } catch (err) {
    console.log(Yellow(`Failed to ${op} remote backend: ${err}`));
  }
})();
