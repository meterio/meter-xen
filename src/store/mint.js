import { chains } from "@/constants/chains";
import { defineStore } from "pinia";
import { useWalletStore } from "./wallet";
import { BigNumber, ethers } from "ethers";
import xenABI from "@/constants/xenABI";
import router from "@/router";
import { zero_address } from "@/constants";

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
    mintReward: 0,
    penalty: 0,
    error: "",

    mintLoading: false,
    claimRewardLoading: false,
    claimRewardAndShareLoading: false,
    claimRewardAndStakeLoading: false
  }),
  getters: {},
  actions: {
    async initData() {
      console.log('mint init data')
      const { xenContract, wallet } = useWalletStore()
      const [maxTerm, userMints, globalRank] = await Promise.all([
        xenContract.getCurrentMaxTerm(),
        xenContract.userMints(wallet.account),
        xenContract.globalRank(),
      ])
      console.log('mint info', userMints)
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
      console.log('global rank', this.globalRank)

      if (!this.rank) {
        this.rank = this.globalRank
      }

      this.maturityTs = BigNumber.from(userMints.maturityTs).toNumber()
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

      // console.log({rank: this.rank, term: this.term, maturityTs: this.maturityTs, amplifier: this.amplifier, eaaRate: this.eaaRate})
      // const mintReward = await xenContract.calculateMintReward(this.rank, this.term, this.maturityTs, this.amplifier, this.eaaRate)
      // console.log('mint reward', mintReward)

      // for step3 penalty
      if (!endTime.isZero()) {
        const lateSecs = (nowTime - endTime) / 1000
        if (lateSecs > 0) {
          const penalty = await xenContract.getPenalty(lateSecs.toFixed())
          this.penalty = BigNumber.from(penalty).toNumber()
        }
      }

      if (endTime.gt(0)) {
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
      try {
        if (this.user !== zero_address) {
          this.error = "You already minted."
          return
        }
        this.mintLoading = true
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

        this.mintLoading = false
  
        await this.initData()
  
        // router.push({
        //   name: "MintStep2"
        // })
      } catch(e) {
        this.mintLoading = false
        console.log('claim rank error: ', e)
      }
    },
    async claimMintReward() {
      try {
        this.claimRewardLoading = true

        const { xenContract } = useWalletStore()
        const tx = await xenContract.claimMintReward()
        await tx.wait()

        this.claimRewardLoading = false
      } catch(e) {
        console.log(e)
        this.claimRewardLoading = false
      }
    },
    async claimMintRewardAndShare(address, pct) {
      try {
        this.claimRewardAndShareLoading = true

        const { xenContract } = useWalletStore()
        const tx = await xenContract.claimMintRewardAndShare(address, pct)
        await tx.wait()

        this.claimRewardAndShareLoading = false
      } catch (e) {
        this.claimRewardAndShareLoading = false
      }
    },
    async claimMintRewardAndStake(pct, term) {
      try {
        this.claimRewardAndStakeLoading = true

        const { xenContract } = useWalletStore()
        const tx = await xenContract.claimMintRewardAndStake(pct, term)
        await tx.wait()

        this.claimRewardAndStakeLoading = false
      } catch (e) {
        this.claimRewardAndStakeLoading = false
      }
    }
  }
})