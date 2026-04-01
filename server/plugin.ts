import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
import * as webpack from 'webpack';
import * as dev from '@apila/dev-server';

export class TypeCheckPlugin {
  private fork: ForkTsCheckerWebpackPlugin;
  private clients = new Set<dev.WSClient>();
  private errorStr?: string;

  constructor(wss: dev.WSServer) {
    wss.onConnect('__overlay', (e) => {
      this.clients.add(e);
      this.updateOverlay(e);
    });

    this.fork = new ForkTsCheckerWebpackPlugin({
      logger: {
        log: this.logEvent.bind(this),
        error: this.errorEvent.bind(this),
      },
    });
  }

  apply(compiler: webpack.Compiler) {
    this.fork.apply(compiler);
    const hooks = ForkTsCheckerWebpackPlugin.getCompilerHooks(compiler);
    hooks.issues.tap('TypeCheckPlugin', (issues) => {
      return issues;
    });
  }

  private logEvent(s: string): void {
    if (s.toLowerCase().includes('no errors found')) this.errorStr = undefined;
    this.clients.forEach((e) => this.updateOverlay(e));
  }

  private errorEvent(s: string): void {
    this.errorStr = s;
    this.clients.forEach((e) => this.updateOverlay(e));
    console.error(s);
  }

  private updateOverlay(client: dev.WSClient) {
    client.send({set: this.errorStr ? [this.errorStr] : []});
  }
}

export function SwcLoader(opts: Partial<dev.TranspilerOpts>): dev.Loader {
  return {
    test: /\.ts$/,
    loader: 'swc-loader',
    options: {
      jsc: {
        target: opts.target,
      },
    },
  };
}
