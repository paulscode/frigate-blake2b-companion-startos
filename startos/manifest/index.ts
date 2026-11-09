import { setupManifest } from '@start9labs/start-sdk'
import { chain } from '../chain'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: chain.id,
  title: chain.title,
  license: 'Apache-2.0',
  packageRepo: chain.packageRepo,
  upstreamRepo: 'https://github.com/sparrowwallet/frigate',
  marketingUrl: 'https://github.com/sparrowwallet/frigate',
  donationUrl: 'https://sparrowwallet.com/donate/',
  description: { short, long },
  // StartOS 0.4.0.2, not the SDK's default, so the registry hides releases from older servers.
  // Every package in this stack targets 0.4.0.2 from 2026-10-11 on; release.sh refuses less.
  osVersion: '0.4.0.2',
  volumes: ['main'],
  images: {
    main: {
      source: {
        // Frigate built from upstream source with patches/ applied and a BLAKE2b-aware drongo, laid
        // over the community image for its entrypoint and Intel OpenCL runtime. See Dockerfile.
        dockerBuild: { dockerfile: 'Dockerfile', workdir: '.' },
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissing: false,
    },
  },
  // /dev/dri, for a recent Intel iGPU through the image's OpenCL runtime. Frigate falls back to the
  // CPU when it finds no usable device. NVIDIA and AMD variants are not built (yet).
  hardwareAcceleration: true,
  // Dependencies are declared in dependencies.ts, which the SDK writes into the manifest.
})
