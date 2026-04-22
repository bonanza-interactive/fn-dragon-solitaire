/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @file Asset pipeline client application entry point.
 */

registerSignalHandlers();

import * as fs from 'fs';
import * as path from 'path';

import * as ap from '@apila/asset-pipeline';

import {OVERLAY_VALUES, createAndStartOverlayBackend} from './ap-overlay';
import * as particle from './particle';

const {map, concat, filter, zip} = ap;

// Strict mode will fail for bundles which exceed this size limit
// (this is the size of the largest permutation of format variants)
const MAX_BUNDLE_SIZE_BYTES = 30000000;

/**
 * Set of parameters which define a bundle. These are meant to codify things by
 * which one bundle differs from another (e.g. they use different languages.)
 * Choose the number and semantic of these based on the requirements of your
 * project.
 *
 * (Also included are some file path variables, which are grouped here for
 * convenience.)
 */
interface UserEnv extends ap.Env {
  platform: string;
  operator: string;
  name: string;
  assetPath: string;
  deployPath: string;
}

/*****************************************************************************
 General resource settings and configurations. Rules for handling specific
 resources in non-default ways.
 ******************************************************************************/

// Files that are not included in a bundle unless the conditions they specify
// are met. The condition is any function that takes in a 'UserEnv' object and
// returns 'true' if that object specifies a bundle variant a given file should
// be part of. Each entry may also specify an optional string element which
// will be used as the resource id of that file.
const CONDITIONAL_FILES: ConditionalFiles = {
  // 'sub2/identical.png': [() => true, 'red'],
  // 'images/logo-fi.png': [LanguageIs('fi'), 'logo'],
  // 'images/logo-int.png': [ap.Not(LanguageIs('fi')), 'logo'],
  // 'shaders/background-hd.frag': [PlatformIs('desktop'), 'background'],
  // 'shaders/background-fast.frag': [PlatformIs('mobile'), 'background'],
  // 'images/its-complicated.png': [
  //   ap.AllOf(OperatorIs('svenskaspel'), LanguageIs('se')),
  // ],
};

// If an image does not have an explicitly set scale value, use this
// per-platform value. Default to 1.0.
const DEFAULT_PLATFORM_IMAGE_SCALES: PlatformScales = {
  mobile: 0.5,
};

// Images that do not use the default configuration values (see imageConfig())
const IMAGE_CONFIG: ImageConfigs = {};

const DEFAULT_SOUND_QUALITY = {
  mp3: {sampleRate: 44100, bitRate: 64000},
  ogg: {sampleRate: 44100, bitRate: 64000},
};

// Sounds that do not use the default configuration values
// (see 'DEFAULT_SOUND_QUALITY')
const SOUND_CONFIG: SoundConfigs = {};

// Spine atlases that do not use the default configuration values (see
// spineAtlasConfig())
const DEFAULT_PLATFORM_SPINE_SCALES: PlatformScales = {
  mobile: 0.5,
};

const SPINE_ATLAS_CONFIG: SpineAtlasConfigs = {
  // 'common/spine/high3.atlas': {stripWhitespace: false},
  // 'common/spine/logo.atlas': {stripWhitespace: false},
  // 'common/spine/low4.atlas': {stripWhitespace: false},
  // 'common/spine/low3.atlas': {stripWhitespace: false},
  // 'common/spine/symbol_kultaholvi_free.atlas': {stripWhitespace: false},
  // 'common/spine/reel_anticipate.atlas': {stripWhitespace: false},
  // 'common/spine/symbol_kultaholvi_sack.atlas': {stripWhitespace: false},
};

const SPINE_SKELETON_DEFAULT_ATLASES: Record<string, string> = {};

// Texture files that are used by shaders programs and their content can be
// processed with for example webp compression.
const PROCESSED_SHADER_IMAGE_INPUTS: ReadonlyArray<string> = [
  'loader/sprites/progress_bar.png',
] as const;

// Resources that have been manually prepared, and should not be processed
// any further. *NOTE* that these are files that require an entry in
// bundle.json, as opposed to extra files that simply need to be copied into
// the deployment target (see NON_BUNDLE_FILES).
const UNPROCESSED_FILES: ReadonlyArray<string> = [
  'loader/sprites/splash_screen_color.jpg',
  'loader/sprites/splash_screen_alpha.jpg',
  'loader/sprites/bg_gradient.png',
  'common/particle/images/doubling_first_card-mask-card_mask.png',
  'common/particle/images/doubling_win_2-mask-card_mask.png',
  'common/particle/images/big_win_1-mask-crown_mask.png',
] as const;

// Any file whose top directory appears in this list will be assigned to
// a group of the same name. All other resources will be assigned to group
// 'common'.
const GROUP_DIRECTORIES = ['initial'] as const;

// Define shader program ids manually by specifying vertex and fragment stages.
// If stage is part of any explicitly defined program here, there will not
// be an implicitly defined program. See setProgramIds(). This overrides default
// behaviour, where two stages are combined by file name (foo.vert + foo.frag
// become a program named 'foo') or a single stage is combined with a default
// stage based on file name postfix (foo.sprite.vert becomes a program named
// 'foo' using the default fragment shader for sprites; postfix is one of the
// drawable types: sprite, spine, bmfont or mesh.)
const PROGRAM_STAGES: Record<string, Array<string>> = {
  region: ['common/shaders/region.vert', 'common/shaders/region.frag'],
  region_blurred_h: [
    'common/shaders/region.vert',
    'common/shaders/region_blurred_h.frag',
  ],
  region_blurred_v: [
    'common/shaders/region.vert',
    'common/shaders/region_blurred_v.frag',
  ],
};

