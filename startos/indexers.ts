/**
 * The Electrum servers Frigate can use as its backend, one at a time, chosen with Select Indexer.
 * Frigate answers Silent Payments queries itself and passes every other wallet request (address
 * history, balances, transaction lookups, header ranges) to the backend, so one is required.
 *
 * The backend must follow the same node, or at least the same chain. Frigate checks that itself,
 * by comparing a recent header from each, and refuses wallets while they disagree.
 *
 * Host ids and ports are written out: none of these packages is an npm dependency here. Electrs
 * Pruned is a fork of the electrs package (host `electrum`); Fulcrum Pruned is a fork of the
 * fulcrum package (host `main`). Both listen on 50001 inside their container.
 */
export const indexers = {
  'electrs-pruned': {
    title: 'Electrs Pruned',
    hostId: 'electrum',
    port: 50001,
    healthChecks: ['electrs', 'sync'],
    // 0.11.1:48: the first that keeps fetching post-split BLAKE2b blocks from Knots 29.4.3+.
    versionRange: '>=0.11.1:48',
    icon: 'https://raw.githubusercontent.com/paulscode/electrs-pruned-startos/master/dep-icon.png',
  },
  'fulcrum-pruned': {
    title: 'Fulcrum Pruned',
    hostId: 'main',
    port: 50001,
    healthChecks: ['primary', 'sync-progress'],
    // 2.1.4:1: Electrum protocol 1.8 (patch 0007), so it answers Frigate on the BLAKE2b chain in
    // exactly the form Electrs Pruned does.
    versionRange: '>=2.1.4:1',
    icon: 'https://raw.githubusercontent.com/paulscode/fulcrum-pruned/master/dep-icon.png',
  },
  electrs: {
    title: 'Electrs',
    hostId: 'electrum',
    port: 50001,
    healthChecks: ['electrs', 'sync'],
    versionRange: '>=0.11.1:11',
    icon: 'https://raw.githubusercontent.com/Start9Labs/electrs-startos/refs/heads/master/icon.svg',
  },
  fulcrum: {
    title: 'Fulcrum',
    hostId: 'main',
    port: 50001,
    healthChecks: ['primary', 'sync-progress'],
    // Start9's floor, plus privkeyio's BLAKE2b build, which takes the `fulcrum` id under the
    // `#blake` flavor and so matches no unflavored range.
    versionRange: '>=2.1.1:8 || >=#blake:2.1.4:0',
    icon: 'https://raw.githubusercontent.com/Start9Labs/fulcrum-startos/master/icon.png',
  },
} as const

export type IndexerId = keyof typeof indexers
export const indexerIds = Object.keys(indexers) as IndexerId[]
export const isIndexerId = (v: unknown): v is IndexerId =>
  typeof v === 'string' && (indexerIds as string[]).includes(v)
