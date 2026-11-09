import {
  rpcHostId as btcRpcHostId,
  rpcPort as btcRpcPort,
  zmqHostId as btcZmqHostId,
  zmqPortTransaction as btcZmqPort,
} from 'bitcoin-core-startos/startos/utils'
import {
  rpcHostId as b2bRpcHostId,
  rpcPort as b2bRpcPort,
  zmqHostId as b2bZmqHostId,
  zmqPortTransaction as b2bZmqPort,
} from 'knots-blake2b-startos/startos/utils'
import { i18n } from './i18n'

/**
 * The Bitcoin nodes Frigate can follow, one at a time, chosen with Select Node: the same three
 * Electrs Pruned and Fulcrum Pruned offer, so either companion can follow either chain and pair
 * with either pruned indexer. Frigate talks to a node over RPC (through btc-rpc-proxy when it
 * prunes) and listens to its ZeroMQ `sequence` feed for mempool changes when the node publishes
 * one (port 28333 on all three, alongside rawtx); without it Frigate polls every 5 seconds.
 */
type Endpoint = { hostId: string; port: number }

/** Written out, not imported: a health check id is not exported by the packages that declare it. */
const officialHealthChecks = ['bitcoind', 'sync-progress'] as const

export const nodes = {
  bitcoind: {
    // "Bitcoin Knots" rather than "Bitcoin": both flavors share the `bitcoind` id, and nearly
    // everyone running this stack runs Knots.
    title: 'Bitcoin Knots',
    blurb: i18n(
      'The official Bitcoin service, whichever flavor is installed: Knots or Core, on the SHA256 chain, or a BLAKE2b build that took its place.',
    ),
    rpc: { hostId: btcRpcHostId, port: btcRpcPort } as Endpoint,
    zmq: { hostId: btcZmqHostId, port: btcZmqPort } as Endpoint,
    healthChecks: officialHealthChecks,
    icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/refs/heads/30.x/dep-icon.svg',
  },
  // The id stays `knots-prerdts`; only its title changed when the package renamed itself to SHA256.
  'knots-prerdts': {
    title: 'Bitcoin Knots (SHA256) Companion',
    blurb: i18n(
      'A second node on the SHA256 chain, installed alongside your main Bitcoin service, pruned by default.',
    ),
    rpc: { hostId: btcRpcHostId, port: btcRpcPort } as Endpoint,
    zmq: { hostId: btcZmqHostId, port: btcZmqPort } as Endpoint,
    healthChecks: officialHealthChecks,
    icon: 'https://raw.githubusercontent.com/paulscode/knots-prerdts-startos/main/dep-icon.png',
  },
  'knots-blake2b': {
    title: 'Bitcoin Knots (BLAKE2b) Companion',
    blurb: i18n(
      'A node on the BLAKE2b chain, whose blocks use a different proof of work and a longer header, pruned by default.',
    ),
    rpc: { hostId: b2bRpcHostId, port: b2bRpcPort } as Endpoint,
    zmq: { hostId: b2bZmqHostId, port: b2bZmqPort } as Endpoint,
    // `chain` fails while the node is not on the BLAKE2b chain; `sync-progress` would add nothing.
    healthChecks: ['node', 'chain'] as const,
    icon: 'https://raw.githubusercontent.com/paulscode/knots-blake2b-startos/main/dep-icon.png',
  },
} as const

export type NodeId = keyof typeof nodes
export const nodeIds = Object.keys(nodes) as NodeId[]
export const isNodeId = (v: unknown): v is NodeId =>
  typeof v === 'string' && (nodeIds as string[]).includes(v)

/**
 * The minimum version of each node: Fulcrum Pruned's floors, which are the releases whose
 * btc-rpc-proxy serves a pruned node correctly (v0.8.1+ follows a rotated cookie; on the BLAKE2b
 * chain v0.8.2-blake2b.2 advertises NODE_BLAKE2B, without which Knots 29.4.3+ serves nothing past
 * the split). Frigate's baseline reads only blocks the node still holds, but the proxy fronts
 * every RPC call on a pruned node, so its faults would be Frigate's.
 *
 * Checked with the SDK's comparator (exver): `#knotsprerdts:31.2:0`, `#knotssha:31.2:1` (through
 * its satisfies list) and `#knots:29.5.0:3` pass the `bitcoind` range; `29.5.0:0` passes
 * `knots-blake2b`'s.
 */
export const nodeVersionRange: Record<NodeId, string> = {
  bitcoind:
    '(>=28.4:29 && <29) || (>=29.4:16 && <30) || (>=30.3:16 && <31) || >=31.1:16 || >=#knotsprerdts:29.3:29 || >=#knots:29.4.2:4',
  'knots-prerdts': '>=#knotsprerdts:29.3:29',
  'knots-blake2b': '>=29.4.3:1',
}
