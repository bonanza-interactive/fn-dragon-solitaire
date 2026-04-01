import * as Path from 'path';
import * as fs from 'fs';
import {default as assert} from 'assert';
import * as zlib from 'zlib';
import crypto from 'crypto';
import {parseArgs} from 'util';

type File = ReturnType<typeof fs.openSync>;
type CDFH = {
  filename: string;
  headerOffset: number;
  compression: number;
  compressedBytes: number;
  uncompressedBytes: number;
};

const Yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const BrightYellow = (s: string) => `\x1b[93m${s}\x1b[0m`;
const Cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const Green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const Red = (s: string) => `\x1b[31m${s}\x1b[0m`;

function extractEOCD(file: File): Buffer {
  const {size} = fs.fstatSync(file);
  assert(size >= 4);

  let i = 4;
  const scratch = Buffer.alloc(1024);
  while (i <= size) {
    fs.readSync(file, scratch, 0, 4, size - i);
    if (scratch.readUint32LE() === 0x06054b50) break;

    i++;
  }

  assert(i <= size);

  fs.readSync(file, scratch, 0, 22, size - i);
  return scratch.subarray(0, 22);
}

function extractCD(file: File, offset: number, count: number): Buffer[] {
  let i = 0;
  const scratch = Buffer.alloc(1024);
  const result = [] as Array<Buffer>;

  while (i < count) {
    const bytesRead = fs.readSync(file, scratch, 0, 1024, offset);

    assert(bytesRead >= 46);
    assert(scratch.readUint32LE() === 0x02014b50);

    const len = cdLength(scratch);
    result.push(Buffer.from(scratch.subarray(0, len)));
    offset += len;
    i++;
  }

  return result;
}

function extractFileBlock(file: File, header: CDFH): Buffer {
  const scratch = Buffer.alloc(1024);
  fs.readSync(file, scratch, 0, 30, header.headerOffset);

  assert(scratch.readUint32LE() === 0x04034b50);

  const blockSize = header.compressedBytes;
  const nameLen = scratch.readUint16LE(26);
  const extraLen = scratch.readUint16LE(28);
  const offset = 30 + nameLen + extraLen;

  const result = Buffer.alloc(blockSize);
  fs.readSync(file, result, 0, blockSize, header.headerOffset + offset);
  return result;
}

function cdLength(cd: Buffer): number {
  return cd.readUint16LE(28) + cd.readUint16LE(30) + cd.readUint16LE(32) + 46;
}

function cdLocation(eocd: Buffer): [offset: number, count: number] {
  return [eocd.readUInt32LE(16), eocd.readUInt16LE(10)];
}

function parseCD(cd: Buffer): CDFH {
  const nameLen = cd.readUint16LE(28);
  return {
    filename: cd.subarray(46, 46 + nameLen).toString(),
    headerOffset: cd.readUint32LE(42),
    compression: cd.readUint16LE(10),
    compressedBytes: cd.readUint32LE(20),
    uncompressedBytes: cd.readUint32LE(24),
  };
}

function uncompress(block: Buffer, compressionMethod: number): Buffer {
  switch (compressionMethod) {
    case 0:
      return Buffer.from(block);
    case 8:
      return zlib.inflateRawSync(block);
    default:
      throw new Error(`Unsupported compression method: ${compressionMethod}`);
  }
}

function md5sum(path: string): string {
  return crypto.createHash('md5').update(fs.readFileSync(path)).digest('hex');
}

function backendJarVersion(path: string): string | undefined {
  const fd = fs.openSync(path, 'r');
  const eocd = extractEOCD(fd);
  const cd = extractCD(fd, ...cdLocation(eocd)).map(parseCD);

  const entry = cd.find((e) => e.filename === 'game.version');
  if (!entry) return undefined;

  const compressed = extractFileBlock(fd, entry);
  const versionStr = uncompress(compressed, entry.compression).toString();
  return versionStr.split('/')[0].substring(1);
}

async function downloadFile(url: string, destFile: string) {
  console.log(Yellow(`Downloading ${Path.basename(url)} to ${destFile}`));

  return fetch(url)
    .then((r) => {
      if (r.status >= 300)
        throw new Error(`Download error (${url}): "${r.statusText}"`);
      return r.arrayBuffer();
    })
    .then((r) => fs.writeFileSync(destFile, Buffer.from(r)));
}

async function downloadEgsFiles(
  files: string[],
  destDir: string,
  version?: string
) {
  const url = `https://gitlab.veikkaus.fi/api/v4/projects/2359/packages/generic/egs/${
    version ?? 'v2-latest'
  }/`;
  return Promise.all(
    files.map((e) => downloadFile(url + e, Path.join(destDir, e)))
  );
}

async function downloadBackendFiles(
  files: string[],
  gameId: string,
  version: string,
  destDir: string
) {
  const url = `https://gitlab.veikkaus.fi/api/v4/projects/2718/packages/generic/${gameId}/${version}/`;
  return Promise.all(
    files.map((e) => downloadFile(url + e, Path.join(destDir, e)))
  );
}

function parseExpectedBackendVersion() {
  const expectedVersion = /BACKEND_VERSION:\s*(\S+)\s*/gm.exec(
    fs.readFileSync('.gitlab-ci.yml').toString()
  )?.[1];
  assert(expectedVersion);
  return expectedVersion;
}

