<template>
  <router-view />
</template>

<script setup>
  import { provide } from 'vue';
  import useWallet from '@/hooks/useWallet'

  const { connectWallet, setChain } = useWallet()

  provide('connectWallet', connectWallet)
  provide('setChain', setChain)
</script>

<style>
  .global-bg-color {
    background-color: #f9f9f9;
  }
  .v-btn {
    text-transform: none !important;
  }
  .text-my-color.v-btn--active {
    background-color: white;
    color: #5CE199;
  }
  .bg-my-color {
    background-color: #0a2d1a !important;
    color: white !important;
  }
  .bg-my-color.v-btn--active {
    background-color: white !important;
    color: #5CE199 !important;
  }
  .text-myConnectWalletColor {
    background-color: #5ce199 !important;
  }
  .border-bottom-black-color {
    border-bottom: 1px solid black !important;
  }
  .black-border {
    border: 1px solid black !important;
  }
  .white-bg {
    background-color: white !important;
  }
  .white-text {
    color: white !important;
  }
  .my-text-color {
    color: #808080;
  }
</style>