// Resources not included in bundle that are just copied without any processing.
// These resources keep their relative path when deployed. The second argument
// is any function that takes in a 'UserEnv' object and returns 'true' if that
// object specifies a bundle variant a given file should be part of.
const NON_BUNDLE_FILES: NonBundleFiles = [
  ['slot-ui/BoxedRegular-Bold.woff', ap.always],
  ['slot-ui/BoxedRegular-Bold.woff2', ap.always],
  ['slot-ui/BoxedRegular.woff', ap.always],
  ['slot-ui/BoxedRegular.woff2', ap.always],
  ['slot-ui/paytable/info_back_button.png', ap.always],
  ['slot-ui/paytable/info_bet_button.png', ap.always],
  ['slot-ui/paytable/info_collect_button.png', ap.always],
  ['slot-ui/paytable/info_dragon.png', ap.always],
  ['slot-ui/paytable/info_dragon_mobile.png', ap.always],
  ['slot-ui/paytable/info_dragon_free.png', ap.always],
  ['slot-ui/paytable/info_freespin_image.png', ap.always],
  ['slot-ui/paytable/info_dragon_card.png', ap.always],
  ['slot-ui/paytable/info_gamble_button.png', ap.always],
  ['slot-ui/paytable/info_play_button.png', ap.always],
  ['slot-ui/paytable/info_swap_button.png', ap.always],
  ['slot-ui/infotext-fi', ap.always],
  ['slot-ui/infotext-sv', ap.always],
  ['slot-ui/infotext-en', ap.always],
  ['slot-ui/intro/intro_card_image.png', ap.always],
  ['slot-ui/intro/intro_bg.png', ap.always],
  ['slot-ui/intro/intro_freespin_image.png', ap.always],
  ['slot-ui/intro/intro_hero_image_veikkaus.png', ap.always],
  ['slot-ui/intro/intro_hero_image_international.png', ap.always],
];

// Image compression settings for different formats; all images assigned a given
// format are assumed to use the same compression settings (see imageConfig()).
const COMPRESSION: CompressionConfigs = {
  png: {kind: 'png'},
  jpeg: {kind: 'jpeg', quality: 80},
  indexedpng: {kind: 'indexedpng', quality: 0.0, ditherType: 'HighTP'},
  webp: {kind: 'webp', quality: 60, lossless: false},
} as const;

/*****************************************************************************
 Define the different types of bundles this project generates.
 The parameters are: [operator] [platform] [language]
 ******************************************************************************/
const BUNDLE_TYPES = [
  ['veikkaus', 'desktop'],
  ['international', 'desktop'],
  ['veikkaus', 'mobile'],
  ['international', 'mobile'],
] as const;

/*****************************************************************************
 This section contains functions that define the properties of bundles and
 the pipeline configuration of asset files. These implement the logic for the
 data structures defined above. Modifications can be made to handle special
 cases not covered by constructs like CONDITIONAL_FILES and such.
 ******************************************************************************/

// Select which files end up in a given bundle variant (see UserEnv)
function includedInBundle(env: UserEnv, file: ap.Source): boolean {
  const key = relativePath(env, file);
  if (ap.asObject(NON_BUNDLE_FILES)[key]?.(env) ?? false) return false;
  if (key in CONDITIONAL_FILES) {
    return CONDITIONAL_FILES[key][0](env);
  }
  return true;
}

// Select which files end up copied directly to the deploy directory (see
// NON_BUNDLE_FILES)
function getNonBundleFileOps(env: UserEnv): ap.CopyOps {
  return NON_BUNDLE_FILES.filter((f) => f[1](env)).map((f) => [
    path.join(env.assetPath, f[0]),
    path.join(env.deployPath, f[0]),
  ]);
}

function imageShouldBeAtlased(
  env: UserEnv,
  res: ap.FileDescriptor | ap.Source,
): boolean {
  const src = 'src' in res ? res.src : res;
  return !PROCESSED_SHADER_IMAGE_INPUTS.includes(relativePath(env, src));
}

// Select the resource id of an asset file
function generateResourceId(env: UserEnv, file: ap.Source): string {
  // By default, use filename without extension
  const defaultId = ap.stem(file.path);
  const key = relativePath(env, file);
  if (key in CONDITIONAL_FILES) {
    return CONDITIONAL_FILES[key][1] ?? defaultId;
  }
  return defaultId;
}

// Select the resource group of an asset file
function generateResourceGroup(env: UserEnv, file: ap.Source): string {
  for (const dir of GROUP_DIRECTORIES) {
    if (relativePath(env, file).startsWith(dir)) {
      return dir;
    }
  }

  return 'common';
}

