import type * as gf from '@apila/casino-frame/server-types';
import {CasinoLoaderMiddleware} from '@apila/casino-loader/express';
import * as dev from '@apila/dev-server';
import * as fs from 'fs';
import * as Path from 'path';
import {DevCasinoFrameMiddleware} from './dev-cf-middleware';
import {parse} from './parser';
import {SwcLoader, TypeCheckPlugin} from './plugin';
import {getEndpoint as getRemoteBackendEndpoint} from './remote-backend';

type LauncherParams = {
  gameId: string;
  tenantId: string;
  engineId: string;
  localization: string;
};

// Path to game client's entrypoint file
const ENTRY = Path.resolve(Path.join('src', 'main.ts'));
const ENGINE = 'ECasino';
const GAME = 'templategame';

let gfReleaseUrl = '';
const p = process.argv.indexOf('--gf');

if (p !== -1) {
  if (process.argv.length > p) {
    const a = process.argv[p + 1];
    const [e, v] = a.split('/');
    gfReleaseUrl = `https://static.cluster.gaas.${e}.gcp.veikkaus.com/assets/frontend/game-frame/${v}/`;
  } else {
    throw 'Could not read game-frame release version';
  }
}
const DEV_GAMEFRAME_ENDPOINT = process.argv.includes('--devgf')
  ? 'http://localhost:8000/'
  : undefined;

const options = parse(
  process.argv.slice(2).filter((e) => e !== '--devgf' && e !== '--gf'),
);

const EXTRA_ENTRYPOINTS = [
  dev.overlayEntry(),
  options.useAssetTracker ? './server/asset-tracker.js' : undefined,
].filter(Boolean);

// Game backend address
const EGS = options.useRemoteBackend
  ? getRemoteBackendEndpoint({})
  : 'http://localhost:4567';

// Directory to serve game assets from
const ASSETS = options.useReleaseAssets ? 'release' : 'dev-release';
// Development server port
const PORT = options.devServerPort;
// Enable Asset pipeline's overlay component
const USE_AP_OVERLAY = options.useApOverlay;
// Enable @apila/engine debugger component
let USE_DEBUGGER = options.useDebugger;

// Wake up remote backend early, in order to speed up game launch
if (options.useRemoteBackend) {
  fetch(`${EGS}/api/v2/ping`).then(() => {});
}

// Create an Express app and an HTTPServer instance. The development server
// is configured by adding various middleware to this app instance.
const [server, app] = dev.emptyServer();
const wss = dev.attachWebsocketServer(server);

app
  .get(
    '/',
    // Configure GameFrame. The 'id' arguments are mandatory, the rest
    // are optional GameFrame parameters (see gf.Adapter.ConstructOptions).
    // NOTE: the page needs to be reloaded for these changes to take effect.
    // prettier-ignore
    dev.InjectQueryParams({
      gameId: GAME,
      engineId: ENGINE,
      tenantId: 'templatetenant',
      localization: 'en-US',
    } satisfies LauncherParams & Partial<LauncherParams>),
  )
  .get(
    '/app.bundle.js',
    // This is the asset GameFrame loads which represents game client code.
    // 'LoadScripts()' is used to inject multiple Javascript in place of
    // 'app.bundle.js'; this way, we can include additional components, such as
    // the debugger, as part of the game's startup sequence.
    dev.LoadScripts(() => {
      return [
        USE_DEBUGGER ? '/debugger/debugger.js' : '',
        USE_AP_OVERLAY ? '/overlay.js' : '',
        '/game.js',
      ].filter(Boolean);
    }),
  )
  .use(`/cheats/${ENGINE}/:GAME/:VARIANT/`, dev.Static('cheats'))
  .use(
    // Setup client code compilation.
    dev.WebpackBuild(
      dev.defaultCompiler(EXTRA_ENTRYPOINTS.concat(ENTRY) as string[], {
        // Name the client code bundle 'game.js'; this is referenced in
        // the '/app.bundle.js' middleware above
        outputFile: 'game.js',
        // Replace the default Typescript loader with Swc to reduce build times
        typescriptLoader: SwcLoader,
        target: 'es2017',
        // Bypass typecheck to reduce build times
        transpileOnly: true,
        extraPlugins: [
          // This plugin performs type checking parallel to the actual build,
          // and reports potential issues to stdout/browser overlay
          new TypeCheckPlugin(wss),
          // Render a separator line to stdout after each build to help
          // distinguish relevant error messages
          dev.CompilerCallback('beforeCompile', () => {
            console.log('='.repeat(process.stdout.columns));
          }),
          // Activate @apila/engine's asset hot reload functionality
          new dev.RefreshAssetsPluginV1({
            assetPath: ASSETS,
            wss,
          }),
        ],
        stats: 'errors-only',
      }),
    ),
  )
  // Game asset path is hard-coded to the following form. We ignore the last
  // part ('version') since there are never multiple versions in use
  // concurrently.
  .use(`/assets/${ENGINE}/${GAME}/:ver`, dev.Static(ASSETS));
