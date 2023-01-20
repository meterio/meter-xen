import { defineStore } from "pinia";

export const useWalletStore = defineStore({
  id: 'wallet',
  state: () => ({
    wallet: {
      account: '',
      balance: '',
      symbol: '',
      icon: '',
      provider: null,
      web3Provider: null,
      signer: null,
      networkName: '',
      networkId: ''
    },
  }),
  getters: {},
  actions: {
    initData(wallet) {
      this.wallet = wallet
    }
  }
})