// Select the configuration for an atlased image file
function imageConfig(
  env: UserEnv,
  file: ap.Source,
  info: ap.TextureDescriptor,
): ap.ImageConfig {
  // If this file has an entry in IMAGE_CONFIG, use any values specified there;
  // otherwise use the defaults provided here.
  const key = relativePath(env, file) as keyof typeof IMAGE_CONFIG;
  const config = IMAGE_CONFIG[key];

  const compressionKind =
    config?.compression ??
    (info.compression === 'jpeg'
      ? 'jpeg'
      : imageShouldBeAtlased(env, file)
        ? ap.hasAlphaChannel(info.pixelFormat)
          ? ['indexedpng', 'webp']
          : 'jpeg'
        : ['png', 'webp']);

  return {
    customAtlasGroup: config?.customAtlasGroup,
    trimMode: config?.trimMode,
    scale: config?.scale ?? DEFAULT_PLATFORM_IMAGE_SCALES[env.platform] ?? 1.0,
    wrapMode: config?.wrapMode ?? 'clamp',
    filterMode: config?.filterMode ?? 'linear',
    compressions: [compressionKind].flat().map((e) => COMPRESSION[e]),
  };
}

// Select the configuration for a spine atlas file
function spineAtlasConfig(env: UserEnv, file: ap.Source): ap.SpineAtlasConfig {
  const key = relativePath(env, file);
  const config = SPINE_ATLAS_CONFIG[key];
  return {
    ...config,
    scale: config?.scale ?? DEFAULT_PLATFORM_SPINE_SCALES[env.platform] ?? 1.0,
  };
}

// Select the configuration for each sound format
function soundConfig(
  env: UserEnv,
  file: ap.Source,
  info: ap.SoundDescriptor,
): {
  [key in ap.CompressedSoundFormat]: ap.SoundCompressionSettings;
} {
  // If this file has an entry in SOUND_CONFIG, use any values specified there;
  // otherwise use the defaults provided here.
  const key = relativePath(env, file);
  const config = SOUND_CONFIG[key];

  return {
    mp3: config?.mp3 ?? DEFAULT_SOUND_QUALITY.mp3,
    ogg: config?.ogg ?? DEFAULT_SOUND_QUALITY.ogg,
  };
}

// Define shader program ids. Check notes on PROGRAM_STAGES above.
function setProgramIds(env: UserEnv, fd: ap.FileDescriptor): void {
  const stage = ap.takeShaderStageDescriptor(fd);

  // Either the vertex and fragment stages are defined in PROGRAM_STAGES...
  Object.keys(PROGRAM_STAGES).map((programId) => {
    PROGRAM_STAGES[programId].forEach((s) => {
      if (relativePath(env, fd.src) === s) {
        stage.programIds.push(programId);
      }
    });
  });

  // ...or we guess them based on the filename. This looks for the pattern:
  // {id}.{drawable}.{vert|frag}
  if (stage.programIds.length === 0) {
    const path = ap.pathOf(fd);
    const implicitId =
      stage.drawable === 'custom' ? ap.stem(path) : ap.stem(ap.stem(path));
    stage.programIds.push(implicitId);
  }
}

/*****************************************************************************
 Command line options.
 ******************************************************************************/

// Check valid parameters
const validArguments = [
  '--strict',
  '--release',
  '--optimize',
  '--fast',
  '--daemon',
  '--all',
  '--mobile',
  '--desktop',
  '--slot',
  '--cache',
  '--veikkaus',
  '--international',
  '-v',
  '-V',
];
process.argv.forEach((e, i, all) => {
  if (validArguments.includes(e)) return;
  if (i <= 1) return;
  console.log(
    'Invalid parameters. Usage: yarn ap <options>\nValid options:',
    validArguments,
  );
  process.exit();
});

const PROJECT_NAME = projectName() ?? 'unknown';
const OPTIMIZE_MODE = process.argv.includes('--optimize');
const RELEASE_MODE = process.argv.includes('--release');
const DAEMON_MODE = RELEASE_MODE ? false : process.argv.includes('--daemon');
const FAST_MODE =
  RELEASE_MODE || OPTIMIZE_MODE
    ? false
    : DAEMON_MODE
      ? true
      : process.argv.includes('--fast');
const STRICT_MODE = process.argv.includes('--strict');
const TOOL_LEVEL = OPTIMIZE_MODE
  ? 9999
  : FAST_MODE
    ? 0
    : DAEMON_MODE
      ? 0
      : RELEASE_MODE
        ? 9999
        : 9999;
const DEPLOY_ALL = RELEASE_MODE
  ? true
  : DAEMON_MODE
    ? false
    : process.argv.includes('--all');
const PLATFORM = process.argv.includes('--mobile')
  ? 'mobile'
  : process.argv.includes('--desktop')
    ? 'desktop'
    : process.argv.includes('--slot')
      ? 'slot'
      : 'desktop';
const OPERATOR = process.argv.includes('--veikkaus')
  ? 'veikkaus'
  : process.argv.includes('--international')
    ? 'international'
    : 'veikkaus';
const DISK_CACHE = process.argv.includes('--cache')
  ? ap.appDir('cache', PROJECT_NAME)
  : undefined;