if (gfReleaseUrl !== '') {
  app.get(
    '/gf/cf-ecasino.min.js',
    dev.Redirect(gfReleaseUrl + 'cf-ecasino.min.js'),
  );
}
app
  // Use loader middleware to serve index, loader and needed localizations
  .use(CasinoLoaderMiddleware())
  .use(
    DevCasinoFrameMiddleware({
      endpoint: DEV_GAMEFRAME_ENDPOINT,
      type: 'ecasino',
    }),
  )
  // This endpoint allows users to toggle the engine debugger on/off by
  // opening 'http://localhost:XXX/_dbg' from their browsers. The middleware
  // redirects clients back to the root page, and flips the value of
  // 'USE_DEBUGGER' (which in turn affects how the '/app.bundle.js' middleware
  // behaves)
  .use(
    '/_dbg',
    dev.DebuggerToggle((b) => (USE_DEBUGGER = b), {initial: USE_DEBUGGER}),
  )
  // Serve engine debugger assets. These are shipped as part of the
  // @apila/engine NPM package.
  .use('/debugger', dev.NPMPackage('@apila/engine', 'bin'))
  // Do the same for Asset pipeline overlay assets
  .use('/overlay.js', dev.NPMPackage('@apila/engine', 'bin', 'ap-overlay.js'))
  // Override Configuration manager behaviour
  .all(
    '/api/v2/game/*/config',
    // Modify the response sent by EGS before sending it back to the client.
    // 'assetDomain' is the base URL used by the launcher/GameFrame to fetch
    // assets.
    dev.Proxy(EGS, {
      resCb: (r) => ({
        ...r,
        assetDomain: ``,
        clientSettings: {
          autoplay: {
            enabled: true,
            rounds: [2, 5, 20, 100, 2000],
            mandatoryRounds: true,
            lossLimit: [1, 2, 10, 100],
            mandatoryLossLimit: false,
            singleWinLimit: [1, 2, 10, 100],
            mandatorySingleWinLimit: false,
          },
          realityCheck: {
            enabled: true,
            intervalSeconds: 3600,
          },
          netPosition: {
            enabled: true,
          },
          quickSpin: {
            enabled: true,
          },
          clock: {
            enabled: true,
          },
          minRoundTimeMs: 0,
          slamStop: {
            enabled: true,
          },
        } satisfies gf.ECClientSettings,
      }),
    }),
  )
  // TODO: Temporary reroute: remove this when EGS supports /api/v2/game/:GAME/balance
  .all('/api/v2/game/:GAME/balance', dev.Redirect('/api/v2/balance'))
  // GameFrame makes game backend requests to the path '/api/v2/game/...';
  // this cannot be reconfigured. In order to support using an external
  // backend server, we need to proxy all requests made to this endpoint
  // to the actual backend instance.
  .all('/api/v2/*', dev.Proxy(EGS))
  .use('/history/api/public/v1/rounds/', dev.Static('history'))
  // Provide a way for the client to enumerate available history files
  .get(
    '/history',
    dev.Json(() => {
      try {
        return {
          files: fs
            .readdirSync('./history')
            .filter((e) => Path.extname(e) === '.json'),
        };
      } catch {
        return {};
      }
    }),
  )
  .post('/history', (req, res) => {
    const filename = `history/${req.body.filename}.json`;

    try {
      if (fs.existsSync(filename)) {
        res.status(403).send({message: 'file already exists'});
      } else {
        const content = JSON.stringify(req.body.data, null, 2);
        fs.writeFileSync(filename, content);
        res.send({message: 'ok'});
      }
    } catch (err) {
      console.error(err);
      res.status(403).send({message: 'error writing file'});
    }
  });

// This callback implements server-side logic for --track-assets
wss.onMessage('__tracker', (d, c) => {
  const bundleFile = fs
    .readdirSync(ASSETS)
    .find((e) => e.includes('veikkaus') && e.endsWith('.json'));
  if (bundleFile) {
    c.send(
      JSON.parse(
        fs.readFileSync(Path.join(ASSETS, bundleFile)) as unknown as string,
      ),
    );
  } else {
    c.send([]);
  }
});

server.listen(PORT, () => {
  console.log(`Development server listening @ http://localhost:${PORT}`);
  console.log(`Serving game assets from ${ASSETS}`);
  console.log(`Backend requests forwarded to ${EGS}`);
});
