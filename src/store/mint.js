import { chains } from "@/constants/chains";
import { maximum_approve_amount } from "@/constants";
import { defineStore } from "pinia";
import { useWalletStore } from "./wallet";
import { BigNumber, ethers } from "ethers";
import xenABI from "@/constants/xenABI";
import router from "@/router";

export const useMintStore = defineStore({
  id: 'mint',
  state: () => ({
    maxTerm: 0,
    rank: 0,
    maturityPer: 0,
    term: 0,
    amplifier: 0,
    eaaRate: 0,
    globalRank: 0,
    grossReward: 0,
  }),
  getters: {},
  actions: {
    async initData() {
      console.log('mint init data')
      const { xenContract, wallet } = useWalletStore()
      const [maxTerm, userMints, globalRank] = await Promise.all([
        xenContract.getCurrentMaxTerm(),
        xenContract.userMints(wallet.account),
        xenContract.globalRank()
      ])
      // console.log('mint info', userMints)
      // console.log('maturityTs', new Date(BigNumber.from(userMints.maturityTs).toNumber() * 1000))
      
      // console.log('maxTerm', BigNumber.from(maxTerm).div(24 * 3600).toNumber())
      // console.log('currentAPY', String(currentAPY))
      this.maxTerm = BigNumber.from(maxTerm).div(24 * 3600).toNumber()
      this.rank = BigNumber.from(userMints.rank).toNumber()
      this.term = BigNumber.from(userMints.term).toNumber()
      this.amplifier = BigNumber.from(userMints.amplifier).toNumber()
      this.eaaRate = BigNumber.from(userMints.eaaRate).toNumber()
      this.globalRank = BigNumber.from(globalRank).toNumber()
      console.log('global rank', this.globalRank)

      if (!this.rank) {
        this.rank = this.globalRank
      }


      const endTime = BigNumber.from(userMints.maturityTs).mul(1000)
      const nowTime = Date.now()
      // console.log('now time', nowTime)
      const totalTime = BigNumber.from(userMints.term).mul(24 * 3600 * 1000)
      // console.log('percent', (endTime.sub(nowTime).toNumber() / totalTime.toNumber()).toFixed(2))
      this.maturityPer = ((1 - (endTime.sub(nowTime).toNumber() / totalTime.toNumber())) * 100).toFixed(2)
      console.log('maturityPer', this.maturityPer)

      const rankDelta = Math.max(this.globalRank - this.rank, 2)

      const grossReward = await xenContract.getGrossReward(rankDelta, this.amplifier, this.term, this.eaaRate)
      console.log('gross reward', grossReward.toNumber())
      this.grossReward = grossReward.toNumber()

      // if (endTime.lt(nowTime)) {
      //   router.push({
      //     name: "MintStep3"
      //   })
      // }
    },
    async claimRank(term) {
      console.log('term', term)
      const { xenContract, wallet } = useWalletStore()
      // get approve amount
      const mintValue = await xenContract.mintValue()
      const network = chains.find(c => c.networkId === wallet.networkId)
      const mtrgContract = new ethers.Contract(network.mtrgAddr, xenABI, wallet.signer)
      const allowance = await mtrgContract.allowance(wallet.account, network.contract)
      if (BigNumber.from(allowance).lt(mintValue)) {
        await (await mtrgContract.approve(network.contract, mintValue)).wait()
      }
      const tx = await xenContract.claimRank(term)
      await tx.wait()

      await this.initData()

      router.push({
        name: "MintStep2"
      })
    },
    async claimMintReward() {
      const { xenContract } = useWalletStore()
      const tx = await xenContract.claimMintReward()
      await tx.wait()
    },
    async claimMintRewardAndShare(address, pct) {
      const { xenContract } = useWalletStore()
      const tx = await xenContract.claimMintRewardAndShare(address, pct)
      await tx.wait()
    },
    async claimMintRewardAndStake(pct, term) {
      const { xenContract } = useWalletStore()
      const tx = await xenContract.claimMintRewardAndStake(pct, term)
      await tx.wait()
    }
  }
})