console.log(
  'Running asset pipeline with configuration:' +
    (RELEASE_MODE ? '\nRELEASE_MODE ON' : '') +
    (DAEMON_MODE ? '\nDAEMON_MODE ON' : '') +
    (FAST_MODE
      ? '\nFAST_MODE ON (do not process assets)'
      : '\nFAST_MODE OFF (process all assets)') +
    (DEPLOY_ALL
      ? '\nDEPLOY_ALL'
      : '\nPLATFORM: ' + PLATFORM + ' OPERATOR: ' + OPERATOR),
);

// Program output verbosity; '-v' for slightly increased, '-V' for everything
ap.setLogLevel(
  process.argv.includes('-V')
    ? ap.Level.DEBUG
    : process.argv.includes('-v')
      ? ap.Level.INFO
      : ap.Level.STATUS,
);

/*****************************************************************************
 Main function.
 ******************************************************************************/

// Read asset-pipeline configuration file
const APP_CONFIGURATION = ap.readAppConfigurationSync();

// Find specified tools from OS.
// Tools are searched in order of preference from
// 1) 'path' property in each tool's config object
// 2) app configuration tool path
// 3) OS global path.
// By default, all found tools will be returned. If 'level' is specified for
// a given tool, that tool will be disabled if 'level' > TOOL_LEVEL.
// TOOL_LEVEL is read from the command line.
const TOOLS = {
  TexturePacker: {level: 1},
  cwebp: {level: 1},
  pngquant: {level: 1},
  Spine: {level: 2},
  ffmpeg: {level: 2},
  ffprobe: {level: 2},
};

// Using common source and deploy path for all envs / bundles
const DEPLOY_PATH = RELEASE_MODE
  ? path.resolve('./release')
  : path.resolve('./dev-release');
const ASSET_PATH = path.resolve('./assets');
console.log('Input path:  ' + ASSET_PATH);
console.log('Output path: ' + DEPLOY_PATH);

// Main function. Generates and deploys bundles, either once or in watch mode.
(async () => {
  // Generate bundle variants. If only one is requested, use the first entry
  const envs = DEPLOY_ALL
    ? BUNDLE_TYPES.map(makeUserEnv)
    : [
        makeUserEnv(
          BUNDLE_TYPES.filter((e) => {
            return e[0] == OPERATOR && e[1] === PLATFORM;
          })[0],
        ),
      ];
  ap.assert(ap.notEmpty(envs), 'No bundles were selected');

  // ImageMagick is required for basic functionality
  ap.assert(envs[0].toolPath('identify'), `ImageMagick was not found`);
  await ap.checkToolCompatibility(envs[0], 'error');
  // Select daemon mode or single deployment based on command line input
  if (DAEMON_MODE) {
    // Clean up previous work
    ap.removeDir(DEPLOY_PATH);

    // Starting engine overlay backend, events object is used to send
    // pipeline events to engine overlay
    const {events} = createAndStartOverlayBackend();

    // Engine overlay determines used environment. If env is changed while
    // daemon is running, we should keep directories and bundle name constant
    const currentEnv = () => envs[0];

    // Update condition for daemon mode
    const updateCondition = (changes: ap.Source[]) => {
      if (OVERLAY_VALUES.runTriggered) {
        OVERLAY_VALUES.runTriggered = false;
        return true;
      }
      return ap.notEmpty(changes);
    };

    console.log('\nWatching...');
    await ap.updateBundleOnFileChanges(
      currentEnv(),
      updateCondition,
      async () => await executePipelines(currentEnv()),
      () => getNonBundleFileOps(currentEnv()),
      {
        watchOpt: {minWriteWatcherTimeMs: 800},
        // Overlay events object can be given as callbacks
        callbacks: events,
      },
    );
  } else {
    if (DISK_CACHE) {
      ap.deserializeCaches(ap.head(envs), DISK_CACHE, {maxFileAgeDays: 7});
    }

    const bundles: ap.BundleDeployment[] = [];
    for (const env of envs) {
      // Clean up previous work
      ap.removeDir(env.deployPath);
      console.log(`Building "${env.name}"...`);
      // Transform input resources into final/optimized ones
      const files = await executePipelines(env);

      // The combined output of all pipelines is used to create the bundle
      // object (i.e. bundle.json.) and a list of file paths that need to be
      // copied to the deployment directory.
      const res = ap.bundleResources(files, env.deployPath, env.name);

      ap.validate(
        ap.validateSkeletonsHaveDefaultAtlases(res.bundleData),
        'Potentially broken Spine atlas setup detected in bundle. Exiting.',
      );

      // Check that all images adhere to the specified dimension limits
      const MAX_DIM = 2048;
      const invalidImages = files
        .filter(ap.HasKind('texture'))
        .filter(
          ap.spipe(
            ap.takeTextureDescriptor,
            (e) => e.w > MAX_DIM || e.h > MAX_DIM,
          ),
        );
      ap.validate(
        ap.empty(invalidImages),
        `The following images exceed maximum allowed dimensions (${MAX_DIM}x${MAX_DIM}):\n${ap
          .zip(
            invalidImages.map(ap.pathOf).map(ap.basename),
            invalidImages
              .map(ap.takeTextureDescriptor)
              .map((e) => `${e.w} x ${e.h}`),
          )
          .map((e) => ` ${e[0]} - ${e[1]}`)
          .join('\n')}`,
      );

      // Print some information about bundle space requirements
      const bm = ap.calculateBundleMetrics(res.bundleData, files);
      const combinations = ap.enumerateFormatCombinations(bm);
      ap.printBundleSize(bm, combinations, true);

      bundles.push({
        ...res,
        nonBundleCopyOps: getNonBundleFileOps(env),
      });
    }

    // Ensure that different bundles do not contain conflicting file operations
    // with same destinations. This replaces final resource filenames so that
    // each bundle has distinct files. This makes it possible to have more than
    // one bundle share common deploy path.
    const distinctBundles = ap.makeDistinctBundles(bundles);

    // Finally, filesystem operations are performed to construct the
    // deployment directories and their contents for each bundle.
    for (const bundle of distinctBundles) {
      await ap.deployBundle(bundle);
    }

    // Optimize space by deleting duplicate resources and re-using same
    // resources in different bundles.
    if (envs.length > 1) {
      await ap.deduplicateBundleFiles(
        distinctBundles.map((d) => d.bundleFile),
        true,
      );
    }
    fs.writeFileSync(
      path.join(DEPLOY_PATH, 'assets.md5'),
      JSON.stringify(ap.hashDirectory(ASSET_PATH)),
    );

    if (DISK_CACHE) {
      await ap.serializeCaches(ap.head(envs), DISK_CACHE);
    }

    if (STRICT_MODE) {
      await strictModeAssetChecks(DEPLOY_PATH);
    }
  }
})().catch((e) => {
  console.error(ap.Red(e));
  process.exit(1);
});

