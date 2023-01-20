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
