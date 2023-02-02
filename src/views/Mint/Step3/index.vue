<template>
  <claim-mint :reward="grossReward" :penalty="penalty" :loading="claimRewardLoading" />

  <claim-mint-share :reward="grossReward" :penalty="penalty" :loading="claimRewardAndShareLoading" />

  <claim-mint-stake :reward="grossReward" :penalty="penalty" :loading="claimRewardAndStakeLoading" />
</template>

<script setup>
  import { useMintStore } from "@/store/mint"
  import { storeToRefs } from "pinia"
  import ClaimMint from "./ClaimMint.vue"
  import ClaimMintShare from "./ClaimMintShare.vue"
  import ClaimMintStake from "./ClaimMintStake.vue"

  const mintStore = useMintStore()
  const { grossReward, penalty, claimRewardLoading,
    claimRewardAndShareLoading,
    claimRewardAndStakeLoading } = storeToRefs(mintStore)
</script>