async function executePipelines(env: UserEnv): Promise<ap.FileDescriptor[]> {
  // Bundle creation proceeds in the following phases:

  // First, all files found in the asset directory are filtered for inclusion
  // in this particular bundle variant.
  const allFiles = ap
    .discoverFiles(env.assetPath)
    .filter(ap.Bind(includedInBundle, env));
  // All files passing that test are then identified (i.e. their properties are
  // enumerated), named (resource ids and groups are defined) and
  // bucketed (skeletons are separated from images and so on.)
  const descriptors = await describeFiles(env, allFiles);

  // Run some validation on the files
  ap.validateResourceIdsAreUnique(concat(...Object.values(descriptors)), true);

  const {
    atlases,
    skeletons,
    fonts,
    images,
    tpsAtlases,
    particleAtlases,
    shaderStages,
    sounds,
    webfonts,
  } = descriptors;

  // Apply desired sampler settings to images
  images.forEach((e) => {
    const desc = ap.takeTextureDescriptor(e);
    const config = imageConfig(env, e.src, desc);
    desc.wrapMode = config.wrapMode;
    desc.filterMode = config.filterMode;
  });

  // Separate images that should not be atlased
  const [atlasedImages, standaloneImages] = ap.partition(
    images,
    ap.Bind(imageShouldBeAtlased, env),
  );

  checkUnusedConfigEntries(
    env,
    SPINE_ATLAS_CONFIG,
    atlases,
    'SPINE_ATLAS_CONFIG',
  );
  checkUnusedConfigEntries(
    env,
    IMAGE_CONFIG,
    concat(atlasedImages, standaloneImages),
    'IMAGE_CONFIG',
  );
  checkUnusedConfigEntries(
    env,
    CONDITIONAL_FILES,
    Object.values(descriptors).flat(),
    'CONDITIONAL_FILES',
  );
  checkUnusedConfigEntries(env, SOUND_CONFIG, sounds, 'SOUND_CONFIG');
  checkUnusedConfigEntries(
    env,
    PROCESSED_SHADER_IMAGE_INPUTS,
    standaloneImages,
    'PROCESSED_SHADER_IMAGE_INPUTS',
  );
  checkUnusedConfigEntries(
    env,
    UNPROCESSED_FILES,
    Object.values(descriptors).flat(),
    'UNPROCESSED_FILES',
  );
  checkUnusedConfigEntries(
    env,
    SPINE_SKELETON_DEFAULT_ATLASES,
    Object.values(descriptors).flat(),
    'SPINE_SKELETON_DEFAULT_ATLASES',
  );

  // Assign explicitly defined 'defaultAtlasId's
  skeletons
    .map(
      (e) => SPINE_SKELETON_DEFAULT_ATLASES[relativePath(env, e.originalSrc)],
    )
    .forEach((e, i) => {
      if (ap.notUndefined(e)) {
        ap.takeSkeletonDescriptor(skeletons[i]).defaultAtlasId = e;
      }
    });

  // The buckets are dispatched to their respective pipelines. Pipelines run
  // their input files through a series of external tools to produce resources
  // whose properties match those requested by the user.
  // (SkipUnprocessed() is used here to filter out files that have requested not
  // to have any processing done on them.)
  return (
    await Promise.all([
      SkipUnprocessed(spinePipeline)(env, concat(atlases, skeletons)).then(
        ap.Bind(skeletonPipeline, env),
      ),
      SkipUnprocessed(imagePipeline)(env, atlasedImages),
      SkipUnprocessed(standaloneImagePipeline)(env, standaloneImages),
      SkipUnprocessed(tpsPipeline)(env, tpsAtlases),
      SkipUnprocessed(particlePipeline)(env, particleAtlases),
      shaderStages,
      SkipUnprocessed(fontPipeline)(env, fonts),
      SkipUnprocessed(soundPipeline)(env, sounds),
      webfonts,
    ])
  ).flat();
}

