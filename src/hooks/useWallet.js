import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'

import { chains } from "@/constants/chains"
import { markRaw, onBeforeUnmount, onMounted, ref } from 'vue'

import { useWalletStore } from '@/store/wallet'
import { ethers } from 'ethers'

const injected = injectedModule()
const walletConnect = walletConnectModule()

export default () => {

  const walletStore = useWalletStore()

  const onboard = ref(null)
  const unsubscribe = ref(null)

  onMounted(() => {
    onboard.value = Onboard({
      wallets: [injected, walletConnect],
      chains: chains.map(c => ({
        id: `0x${c.networkId.toString(16)}`,
        token: c.nativeTokenSymbol,
        label: c.name,
        rpcUrl: c.rpcUrl,
        publicRpcUrl: c.officialRpc,
        blockExplorerUrl: c.blockExplorer
      })),
      accountCenter: {
        desktop: {
          enabled: false,
        },
        mobile: {
          enabled: false,
        }
      },
      appMetadata: {
        name: 'Meter XEN',
        icon: '<svg></svg>',
        description: 'Meter XEN'
      }
    })

    connectWallet()
    subscribe()
  })

  const connectWallet = () => {
    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem('connectedWallets')
    )

    if (onboard.value) {
      if (previouslyConnectedWallets && previouslyConnectedWallets.length) {
        onboard.value.connectWallet({
          autoSelect: { label: previouslyConnectedWallets[0], disableModals: true }
        })
      } else {
        onboard.value.connectWallet()
      }
    }
  }

  const subscribe = () => {
    const wallets = onboard.value.state.select('wallets')
    const sub = wallets.subscribe(update => {
      const wallet = {}
      if (update.length) {
        const newWallet = update[0]
        // console.log('newWallet', newWallet)
        if (newWallet.accounts) {
          wallet.account = newWallet.accounts[0].address
          if (newWallet.accounts[0].balance) {
            wallet.balance = Object.values(newWallet.accounts[0].balance)[0]
            wallet.symbol = Object.keys(newWallet.accounts[0].balance)[0]
          }
        }
        wallet.icon = newWallet.icon
        const networkId = Number(newWallet.chains[0].id)
        wallet.networkId = networkId
        const network = chains.find(c => c.networkId === networkId)
        if (network) {
          wallet.networkName = network.name
        } else {
          wallet.networkName = 'Wrong Network'
        }
        if (newWallet.provider) {
          wallet.provider = markRaw(newWallet.provider)
          const web3Provider = new ethers.providers.Web3Provider(newWallet.provider)
          wallet.web3Provider = markRaw(web3Provider)
          wallet.signer = markRaw(web3Provider.getSigner())
        }
      }
      walletStore.initData(wallet)
      
      const connectedWallets = update.map(({ label }) => label)
      window.localStorage.setItem(
        'connectedWallets',
        JSON.stringify(connectedWallets)
      )

      disconnectOtherWallet()
    })
    unsubscribe.value = sub.unsubscribe
  }

  const setChain = (chainId) => {
    if (onboard.value) {
      onboard.value.setChain({ chainId: `0x${Number(chainId).toString(16)}`})
    }
  }

  const disconnectWallet = () => {
    if (onboard.value) {
      const wallets = onboard.value.state.get().wallets
      if (wallets.length) {
        onboard.value.disconnectWallet({ label: wallets[0].label })
      }
    }
  }

  const disconnectOtherWallet = () => {
    if (onboard.value) {
      const wallets = onboard.value.state.get().wallets
      if (wallets.length > 1) {
        onboard.value.disconnectWallet({ label: wallets[1].label })
      }
    }
  }

  onBeforeUnmount(() => {
    if (unsubscribe.value) {
      unsubscribe.value()
    }
  })

  return {
    connectWallet,
    setChain,
    disconnectWallet,
  }
}
