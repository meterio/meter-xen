<template>
  <v-card class="pa-4 mt-4">
    <v-card-title class="px-0">Claim Mint + Share</v-card-title>

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
        v-model="percentValid"
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
        ref="walletAddrRef"
        v-model="walletAddrValid"
        lazy-validation
      >
        <v-text-field
          v-model="walletAddr"
          :rules="walletAddrRules"
          label="Wallet Address"
          required
        ></v-text-field>
      </v-form>
      <div class="d-flex justify-space-between">
        <span class="text-body-2">Wallet address where you want to share your XEN</span>
      </div>
    </v-sheet>

    <v-btn
      block
      size="large"
      class="mt-4"
      color="primary"
      @click="mintShare"
    >
    CLAIM MINT + SHARE
    </v-btn>
  </v-card>
</template>

<script setup>
  import { ref } from "vue";

  const reward = ref(0)
  const penalty = ref(0)

  const percentageRef = ref(null)
  const percentValid = ref(false)
  const percentage = ref(0)
  const percentageRules = []
  const maxStakePercentage = () => {}

  const walletAddrRef = ref(null)
  const walletAddrValid = ref(false)
  const walletAddr = ref('')
  const walletAddrRules = []

  const mintShare = () => {}
</script>