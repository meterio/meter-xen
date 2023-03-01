import { chains } from "@/constants/chains";
import { defineStore } from "pinia";
import { useWalletStore } from "./wallet";
import { BigNumber, ethers } from "ethers";
import { v4 as uuidv4 } from 'uuid';
import xenABI from "@/constants/xenABI";
import router from "@/router";
import { useTxinfoStore } from "./txinfo";

export const useMintStore = defineStore({
  id: 'mint',
  state: () => ({
    user: "",
    maxTerm: 0,
    rank: 0,
    maturityTs: 0,
    maturityPer: 0,
    term: 0,
    amplifier: 0,
    eaaRate: 0,
    globalRank: 0,
    grossReward: 0,
    penalty: 0,
    error: "",
    claimError: "",
    claimShareError: "",
    claimStakeError: "",

    mintLoading: false,
    claimRewardLoading: false,
    claimRewardAndShareLoading: false,
    claimRewardAndStakeLoading: false
  }),
  getters: {},
  actions: {
    clearData() {
      this.user = ""
      this.maxTerm = 0
      this.rank = 0
      this.maturityTs = 0
      this.maturityPer = 0
      this.term = 0
      this.amplifier = 0
      this.eaaRate = 0
      this.globalRank = 0
      this.grossReward = 0
      this.penalty = 0
      this.error = ""
      this.claimError = ""
      this.claimShareError = ""
      this.claimStakeError = ""

      this.mintLoading = false
      this.claimRewardLoading = false
      this.claimRewardAndShareLoading = false
      this.claimRewardAndStakeLoading = false
    },
    async initData() {
      this.clearData()
      console.log('mint init data')
      const { xenContract, wallet } = useWalletStore()
      const [maxTerm, userMints, globalRank] = await Promise.all([
        xenContract.getCurrentMaxTerm(),
        xenContract.userMints(wallet.account),
        xenContract.globalRank(),
      ])
      // console.log('mint info', userMints)
      // console.log('maturityTs', new Date(BigNumber.from(userMints.maturityTs).toNumber() * 1000))
      
      // console.log('maxTerm', BigNumber.from(maxTerm).div(24 * 3600).toNumber())
      // console.log('currentAPY', String(currentAPY))
      this.user = userMints.user
      this.maxTerm = BigNumber.from(maxTerm).div(24 * 3600).toNumber()
      this.rank = BigNumber.from(userMints.rank).toNumber()
      this.term = BigNumber.from(userMints.term).toNumber()
      this.amplifier = BigNumber.from(userMints.amplifier).toNumber()
      this.eaaRate = BigNumber.from(userMints.eaaRate).toNumber()
      this.globalRank = BigNumber.from(globalRank).toNumber()
      // console.log('global rank', this.globalRank)

      if (!this.rank) {
        this.rank = this.globalRank
      }

      const maturityTs = BigNumber.from(userMints.maturityTs).toNumber()
      if (maturityTs > 0) {
        this.maturityTs = maturityTs
        const endTime = BigNumber.from(userMints.maturityTs).mul(1000)
        const nowTime = Date.now()
        // console.log('now time', nowTime)
        const totalTime = BigNumber.from(userMints.term).mul(24 * 3600 * 1000)
        // console.log('percent', (endTime.sub(nowTime).toNumber() / totalTime.toNumber()).toFixed(2))
        this.maturityPer = ((1 - (endTime.sub(nowTime).toNumber() / totalTime.toNumber())) * 100).toFixed(2)
        // console.log('maturityPer', this.maturityPer)
  
        const rankDelta = Math.max(this.globalRank - this.rank, 2)
  
        const grossReward = await xenContract.getGrossReward(rankDelta, this.amplifier, this.term, this.eaaRate + 1000)
        // console.log('gross reward', grossReward.toNumber())
        this.grossReward = grossReward.toNumber()

        // for step3 penalty
        const lateSecs = (nowTime - endTime) / 1000
        if (lateSecs > 0) {
          const penalty = await xenContract.getPenalty(lateSecs.toFixed())
          this.penalty = BigNumber.from(penalty).toNumber()
        }

        if (endTime.lt(nowTime)) {
          router.push({
            name: "MintStep3"
          })
        } else {
          router.push({
            name: "MintStep2"
          })
        }
      } else {
        router.push({
          name: "MintStep1"
        })
      }
    },
    async claimRank(term) {
      const txinfoStore = useTxinfoStore()
      const approveId = uuidv4()
      const claimRankId = uuidv4()
      try {
        this.mintLoading = true
        // console.log('term', term)
        const { xenContract, wallet } = useWalletStore()
        // get approve amount
        const mintValue = await xenContract.mintValue()
        const network = chains.find(c => c.networkId === wallet.networkId)
        const mtrgContract = new ethers.Contract(network.mtrgAddr, xenABI, wallet.signer)

        const mtrgBalance = await mtrgContract.balanceOf(wallet.account)
        if (BigNumber.from(mintValue).gt(mtrgBalance)) {
          this.error = "Insufficient MTRG balance."
          this.mintLoading = false
          return
        }

        const allowance = await mtrgContract.allowance(wallet.account, network.contract)
        if (BigNumber.from(allowance).lt(mintValue)) {
          
          txinfoStore.updateTxinfos({
            id: approveId,
            hash: '',
            title: 'Approve MTRG',
            status: 'pending'
          })
          const approveTx = await mtrgContract.approve(network.contract, mintValue)

          await approveTx.wait()

          txinfoStore.updateTxinfos({
            id: approveId,
            hash: approveTx.hash,
            title: 'Approve MTRG',
            status: 'over'
          })
        }
        
        txinfoStore.updateTxinfos({
          id: claimRankId,
          hash: '',
          title: 'Claim Rank',
          status: 'pending'
        })
        const tx = await xenContract.claimRank(term)
        
        await tx.wait()

        txinfoStore.updateTxinfos({
          id: claimRankId,
          hash: tx.hash,
          title: 'Claim Rank',
          status: 'over'
        })

        this.mintLoading = false
  
        await this.initData()
  
        // router.push({
        //   name: "MintStep2"
        // })
      } catch(e) {
        txinfoStore.removeTxinfo({ id: approveId })
        txinfoStore.removeTxinfo({ id: claimRankId })
        this.mintLoading = false
        console.log('claim rank error: ', e)
      }
    },
    async claimMintReward() {
      if (this.maturityPer < 100) {
        return this.claimError = "No MEN available to claim yet"
      }
      this.claimError = ""

      const txinfoStore = useTxinfoStore()
      const claimRewardId = uuidv4()

      try {
        this.claimRewardLoading = true

        const { xenContract } = useWalletStore()
        txinfoStore.updateTxinfos({
          id: claimRewardId,
          hash: '',
          title: 'Claim Reward',
          status: 'pending'
        })
        const tx = await xenContract.claimMintReward()
        await tx.wait()

        txinfoStore.updateTxinfos({
          id: claimRewardId,
          hash: tx.hash,
          title: 'Claim Reward',
          status: 'over'
        })

        this.claimRewardLoading = false
      } catch(e) {
        txinfoStore.removeTxinfo({ id: claimRewardId })
        console.log(e)
        this.claimRewardLoading = false
      }
    },
    async claimMintRewardAndShare(address, pct) {
      if (this.maturityPer < 100) {
        return this.claimShareError = "No MEN available to claim yet"
      }
      this.claimShareError = ""

      const txinfoStore = useTxinfoStore()
      const claimRewardShareId = uuidv4()

      try {
        this.claimRewardAndShareLoading = true

        const { xenContract } = useWalletStore()
        txinfoStore.updateTxinfos({
          id: claimRewardShareId,
          hash: '',
          title: 'Claim Reward & Share',
          status: 'pending'
        })
        const tx = await xenContract.claimMintRewardAndShare(address, pct)
        await tx.wait()

        txinfoStore.updateTxinfos({
          id: claimRewardShareId,
          hash: tx.hash,
          title: 'Claim Reward & Share',
          status: 'over'
        })

        this.claimRewardAndShareLoading = false
      } catch (e) {
        txinfoStore.removeTxinfo({ id: claimRewardShareId })
        this.claimRewardAndShareLoading = false
      }
    },
    async claimMintRewardAndStake(pct, term) {
      if (this.maturityPer < 100) {
        return this.claimStakeError = "No MEN available to claim yet"
      }
      this.claimStakeError = ""

      const txinfoStore = useTxinfoStore()
      const claimRewardStakeId = uuidv4()

      try {
        this.claimRewardAndStakeLoading = true

        const { xenContract } = useWalletStore()

        txinfoStore.updateTxinfos({
          id: claimRewardStakeId,
          hash: '',
          title: 'Claim Reward & Stake',
          status: 'pending'
        })

        const tx = await xenContract.claimMintRewardAndStake(pct, term)
        await tx.wait()

        txinfoStore.updateTxinfos({
          id: claimRewardStakeId,
          hash: tx.hash,
          title: 'Claim Reward & Stake',
          status: 'over'
        })

        this.claimRewardAndStakeLoading = false
      } catch (e) {
        txinfoStore.removeTxinfo({ id: claimRewardStakeId })
        this.claimRewardAndStakeLoading = false
      }
    }
  }
})