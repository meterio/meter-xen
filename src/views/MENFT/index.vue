<template>
  <v-container class="fill-height d-flex align-center justify-center px-0">
    <v-responsive
      :max-width="currentStep === 1 ? maxWidth : ''"
      class="fill-height">

      <div class="px-2">
        <v-row class="text-center">
          <v-col>
            <v-btn :variant="currentStep === 1 ? 'tonal' : 'text'" rounded="pill" @click="clickStep1">Mint MENFT</v-btn>
          </v-col>

          <v-col>
            <v-btn :variant="currentStep === 2 ? 'tonal' : 'text'" rounded="pill" @click="clickStep2">My MENFTS</v-btn>
          </v-col>

          <!-- <v-col>
            <v-btn :variant="currentStep === 3 ? 'tonal' : 'text'" rounded="pill" @click="clickStep3">Claim Mint</v-btn>
          </v-col> -->
        </v-row>
      </div>

      <router-view />

      <bottom-page />

    </v-responsive>
  </v-container>
</template>

<script setup>
  import BottomPage from '@/layouts/Bottom.vue'
  import { computed } from "vue"
  import { useRouter, useRoute } from "vue-router"
  import useMaxWidth from "@/hooks/useMaxWidth"

  const maxWidth = useMaxWidth()

  const route = useRoute()
  const router = useRouter()

  const currentStep = computed(() => {
    switch (route.name) {
      case 'MintMENFT':
        return 1
      case 'MyNFTS':
        return 2
      // case 'MintStep3':
      //   return 3
    }
  })

  const clickStep1 = () => {
    router.push({
      name: "MintMENFT"
    })
  }
  const clickStep2 = () => {
    router.push({
      name: "MyNFTS"
    })
  }
  const clickStep3 = () => {
    router.push({
      name: "MintStep3"
    })
  }
</script>