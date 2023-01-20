<template>
  <v-card class="pa-4 mt-4">
    <v-card-title class="px-0">Minting</v-card-title>

    <section class="d-flex flex-column justify-space-between">
      <div class="d-flex justify-space-between">
        <span class="text-subtitle-2">Progress</span>
        <span>0.00%</span>
      </div>
      <v-progress-linear class="mt-2" :model-value="progressPercent" color="primary" height="10" rounded></v-progress-linear>
    </section>

    <v-divider class="my-6"></v-divider>

    <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">Estimated XEN</span>
      <span>0</span>
    </section>

    <v-divider class="my-6"></v-divider>

    <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">Amplifier</span>
      <span>0</span>
    </section>

    <v-divider class="my-6"></v-divider>

    <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">EAA Rate</span>
      <span>0.00%</span>
    </section>

    <v-divider class="my-6"></v-divider>

    <section class="d-flex justify-space-between">
      <span class="text-subtitle-2">Rank</span>
      <span>0</span>
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