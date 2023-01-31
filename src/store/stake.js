import { BigNumber } from "ethers";
import { defineStore } from "pinia";
import { useWalletStore } from "./wallet";

export const useStakeStore = defineStore({
  id: 'stake',
  state: () => ({
    maxTerm: 1000,
    term: 0,
    amount: 0,
    stakedAmount: 0,
    apy: 0,
    currentAPY: 0,
    maturityPer: 0
  }),
  getters: {},
  actions: {
    async initData() {
      console.log('stake init data')
      const { xenContract, wallet } = useWalletStore()
      const [userStakes, amount, currentAPY] = await Promise.all([
        xenContract.userStakes(wallet.account),
        xenContract.balanceOf(wallet.account),
        xenContract.getCurrentAPY()
        // xenContract.totalMenStaked()
      ])
      console.log('amount', BigNumber.from(amount).div((10 ** 18).toString()))
      // console.log('totalStaked', totalStaked)
      console.log('currentAPY', currentAPY)
      this.currentAPY = BigNumber.from(currentAPY).toNumber()
      this.term = BigNumber.from(userStakes.term).toNumber()
      this.amount = BigNumber.from(amount).div((10 ** 18).toString()).toNumber()
      console.log('userStakes.amount', userStakes.amount)
      this.stakedAmount = BigNumber.from (userStakes.amount).div((10 ** 18).toString()).toNumber()
      console.log('1')
      this.apy = BigNumber.from(userStakes.apy).toNumber()

      if (BigNumber.from(userStakes.maturityTs).isZero()) {

      } else {
        const endTime = BigNumber.from(userStakes.maturityTs).mul(1000)
        const nowTime = Date.now()
        const totalTime = BigNumber.from(userStakes.term).mul(24 * 3600 * 1000)
        this.maturityPer = ((1 - (endTime.sub(nowTime).toNumber() / totalTime.toNumber())) * 100).toFixed(2)
        console.log('maturityPer', this.maturityPer)
      }
    },
    async stake(amount, term) {
      const { xenContract } = useWalletStore()
      const tx = await xenContract.stake(BigNumber.from(amount).mul((10 ** 18).toString()), term)
      await tx.wait()

      await this.initData()

      router.push({
        name: "StakeStep2"
      })
    },
    async endStake() {
      const { xenContract } = useWalletStore()
      const tx = await xenContract.withdraw()
      await tx.wait()
    }
  }
})