import { chains } from "@/constants/chains";
import { defineStore } from "pinia";
import { useWalletStore } from "./wallet";
import { BigNumber, ethers } from "ethers";
import { v4 as uuidv4 } from 'uuid';
import xenABI from "@/constants/xenABI";
import router from "@/router";
import { useTxinfoStore } from "./txinfo";
import buyBackABI from "@/constants/buyBackABI";
import menftABI from "@/constants/menftABI";
import { getErrorMsg } from "@/utils";

export const useMenftStore = defineStore({
  id: 'menft',
  state: () => ({
    maxTerm: 0,
    limitedCatetoryTimeThreshold: 0,
    xenAmount: 0,
    approvedMEN: 0,
    genesisTs: 0,

    error: ''
  }),
  getters: {},
  actions: {
    async clearData() {
      this.maxTerm = 0
      this.limitedCatetoryTimeThreshold = 0
      this.xenAmount = 0
      this.approvedMEN = 0
      this.genesisTs = 0
      this.error = ''
    },
    async initData() {
      await this.clearData()
      console.log('menft init data')
      const { xenContract, menftContract, wallet } = useWalletStore()
      if (!wallet.account) {
        console.log('no wallet connected yet, return.')
        return
      }
      const [maxTerm, threshold, xenAmount, genesisTs] = await Promise.all([
        xenContract.getCurrentMaxTerm(),
        menftContract.LIMITED_CATEGORY_TIME_THRESHOLD(),
        xenContract.balanceOf(wallet.account),
        menftContract.genesisTs()
      ])
      // console.log('menft max term', BigNumber.from(maxTerm).div(24 * 3600).toNumber())
      this.maxTerm = BigNumber.from(maxTerm).div(24 * 3600).toNumber()
      this.limitedCatetoryTimeThreshold = BigNumber.from(threshold).toNumber()
      // console.log('xen amount', BigNumber.from(xenAmount).div((10 ** 18).toString()).toNumber())
      this.xenAmount = BigNumber.from(xenAmount).div((10 ** 18).toString()).toNumber()
      this.genesisTs = BigNumber.from(genesisTs).toNumber()

      this.getMenAllowance()
    },
    async getNFTLeft(tier) {
      const { xenContract, menftContract, wallet } = useWalletStore()
      const [limits, counters] = await Promise.all([
        menftContract.specialClassesTokenLimits(tier),
        menftContract.specialClassesCounters(tier),
      ])

      // console.log({
      //   limits: BigNumber.from(limits).toNumber(),
      //   counters: BigNumber.from(counters).toNumber()
      // })
      return {
        limits: BigNumber.from(limits).toNumber(),
        counters: BigNumber.from(counters).toNumber()
      }
    },
    async getMenAllowance() {
      const { xenContract, menftContract, wallet } = useWalletStore()
      const network = chains.find(c => c.networkId === wallet.networkId)
      const allowance = await xenContract.allowance(wallet.account, network.menftContract)
      // console.log('allowance', BigNumber.from(allowance).div(String(10 ** 18)).toString())
      this.approvedMEN = BigNumber.from(allowance).div(String(10 ** 18)).toString()
    },
    async approveMEN(approveVal) {
      this.error = ''
      const txinfoStore = useTxinfoStore()
      const approveId = uuidv4()
      try {
        txinfoStore.updateTxinfos({
          id: approveId,
          hash: '',
          title: 'Approve MEN',
          status: 'pending'
        })
        const { xenContract, menftContract, wallet } = useWalletStore()
        const network = chains.find(c => c.networkId === wallet.networkId)
        const approveTx = await xenContract.approve(network.menftContract, BigNumber.from(approveVal).mul(String(10**18)))
  
        await approveTx.wait()
  
        txinfoStore.updateTxinfos({
          id: approveId,
          hash: approveTx.hash,
          title: 'Approve MEN',
          status: 'over'
        })

        this.getMenAllowance()
      } catch(e) {
        this.error = getErrorMsg(e.message)
        console.log('approve men error', e)
        txinfoStore.removeTxinfo({ id: approveId })
      }
    },
    async bulkClaimRankLimited(count, term, burning) {
      this.error = ''
      const txinfoStore = useTxinfoStore()
      const uuid = uuidv4()
      try {
        txinfoStore.updateTxinfos({
          id: uuid,
          hash: '',
          title: 'Mint MENFT',
          status: 'pending'
        })

        const { xenContract, menftContract, wallet } = useWalletStore()
        const tx = await menftContract.bulkClaimRankLimited(count, term, burning)
        await tx.wait()

        txinfoStore.updateTxinfos({
          id: uuid,
          hash: tx.hash,
          title: 'Mint MENFT',
          status: 'over'
        })
      } catch(e) {
        
        this.error = getErrorMsg(e.message)
        txinfoStore.removeTxinfo({ id: uuid })
        console.log('bulk claim rank limited error', e)
      }
    },
    async bulkClaimRank(count, term) {
      this.error = ''
      const txinfoStore = useTxinfoStore()
      const uuid = uuidv4()
      try {
        txinfoStore.updateTxinfos({
          id: uuid,
          hash: '',
          title: 'Mint MENFT',
          status: 'pending'
        })

        const { xenContract, menftContract, wallet } = useWalletStore()
        const tx = await menftContract.bulkClaimRank(count, term)
        await tx.wait()

        txinfoStore.updateTxinfos({
          id: uuid,
          hash: tx.hash,
          title: 'Mint MENFT',
          status: 'over'
        })
      } catch(e) {
        this.error = getErrorMsg(e.message)
        txinfoStore.removeTxinfo({ id: uuid })
        console.log('bulk claim rank error', e.message)
      }
    }
  }
})