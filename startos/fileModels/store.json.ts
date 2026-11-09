import { FileHelper, z } from '@start9labs/start-sdk'
import { indexerIds, IndexerId } from '../indexers'
import { nodeIds, NodeId } from '../nodes'
import { sdk } from '../sdk'

/**
 * StartOS-side state, beside Frigate's own config.toml:
 *   - node, indexer: the Select Node and Select Indexer choices (null until made);
 *   - rebuildIndex: set by Configure Frigate; main deletes the index before the next start, then
 *     clears it.
 */
const shape = z.object({
  node: z
    .enum(nodeIds as [NodeId, ...NodeId[]])
    .nullable()
    .catch(null),
  indexer: z
    .enum(indexerIds as [IndexerId, ...IndexerId[]])
    .nullable()
    .catch(null),
  rebuildIndex: z.boolean().catch(false),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: '/store.json' },
  shape,
)
