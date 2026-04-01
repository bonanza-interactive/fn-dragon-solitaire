import * as particle from '@apila/particle-runtime';

export async function waitParticle(
  effect: particle.ParticleEffect,
): Promise<void> {
  while (effect.isEmitting()) {
    await new Promise((resolve) => setTimeout(resolve, 50)); // Wait 50ms
  }
}
