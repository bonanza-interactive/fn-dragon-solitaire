import * as express from 'express';
import * as dev from '@apila/dev-server';
import {
  CasinoFrameMiddleware,
  CasinoFrameMiddlewareOpts,
} from '@apila/casino-frame/express';

export type DevCasinoFrameMiddlewareOpts = CasinoFrameMiddlewareOpts & {
  endpoint?: string;
};

export function DevCasinoFrameMiddleware(
  opts?: Partial<DevCasinoFrameMiddlewareOpts>,
): express.Router {
  if (opts?.endpoint) {
    const router = express.Router();
    const {frameAssetsRoot = '/gf'} = opts ?? {};

    const assetPath = opts.endpoint;
    console.log(
      `Trying to use dev casino-frame @ ${opts.endpoint}. 
      Proxying cf asset requests to ${assetPath}.`,
    );

    router.use(frameAssetsRoot, dev.Proxy(assetPath));
    router.use(CasinoFrameMiddleware(opts));

    return router;
  } else {
    return CasinoFrameMiddleware(opts);
  }
}
