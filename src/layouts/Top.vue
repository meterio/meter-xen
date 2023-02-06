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
      <section v-if="!mobile">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-chip v-if="wallet.networkName" v-bind="props" link>{{ wallet.networkName }}</v-chip>
          </template>
          <v-card class="menu-container d-flex flex-column">
            <v-chip
              v-for="item in chains"
              :key="item.networkId"
              @click="setChain(item.networkId)"
              class="ma-1"
              link="">{{ item.name }}</v-chip>
          </v-card>
        </v-menu>
        <v-chip class="ml-2" @click="connect">
          <div v-if="shortAccount" class="d-flex">
            <span class="wallet-icon d-flex align-center" v-html="wallet.icon"></span>
            <span>{{ shortAccount }}</span>
          </div>
          <div v-else>No Wallet Connected</div>
        </v-chip>
      </section>
      <v-menu v-else>
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            v-bind="props"
            icon="mdi-dots-vertical"
          >
          </v-btn>
        </template>
        <v-card class="menu-container d-flex flex-column">
          <v-chip class="ma-1" v-if="wallet.networkName">{{ wallet.networkName }}</v-chip>
          <v-chip class="ma-1" @click="connect">
            <div v-if="shortAccount" class="d-flex">
              <span class="wallet-icon d-flex align-center" v-html="wallet.icon"></span>
              <span>{{ shortAccount }}</span>
            </div>
            <div v-else>No Wallet Connected</div>
          </v-chip>
        </v-card>
      </v-menu>
    </v-app-bar>
</template>

<script setup>
  import { useMintStore } from '@/store/mint'
  import { useStakeStore } from '@/store/stake'
  import { useWalletStore } from '@/store/wallet'
  import { storeToRefs } from 'pinia'
  import { computed, inject, ref } from 'vue'
  import { useRoute, useRouter } from "vue-router"
  import { useDisplay } from 'vuetify'
  import { chains } from '@/constants/chains'

  const setChain = inject('setChain')

  const mintStore = useMintStore()
  const stakeStore = useStakeStore()

  const { mobile } = useDisplay()
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
  } else if (route.path.includes('stake')) {
    linkValue.value = 1
  }

  const listenLinkValue = (link) => {
    linkValue.value = link
    // console.log(link)
    if (linkValue.value === 0) {
      mintStore.initData()

      router.push({
        name: 'MintStep1'
      })
    }

    if (linkValue.value === 1) {
      stakeStore.initData()

      router.push({
        name: 'StakeStep1'
      })
    }
  }

  const shortAccount = computed(() => {
    // console.log('wallet', wallet)
    if (wallet.value.account) {
      const account = wallet.value.account
      const short = `${account.substring(0, 6)}...${account.substring(account.length - 4, account.length)}`
      return short
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
  .menu-container {
    background-color: #fff;
  }
</style>