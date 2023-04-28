import { chains } from "@/constants/chains";
import { ethers } from "ethers";
import { defineStore } from "pinia";
import { useMintStore } from "./mint";
import { useStakeStore } from "./stake"
import exnABI from "../constants/xenABI";
import menftABI from "@/constants/menftABI"
import mintInfoABI from "@/constants/mintInfoABI";
import { getMatchRoute } from "@/utils"
import { useMenftStore } from "./menft";
import { Contract, Provider, setMulticallAddress } from 'ethers-multicall';

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
    mintInfoContract: null,
    multicall: null,
    xenMultiContract: null
  }),
  getters: {},
  actions: {
    initData(wallet) {
      this.wallet = wallet

      const chain = chains.find(c => c.networkId === this.wallet.networkId)
      if (chain) {
        this.xenContract = new ethers.Contract(chain.contract, exnABI, this.wallet.signer)
        this.menftContract = new ethers.Contract(chain.menftContract, menftABI, this.wallet.signer)
        this.mintInfoContract = new ethers.Contract(chain.mintInfoContract, mintInfoABI, this.wallet.signer)

        setMulticallAddress(this.networkId, chain.multicallAddr)
        const multicall = new Provider(this.wallet.web3Provider, this.networkId)
        this.multicall = multicall
        this.xenMultiContract = new Contract(chain.contract, exnABI)

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