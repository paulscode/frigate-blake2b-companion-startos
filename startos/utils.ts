import { sdk } from './sdk'

// Host id Frigate binds its Electrum interface on, and the container port it listens on.
export const electrumHostId = 'electrum'
export const electrumPort = 50001

/** Frigate's home inside its container: config.toml, store.json and the index (db/). */
export const frigateHome = '/root/.frigate'

/**
 * The tweak index and the start-height record beside it. Deleting the directory rebuilds the index
 * from the start height (or, on a pruned node, from the node's prune height).
 */
export const dbDirOnVolume = sdk.volumes.main.subpath('db')
export const startHeightFile = sdk.volumes.main.subpath('db/start-height')

/** Frigate's mainnet default: Taproot activation, where Silent Payments become possible. */
export const taprootActivationHeight = 709632
