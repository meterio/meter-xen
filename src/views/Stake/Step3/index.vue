<template>
  <v-card class="pa-4 mt-4">
    <v-card-title class="px-0">End Stake</v-card-title>

    <v-sheet
      rounded
      color="grey-lighten-3"
      class="mx-auto w-100 mt-4 pa-2 "
      height="100"
    >
      <div class="d-flex flex-column justify-space-between fill-height">
        <span class="text-subtitle-2">Reward</span>
        <span class="text-body-2">{{ reward }}</span>
      </div>
    </v-sheet>

    <v-sheet
      rounded
      color="grey-lighten-3"
      class="mx-auto w-100 mt-4 pa-2"
      v-if="maturityPer < 100"
    >
      <div class="d-flex flex-column justify-space-between fill-height">
        <span class="text-subtitle-2">Note</span>
        <span class="text-body-2">Your stake term is not over yet. You can end your stake early without a penalty without you yield or you can wait until your stake matures to get the full yield.</span>
      </div>
    </v-sheet>

    <v-btn
      block
      size="large"
      class="mt-4"
      color="primary"
      @click="endStake"
    >
      <span v-if="maturityPer < 100">EARLY END STAKE</span>
      <span v-else>END STAKE</span>
    </v-btn>
  </v-card>
</template>

<script setup>
  import { ref } from "vue";
  import { useStakeStore } from "@/store/stake";
  import { storeToRefs } from "pinia";

  const stakeStore = useStakeStore()
  const { maturityPer } = storeToRefs(stakeStore)

  const reward = ref(0)

  const endStake = async () => {
    stakeStore.endStake()
  }
</script>