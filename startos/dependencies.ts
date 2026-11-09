import { T } from '@start9labs/start-sdk'
import { storeJson } from './fileModels/store.json'
import { IndexerId, indexers } from './indexers'
import { bitcoindDescription, electrumDescription } from './manifest/i18n'
import { NodeId, nodes, nodeVersionRange } from './nodes'
import { sdk } from './sdk'

/**
 * Exactly one node and one indexer are required: the ones selected with Select Node and Select
 * Indexer. Each is its own `optional` dependency, enabled only while selected, so the UI shows the
 * pair in use and does not nag about the others (Mempool Pruned's and Fulcrum Pruned's pattern).
 *
 * There is deliberately **no autoconfig task.** Upstream raises a critical one forcing `prune: 0`,
 * `txindex: true` and ZeroMQ on. These packages exist to drop the first two: Frigate reads each
 * block's spent outputs from getblock verbosity 3, which a pruned node serves for every block it
 * holds, and a mempool transaction's from gettxout (patch 0003), so `txindex` is never needed
 * (Knots refuses it with pruning anyway). ZeroMQ is used when the node publishes it and polled for
 * otherwise, so nothing here changes the node's configuration.
 */

const selectedNode = async (effects: T.Effects) =>
  (await storeJson.read((s) => s.node).const(effects)) ?? null
const selectedIndexer = async (effects: T.Effects) =>
  (await storeJson.read((s) => s.indexer).const(effects)) ?? null

const node = (id: NodeId) =>
  sdk.Dependency.optional(id, {
    description: bitcoindDescription,
    metadata: { title: nodes[id].title, icon: nodes[id].icon },
    kind: 'running',
    versionRange: nodeVersionRange[id],
    healthChecks: [...nodes[id].healthChecks],
    enabled: async ({ effects }) => (await selectedNode(effects)) === id,
  })

const indexer = (id: IndexerId) =>
  sdk.Dependency.optional(id, {
    description: electrumDescription,
    metadata: { title: indexers[id].title, icon: indexers[id].icon },
    kind: 'running',
    versionRange: indexers[id].versionRange,
    healthChecks: [...indexers[id].healthChecks],
    enabled: async ({ effects }) => (await selectedIndexer(effects)) === id,
  })

export const dependencies = sdk.Dependencies.of()
  .addDependency(node('bitcoind'))
  .addDependency(node('knots-prerdts'))
  .addDependency(node('knots-blake2b'))
  .addDependency(indexer('electrs-pruned'))
  .addDependency(indexer('fulcrum-pruned'))
  .addDependency(indexer('electrs'))
  .addDependency(indexer('fulcrum'))
