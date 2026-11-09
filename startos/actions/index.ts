import { sdk } from '../sdk'
import { configure } from './configure'
import { selectIndexer } from './selectIndexer'
import { selectNode } from './selectNode'

export const actions = sdk.Actions.of()
  .addAction(selectNode)
  .addAction(selectIndexer)
  .addAction(configure)
