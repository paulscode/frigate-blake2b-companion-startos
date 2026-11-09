import { selectIndexer } from '../actions/selectIndexer'
import { selectNode } from '../actions/selectNode'
import { chain } from '../chain'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { IndexerId, indexerIds, indexers } from '../indexers'
import { NodeId, nodeIds, nodes } from '../nodes'
import { sdk } from '../sdk'

/**
 * On install, settle the node and the indexer rather than assume them (Electrs Pruned's rule,
 * learned the hard way: a default can be on the wrong chain, and `bitcoind` is SHA256 on one
 * server and BLAKE2b on another):
 *   - the node this app is named for, if installed, else the only supported node installed;
 *   - the only supported indexer installed;
 *   - otherwise a critical task, which keeps Frigate stopped until the operator chooses.
 *
 * Install only. An update keeps the choices already made, and a restore brings its own.
 */
export const chooseBackends = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  const installedNodes: NodeId[] = []
  for (const id of nodeIds) {
    const rpc = await sdk.host
      .getBridgeAddress(effects, {
        packageId: id,
        hostId: nodes[id].rpc.hostId,
        internalPort: nodes[id].rpc.port,
        ssl: false,
      })
      .once()
      .catch(() => null)
    if (rpc) installedNodes.push(id)
  }
  const installedIndexers: IndexerId[] = []
  for (const id of indexerIds) {
    const addr = await sdk.host
      .getBridgeAddress(effects, {
        packageId: id,
        hostId: indexers[id].hostId,
        internalPort: indexers[id].port,
        ssl: false,
      })
      .once()
      .catch(() => null)
    if (addr) installedIndexers.push(id)
  }

  const node = installedNodes.includes(chain.pairedNode)
    ? chain.pairedNode
    : installedNodes.length === 1
      ? installedNodes[0]
      : null
  const indexer = installedIndexers.length === 1 ? installedIndexers[0] : null
  await storeJson.merge(effects, { node, indexer })

  if (!node) {
    await sdk.action.createOwnTask(effects, selectNode, 'critical', {
      reason: i18n(
        'Choose which Bitcoin node Frigate follows. It decides which chain your wallets see, so it is not guessed.',
      ),
    })
  }
  if (!indexer) {
    await sdk.action.createOwnTask(effects, selectIndexer, 'critical', {
      reason: i18n(
        'Choose the Electrum server Frigate passes address lookups to. It must follow the same node as Frigate.',
      ),
    })
  }
})
