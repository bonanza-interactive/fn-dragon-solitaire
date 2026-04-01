declare global {
  interface Window {
    RELEASE_VERSION: string;
    GIT_REVISION: string;
    TIME_STAMP: number;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    opera: any; //for the isDeviceMobile hack
  }
}

export function timestamp(): number {
  return window.TIME_STAMP;
}

export function releaseVersion(): string {
  return window.RELEASE_VERSION;
}

export function gitRevision(): string {
  return window.GIT_REVISION;
}
