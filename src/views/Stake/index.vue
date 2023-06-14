<template>
  <v-container class="fill-height d-flex align-center justify-center px-0">
    <v-responsive
      :max-width="maxWidth"
      class="fill-height">

      <div class="px-2">
        <v-row class="text-center">
          <v-col>
            <v-btn :variant="currentStep === 1 ? 'tonal' : 'text'" rounded="pill" @click="clickStep1">Start Stake</v-btn>
          </v-col>

          <v-col>
            <v-btn :variant="currentStep === 2 ? 'tonal' : 'text'" rounded="pill" @click="clickStep2">Staking</v-btn>
          </v-col>

          <v-col>
            <v-btn :variant="currentStep === 3 ? 'tonal' : 'text'" rounded="pill" @click="clickStep3">End Stake</v-btn>
          </v-col>
        </v-row>
      </div>

      <router-view />

      <!-- <bottom-page /> -->

    </v-responsive>
  </v-container>
</template>

<script setup>
  import BottomPage from '@/layouts/Bottom.vue'
  import { computed, ref } from "vue"
  import { useRouter, useRoute } from "vue-router"
  import useMaxWidth from "@/hooks/useMaxWidth"

  const maxWidth = useMaxWidth()

  const route = useRoute()
  const router = useRouter()

  const currentStep = computed(() => {
    switch (route.name) {
      case 'StakeStep1':
        return 1
      case 'StakeStep2':
        return 2
      case 'StakeStep3':
        return 3
    }
  })

  const clickStep1 = () => {
    router.push({
      name: "StakeStep1"
    })
  }
  const clickStep2 = () => {
    router.push({
      name: "StakeStep2"
    })
  }
  const clickStep3 = () => {
    router.push({
      name: "StakeStep3"
    })
  }
</script>