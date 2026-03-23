import {core} from '@apila/engine';

import {CORE} from './game';

//import { Config } from './config/config';
/**
 * A group of assets in a bundle.
 */
export interface BundleGroup {
  /**
   * Assetgroup for the assets.
   * If assets are not yet downloaded, this is null.
   */
  asset?: core.ResourceCreateParams[];
  /**
   * Are the assets downloaded.-
   */
  downloaded: boolean;
  /**
   * Have the assets been loaded into memory.
   */
  loaded: boolean;
  /**
   * Gfx resources currently in memory.
   */
  resident: core.ResidentResource[];
  /**
   * Callback for when download is complete.
   * This is undefined if download is already done.
   */
  downloadComplete: (() => void) | undefined;
}

/**
 * Wraps loading into a single class which keeps track of
 * loaded bundles and groups.
 */
export class Loader {
  /**
   * Collection of loaded bundles & groups.
   */
  public bundleGroups = new Map<string, Map<string, BundleGroup>>();

  /**
   * Load a single group.
   * @param group Group id.
   * @param bundleName Identifier for the bundle this group resides in.
   * @param res List of assets in the bundle.
   * @param loadImmediately Should the asset be loaded into memory
   * immediatly after download is complete.
   * @param progress Callback function to invoke whenever a file download
   * finishes.
   */
  public loadGroup = async (
    group: string,
    bundleName: string,
    res: core.ResourceDownloadParams[],
    loadImmediately: boolean,
    progress?: (size: number) => void
  ): Promise<void> => {
    //trace(`loadGroup: ${group}`);

    // Create new bundlegroup map if bundle is not yet managed.
    if (!this.bundleGroups.has(bundleName)) {
      this.bundleGroups.set(bundleName, new Map<string, BundleGroup>());
    }

    // See if group already exists. Then load it.
    const bundleGroups = this.bundleGroups.get(bundleName);
    if (bundleGroups && bundleGroups.has(group)) {
      // Casting to replace !
      const bundleGroup: BundleGroup = bundleGroups.get(group) as BundleGroup;
      if (!bundleGroup.asset) {
        // Asset has been loading in the background, but not ready yet.
        // Wait for it.
        return new Promise((resolve) => {
          bundleGroup.downloadComplete = () => {
            bundleGroup.resident = core.createResources(
              bundleGroup.asset ?? [],
              CORE.gfx
            );
            bundleGroup.loaded = true;
            resolve();
          };
        });
      } else {
        // Everythings waiting for assets to be loaded into gpu.
        bundleGroup.resident = core.createResources(
          bundleGroup.asset ?? [],
          CORE.gfx
        );
        bundleGroup.loaded = true;
      }
    } else {
      // Completely new group, download & load (if loadImmediatly true)
      const bundleGroup: BundleGroup = {
        downloaded: false,
        loaded: false,
        downloadComplete: undefined,
        resident: [],
      };
      this.bundleGroups.get(bundleName)?.set(group, bundleGroup);

      // Only update the loader when there's groups to update.
      // 0 is used mainly for those that are downloaded hidden.
      //trace(groupsInTotal);

      // For the download phase, we separate sound assets from other types of
      // assets, in order to make it easier to ignore errors related to sound
      // assets (which we don't consider to be critical)
      const assets = res.filter(core.selectGroups(group));
      const sounds = assets.filter((e) => e.type === 'Sound');
      const rest = assets.filter((e) => e.type !== 'Sound');

      let soundError = false;
      const assetPromises = await Promise.all([
        core.download(rest, undefined, progress),
        core.download(sounds, CORE.sound, progress).catch((e) => {
          console.error(e);
          soundError = true;
        }),
      ]);

      // If sound downloads finished without errors, continue as usual.
      // Otherwise we erase all sound assets from bookeeping. This has little
      // effect on the loader, since sound assets do not have a create phase,
      // and cannot be unloaded.
      const downloads = soundError
        ? assetPromises[0]
        : (assetPromises.flat() as core.ResourceCreateParams[]);

      // To help developers notice sound-related issues, we abort execution
      // in development builds if the download phase did not complete
      // successfully.
      if (process.env.NODE_ENV === 'development') {
        if (soundError) throw new Error('Failed to load some sounds');
      }

      bundleGroup.asset = downloads;
      bundleGroup.downloaded = true;

      if (loadImmediately) {
        bundleGroup.resident = core.createResources(downloads, CORE.gfx);
        bundleGroup.loaded = true;
      } else {
        // See if something is wanting to know if download is complete
        if (bundleGroup.downloadComplete) bundleGroup.downloadComplete();
      }
    }
  };

  public unloadGroup(bundleName: string, group: string): void {
    const entry = this.bundleGroups.get(bundleName)?.get(group);
    if (entry && entry.loaded) {
      entry.resident.forEach(core.release);
      entry.loaded = false;
      entry.resident.length = 0;
    } else {
      throw new Error(
        `Attempted to unload group which is not currently in memory (${bundleName}/${group})`
      );
    }
  }

  /**
   * Is the assetgroup ready to be used without any additional loading.
   * @param bundle
   * @param group
   */
  public isLoaded(bundle: string, group: string): boolean {
    return this.bundleGroups.get(bundle)?.get(group)?.loaded || false;
  }
}
