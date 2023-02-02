import { BigNumber } from "ethers";
import { defineStore } from "pinia";
import { useWalletStore } from "./wallet";
import router from "@/router";

export const useStakeStore = defineStore({
  id: 'stake',
  state: () => ({
    maxTerm: 1000,
    term: 0,
    amount: 0,
    stakedAmount: 0,
    totalStaked: 0,
    apy: 0,
    currentAPY: 0,
    maturityPer: 0,
    reward: 0,
    dayInYear: 365,

    stakeLoading: false,
    withdrawLoading: false
  }),
  getters: {},
  actions: {
    async initData() {
      console.log('stake init data')
      const { xenContract, wallet } = useWalletStore()
      const [userStakes, amount, currentAPY, totalStaked, dayInYear] = await Promise.all([
        xenContract.userStakes(wallet.account),
        xenContract.balanceOf(wallet.account),
        xenContract.getCurrentAPY(),
        xenContract.totalMenStaked(),
        xenContract.DAYS_IN_YEAR()
      ])

      console.log('userStakes', userStakes)
      // console.log('amount', BigNumber.from(amount).div((10 ** 18).toString()))
      // console.log('totalStaked', BigNumber.from(totalStaked).div((10 ** 18).toString()).toString())
      this.totalStaked = BigNumber.from(totalStaked).div((10 ** 18).toString()).toString()
      // console.log('currentAPY', currentAPY)
      this.currentAPY = BigNumber.from(currentAPY).toNumber()
      this.term = BigNumber.from(userStakes.term).toNumber()
      this.amount = BigNumber.from(amount).div((10 ** 18).toString()).toNumber()
      // console.log('userStakes.amount', userStakes.amount)
      this.stakedAmount = BigNumber.from (userStakes.amount).div((10 ** 18).toString()).toNumber()
      this.apy = BigNumber.from(userStakes.apy).toNumber()
      // console.log('dayInYear', BigNumber.from(dayInYear).toNumber())
      this.dayInYear = BigNumber.from(dayInYear).toNumber()

      const endTime = BigNumber.from(userStakes.maturityTs).mul(1000)
      const nowTime = Date.now()
      const totalTime = BigNumber.from(userStakes.term).mul(24 * 3600 * 1000)
      this.maturityPer = ((1 - (endTime.sub(nowTime).toNumber() / totalTime.toNumber())) * 100).toFixed(2)
      console.log('maturityPer', this.maturityPer)

      const rate = this.apy * this.term * 1000000 / this.dayInYear;
      this.reward = (this.stakedAmount * rate / 100000000).toFixed(2);

      if (endTime.gt(0)) {
        if (endTime.lt(nowTime)) {
          router.push({
            name: "StakeStep3"
          })
        } else {
          router.push({
            name: "StakeStep2"
          })
        }
      } else {
        router.push({
          name: "StakeStep1"
        })
      }
    },
    async stake(amount, term) {
      try {
        this.stakeLoading = true

        const { xenContract } = useWalletStore()
        const tx = await xenContract.stake(BigNumber.from(amount).mul((10 ** 18).toString()), term)
        await tx.wait()

        this.stakeLoading = false

        await this.initData()
      } catch(e) {
        this.stakeLoading = false
      }
    },
    async endStake() {
      try {
        this.withdrawLoading = true

        const { xenContract } = useWalletStore()
        const tx = await xenContract.withdraw()
        await tx.wait()

        this.withdrawLoading = false
      } catch(e) {
        this.withdrawLoading = false
      }
    }
  }
})