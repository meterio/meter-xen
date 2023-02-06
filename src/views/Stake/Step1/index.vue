<template>
  <v-card class="pa-4 mt-4">
    <v-card-title class="px-0">Start Stake</v-card-title>

    <v-alert v-if="!!term" type="warning">This address has already staked MEN</v-alert>

    <v-sheet
      rounded
      color="grey-lighten-3"
      class="mx-auto w-100 pa-2"
    >
      <v-form
        ref="amountRef"
        v-model="amountValid"
        lazy-validation
      >
        <v-text-field
          v-model="stakeAmount"
          :rules="amountRules"
          label="amount"
          required
        ></v-text-field>
      </v-form>

      <section class="d-flex justify-space-between">
        <span class="text-body-2">Maximum stake amount</span>
        <v-btn variant="tonal" size="sm" @click="maxAmount">
          Max
        </v-btn>
      </section>
    </v-sheet>

    <!-- maximum stake days -->
    <v-sheet
      rounded
      color="grey-lighten-3"
      class="mx-auto w-100 pa-2 mt-4"
    >
      <v-form
        ref="daysRef"
        v-model="daysValid"
        lazy-validation
      >
        <v-text-field
          v-model="days"
          :rules="daysRules"
          label="days"
          required
        ></v-text-field>
      </v-form>

      <section class="d-flex justify-space-between">
        <span class="text-body-2">Maximum stake days</span>
        <v-btn variant="tonal" size="sm" @click="maxDays">
          Max
        </v-btn>
      </section>
    </v-sheet>

    <v-row>
      <v-col>
        <v-sheet
          rounded
          color="grey-lighten-3"
          class="mx-auto w-100 mt-4 pa-2 "
          height="100"
        >
          <div class="d-flex flex-column justify-space-between fill-height">
            <span class="text-subtitle-2">Yield</span>
            <span class="text-body-2">{{ currentAPY }}%</span>
          </div>
        </v-sheet>
      </v-col>
      <v-col>
        <v-sheet
          rounded
          color="grey-lighten-3"
          class="mx-auto w-100 mt-4 pa-2"
          height="100"
        >
          <div class="d-flex flex-column justify-space-between fill-height">
            <span class="text-subtitle-2">Maturity</span>
            <span class="text-body-2">{{ days }} Days</span>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <v-sheet
      rounded
      color="grey-lighten-3"
      class="mx-auto w-100 mt-4 pa-2"
    >
      <div class="d-flex flex-column justify-space-between fill-height">
        <span class="text-subtitle-2">Staking Terms</span>
        <span class="text-body-2">Withdraw original stake amount plus yield at any time after the maturity date, or at any time the original stake amount with 0 (zero) yield before the maturity date. One stake at a time per one address</span>
      </div>
    </v-sheet>

    <v-btn
      block
      size="large"
      class="mt-4"
      color="primary"
      @click="startStake"
      :loading="stakeLoading"
      :disabled="!!term"
    >
      START STAKE
    </v-btn>
  </v-card>
</template>

<script setup>
  import { computed, ref } from "vue";
  import { useStakeStore } from "@/store/stake"
  import { storeToRefs } from "pinia";

  const stakeStore = useStakeStore()
  const { maxTerm, amount, currentAPY, stakeLoading, stakeError, term } = storeToRefs(stakeStore)

  const amountRef = ref(null)
  const stakeAmount = ref(0)
  const amountValid = ref(false)
  const amountRules = [
    v => !!v || 'amount is required',
    v => (v && !isNaN(Number(v))) || 'amount must be a number',
    v => (Number(v) > 0) || 'amount must great than 0',
    v => (Number(v) <= amount.value) || 'insufficient balance'
  ]
  const maxAmount = () => {
    stakeAmount.value = amount.value
  }

  const daysRef = ref(null)
  const daysValid = ref(false)
  const days = ref(0)
  const daysRules = [
    v => !!v || 'days is required',
    v => (v && !isNaN(Number(v))) || 'days must be a number',
    v => (Number(v) > 0) || 'days must great than 0'
  ];
  const maxDays = () => {
    days.value = maxTerm.value
  }

  const startStake = async () => {
    await amountRef.value.validate()
    await daysRef.value.validate()

    if (amountValid.value && daysValid.value) {
      stakeStore.stake(stakeAmount.value, days.value)
    }
  }
</script>