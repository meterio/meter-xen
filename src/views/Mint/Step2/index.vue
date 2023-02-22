<template>
  <v-card class="pa-4 my-4 white-bg" :class="{'mx-1': !mobile}">
    <v-card-title class="px-0">Minting</v-card-title>

    <section class="d-flex flex-column mt-2">
      <div class="d-flex justify-space-between align-center">
        <span class="my-text-color">Progress</span>
        <span class="item-value">{{ maturityPer }}%</span>
      </div>
      <v-progress-linear class="mt-1" :model-value="maturityPer" color="#5ce199" height="25" rounded="pill"></v-progress-linear>
    </section>

    <section v-for="item in data" :key="item.key" class="d-flex justify-space-between mt-4">
      <div class="d-flex align-center">
        <span class="my-text-color">{{ item.key }}</span>
        <v-tooltip
          v-if="item.tip"
          :text="item.tip"
        >
          <template v-slot:activator="{ props }">
            <v-icon class="ml-1" size="xsmall" v-bind="props" icon="mdi-information"></v-icon>
          </template>
        </v-tooltip>
      </div>
      <span class="item-value">{{ item.value }}</span>
    </section>

    <v-btn
      block
      size="large"
      class="my-4"
      color="#5CE199"
      disabled
      rounded="pill"
    >
      Claim Mint
    </v-btn>
  </v-card>
</template>

<script setup>
  import { useMintStore } from "@/store/mint";
  import { storeToRefs } from "pinia";
  import { computed } from "vue";
  import { useDisplay } from 'vuetify'

  const { mobile } = useDisplay()

  const mintStore =  useMintStore()
  const { rank, term, amplifier, eaaRate, maturityPer, grossReward } = storeToRefs(mintStore)

  const data = computed(() => [
    {
      key: "Estimated MEN",
      value: grossReward.value + " MEN",
      tip: ""
    },
    {
      key: "Amplifier",
      value: amplifier,
      tip: ""
    },
    {
      key: "EAA Rate",
      value: eaaRate.value + "%",
      tip: ""
    },
    {
      key: "Rank",
      value: rank,
      tip: ""
    },
    {
      key: "Term",
      value: term.value + " days",
      tip: ""
    }
  ])
</script>

<style scoped>
.item-value {
  font-size: 25px;
  font-weight: bold;
}
</style>