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
    background-color: #fafafa;
  }
  .v-btn {
    text-transform: none !important;
  }
  .text-my-color.v-btn--active {
    background-color: black;
    color: white;
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
</style>
