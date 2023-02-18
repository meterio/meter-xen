<template>
  <div class="page-container">
    <v-card class="pa-4 mt-4 white-bg main-content" variant="outlined" rounded="xl">
      <v-card-title class="d-flex justify-center">Claim Rank</v-card-title>

      <m-alert :type="alertInfo.type" :msg="alertInfo.msg"></m-alert>
      <!-- <v-alert closable v-if="!!term" type="warning">This address has already minted MEN</v-alert> -->

      <v-sheet
        rounded
        class="mx-auto w-100 pa-2"
      >
        <section class="text-body-2 text-center">Number of days</section>

        <section class="text-center">
          <m-input v-model="days" :max="maxTerm" />
        </section>
      </v-sheet>

      <section class="mt-6">
        <m-panel :data="panelData"></m-panel>
      </section>

      <v-sheet
        rounded
        class="mx-auto w-100 mt-4 pa-4"
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
        Mint
      </v-btn>
    </v-card>
    <v-card class="pa-4 mx-5 white-bg next-page" variant="outlined" rounded="xl"></v-card>
  </div>
</template>

<script setup>
  import { computed, reactive, ref, watch, watchEffect } from "vue"
  import { useMintStore } from "@/store/mint"
  import { storeToRefs } from "pinia"
  import { validate } from "@/utils"

  const mintStore = useMintStore()
  const { maxTerm, rank, term, error, mintLoading, maturityTs } = storeToRefs(mintStore)

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
        name: ''
      },
      {
        title: 'Maturity',
        value: days.value,
        name: 'days'
      }
    ]
  })

  const maxDays = () => {
    days.value = maxTerm.value
  }

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
    const valid = validate(daysRules, days.value)

    if (!valid.status) {
      alertInfo.type = 'warning'
      alertInfo.msg = valid.msg
    } else {
      alertInfo.msg = ''
      mintStore.claimRank(days.value)
    }
  }
</script>

<style scoped>
  .page-container {
    position: relative;
    z-index: 2;
  }
  .main-content {
    position: relative;
    z-index: 2;
  }
  .next-page {
    position: relative;
    bottom: 18px;
    z-index: 1;
  }
</style>