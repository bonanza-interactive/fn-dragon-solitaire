import * as Path from 'path';
import {readFileSync} from 'fs';

const HOST = `http://backends.apila.dev.gcp.veikkaus.fi`;

export type RemoteBackendOptions = Partial<RemoteBackendKey>;

export const getEndpoint = (opts?: RemoteBackendOptions): string => {
  return `${HOST}/${Path.join('egs', getBackendKeyPath(opts))}`;
};

export async function makeBackendOp(
  op: string,
  key?: Partial<RemoteBackendKey>
): Promise<void> {
  const path = Path.join(HOST, `api/v1/backend/${op}`, getBackendKeyPath(key));
  console.log(`Making request GET ${path}`);
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Server responded with status ${res.status}`);
  }
}

type RemoteBackendKey = {
  backendId: string;
  packageVersion: string;
  userName: string;
};

function getBackendKeyPath(key?: Partial<RemoteBackendKey>): string {
  return Path.join(
    key?.backendId ?? getBackendIdCIConfig(),
    key?.packageVersion ?? getBackendPackageVersionFromCIConfig(),
    key?.userName ?? getUsername()
  );
}

function getBackendPackageVersionFromCIConfig(): string {
  const CI_FILE = '.gitlab-ci.yml';
  const RE = /BACKEND_VERSION:\s*(\S+)\s*/gm;
  const yaml = readFileSync(CI_FILE).toString('utf-8');
  const parsed = RE.exec(yaml);
  if (!parsed) {
    throw new Error(`Cannot parse backend package version from ${CI_FILE}`);
  }
  return parsed[1];
}

function getBackendIdCIConfig(): string {
  const CI_FILE = '.gitlab-ci.yml';
  const RE = /BACKEND_ID:\s*(\S+)\s*/gm;
  const yaml = readFileSync(CI_FILE).toString('utf-8');
  const parsed = RE.exec(yaml);
  if (!parsed) {
    throw new Error(`Cannot parse backend package name from ${CI_FILE}`);
  }
  return parsed[1];
}

function getUsername(): string {
  if (process.platform === 'win32') {
    return process.env.USERNAME ?? 'unknown';
  } else {
    return process.env.USER ?? 'unknown';
  }
}
