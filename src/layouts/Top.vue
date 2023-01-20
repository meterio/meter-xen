<template>
  <v-app-bar
      class="px-3"
      color="white"
      flat
      density="compact"
    >
      <v-avatar
        size="32"
      >
        <v-img src="/meter.png"></v-img>
      </v-avatar>

      <v-spacer></v-spacer>

      <v-tabs
        centered
        color="grey-darken-2"
        :model-value="linkValue"
        @update:modelValue="listenLinkValue"
      >
        <v-tab
          v-for="link in links"
          :key="link"
        >
          {{ link }}
        </v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
      <v-chip v-if="wallet.networkName">{{ wallet.networkName }}</v-chip>
      <v-chip class="ml-2" @click="connect">
        <div v-if="shortAccount" class="d-flex">
          <span class="wallet-icon d-flex align-center" v-html="wallet.icon"></span>
          <span>{{ shortAccount }}</span>
        </div>
        <div v-else>NO CONNECT</div>
      </v-chip>
    </v-app-bar>
</template>

<script setup>
  import { useWalletStore } from '@/store/wallet'
  import { storeToRefs } from 'pinia'
  import { computed, inject, ref } from 'vue'
  import { useRoute, useRouter } from "vue-router"
  const router = useRouter()
  const route = useRoute()
  
  const walletStore = useWalletStore()
  const { wallet } = storeToRefs(walletStore)
  
  const links = ["mint", "stake"]

  const linkValue = ref(0)

  if (route.path === '/') {
    router.push({
      name: 'MintStep1'
    })
  }

  const listenLinkValue = (link) => {
    linkValue.value = link
    console.log(link)
    if (linkValue.value === 0) {
      router.push({
        name: 'MintStep1'
      })
    }

    if (linkValue.value === 1) {
      router.push({
        name: 'StakeStep1'
      })
    }
  }

  const shortAccount = computed(() => {
    // console.log('wallet', wallet)
    if (wallet.value.account) {
      const account = wallet.value.account
      return `${account.substring(0, 6)}...${account.substring(account.length - 4, account.length)}`
    } else {
      return ''
    }
  })

  const connect = inject('connectWallet')
</script>

<style scoped>
  .wallet-icon > :deep svg,img {
    width: 20px !important;
    height: 20px !important;
  }
</style>