<template>
  <v-card class="pa-4 mt-4">
    <v-card-title class="px-0">Claim Mint</v-card-title>

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

    <v-btn
      block
      size="large"
      class="mt-4"
      color="primary"
      @click="claimMint"
    >
      CLAIM MINT
    </v-btn>
  </v-card>
</template>

<script setup>
  import { ref } from "vue";

  const reward = ref(0)
  const penalty = ref(0)

  const claimMint = () => {}
</script>