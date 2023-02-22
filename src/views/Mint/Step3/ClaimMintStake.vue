<template>
  <v-card class="pa-4 my-4 white-bg" :class="{'mx-1': !mobile}">
    <v-card-title class="px-0">Claim Mint + Stake</v-card-title>

    <m-alert :type="alertInfo.type" :msg="alertInfo.msg"></m-alert>

    <section class="mt-6">
      <m-panel :data="panelData"></m-panel>
    </section>

    <section class="mt-5">
      <div class="my-text-color">Stake Percentage</div>
      <v-sheet
        rounded
        class="mx-auto w-100 pa-2 mt-1"
        color="#ededed"
      >

        <m-input v-model="percentage" :max="100" />
      </v-sheet>
    </section>

    <section class="mt-5">
      <div class="my-text-color">Stake Days</div>
      <v-sheet
        rounded
        class="mx-auto w-100 pa-2 mt-1"
        color="#ededed"
      >

        <m-input v-model="days" :max="1000" />
      </v-sheet>
    </section>

    <v-btn
      block
      size="large"
      class="mt-4"
      color="#5CE199"
      @click="mintStake"
      :loading="loading"
      rounded="pill"
    >
    Claim Mint + Stake
    </v-btn>
  </v-card>
</template>

<script setup>
  import { useMintStore } from "@/store/mint";
  import { ref, toRefs, computed, watchEffect, reactive } from "vue";
  import { storeToRefs } from "pinia";
  import { useDisplay } from 'vuetify'

  const { mobile } = useDisplay()

  const mintStore = useMintStore()

  const { claimStakeError } = storeToRefs(mintStore)

  let alertInfo = reactive({
    type: '',
    msg: ''
  })

  watchEffect(() => {
    if (!!claimStakeError.value) {
      alertInfo.type = 'error'
      alertInfo.msg = claimStakeError
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

  const percentage = ref(0)
  const percentageRules = [
    v => !!v || 'percentage is required',
    v => (v && !isNaN(Number(v))) || 'percentage must be a number',
    v => (Number(v) > 0) || 'percentage must great than 0',
    v => (Number(v) <= 100) || 'percentage must less than or equal 100'
  ]

  const days = ref(0)
  const daysRules = [
    v => !!v || 'days is required',
    v => (v && !isNaN(Number(v))) || 'days must be a number',
    v => (Number(v) > 0) || 'days must great than 0',
    v => (Number(v) <= 1000) || 'days must less than or equal 1000'
  ]

  const mintStake = async () => {
    const perValid = mValidate(percentageRules, percentage.value)
    const daysValid = mValidate(daysRules, days.value)

    if (!perValid.status) {
      alertInfo.type = 'warning'
      alertInfo.msg = perValid.msg
      return
    }
    if (!daysValid.status) {
      alertInfo.type = 'warning'
      alertInfo.msg = daysValid.msg
      return
    }
    alertInfo.msg = ''
    mintStore.claimMintRewardAndStake(percentage.value, days.value)
  }
</script>