import {ParseArgsConfig, parseArgs} from 'util';

export type ProgramOptions = {
  devServerPort: number;
  useApOverlay: boolean;
  useDebugger: boolean;
  useReleaseAssets: boolean;
  useRemoteBackend: boolean;
  useAssetTracker: boolean;
};

const PARSER_OPTIONS = {
  port: {
    type: 'string',
    short: 'p',
    default: '8080',
    description: 'Set Apila Development Server port',
  },
  debugger: {
    type: 'boolean',
    // short: 'N/A',
    default: false,
    description: 'Use engine debugger',
  },
  apoverlay: {
    type: 'boolean',
    // short: 'N/A',
    default: false,
    description: 'Use asset pipeline overlay',
  },
  release: {
    type: 'boolean',
    short: 'r',
    default: false,
    description: 'Use release assets',
  },
  remote: {
    type: 'boolean',
    short: 'R',
    default: false,
    description: 'Use EGS backend provided by Backends service',
  },
  'track-assets': {
    type: 'boolean',
    default: false,
    description: 'Display list of unused assets on an overlay on the web page',
  },
  help: {
    type: 'boolean',
    short: 'h',
    default: false,
    description: 'Print help and stop execution.',
  },
} satisfies Record<
  string,
  NonNullable<ParseArgsConfig['options']>[string] & {[k: string]: unknown}
>;

export function parse(args: string[]): ProgramOptions {
  try {
    const res = parseArgs({
      args,
      options: PARSER_OPTIONS,
      strict: true,
      allowPositionals: true,
    });

    const devServerPort = res.values.port
      ? parseInt(res.values.port)
      : parseInt(PARSER_OPTIONS.port.default);
    if (isNaN(devServerPort)) {
      throw new Error(`Illegal port ${res.values.port}`);
    }

    if (res.values.help) {
      printHelp();
      process.exit(0);
    }
    return {
      devServerPort,
      useApOverlay: res.values.apoverlay ?? false,
      useDebugger: res.values.debugger ?? false,
      useReleaseAssets: res.values.release ?? false,
      useRemoteBackend: res.values.remote ?? false,
      useAssetTracker: res.values['track-assets'] ?? false,
    };
  } catch (e) {
    printHelp();
    throw e;
  }
}

function printHelp(): void {
  console.log(getHelpText(PARSER_OPTIONS));
}

function getHelpText(opts: typeof PARSER_OPTIONS): string {
  return `OPTIONS:\n${Object.entries(opts)
    .map(([name, value]) => {
      const longopt = `--${name}${
        value.type === 'string' ? ' <value>' : '        '
      }`.padEnd(20, ' ');
      const short = 'short' in value ? value.short : undefined;
      return `${short ? '-' + short + ', ' : ''}\t${longopt}\t${
        value.description
      }`;
    })
    .join('\n')}`;
}
