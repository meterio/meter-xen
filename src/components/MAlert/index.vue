<template>
  <div v-if="!!msg">
    <v-alert :icon="false" class="py-2" rounded="pill" :type="type">{{ msg }}</v-alert>
  </div>
</template>

<script setup>
  defineProps(['type', 'msg'])
</script>