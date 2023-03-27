import { chains } from "@/constants/chains";
import { ethers } from "ethers";
import { defineStore } from "pinia";
import { useMintStore } from "./mint";
import { useStakeStore } from "./stake"
import exnABI from "../constants/xenABI";
import menftABI from "@/constants/menftABI"
import { getMatchRoute } from "@/utils"
import { useMenftStore } from "./menft";

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
    menftContract: null,
  }),
  getters: {},
  actions: {
    initData(wallet) {
      this.wallet = wallet

      const chain = chains.find(c => c.networkId === this.wallet.networkId)
      if (chain) {
        this.xenContract = new ethers.Contract(chain.contract, exnABI, this.wallet.signer)
        this.menftContract = new ethers.Contract(chain.menftContract, menftABI, this.wallet.signer)

        const currentHref = window.location.href
        // console.log('currentHref', currentHref.split('/'))

        if (getMatchRoute(currentHref, 'mint')) {
          const mintStore = useMintStore()
          mintStore.initData()
        }

        if (getMatchRoute(currentHref, 'stake')) {
          const stakeStore = useStakeStore()
          stakeStore.initData()
        }

        if (getMatchRoute(currentHref, 'menft')) {
          const menftStore = useMenftStore()
          menftStore.initData()
        }
      }
    }
  }
})