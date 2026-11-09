/**
 * Everything that differs between the two Frigate companions lives here (plus the icons and the
 * wording of README.md and instructions.md). The SHA256 and BLAKE2b packages are otherwise
 * identical, and tools/sync-packages.sh in the frigate-companions project keeps them so.
 */
export const chain = {
  id: 'frigate-blake2b-companion',
  title: 'Frigate Electrum Server (BLAKE2b) Companion',
  /** The chain named in the title and on the icon's band. */
  band: 'BLAKE2b',
  packageRepo: 'https://github.com/paulscode/frigate-blake2b-companion-startos',
  /** The node this app is named for. Preferred at install when it is installed. */
  pairedNode: 'knots-blake2b',
  /**
   * Preferred external ports, SSL then plaintext. Distinct from the official Frigate's 50002/50001
   * and from the other companion's, so a server running several gets predictable ports.
   */
  sslPort: 50032,
  tcpPort: 50031,
  /**
   * Look Back for Payments (the backfill): the chain split offered as a choice (null: none), and the
   * rough cost per 1,000 blocks from the measurements in the frigate-companions project
   * (internal_docs/SPIKES-S1-S4.md), for the action's description.
   */
  chainSplit: 961640 as number | null,
  backfillCost: {
    trafficGb: '15 to 80',
    full: '2 to 10 hours',
    background: '8 to 40 hours',
  },
} as const
