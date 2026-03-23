import * as ap from '@apila/asset-pipeline';
import {globalTransformCache, tempDirectory} from '@apila/asset-pipeline';
import {imageDescriptor} from '@apila/asset-pipeline/dist/image';
import {makeDescriptorValidationFunctions} from '@apila/asset-pipeline/dist/resource';
import {z} from 'zod';
import * as path from 'path';
import {IOption, MaxRectsPacker, Rectangle} from 'maxrects-packer';

export interface ParticleDescriptor extends ap.ResourceDescriptor {
  kind: 'particle';
  images: Array<{id: string; path: string}>;
}

const partSchema = z.object({
  id: z.string().optional(),
  kind: z.literal('particle'),
  images: z.array(z.object({id: z.string(), path: z.string()})),
});

export const [isParticle, assertParticleDescriptor, takeParticleDescriptor] =
  makeDescriptorValidationFunctions<ParticleDescriptor>(partSchema);

export function BelongsToParticle<
  T extends ap.Source | ap.FileDescriptor = ap.Source,
>(atlases: ap.FileDescriptor[]): ap.FilterFunc<T> {
  const allAtlasImages = atlases
    .filter(ap.HasKind('particle'))
    .map(ap.Property('resource'))
    .map(assertParticleDescriptor)
    .map(ap.Property('images'))
    .flat()
    .map(ap.Property('path'));

  return (e) => {
    return allAtlasImages.includes('path' in e ? e.path : e.src.path);
  };
}

export const describeParticleFile = async (env: ap.Env, src: ap.Source) => {
  const input = JSON.parse(await ap.readTextFile(src.path));
  const resource = {
    kind: 'particle',
    images: input.images.map((img: {id: string; filepath: string}) => {
      const outPath = img.filepath.split(path.win32.sep).join(path.posix.sep);
      return {id: img.id, path: path.join(path.dirname(src.path), outPath)};
    }),
  } as ParticleDescriptor;

  return {
    src: ap.clone(src),
    originalSrc: ap.clone(src),
    resource,
  } as ap.FileDescriptor;
};

export const ParticleAtlas = ap.makeTransform(
  'ParticleAtlas',
  ParticleAtlasImpl,
  ap.HasKind('particle', 'texture'),
  ap.NoFallback(),
  globalTransformCache()
);

function ParticleAtlasImpl(env: ap.Env, _cfg: unknown): ap.Transform {
  return async (res: ap.FileDescriptor[]) => {
    const [particles, rest] = ap.partition(res, ap.HasKind('particle'));
    const [images, unused] = ap.partition(rest, (e) =>
      BelongsToParticle(particles)(e.src)
    );

    const binPath = env.toolPath('convert');
    const outputPath = tempDirectory();
    const outputImages: ap.FileDescriptor[] = [];

    ap.assert(binPath, 'magick not found');
    ap.validate(
      particles
        .map(takeParticleDescriptor)
        .map(ap.Property('images'))
        .flat()
        .map(ap.Property('path'))
        .every((e) => images.map(ap.pathOf).includes(e)),
      'All image files of .parts were not provided as inputs'
    );

    await Promise.all(
      GetAtlasInfos(images, particles).map(async (atlasInfo) =>
        outputImages.push(
          await createAtlas(atlasInfo, outputPath, binPath, env)
        )
      )
    );

    return ap.concat(particles, outputImages, unused);
  };
}

interface ImageInfo {
  path: string;
  w: number;
  h: number;
  x: number;
  y: number;
  ids: string[];
}

interface AtlasInfo {
  id: string;
  size: [number, number];
  images: ImageInfo[];
}