function parseBackendId() {
  const backendId =
    /BACKEND_ID:\s*(\S+)\s*/gm.exec(
      fs.readFileSync('.gitlab-ci.yml').toString()
    )?.[1] ??
    /WEB_NAME:\s*(\S+)\s*/gm.exec(
      fs.readFileSync('.gitlab-ci.yml').toString()
    )?.[1];
  assert(backendId);
  return backendId;
}

function parseMd5Sum(md5FilePath: string) {
  try {
    const contents = fs.readFileSync(md5FilePath).toString();
    return contents.split(' ')[0];
  } catch (err) {
    return 'N/A';
  }
}

(async () => {
  const opts = parseArgs({
    options: {
      backend: {
        type: 'boolean',
        short: 'b',
        default: false,
        description: 'Sync game backend file',
      },
      variantConfig: {
        type: 'boolean',
        short: 'v',
        default: false,
        description: 'Sync variant config file',
      },
      egs: {
        type: 'boolean',
        short: 'e',
        default: false,
        description: 'Sync EGS resources',
      },
      force: {
        type: 'boolean',
        short: 'f',
        default: false,
        description: 'Download / overwrite all resources',
      },
      update: {
        type: 'boolean',
        short: 'u',
        default: false,
        description: 'Update EGS if never exists',
      },
      ignoreErrors: {
        type: 'boolean',
        short: 'i',
        default: false,
        description: 'Ignore errors',
      },
    },
    strict: true,
    allowPositionals: true,
  });
  if (opts.positionals.length < 1) {
    throw new Error('Give target directory for local files as an argument!');
  }
  const path = opts.positionals[0];
  const force = opts.values.force ?? false;
  const update = opts.values.update ?? false;
  try {
    if (opts.values.egs) {
      console.log(Cyan(`Syncing EGS resources...`));
      const MD5_FILE = 'egs.md5';
      const EGS = 'egs.jar';
      const version = 'v2-latest';
      const resources = [EGS, 'operatorConfigPP.json', 'operatorConfigPS.json'];

      let downloadables: string[] = [];
      if (force) {
        console.log(
          BrightYellow(
            `Force flag on. Downloading all resources from package ${version}`
          )
        );
        downloadables = resources;
      } else {
        const missingResources = resources.filter(
          (r) => !fs.existsSync(Path.join(path, r))
        );
        if (missingResources.length > 0) {
          console.log(
            BrightYellow(
              `Resources missing: [${missingResources}]. Downloading them from package ${version}`
            )
          );
          downloadables = missingResources;
        }
        if (update && !downloadables.includes(EGS)) {
          const localEgs = Path.join(path, EGS);
          await downloadEgsFiles([MD5_FILE], path, version);
          const currentHash = fs.existsSync(localEgs)
            ? md5sum(localEgs)
            : 'N/A';
          const md5Path = Path.join(path, MD5_FILE);
          const wantedHash = parseMd5Sum(md5Path);

          if (wantedHash !== currentHash) {
            console.log(
              BrightYellow(
                `EGS is out of date. Downloading all resources from package ${version}`
              )
            );
            downloadables = resources;
          }
        }
      }
      for (const d of downloadables) {
        await downloadEgsFiles([d], path, version);
      }

      console.log(Green(`Local EGS resources synced`));
    }

    if (opts.values.backend) {
      console.log(Cyan(`Syncing game backend...`));
      const backendPath = Path.join(path, 'backend.jar');
      const version = parseExpectedBackendVersion();
      const gameId = parseBackendId();
      const currentVersion = fs.existsSync(backendPath)
        ? backendJarVersion(backendPath)
        : 'N/A';
      let needsDownloading = false;
      if (currentVersion !== version) {
        console.log(
          BrightYellow(`Backend is out of date. Downloading version ${version}`)
        );
        needsDownloading = true;
      } else if (force) {
        console.log(
          BrightYellow(`Force flag on. Downloading version ${version}`)
        );
        needsDownloading = true;
      }
      if (needsDownloading) {
        await downloadBackendFiles(['backend.jar'], gameId, version, path);
      }
      console.log(Green(`Local game backend synced`));
    }

    if (opts.values.variantConfig) {
      console.log(Cyan(`Syncing variant configurationvariantConfig.json...`));

      const variantConfigPath = Path.join(path, 'variantConfig.json');
      let needsDownloading = false;
      if (!fs.existsSync(variantConfigPath)) {
        console.log(
          BrightYellow(
            `variantConfig.json does not exist. Downloading from backend package`
          )
        );
        needsDownloading = true;
      } else if (force) {
        console.log(
          BrightYellow(`Force flag on. Downloading from backend package`)
        );
        needsDownloading = true;
      }

      if (needsDownloading) {
        const version = parseExpectedBackendVersion();
        const gameId = parseBackendId();
        await downloadBackendFiles(
          ['variantConfig.json'],
          gameId,
          version,
          path
        );
      }
      console.log(Green(`Local variant configuration synced`));
    }
  } catch (e) {
    if (opts.values.ignoreErrors) {
      console.error(Red(`Sync error`));
      console.error(e);
    } else {
      throw e;
    }
  }
})();
