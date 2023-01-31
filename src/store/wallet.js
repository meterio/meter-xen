import { chains } from "@/constants/chains";
import { ethers } from "ethers";
import { defineStore } from "pinia";
import { useMintStore } from "./mint";
import { useStakeStore } from "./stake"
import exnABI from "../constants/xenABI";

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
    xenContract: null,
  }),
  getters: {},
  actions: {
    initData(wallet) {
      this.wallet = wallet

      const chain = chains.find(c => c.networkId === this.wallet.networkId)
      if (chain) {
        this.xenContract = new ethers.Contract(chain.contract, exnABI, this.wallet.signer)

        const currentHref = window.location.href
        if (currentHref.includes('mint')) {
          const mintStore = useMintStore()
          mintStore.initData()
        }

        if (currentHref.includes('stake')) {
          const stakeStore = useStakeStore()
          stakeStore.initData()
        }
      }
    }
  }
})