// Describe the properties of each asset file, and categorize them according to
// resource type and the pipeline they are targeting.
async function describeFiles(env: UserEnv, files: ap.Source[]) {
  // Remove some code clutter
  const {
    Bind,
    HasExtension,
    pipe,
    describeSpineAtlasFile,
    describeImageFile,
    describeSkeletonFile,
    describeFontFile,
    describeShaderStageFile,
    describeTpsFile,
    describeSoundFile,
    BelongsToSpineAtlas,
    BelongsToFont,
    BelongsToTps,
    HasSkeletonData,
    Not,
  } = ap;

  const {BelongsToParticle, describeParticleFile} = particle;

  const allImages = files.filter(ap.HasExtension('.png', '.jpg', '.jpeg'));

  const spineAtlasFiles = await pipe(
    filter(HasExtension('.atlas')),
    map(Bind(describeSpineAtlasFile, env)),
  )(files);
  const spineAtlasImages = await pipe(
    filter(BelongsToSpineAtlas(spineAtlasFiles)),
    map(Bind(describeImageFile, env)),
  )(allImages);
  const atlases = concat(spineAtlasFiles, spineAtlasImages);

  const skeletons = await pipe(
    filter(HasExtension('.json', '.skel')),
    filter(HasSkeletonData()),
    map(Bind(describeSkeletonFile, env)),
  )(files);

  const fontFiles = await pipe(
    filter(HasExtension('.bmfont')),
    map(Bind(describeFontFile, env)),
  )(files);
  const fontImages = await pipe(
    filter(BelongsToFont(fontFiles)),
    map(Bind(describeImageFile, env)),
  )(allImages);
  const fonts = concat(fontFiles, fontImages);

  const shaderStages = await pipe(
    filter(HasExtension('.frag', '.vert')),
    map(Bind(describeShaderStageFile, env)),
  )(files);

  const tpsFiles = await pipe(
    filter(HasExtension('.tps')),
    map(Bind(describeTpsFile, env)),
  )(files);
  const tpsImages = await pipe(
    filter(BelongsToTps(tpsFiles)),
    map(Bind(describeImageFile, env)),
  )(allImages);

  const particleFiles = await pipe(
    filter(HasExtension('.part')),
    map(Bind(describeParticleFile, env)),
  )(files);

  const partImages = await pipe(
    filter(BelongsToParticle(particleFiles)),
    map(Bind(describeImageFile, env)),
  )(allImages);

  const images = await pipe(
    filter(Not(BelongsToTps(tpsFiles))),
    filter(Not(BelongsToSpineAtlas(spineAtlasFiles))),
    filter(Not(BelongsToFont(fontFiles))),
    filter(Not(BelongsToParticle(particleFiles))),
    map(Bind(describeImageFile, env)),
  )(allImages);

  const sounds = await pipe(
    filter(HasExtension('.wav', '.mp3', '.ogg')),
    map(Bind(describeSoundFile, env)),
  )(files);

  const webfonts = await pipe(
    filter(HasExtension('.woff', '.woff2', '.ttf', '.otf')),
    map(Bind(ap.describeWebfontFile, env)),
  )(files);

  // Name resources and assign groups to files. This simply delegates the task
  // to the functions presented earlier (see generateResourceGroup() and
  // generateResourceId()).
  concat(
    atlases,
    skeletons,
    fonts,
    images,
    shaderStages,
    tpsFiles,
    particleFiles,
    sounds,
    webfonts,
  ).forEach(Bind(nameResources, env));
  shaderStages.forEach(Bind(setProgramIds, env));

  return {
    atlases,
    skeletons,
    fonts,
    images,
    shaderStages,
    // 'tpsImages' are kept separate up until this point in order to skip
    // assigning ids to them (nameResource() above); this lets .tps settings
    // determine the ids instead
    tpsAtlases: concat(tpsFiles, tpsImages),
    particleAtlases: concat(particleFiles, partImages),
    sounds,
    webfonts,
  };
}

/*****************************************************************************
 The following functions define chains of external tools which assets are
 "pipelined" through. There are separate pipelines for TexturePacker images,
 Spine resources and fonts. This separation is somewhat arbitrary, and not a
 requirement imposed by the asset-pipeline API.
 ******************************************************************************/

async function spinePipeline(
  env: UserEnv,
  res: ap.FileDescriptor[],
): Promise<ap.FileDescriptor[]> {
  // Map each file to its requested configuration
  const configs = ap.asObject(
    zip(
      res.filter(ap.HasKind('spineatlas')).map(ap.pathOf),
      res
        .filter(ap.HasKind('spineatlas'))
        .map((r) => spineAtlasConfig(env, r.src)),
    ),
  );

  // Scale atlases (if required) and create compressed png and webp variants
  // of each image
  return ap.pipe(
    ap.SpineAtlas(env, configs),
    ap.MergeSpineAtlases(env, configs, {
      autoAssignDefaultAtlases: true,
      disableStripWhitespaceForMeshes: true,
    }),
    ap.FormatVariants(
      ap.HasTextureAndCompression('png'),
      ap.PngQuant(env),
      ap.WebpCompress(env, COMPRESSION.webp),
    ),
  )(res);
}

