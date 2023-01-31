<template>
  <v-card class="pa-4 mt-4">
    <v-card-title class="px-0">Minting</v-card-title>

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
      <span class="text-subtitle-2">Estimated XEN</span>
      <span>0</span>
    </section>

    <v-divider class="my-6"></v-divider>

    <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">Amplifier</span>
      <span>{{ amplifier }}</span>
    </section>

    <v-divider class="my-6"></v-divider>

    <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">EAA Rate</span>
      <span>{{ eaaRate }}%</span>
    </section>

    <v-divider class="my-6"></v-divider>

    <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">Rank</span>
      <span>{{ rank }}</span>
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
  import { useMintStore } from "@/store/mint";
  import { storeToRefs } from "pinia";
  import { ref } from "vue";

  const mintStore =  useMintStore()
  const { rank, term, amplifier, eaaRate, maturityPer } = storeToRefs(mintStore)
</script>