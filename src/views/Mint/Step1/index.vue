<template>
  <v-card class="pa-4 mt-4">
    <v-card-title class="px-0">Claim Rank</v-card-title>

    <v-alert v-if="error" type="error">{{ error }}</v-alert>

    <v-sheet
      rounded
      color="grey-lighten-3"
      class="mx-auto w-100 pa-2"
    >
      <v-form
        ref="formRef"
        v-model="valid"
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
        <span class="text-body-2">Number of days</span>
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
            <span class="text-subtitle-2">Your Claim Rank</span>
            <span class="text-body-2">{{ rank }}</span>
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
        <span class="text-subtitle-2">Minting Terms</span>
        <span class="text-body-2">Your mint starts by claiming a rank. Select the number of days you want to mint for. The longer you mint for, the more rewards you will receive. You can mint for a maximum of 100 days.</span>
      </div>
    </v-sheet>

    <v-btn
      block
      size="large"
      class="mt-4"
      color="primary"
      @click="mint"
      :loading="mintLoading"
    >
      START MINT
    </v-btn>
  </v-card>
</template>

<script setup>
  import { ref } from "vue"
  import { useMintStore } from "@/store/mint"
  import { storeToRefs } from "pinia"

  const mintStore = useMintStore()
  const { maxTerm, rank, error, mintLoading } = storeToRefs(mintStore)

  const days = ref(0)
  const valid = ref(false)

  const daysRules = [
    v => !!v || 'days is required',
    v => (v && !isNaN(Number(v))) || 'days must be a number',
    v => (Number(v) > 0) || 'days must great than 0'
  ];

  const maxDays = () => {
    days.value = maxTerm.value
  }

  const formRef = ref(null)

  const mint = async () => {
    const { valid } = await formRef.value.validate()
    console.log('valid', valid)
    if (valid) {
      mintStore.claimRank(days.value)
    }
  }
</script>

<style scoped>

</style>