async function skeletonPipeline(
  env: UserEnv,
  res: ap.FileDescriptor[],
): Promise<ap.FileDescriptor[]> {
  // Convert JSON skeletons into binary format
  return ap.pipe(ap.EnsureBinarySkeleton(env))(res);
}

async function imagePipeline(
  env: UserEnv,
  res: ap.FileDescriptor[],
): Promise<ap.FileDescriptor[]> {
  // Map each file to its requested configuration
  const configs = ap.asObject(
    zip(
      res.map(ap.pathOf),
      res.map((r) => imageConfig(env, r.src, ap.takeTextureDescriptor(r))),
    ),
  );

  // Using 'configs', create atlases of images that have compatible properties
  // (e.g. jpeg images are not atlased with png images), and produce compressed
  // png and webp variants of each atlas.
  // (see atlasCompressionVariants() for more details on how this is configured)
  return ap.pipe(ap.AutoAtlas(env, configs, {}))(res);
}

async function standaloneImagePipeline(
  env: UserEnv,
  res: ap.FileDescriptor[],
): Promise<ap.FileDescriptor[]> {
  const configs = ap.asObject(
    zip(
      res.map(ap.pathOf),
      res.map((r) => imageConfig(env, r.src, ap.takeTextureDescriptor(r))),
    ),
  );

  return ap.pipe(ap.BasicImage(env, configs))(res);
}

async function tpsPipeline(
  env: UserEnv,
  res: ap.FileDescriptor[],
): Promise<ap.FileDescriptor[]> {
  return ap.pipe(ap.TpsAtlas(env, {}))(res);
}

async function particlePipeline(
  env: UserEnv,
  res: ap.FileDescriptor[],
): Promise<ap.FileDescriptor[]> {
  return ap.pipe(particle.ParticleAtlas(env, {}))(res);
}

async function fontPipeline(
  env: UserEnv,
  res: ap.FileDescriptor[],
): Promise<ap.FileDescriptor[]> {
  // Break up fonts into SDF and bitmap types
  const sdfs = res.filter(ap.HasFontType('sdf'));
  const bms = res.filter(ap.HasFontType('bitmap'));

  // SDF images are compressed using lossless formats, bitmaps use lossy formats
  return ap.pipe(
    ap.FormatVariants(
      ap.BelongsToFont(sdfs),
      ap.WebpCompress(env, {kind: 'webp', lossless: true, quality: 100}),
      ap.Passthrough(env), // use the original pngs as a fallback
    ),
    ap.FormatVariants(
      ap.BelongsToFont(bms),
      ap.WebpCompress(env, COMPRESSION['webp']),
      ap.PngQuant(env),
    ),
  )(res);
}

async function soundPipeline(
  env: UserEnv,
  res: ap.FileDescriptor[],
): Promise<ap.FileDescriptor[]> {
  // Map each file to its requested configuration
  const mp3Configs = ap.asObject(
    zip(
      res.map(ap.pathOf),
      res.map((r) => soundConfig(env, r.src, ap.takeSoundDescriptor(r)).mp3),
    ),
  );
  const oggConfigs = ap.asObject(
    zip(
      res.map(ap.pathOf),
      res.map((r) => soundConfig(env, r.src, ap.takeSoundDescriptor(r)).ogg),
    ),
  );

  // For each .wav file, produce an ogg and mp3 variant of that file
  return ap.pipe(
    ap.FormatVariants(
      ap.HasSoundFormat('wav'),
      ap.SoundCompress(env, 'ogg', oggConfigs),
      ap.SoundCompress(env, 'mp3', mp3Configs),
    ),
  )(res);
}

type PipelineFunc = (
  e: UserEnv,
  res: ap.FileDescriptor[],
) => Promise<ap.FileDescriptor[]>;

function SkipUnprocessed(f: PipelineFunc): PipelineFunc {
  return async (e, res) => {
    const [unprocessed, rest] = ap.partition(res, (file) =>
      UNPROCESSED_FILES.includes(relativePath(e, file.originalSrc)),
    );
    return (await f(e, rest)).concat(unprocessed);
  };
}

/**
 * Returns the path of a file relative to the asset directory root.
 */
function relativePath(env: UserEnv, src: ap.Source | string): string {
  return ap.win32PathToPosix(
    path.relative(env.assetPath, typeof src === 'string' ? src : src.path),
  );
}

function PlatformIs(p: string): ap.FilterFunc<UserEnv> {
  return (e) => e.platform === p;
}

function OperatorIs(p: string): ap.FilterFunc<UserEnv> {
  return (e) => e.operator === p;
}

function nameResources(env: UserEnv, res: ap.FileDescriptor): void {
  res.resource.id = generateResourceId(env, res.src);
  res.group = generateResourceGroup(env, res.src);
  if (ap.isTexture(res.resource)) {
    res.resource.images.forEach((e) => {
      e.id = generateResourceId(env, res.src);
    });
  }
}

