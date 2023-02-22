<template>
  <v-card class="pa-4 my-4 white-bg" :class="{'mx-1': !mobile}">
    <v-card-title class="px-0">Start Stake</v-card-title>

    <m-alert :type="alertInfo.type" :msg="alertInfo.msg"></m-alert>

    <section class="mt-5">
      <div class="my-text-color">Enter Stake Amount</div>
      <v-sheet
        rounded
        class="mx-auto w-100 pa-2 mt-1"
        color="#ededed"
      >

        <m-input v-model="stakeAmount" :max="amount" />
      </v-sheet>
    </section>

    <!-- maximum stake days -->
    <section class="mt-5">
      <div class="my-text-color">Enter Stake Days</div>
      <v-sheet
        rounded
        class="mx-auto w-100 pa-2 mt-1"
        color="#ededed"
      >

        <m-input v-model="days" :max="maxTerm" />
      </v-sheet>
    </section>
    
    <section class="mt-6">
      <m-panel :data="panelData"></m-panel>
    </section>

    <v-sheet
      rounded
      class="mx-auto w-100 mt-4"
    >
      <span class="text-caption">Withdraw original stake amount plus yield at any time after the maturity date, or at any time the original stake amount with 0 (zero) yield before the maturity date. One stake at a time per one address</span>
    </v-sheet>

    <v-btn
      block
      size="large"
      class="my-4"
      color="#5CE199"
      @click="startStake"
      :loading="stakeLoading"
      :disabled="!!term"
      rounded="pill"
    >
      Start Stake
    </v-btn>
  </v-card>
</template>

<script setup>
  import { computed, ref, reactive, watchEffect } from "vue";
  import { useStakeStore } from "@/store/stake"
  import { storeToRefs } from "pinia";
  import { useDisplay } from 'vuetify'

  const { mobile } = useDisplay()

  const stakeStore = useStakeStore()
  const { maxTerm, amount, currentAPY, stakeLoading, stakeError, term } = storeToRefs(stakeStore)

  let alertInfo = reactive({
    type: '',
    msg: ''
  })

  watchEffect(() => {
    if (!!stakeError.value) {
      alertInfo.type = 'error'
      alertInfo.msg = stakeError
    }
    if (!!term.value) {
      alertInfo.type = 'warning'
      alertInfo.msg = 'This address has already staked MEN'
    }
  })
  
  const stakeAmount = ref(0)
  const amountRules = [
    v => !!v || 'amount is required',
    v => (v && !isNaN(Number(v))) || 'amount must be a number',
    v => (Number(v) > 0) || 'amount must great than 0',
    v => (Number(v) <= amount.value) || 'insufficient balance'
  ]
  const days = ref(0)
  const daysRules = [
    v => !!v || 'days is required',
    v => (v && !isNaN(Number(v))) || 'days must be a number',
    v => (Number(v) > 0) || 'days must great than 0'
  ];

  const panelData = computed(() => {
    return [
      {
        title: 'Yield',
        value: currentAPY.value + "%",
        name: '',
        tip: ''
      },
      {
        title: 'Maturity',
        value: days.value,
        name: 'days',
        tip: ''
      }
    ]
  })

  const startStake = async () => {
    const amountValid = mValidate(amountRules, stakeAmount.value)
    const daysValid = mValidate(daysRules, days.value)

    if (!amountValid.status) {
      alertInfo.type = 'warning'
      alertInfo.msg = amountValid.msg
      return
    }
    if (!daysValid.status) {
      alertInfo.type = 'warning'
      alertInfo.msg = daysValid.msg
      return
    }
    alertInfo.msg = ''

    stakeStore.stake(stakeAmount.value, days.value)
  }
</script>