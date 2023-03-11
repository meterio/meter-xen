<template>
  <v-card class="pa-4 my-4 white-bg" :class="{'mx-1': !mobile}">
    <v-card-title class="px-0">End Stake</v-card-title>

    <m-alert :type="alertInfo.type" :msg="alertInfo.msg"></m-alert>

    <section class="mt-6">
      <m-panel :data="panelData"></m-panel>
    </section>

    <v-sheet
      rounded
      class="mx-auto w-100 mt-4"
    >
      <span class="text-caption">Your stake term is not over yet. You can end your stake early without a penalty without you yield or you can wait until your stake matures to get the full yield.</span>
    </v-sheet>

    <v-btn
      block
      size="large"
      class="my-4"
      color="primary"
      @click="endStake"
      :loading="withdrawLoading"
      rounded="pill"
    >
      <span v-if="maturityPer < 100">Early End Stake</span>
      <span v-else>End Stake</span>
    </v-btn>
  </v-card>
</template>

<script setup>
  import { computed, watchEffect, reactive } from "vue";
  import { useStakeStore } from "@/store/stake";
  import { storeToRefs } from "pinia";
  import { useDisplay } from 'vuetify'

  const { mobile } = useDisplay()

  const stakeStore = useStakeStore()
  const { maturityPer, reward, withdrawLoading, withdrawError } = storeToRefs(stakeStore)

  let alertInfo = reactive({
    type: '',
    msg: ''
  })

  watchEffect(() => {
    if (!!withdrawError.value) {
      alertInfo.type = 'error'
      alertInfo.msg = withdrawError
    }
  })

  const panelData = computed(() => {
    return [
      {
        title: 'Reward',
        value: reward,
        name: 'MEN',
        tip: ''
      }
    ]
  })

  const endStake = async () => {
    stakeStore.endStake()
  }
</script>