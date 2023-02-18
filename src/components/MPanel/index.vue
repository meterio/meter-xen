<template>
  <div class="panel-container rounded-xl d-flex justify-space-between">
    <!-- <div class="w-50 item-height py-2 px-4 d-flex flex-column justify-space-between">
      <span class="text-subtitle-2">Claim rank</span>
      <div class="d-flex justify-space-between">
        <span class="item-value">567</span>
        <span class="d-flex align-center"></span>
      </div>
    </div>
    <div class="w-50 item-height pa-2 item-divider">
      <span class="title">Maturity</span>
      <div>
        <span class="value">39</span>
        <span class="name">days</span>
      </div>
    </div> -->
    <div
      v-for="(item, idx) in data"
      :key="idx"
      class="w-50 item-height py-2 px-4 d-flex flex-column justify-space-between"
      :class="(idx + 1) % 2 === 0 ? 'item-divider' : ''">
      <span class="text-subtitle-2">{{ item.title }}</span>
      <div class="d-flex justify-space-between">
        <span class="item-value">{{ item.value }}</span>
        <span class="d-flex align-center">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    data: {
      type: Array,
      default() {
        return []
      }
    }
  })
</script>

<style scoped>
  .panel-container {
    border: 1px solid black;
  }
  .item-height {
    height: 100px;
  }
  .item-value {
    font-size: 30px;
    font-weight: bold;
  }
  .item-divider {
    border-left: 1px solid black;
  }
</style>