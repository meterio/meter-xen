<template>
  <div class="d-flex">
    <div class="m-input-container w-100">
      <input
        class="w-100"
        :style="computedMyInput"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
    <div v-if="isMax" class="d-flex align-end">
      <v-btn
        rounded="pill"
        variant="text"
        @click="max"
      >
        <span class="my-text-color" :style="computedMaxBtn">Max</span>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
  import { validate } from "@/utils"
  import { computed } from "vue"
  const props = defineProps(['modelValue', 'max', 'plain', 'color'])
  const emits = defineEmits(['update:modelValue', 'blur'])

  const computedMyInput = computed(() => {
    if (!!!props.plain) {
      return {
        height: '60px',
        fontWeight: 'bold',
        fontSize: '50px',
        color: `${props.color} !important` || ''
      }
    }
    return {
      height: '40px',
    }
  })

  const computedMaxBtn = computed(() => {
    return {
      color: `${props.color} !important` || ''
    }
  })

  const isMax = computed(() => props.max !== undefined)
  const max = () => {
    emits('update:modelValue', props.max)
  }
</script>

<style scoped>
  .m-input-container {
    position: relative;
  }
  input:focus {
    outline: none !important;
  }
</style>
