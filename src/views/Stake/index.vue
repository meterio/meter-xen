<template>
  <v-container class="fill-height d-flex align-center justify-center px-0">
    <v-responsive
      :max-width="maxWidth"
      class="fill-height">

      <v-row justify="space-between" class="text-center">
        <v-col>
          <v-btn icon :color="currentStep === 1 ? 'primary' : ''" @click="clickStep1">1</v-btn>
        </v-col>

        <v-col>
          <v-btn icon :color="currentStep === 2 ? 'primary' : ''" @click="clickStep2">2</v-btn>
        </v-col>

        <v-col>
          <v-btn icon :color="currentStep === 3 ? 'primary' : ''" @click="clickStep3">3</v-btn>
        </v-col>
      </v-row>

      <router-view />

    </v-responsive>
  </v-container>
</template>

<script setup>
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