<template>
  <v-app>
    <top-page />
    <default-view />
    <!-- <bottom-page /> -->
    <v-snackbar
      v-if="txinfos.length"
      v-model="snackbar"
      timeout="-1"
      location="top right"
    >
      <!-- mdi-loading -->
      <v-list-item
        v-for="item in txinfos"
        :key="item.id"
        :prepend-icon="getIcon(item.status)">
        <div class="d-flex justify-space-between">
          <span class="d-flex align-center">{{ item.title }}</span>
          <v-btn
            v-if="item.hash"
            color="pink"
            variant="text"
            @click="viewScan(item.hash)"
          >
            View
          </v-btn>
        </div>
      </v-list-item>
    </v-snackbar>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'
  import { useTxinfoStore } from '@/store/txinfo'
  import TopPage from './Top.vue'
  // import BottomPage from './Bottom.vue'
  import DefaultView from './View.vue'
  import { storeToRefs } from 'pinia'
  import { useWalletStore } from '@/store/wallet'
  import { chains } from '@/constants/chains'
  const walletStore = useWalletStore()

  const { wallet } = storeToRefs(walletStore)
  const snackbar = ref(true)
  
  const txinfoStore = useTxinfoStore()
  const { txinfos } = storeToRefs(txinfoStore)

  const getIcon = (status) => {
    if (status === 'pending') {
      return 'mdi:mdi-loading'
    } else if(status === 'error') {
      return 'mdi:mdi-close'
    } else {
      return 'mdi:mdi-check-bold'
    }
  }

  const viewScan = (hash) => {
    const chain = chains.find(c => c.networkId === wallet.value.networkId)
    if (chain) {
      window.open(`${chain.blockExplorer}/tx/${hash}`)
    }
  }
</script>
