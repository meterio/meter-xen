<template>
  <v-card class="pa-4 my-4 white-bg" :class="{'mx-1': !mobile}">
    <v-card-title class="px-0">Claim Mint + Share</v-card-title>

    <m-alert :type="alertInfo.type" :msg="alertInfo.msg"></m-alert>

    <section class="mt-6">
      <m-panel :data="panelData"></m-panel>
    </section>

    <section class="mt-5">
      <div class="my-text-color">Share Percentage</div>
      <v-sheet
        rounded
        class="mx-auto w-100 pa-2 mt-1"
        color="lightGray"
      >

        <m-input v-model="percentage" :max="100" />
      </v-sheet>
    </section>

    <section class="mt-5">
      <div class="my-text-color">Wallet Address</div>
      <v-sheet
        rounded
        class="mx-auto w-100 pa-2 mt-1"
        color="lightGray"
      >

        <m-input v-model="walletAddr" :plain="true" />
      </v-sheet>
      <span class="my-text-color mt-1">Wallet address where you want to share your MEN</span>
    </section>

    <v-btn
      block
      size="large"
      class="mt-6 mb-3"
      color="primary"
      @click="mintShare"
      :loading="loading"
      rounded="pill"
    >
    Claim Mint + Share
    </v-btn>
  </v-card>
</template>

<script setup>
  import { useMintStore } from "@/store/mint";
  import { ethers } from "ethers";
  import { ref, toRefs, computed, reactive, watchEffect } from "vue";
  import { storeToRefs } from "pinia";
  import { useDisplay } from 'vuetify'

  const { mobile } = useDisplay()

  const mintStore = useMintStore()

  const { claimShareError } = storeToRefs(mintStore)

  let alertInfo = reactive({
    type: '',
    msg: ''
  })

  watchEffect(() => {
    if (!!claimShareError.value) {
      alertInfo.type = 'error'
      alertInfo.msg = claimShareError
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

  const walletAddr = ref('0x...')
  const walletAddrRules = [
    v => !!v || 'wallet address is required',
    v => ethers.utils.isAddress(v) || 'wrong address'
  ]

  const mintShare = async () => {
    const perValid = mValidate(percentageRules, percentage.value)
    const walletValid = mValidate(walletAddrRules, walletAddr.value)

    if (!perValid.status) {
      alertInfo.type = 'warning'
      alertInfo.msg = perValid.msg
      return
    }
    if (!walletValid.status) {
      alertInfo.type = 'warning'
      alertInfo.msg = walletValid.msg
      return
    }
    alertInfo.msg = ''
    mintStore.claimMintRewardAndShare(walletAddr.value, percentage.value)
  }
</script>