function atlasCompressionVariants(c: ap.Compression): ap.Compression[] {
  // 'c' denotes the format that was requested for the images used as inputs to
  // a single atlas. This function returns a list of extra formats that atlas
  // should be also compressed into, allowing multiple format variants of that
  // atlas to be produced.

  // The way this particular function is defined ensures that atlas images
  // will always have a webp and a png version produced (unless the selected
  // format was jpeg, in which case only one variant is sufficient.)
  switch (c.kind) {
    case 'indexedpng':
      return [COMPRESSION.webp];
    case 'webp':
      return [COMPRESSION.indexedpng];
    default:
      return [];
  }
}

function validateFileDoesNotHaveCompression(
  env: UserEnv,
  files: ap.FileDescriptor[],
  illegals: ap.FilterFunc<ap.FileDescriptor>,
  srcWhiteList: readonly string[],
): void {
  files.filter(illegals).forEach((f) => {
    if (!srcWhiteList.includes(relativePath(env, f.src))) {
      throw new Error(
        `"${f.src.path}" is already compressed and should not be passed to a pipeline.
Place it in UNPROCESSED_FILES to skip pipelines.`,
      );
    }
  });
}

function makeUserEnv(
  bundleType: readonly [operator: string, platform: string],
): UserEnv {
  const commonEnvProps: Pick<
    UserEnv,
    | 'assetPath'
    | 'deployPath'
    | 'toolPath'
    | 'cacheTransforms'
    | 'printTransforms'
    | 'missingToolWarnings'
  > = {
    assetPath: ASSET_PATH,
    deployPath: DEPLOY_PATH,
    toolPath: ap.makeToolLookup(TOOL_LEVEL, APP_CONFIGURATION, TOOLS),
    cacheTransforms: DAEMON_MODE || DEPLOY_ALL || ap.notUndefined(DISK_CACHE),
    printTransforms: false,
    missingToolWarnings: DEPLOY_ALL,
  };

  const [operator, platform] = bundleType;

  return {
    ...commonEnvProps,
    operator,
    platform,
    name: `assets.${operator}.${platform}`,
  };
}

function checkUnusedConfigEntries(
  env: UserEnv,
  config: Record<string, unknown> | ReadonlyArray<string>,
  files: ap.FileDescriptor[],
  configName: string,
): void {
  const inputPaths = files.map(ap.pathOf).map(ap.Bind(relativePath, env));
  const confPaths = Array.isArray(config) ? config : Object.keys(config);

  const unused = confPaths.filter((e) => !inputPaths.includes(e));
  if (ap.notEmpty(unused)) {
    console.warn(
      ap.Yellow(
        `Detected unused asset configurations for [${configName}]:\n  ${unused.join(
          '\n  ',
        )}`,
      ),
    );
  }
}

async function strictModeAssetChecks(path: string): Promise<void> {
  const bin = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
  const sizeStatus = await ap.execute(bin, [
    'ap-check',
    'sizes',
    '--limit',
    MAX_BUNDLE_SIZE_BYTES.toString(),
    path,
  ]);
  const pmaStatus = await ap.execute(bin, ['ap-check', 'spine-pma', path]);

  if (sizeStatus.status == 0 && pmaStatus.status == 0) {
    return;
  }

  console.warn(ap.Red(' * Strict mode checks failed *'));

  if (sizeStatus.status != 0) {
    console.warn(
      ap.Red(sizeStatus.stdout.substring(sizeStatus.stdout.indexOf('\n'))),
    );
  }

  if (pmaStatus.status != 0) {
    console.warn(
      ap.Red(pmaStatus.stdout.substring(pmaStatus.stdout.indexOf('\n'))),
    );
  }

  process.exit(1);
}

/*****************************************************************************
 Signal and error handlers for application control.
 ******************************************************************************/
function registerSignalHandlers(): void {
  process.on('SIGINT', () => {
    ap.killRunningChildProcesses().then(() => process.exit(1));
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error(
      reason instanceof Error ? reason.toString() : 'Unknown rejection error',
    );
    console.error(promise);
    process.exit(1);
  });

  process.on('uncaughtException', (err) => {
    console.trace(err.stack ?? err.message);
    process.exit(1);
  });
}

function projectName(): ap.Maybe<string> {
  try {
    if (fs.readdirSync(process.cwd()).includes('.git')) {
      return path.basename(process.cwd());
    }
  } catch {}
  return undefined;
}

// Hide this typedef clutter here...
type CompressionKinds = ap.CompressionKind | ap.CompressionKind[];
type ConditionalFiles = Record<
  string,
  [ap.FilterFunc<UserEnv>] | [ap.FilterFunc<UserEnv>, string]
>;
type ImageConfigs = Record<
  string,
  Partial<Omit<ap.ImageConfig, 'compression'> & {compression: CompressionKinds}>
>;
type SoundConfigs = Record<
  string,
  Partial<{
    [key in ap.CompressedSoundFormat]: ap.SoundCompressionSettings;
  }>
>;
type SpineAtlasConfigs = Record<string, Partial<ap.SpineAtlasConfig>>;
type NonBundleFiles = [string, ap.FilterFunc<UserEnv>][];
type CompressionConfigs = {
  [k in ap.CompressionKind]: ap.Compression & {kind: k};
};
type PlatformScales = Record<string, number>;
