<template>
  <div class="m-input-container">
    <input
      class="my-input text-center"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span class="suffix-name">
      <slot>days</slot>
    </span>
  </div>
  <div>
    <v-btn
      rounded="pill"
      variant="outlined"
      @click="max"
    >
      Max
    </v-btn>
  </div>
</template>

<script setup>
  import { validate } from "@/utils"
  const props = defineProps(['modelValue', 'max'])
  const emits = defineEmits(['update:modelValue'])

  const max = () => {
    emits('update:modelValue', props.max)
  }
</script>

<style scoped>
  .m-input-container {
    position: relative;
  }
  .my-input {
    font-weight: bold;
    font-size: 60px;
    width: 120px;
  }
  .my-input:focus {
    outline: none !important;
  }
  .suffix-name {
    position: absolute;
    bottom: 20px;
  }
</style>
