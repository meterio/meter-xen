import { BigNumber } from "ethers";
import { defineStore } from "pinia";
import { useWalletStore } from "./wallet";
import router from "@/router";
import { v4 as uuidv4 } from 'uuid';
import { useTxinfoStore } from "./txinfo";

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
    withdrawLoading: false,

    stakeError: "",
    withdrawError: "",
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
      this.amount = BigNumber.from(amount).div((10 ** 18).toString()).toNumber()
      // console.log('userStakes.amount', userStakes.amount)
      // console.log('dayInYear', BigNumber.from(dayInYear).toNumber())
      this.dayInYear = BigNumber.from(dayInYear).toNumber()
      
      const endTime = BigNumber.from(userStakes.maturityTs).mul(1000)
      if (endTime.gt(0)) {
        this.term = BigNumber.from(userStakes.term).toNumber()
        this.stakedAmount = BigNumber.from (userStakes.amount).div((10 ** 18).toString()).toNumber()
        this.apy = BigNumber.from(userStakes.apy).toNumber()
        const nowTime = Date.now()
        const totalTime = BigNumber.from(userStakes.term).mul(24 * 3600 * 1000)
        this.maturityPer = ((1 - (endTime.sub(nowTime).toNumber() / totalTime.toNumber())) * 100).toFixed(2)
        console.log('maturityPer', this.maturityPer)
        const rate = this.apy * this.term * 1000000 / this.dayInYear;
        this.reward = (this.stakedAmount * rate / 100000000).toFixed(2);

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
      const txinfoStore = useTxinfoStore()
      const id = uuidv4()
      try {
        this.stakeLoading = true

        const { xenContract } = useWalletStore()
        txinfoStore.updateTxinfos({
          id: id,
          hash: '',
          title: 'Stake',
          status: 'pending'
        })
        const tx = await xenContract.stake(BigNumber.from(amount).mul((10 ** 18).toString()), term)
        await tx.wait()

        txinfoStore.updateTxinfos({
          id: id,
          hash: tx.hash,
          title: 'Stake',
          status: 'over'
        })

        this.stakeLoading = false

        await this.initData()
      } catch(e) {
        if (e.message.includes('user rejected transaction')) {
          this.stakeError = "User denied transaction signature."
        } else {
          this.stakeError = e.message
        }
        txinfoStore.removeTxinfo({ id })
        this.stakeLoading = false
      }
    },
    async endStake() {
      if (this.stakedAmount === 0) {
        return this.withdrawError = "No stake exists"
      }

      const txinfoStore = useTxinfoStore()
      const id = uuidv4()

      try {
        this.withdrawLoading = true

        const { xenContract } = useWalletStore()

        txinfoStore.updateTxinfos({
          id: id,
          hash: '',
          title: 'End Stake',
          status: 'pending'
        })

        const tx = await xenContract.withdraw()
        await tx.wait()

        txinfoStore.updateTxinfos({
          id: id,
          hash: tx.hash,
          title: 'End Stake',
          status: 'over'
        })

        this.withdrawLoading = false
      } catch(e) {
        txinfoStore.removeTxinfo({ id })
        this.withdrawLoading = false
      }
    }
  }
})