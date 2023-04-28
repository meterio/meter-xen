import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid';

import { useWalletStore } from "./wallet";
import { useTxinfoStore } from "./txinfo";
import { Contract } from 'ethers-multicall';
import { getErrorMsg, calEAARate } from '@/utils';
import { BigNumber } from 'ethers';

export const useMyNFTStore = defineStore({
  id: 'mynft',
  state: () => ({
    nftInfos: []
  }),
  getters: {},
  actions: {
    async clearData() {
      this.nftInfos = []
    },
    async initData() {
      await this.clearData()
      const { menftContract, xenContract, xenMultiContract, mintInfoContract, wallet, multicall } = useWalletStore()
      if (!wallet.account) {
        console.log('no wallet connected yet, return.')
        return
      }

      const tokens = await menftContract.ownedTokens()
      const gRank = await xenContract.globalRank()
      // console.log('tokens', tokens)
      for (const t of tokens) {
        const uri = await menftContract.tokenURI(t)
        const mintInfoCode = await menftContract.mintInfo(t)
        // console.log('mintInfoCode', mintInfoCode)
        const decodedMintInfo = await mintInfoContract.decodeMintInfo(mintInfoCode)
        // console.log('decode mint info', decodedMintInfo.redeemed)
        // console.log('uri', JSON.parse(window.atob(String(uri).split(',')[1])))
        const { name, image, attributes } = JSON.parse(window.atob(String(uri).split(',')[1]))
        const attrs = {}
        for (const a of attributes) {
          attrs[a.trait_type] = a.value
        }
        const info = {
          redeemed: decodedMintInfo.redeemed,
          tokenId: t,
          name,
          image,
          ...attrs
        }

        let reward = BigNumber.from(0)
        const requestArr = []
        for (let i = Number(info.cRank); i < Number(info.VMUs) + Number(info.cRank); i++) {
          let rankDelta = BigNumber.from(gRank).toNumber() - i
          if (rankDelta < 2) { rankDelta = 2}
          const amplifier = info.AMP
          const term = info.Term
          const eaaRate = calEAARate(BigNumber.from(gRank).toNumber())
          requestArr.push(xenMultiContract.getGrossReward(rankDelta, amplifier, term, eaaRate + 1000))
        }

        const result = await multicall.all(requestArr)
        // console.log('reward result', result)
        reward = result.reduce((prev, curr) => BigNumber.from(prev).add(curr))
        info.reward = reward.toNumber()

        this.nftInfos.push(info)

        this.nftInfos.sort((n1, n2) => {
          const timer1 = new Date(n1['Maturity DateTime']).getTime()
          const timer2 = new Date(n2['Maturity DateTime']).getTime()
          return timer1 < timer2 ? -1 : 1
        })
      }
      // console.log('nft infos', this.nftInfos)
    },
    async bulkClaimMintReward(tokenId) {
      const { menftContract, wallet } = useWalletStore()
      const txinfoStore = useTxinfoStore()

      const claimId = uuidv4()
      try {
        txinfoStore.updateTxinfos({
          id: claimId,
          hash: '',
          title: 'Claim Reward',
          status: 'pending'
        })

        const tx = await menftContract.bulkClaimMintReward(tokenId, wallet.account)
        
        await tx.wait()

        txinfoStore.updateTxinfos({
          id: claimId,
          hash: tx.hash,
          title: 'Claim Reward',
          status: 'over'
        })
      } catch(e) {
        const msg = getErrorMsg(e.message)
        txinfoStore.updateTxinfos({
          id: claimId,
          hash: '',
          title: msg,
          status: 'error'
        })
        // txinfoStore.removeTxinfo({ id: claimId })
      }
    }
  }
})