function GetAtlasInfos(
  images: ap.FileDescriptor[],
  particles: ap.FileDescriptor[]
): AtlasInfo[] {
  const maxWidth = 2048;
  const maxHeight = 2048;
  const packerOptions: IOption = {
    smart: true,
    pot: true,
    square: true,
    allowRotation: false,
    tag: false,
    border: 0,
  };
  const packer = new MaxRectsPacker(maxWidth, maxHeight, 1, packerOptions);
  const effectAtlases: AtlasInfo[] = [];

  const inputs: {file: string; rect: Rectangle}[] = images.map((img) => {
    const texture = ap.takeTextureDescriptor(img);
    return {
      file: img.originalSrc.path,
      rect: new Rectangle(texture.w, texture.h),
    };
  });

  packer.addArray(inputs.map((i) => i.rect));
  if (packer.bins.length > 0) {
    if (packer.bins.length == 1) {
      console.info('particle: generating one mega atlas');
      const megaAtlas: AtlasInfo = {
        id: 'particle_mega_atlas',
        size: [packer.bins[0].width, packer.bins[0].height],
        images: [],
      };
      megaAtlas.images = inputs.map((input) => {
        const ids: string[] = [];
        particles.forEach((e) => {
          takeParticleDescriptor(e).images.forEach((i) => {
            if (i.path === input.file) {
              ids.push(i.id);
            }
          });
        });
        return {
          path: input.file,
          w: input.rect.width,
          h: input.rect.height,
          x: input.rect.x,
          y: input.rect.y,
          ids,
        };
      });
      return [megaAtlas];
    } else if (packer.bins.length > 1) {
      console.info('particle: generating atlas per effect');
      // If we couldn't fit every effects' images to one atlas then we create atlases per effect.
      // If we get more than one atlas per effect, fail.
      packer.reset();
      particles.forEach((p) => {
        const effectId = p.originalSrc.path;
        const effectInputs: {file: string; rect: Rectangle}[] = [];
        const imgDescriptions = takeParticleDescriptor(p).images;
        imgDescriptions.forEach((description) => {
          const img = images.find(
            (im) => im.originalSrc.path == description.path
          );
          if (img) {
            const texture = ap.takeTextureDescriptor(img);
            effectInputs.push({
              file: img.originalSrc.path,
              rect: new Rectangle(texture.w, texture.h),
            });
          } else {
            throw `Image: ${description.path} not found`;
          }
        });

        packer.addArray(effectInputs.map((input) => input.rect));
        if (packer.bins.length == 1) {
          const [atlasWidth, atlasHeight] = [
            packer.bins[0].width,
            packer.bins[0].height,
          ];
          imgDescriptions.forEach((description) => {
            const part = effectAtlases.find((p) => p.id === effectId);
            const input = effectInputs.find(
              (input) => input.file === description.path
            );
            if (input) {
              const data = {
                path: description.path,
                w: input.rect.width,
                h: input.rect.height,
                x: input.rect.x,
                y: input.rect.y,
                ids: [description.id],
              };
              if (part) {
                part.images.push(data);
              } else {
                effectAtlases.push({
                  id: effectId,
                  size: [atlasWidth, atlasHeight],
                  images: [data],
                });
              }
            }
          });

          packer.reset();
        } else {
          throw Error(
            `Effect "${effectId}" doesn't fit into one atlas:\n Only ${packer.bins[0].rects.length}/${effectInputs.length} could be fitted\n Allowed texture size: ${maxWidth}x${maxHeight}`
          );
        }
      });
    }
    return [...effectAtlases];
  }

  throw Error('No images were provided for generating a particle atlas');
}

async function createAtlas(
  atlas: AtlasInfo,
  outputPath: string,
  binPath: ap.ExtBinary,
  env: ap.Env
): Promise<ap.FileDescriptor> {
  const imgPath = path.join(outputPath, ap.stem(atlas.id) + '.png');
  const args = ['-size', `${atlas.size[0]}x${atlas.size[1]}`, 'xc:none'];
  atlas.images.forEach((img) => {
    args.push(img.path);
    args.push('-geometry');
    args.push(`+${img.x}+${img.y}`);
    args.push('-composite');
  });
  args.push(imgPath);
  const status = await ap.execute(binPath, args);
  ap.validateStatus(status);

  const realPath = ap.fileToSource(imgPath);

  if (!realPath) {
    throw new Error(`Montage couldn't create image for "${imgPath}"`);
  }

  const image = await ap.describeImageFile(env, realPath);
  image.group = 'common';

  const texture = ap.takeTextureDescriptor(image);
  texture.id = ap.stem(imgPath);
  texture.images = [];

  for (let i = 0; i < atlas.images.length; i++) {
    const img = atlas.images[i];
    atlas.images[i].ids.forEach((id) =>
      texture.images.push(
        imageDescriptor({
          id,
          rect: {l: img.x, t: img.y, w: img.w, h: img.h},
          originalSize: {w: img.w, h: img.h},
        })
      )
    );
  }

  return image;
}
