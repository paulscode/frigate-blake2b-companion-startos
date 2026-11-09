import { chain } from './chain'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { electrumHostId, electrumPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const multiHost = sdk.MultiHost.of(effects, electrumHostId)
  // secure: null still allocates a plaintext external port. It is reachable over lxcbr0 and from
  // nowhere else, so off the box the TLS one is all there is.
  const origin = await multiHost.bindPort(electrumPort, {
    protocol: null,
    addSsl: {
      preferredExternalPort: chain.sslPort,
      alpn: null,
      addXForwardedHeaders: false,
      auth: null,
    },
    preferredExternalPort: chain.tcpPort,
    secure: null,
  })

  const electrum = sdk.createInterface(effects, {
    name: i18n('Electrum (SSL)'),
    id: 'electrum',
    description: i18n(
      'The Electrum protocol endpoint, with Silent Payments, served over SSL',
    ),
    type: 'api',
    // protocol: null leaves the origin scheme-less, which renders every address as a bare
    // host:port with nothing marking it as TLS.
    schemeOverride: { ssl: 'ssl', noSsl: 'tcp' },
    masked: false,
    username: null,
    path: '',
    query: {},
  })

  return [await origin.export([electrum])]
})
