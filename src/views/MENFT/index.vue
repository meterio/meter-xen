<template>
  <v-container class="fill-height d-flex align-center justify-center px-0">
    <v-responsive
      :max-width="maxWidth"
      class="fill-height">

      <router-view />

      <bottom-page />

    </v-responsive>
  </v-container>
</template>

<script setup>
  import BottomPage from '@/layouts/Bottom.vue'
  import useMaxWidth from "@/hooks/useMaxWidth"

  const maxWidth = useMaxWidth()
</script>