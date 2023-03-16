<template>
  <v-card class="pa-4 my-4 white-bg" :class="{'mx-1': !mobile}">
    <v-card-title class="pl-0">Claim Rank</v-card-title>

    <m-alert :type="alertInfo.type" :msg="alertInfo.msg"></m-alert>

    <section class="mt-5">
      <div class="my-text-color">Enter Number of days</div>
      <v-sheet
        rounded
        class="mx-auto w-100 pa-2 mt-1"
        color="lightGray"
      >

        <m-input v-model="days" :max="maxTerm" />
      </v-sheet>
    </section>
    <section class="d-flex justify-space-between">
      <v-btn variant="plain" color="primary" class="pa-0" @click="isActive = true">Reward Calculator</v-btn>
    </section>

    <section class="mt-6">
      <m-panel :data="panelData"></m-panel>
    </section>

    <v-sheet
      rounded
      class="mx-auto w-100 mt-4"
    >
      <span class="text-caption">Your mint starts by claiming a rank. Select the number of days you want to mint for. The longer you mint for, the more rewards you will receive. You can mint for a maximum of 100 days.</span>
    </v-sheet>

    <v-btn
      block
      size="large"
      class="my-4"
      color="primary"
      @click="mint"
      :loading="mintLoading"
      :disabled="!!term"
      rounded="pill"
    >
      Start Mint
    </v-btn>
    <v-btn variant="plain" color="primary" class="pa-0" @click="triggerMenBuyback">Trigger MEN Buyback</v-btn>
  </v-card>
  <!-- dialog for estimate men -->
  <v-dialog
    transition="dialog-bottom-transition"
    width="auto"
    v-model:model-value="isActive"
  >
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-toolbar
          color="primary"
          title="Reward Calculator"
        ></v-toolbar>
        <v-card-text>
          <section class="mt-5">
            <div class="my-text-color">Terms</div>
            <v-sheet
              rounded
              class="mx-auto w-100 pa-2 mt-1"
              color="#ededed"
            >

              <m-input v-model="terms" :plain="true" :max="maxTerm" />
            </v-sheet>
            <span class="my-text-color mt-1">Wait for Number of Days to Claim</span>
          </section>
          <section class="mt-5">
            <div class="my-text-color">New Users</div>
            <v-sheet
              rounded
              class="mx-auto w-100 pa-2 mt-1"
              color="#ededed"
            >

              <m-input v-model="rankDelta" :plain="true" />
            </v-sheet>
            <span class="my-text-color mt-1">Number of New Users After You</span>
          </section>
          <section class="mt-5 d-flex justify-space-between">
            <span class="my-text-color">Reward:</span>
            <div>
              <span class="font-weight-bold">{{ estimateReward }}</span>
              <span class="my-text-color"> MEN</span>
            </div>
          </section>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            variant="text"
            @click="isActive.value = false"
          >Close</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
  import { computed, reactive, ref, watch, watchEffect } from "vue"
  import { useMintStore } from "@/store/mint"
  import { storeToRefs } from "pinia"
  import { useDisplay } from 'vuetify'

  const { mobile } = useDisplay()

  const mintStore = useMintStore()
  const { maxTerm, rank, term, error, mintLoading, maturityTs, estimateReward } = storeToRefs(mintStore)

  let alertInfo = reactive({
    type: '',
    msg: ''
  })

  watchEffect(() => {
    if (!!error.value) {
      alertInfo.type = 'error'
      alertInfo.msg = error
    }
    if (!!term.value) {
      alertInfo.type = 'warning'
      alertInfo.msg = 'This address has already minted MEN'
    }
  })

  const days = ref(0)

  const panelData = computed(() => {
    return [
      {
        title: 'Claim rank',
        value: rank.value,
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

  watch(maturityTs, (ts) => {
    if (ts > 0) {
      const t = (ts * 1000) - Date.now()
      if (t > 0) {
        days.value = Math.ceil(t / (24 * 3600 * 1000))
      }
    }
  }, {immediate: true})

  const daysRules = [
    v => !!v || 'days is required',
    v => (v && !isNaN(Number(v))) || 'days must be a number',
    v => (Number(v) > 0) || 'days must great than 0'
  ];

  const mint = async () => {
    const valid = mValidate(daysRules, days.value)

    if (!valid.status) {
      alertInfo.type = 'warning'
      alertInfo.msg = valid.msg
    } else {
      alertInfo.msg = ''
      mintStore.claimRank(days.value)
    }
  }

  const isActive = ref(false)
  const terms = ref(30)
  const rankDelta = ref(1000)

  watch(days, () => {
    if (days.value) {
      terms.value = days.value
    }
  })

  watchEffect(() => {
    const validTerms = !Number.isNaN(Number(terms.value)) && Number(terms.value) > 0
    const validRankDelta = !Number.isNaN(Number(rankDelta.value)) && Number(rankDelta.value) >= 0
    if (validTerms && validRankDelta) {
      if (Number(rankDelta.value) < 2) {
        mintStore.calcMintReward(terms.value, 2)
      } else {
        mintStore.calcMintReward(terms.value, rankDelta.value)
      }
    } else {
      estimateReward.value = 0
    }
  })

  const triggerMenBuyback = () => {
    mintStore.triggerMenBuyback()
  }
</script>

<style scoped>

</style>