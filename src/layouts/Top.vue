<template>
    <div class="d-flex justify-center global-bg-color">
      <v-card
        :min-width="mobile ? '100%' : '600'"
        class="my-5 pa-2"
        rounded="pill"
        elevation="0"
        color="#0a2d1a">
        <v-row>
          <v-col>
            <div class="d-flex align-center fill-height white-text">
              <!-- <h4>MeterMen</h4> -->
              <v-img
                :width="50"
                :height="40"
                src="/logo.svg"
              ></v-img>
            </div>
          </v-col>
          <v-col>
            <div class="d-flex justify-center align-center fill-height">
              <v-btn
                rounded="pill"
                color="my-color"
                :active="mintBtnActive"
                @click="goMint"
                elevation="0"
              >
                Mint
              </v-btn>
              <v-btn
                rounded="pill"
                color="my-color ml-4"
                :active="stakeBtnActive"
                @click="goStake"
                elevation="0"
              >
                Stake
              </v-btn>
            </div>
          </v-col>
          <v-col>
            <div class="d-flex justify-end align-center fill-height">
              <section v-if="!mobile">
                <v-menu  v-if="!isSupport">
                  <template v-slot:activator="{ props }">
                    <v-chip color="white" v-if="wallet.networkName" v-bind="props" link>
                      {{ wallet.networkName }}
                      <v-icon icon="mdi-chevron-down"></v-icon>
                    </v-chip>
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
                <v-chip v-else link color="myConnectWalletColor" class="ml-2" @click="connect">
                  <div v-if="shortAccount">
                    <section class="d-flex align-center">
                      <span class="wallet-icon d-flex align-center" v-html="wallet.icon"></span>
                      <span>{{ shortAccount }}</span>
                    </section>
                  </div>
                  <div v-else>Connect wallet</div>
                </v-chip>
              </section>
              <v-menu v-else>
                <template v-slot:activator="{ props }">
                  <v-btn
                    color="white"
                    v-bind="props"
                    icon="mdi-dots-vertical"
                    variant="plain"
                  >
                  </v-btn>
                </template>
                <v-card class="menu-container d-flex flex-column">
                  <v-chip class="ma-1" v-if="wallet.networkName">{{ wallet.networkName }}</v-chip>
                  <v-chip link class="ma-1" @click="connect">
                    <div v-if="shortAccount" class="d-flex">
                      <span class="wallet-icon d-flex align-center" v-html="wallet.icon"></span>
                      <span>{{ shortAccount }}</span>
                    </div>
                    <div v-else>Connect wallet</div>
                  </v-chip>
                </v-card>
              </v-menu>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </div>
</template>

<script setup>
  import { useMintStore } from '@/store/mint'
  import { useStakeStore } from '@/store/stake'
  import { useWalletStore } from '@/store/wallet'
  import { storeToRefs } from 'pinia'
  import { computed, inject, ref, watch, watchEffect } from 'vue'
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

  // --------------------------------------------
  const mintBtnActive = ref(false)
  const stakeBtnActive = ref(false)

  if (route.path.includes('mint')) {
    mintBtnActive.value = true
  }

  if (route.path.includes('stake')) {
    stakeBtnActive.value = true
  }

  watchEffect(() => {
    if (mintBtnActive.value) {
      stakeBtnActive.value = false
    }
  })
  watchEffect(() => {
    if (stakeBtnActive.value) {
      mintBtnActive.value = false
    }
  })

  const goMint = () => {
    mintBtnActive.value = true
    router.push({
      name: 'MintStep1'
    })
  }
  const goStake = () => {
    stakeBtnActive.value = true
    router.push({
      name: 'StakeStep1'
    })
  }
  // --------------------------------------------

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

  const isSupport = computed(() => {
    const chain = chains.find(c => c.networkId === wallet.value.networkId)
    return !!chain
  })

  const shortAccount = computed(() => {
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
  :deep .v-img__img {
    width: auto !important;
  }
</style>