<template>
  <v-card class="pa-4 my-4 white-bg" :class="{'mx-1': !mobile}">
    <v-card-title class="px-0">Claim Mint</v-card-title>

    <m-alert :type="alertInfo.type" :msg="alertInfo.msg"></m-alert>

    <section class="mt-6">
      <m-panel :data="panelData"></m-panel>
    </section>

    <v-btn
      block
      size="large"
      class="mt-6 mb-3"
      color="#5CE199"
      @click="claimMint"
      :loading="loading"
      rounded="pill"
    >
      Claim Mint
    </v-btn>
  </v-card>
</template>

<script setup>
  import { useMintStore } from "@/store/mint";
  import { storeToRefs } from "pinia";
  import { reactive, toRefs, computed, watchEffect } from "vue";
  import { useDisplay } from 'vuetify'

  const { mobile } = useDisplay()

  const mintStore = useMintStore()

  const { claimError } = storeToRefs(mintStore)

  let alertInfo = reactive({
    type: '',
    msg: ''
  })

  watchEffect(() => {
    if (!!claimError.value) {
      alertInfo.type = 'error'
      alertInfo.msg = claimError
    }
  })

  const props = defineProps({
    reward: Number,
    penalty: Number,
    loading: Boolean
  })

  const { reward, penalty } = toRefs(props)

  const panelData = computed(() => {
    return [
      {
        title: 'Reward',
        value: reward,
        name: '',
        tip: ''
      },
      {
        title: 'Penalty',
        value: penalty.value + "%",
        name: '',
        tip: ''
      }
    ]
  })

  const claimMint = () => {
    mintStore.claimMintReward()
  }
</script>