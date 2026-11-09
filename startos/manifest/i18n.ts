import { chain } from '../chain'

export const short = {
  en_US: `Silent Payments Electrum server that runs on a pruned node`,
}

export const long = {
  en_US: `Frigate, from the Sparrow Wallet team, is an Electrum server that scans the chain for Silent Payments (BIP352) on a wallet's behalf, using ephemeral client keys so the server never learns which payments belong to whom. This companion runs beside the official Frigate rather than in its place, works with a pruned node and needs no txindex, and serves the BLAKE2b chain as well as the SHA256 one: it follows whichever node you select. It is named for the ${chain.band} chain, the pairing it is meant for. Pair it with Electrs Pruned or Fulcrum Pruned for ordinary address lookups. Not the Frigate NVR camera recorder.`,
}

export const bitcoindDescription = {
  en_US:
    'Frigate reads blocks, their spent outputs and the mempool from this node. A pruned node is fine: Frigate indexes from the oldest block it still holds.',
}

export const electrumDescription = {
  en_US:
    'Frigate passes the Electrum requests it does not answer itself, address lookups included, to this server. It must follow the same node as Frigate.',
}
