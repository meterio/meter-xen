<template>
  <v-card class="pa-4 mt-4">
    <v-card-title class="px-0">Claim Mint + Stake</v-card-title>

    <v-row>
      <v-col>
        <v-sheet
          rounded
          color="grey-lighten-3"
          class="mx-auto w-100 mt-4 pa-2 "
          height="100"
        >
          <div class="d-flex flex-column justify-space-between fill-height">
            <span class="text-subtitle-2">Reward</span>
            <span class="text-body-2">{{ reward }}</span>
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
            <span class="text-subtitle-2">Penalty</span>
            <span class="text-body-2">{{ penalty }}%</span>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <v-sheet
      rounded
      color="grey-lighten-3"
      class="mx-auto w-100 mt-4 pa-2"
    >
      <v-form
        ref="percentageRef"
        v-model="percentageValid"
        lazy-validation
      >
        <v-text-field
          v-model="percentage"
          :rules="percentageRules"
          label="Percentage"
          required
        ></v-text-field>
      </v-form>
      <div class="d-flex justify-space-between">
        <span class="text-body-2">Stake Percentage</span>
        <v-btn variant="tonal" size="sm" @click="maxStakePercentage">
          Max
        </v-btn>
      </div>
    </v-sheet>

    <v-sheet
      rounded
      color="grey-lighten-3"
      class="mx-auto w-100 mt-4 pa-2"
    >
      <v-form
        ref="stakeDaysRef"
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
      <div class="d-flex justify-space-between">
        <span class="text-body-2">Stake Days</span>
        <v-btn variant="tonal" size="sm" @click="maxStakeDays">
          Max
        </v-btn>
      </div>
    </v-sheet>

    <v-btn
      block
      size="large"
      class="mt-4"
      color="primary"
      @click="mintStake"
    >
    CLAIM MINT + STAKE
    </v-btn>
  </v-card>
</template>

<script setup>
  import { useMintStore } from "@/store/mint";
  import { ref, toRefs } from "vue";

  const mintStore = useMintStore()

  // const reward = ref(0)
  const penalty = ref(0)
  const props = defineProps({
    reward: Number
  })

  const { reward } = toRefs(props)

  const percentageValid = ref(false)
  const percentage = ref(0)
  const percentageRef = ref(null)
  const percentageRules = [
    v => !!v || 'percentage is required',
    v => (v && !isNaN(Number(v))) || 'percentage must be a number',
    v => (Number(v) > 0) || 'percentage must great than 0',
    v => (Number(v) <= 100) || 'percentage must less than or equal 100'
  ]
  const maxStakePercentage = () => {
    percentage.value = 100
  }

  const daysValid = ref(false)
  const days = ref(0)
  const daysRules = [
    v => !!v || 'days is required',
    v => (v && !isNaN(Number(v))) || 'days must be a number',
    v => (Number(v) > 0) || 'days must great than 0',
    v => (Number(v) <= 1000) || 'days must less than or equal 1000'
  ]
  const stakeDaysRef = ref(null)
  const maxStakeDays = () => {
    days.value = 1000
  }

  const mintStake = async () => {
    await percentageRef.value.validate()
    await stakeDaysRef.value.validate()
    if (percentageValid.value && daysValid.value) {
      mintStore.claimMintRewardAndStake(percentage.value, days.value)
    }
  }
</script>