<template>
  <claim-mint :reward="grossReward" />

  <claim-mint-share :reward="grossReward" />

  <claim-mint-stake :reward="grossReward" />
</template>

<script setup>
  import { useMintStore } from "@/store/mint"
  import { storeToRefs } from "pinia"
  import ClaimMint from "./ClaimMint.vue"
  import ClaimMintShare from "./ClaimMintShare.vue"
  import ClaimMintStake from "./ClaimMintStake.vue"

  const mintStore = useMintStore()
  const { grossReward } = storeToRefs(mintStore)
</script>