<template>
  <div class="panel-container rounded-xl d-flex justify-space-between">
    <v-sheet
      rounded
      color="#ededed"
      v-for="(item, idx) in data"
      :key="idx"
      class="item-height py-2 px-4 d-flex flex-column justify-space-between"
      :class="(idx + 1) % 2 === 0 ? 'ml-2' : ''"
      :style="computedWidth">
      <div>
        <span class="my-text-color">{{ item.title }}</span>
        <v-tooltip
          v-if="item.tip"
          :text="item.tip"
        >
          <template v-slot:activator="{ props }">
            <v-icon class="ml-1" size="xsmall" v-bind="props" icon="mdi-information"></v-icon>
          </template>
        </v-tooltip>
      </div>
      <div class="d-flex justify-space-between">
        <span class="item-value">{{ item.value }}</span>
        <span class="d-flex align-center my-text-color">{{ item.name }}</span>
      </div>
    </v-sheet>
  </div>
</template>

<script setup>
  import { computed } from "vue"

  const props = defineProps({
    data: {
      type: Array,
      default() {
        return []
      }
    }
  })
  
  const computedWidth = computed(() => {
    if (props.data && props.data.length) {
      return {
        width: 100 / props.data.length + '%'
      }
    }
    return {}
  })
</script>

<style scoped>
  .item-height {
    height: 100px;
  }
  .item-value {
    font-size: 30px;
    font-weight: bold;
  }
</style>