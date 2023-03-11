<template>
  <v-card class="pa-4 my-4 white-bg" :class="{'mx-1': !mobile}">
    <v-card-title class="px-0">Staking</v-card-title>

    <section class="d-flex flex-column mt-2">
      <div class="d-flex justify-space-between align-center">
        <span class="my-text-color">Progress</span>
        <span class="item-value">{{ maturityPer }}%</span>
      </div>
      <v-progress-linear class="mt-1" :model-value="maturityPer" color="primary" height="25" rounded="pill"></v-progress-linear>
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
      color="primary"
      disabled
      rounded="pill"
    >
      End Stake
    </v-btn>
  </v-card>
</template>

<script setup>
  import { computed } from "vue";
  import { useStakeStore } from "@/store/stake";
  import { storeToRefs } from "pinia";
  import { useDisplay } from 'vuetify'

  const { mobile } = useDisplay()

  const stakeStore = useStakeStore()
  const { term, stakedAmount, totalStaked, apy, maturityPer } = storeToRefs(stakeStore)

  const data = computed(() => [
    {
      key: "Liquid MEN",
      value: totalStaked.value + " MEN",
      tip: ""
    },
    {
      key: "Staked MEN",
      value: stakedAmount.value + " MEN",
      tip: ""
    },
    {
      key: "APY",
      value: apy.value + "%",
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