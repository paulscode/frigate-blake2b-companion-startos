import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { indexers, isIndexerId } from '../indexers'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const selectIndexer = sdk.Action.withInput(
  'select-indexer',

  async () => ({
    name: i18n('Select Indexer'),
    description: i18n(
      'Choose the Electrum server Frigate passes address lookups to. Frigate answers Silent Payments itself.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  InputSpec.of({
    indexer: Value.select({
      name: i18n('Select Indexer'),
      description: i18n(
        "- Electrs Pruned: works with a pruned node.\n- Fulcrum Pruned: works with a pruned node.\n- Electrs: needs an archival (unpruned) node.\n- Fulcrum: needs an archival node with txindex.\nIt must follow the same node as Frigate (see Select Node). On a server with two pruned nodes, run Electrs Pruned on one and Fulcrum Pruned on the other, and pick the one that follows this server's node.",
      ),
      values: Object.fromEntries(
        Object.entries(indexers).map(([id, x]) => [id, x.title]),
      ) as Record<string, string>,
      default: null,
    }),
  }),

  async () => ({
    indexer: (await storeJson.read((s) => s.indexer).once()) ?? undefined,
  }),

  async ({ effects, input }) => {
    if (!isIndexerId(input.indexer)) return
    await storeJson.merge(effects, { indexer: input.indexer })
  },
)
