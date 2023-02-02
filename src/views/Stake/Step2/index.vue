<template>
  <v-card class="pa-4 mt-4">
    <v-card-title class="px-0">Staking</v-card-title>

    <!-- <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">Matures in</span>
      <span>0</span>
    </section> -->

    <v-divider class="my-6"></v-divider>

    <section class="d-flex flex-column justify-space-between">
      <div class="d-flex justify-space-between">
        <span class="text-subtitle-2">Progress</span>
        <span>{{ maturityPer }}%</span>
      </div>
      <v-progress-linear class="mt-2" :model-value="maturityPer" color="primary" height="10" rounded></v-progress-linear>
    </section>

    <v-divider class="my-6"></v-divider>

    <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">Liquid MEN</span>
      <span> {{ totalStaked }}</span>
    </section>

    <v-divider class="my-6"></v-divider>

    <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">Staked MEN</span>
      <span>{{ stakedAmount }}</span>
    </section>

    <v-divider class="my-6"></v-divider>

    <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">APY</span>
      <span>{{ apy }}%</span>
    </section>

    <v-divider class="my-6"></v-divider>

    <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">Term</span>
      <span>{{ term }}</span>
    </section>

    <v-divider class="my-6"></v-divider>
  </v-card>
</template>

<script setup>
  import { ref } from "vue";
  import { useStakeStore } from "@/store/stake";
  import { storeToRefs } from "pinia";

  const stakeStore = useStakeStore()
  const { term, stakedAmount, totalStaked, apy, maturityPer } = storeToRefs(stakeStore)
</script>