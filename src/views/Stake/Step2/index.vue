<template>
  <v-card class="pa-4 mt-4">
    <v-card-title class="px-0">Staking</v-card-title>

    <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">Matures in</span>
      <span>0</span>
    </section>

    <v-divider class="my-6"></v-divider>

    <section class="d-flex flex-column justify-space-between">
      <div class="d-flex justify-space-between">
        <span class="text-subtitle-2">Progress</span>
        <span>0.00%</span>
      </div>
      <v-progress-linear class="mt-2" :model-value="progressPercent" color="primary" height="10" rounded></v-progress-linear>
    </section>

    <v-divider class="my-6"></v-divider>

    <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">Liquid XEN</span>
      <span>0</span>
    </section>

    <v-divider class="my-6"></v-divider>

    <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">Staked XEN</span>
      <span>0</span>
    </section>

    <v-divider class="my-6"></v-divider>

    <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">APY</span>
      <span>0.00%</span>
    </section>

    <v-divider class="my-6"></v-divider>

    <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">Term</span>
      <span>0</span>
    </section>

    <v-divider class="my-6"></v-divider>
  </v-card>
</template>

<script setup>
  import { ref } from "vue";

  const progressPercent = ref(10)
</script>