<template>
  <div class="d-flex justify-center global-bg-color">
    <v-card :min-width="mobile ? '100%' : '600'" class="my-5 pa-2" rounded="pill" elevation="0" color="#0a2d1a">
      <v-row>
        <v-col cols="2" sm="3">
          <div class="d-flex align-center fill-height white-text">
            <!-- <h4>MeterMen</h4> -->
            <!-- <v-img v-if="!mobile" :height="40" src="/logo.svg"></v-img> -->
            <div :style="{ borderRadius: '100%', overflow: 'hidden' }">
              <v-img :width="30" :height="30" src="/icon.jpg"></v-img>
              
            </div>
            <h4 v-if="!mobile" class="font-italic">Transporter</h4>
          </div>
        </v-col>
        <v-col cols="8" sm="6">
          <div class="d-flex justify-center align-center fill-height">
            <v-slide-group v-model="model" @update:model-value="updateModel" center-active>
              <v-slide-group-item v-slot="{ isSelected, toggle }">
                <v-btn rounded="pill" color="my-color" :active="isSelected" @click="toggle" elevation="0">
                  Mint
                </v-btn>
              </v-slide-group-item>
              <v-slide-group-item v-slot="{ isSelected, toggle }">
                <v-btn rounded="pill" color="my-color ml-4" :active="isSelected" @click="toggle" elevation="0">
                  Stake
                </v-btn>
              </v-slide-group-item>
              <v-slide-group-item v-slot="{ isSelected, toggle }">
                <v-btn rounded="pill" color="my-color ml-4" :active="isSelected" @click="toggle" elevation="0">
                  MENFT
                </v-btn>
              </v-slide-group-item>
            </v-slide-group>
          </div>
        </v-col>
        <v-col cols="2" sm="3">
          <div class="d-flex justify-end align-center fill-height">
            <section v-if="!mobile">
              <v-menu v-if="!isSupport">
                <template v-slot:activator="{ props }">
                  <v-chip color="white" v-if="wallet.networkName" v-bind="props" link>
                    {{ wallet.networkName }}
                    <v-icon icon="mdi:mdi-chevron-down"></v-icon>
                  </v-chip>
                </template>
                <v-card class="menu-container d-flex flex-column">
                  <v-chip v-for="item in chains" :key="item.networkId" @click="setChain(item.networkId)" class="ma-1"
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
                <v-btn color="white" v-bind="props" icon="mdi:mdi-dots-vertical" variant="plain">
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
import { useMenftStore } from '@/store/menft'
import { storeToRefs } from 'pinia'
import { computed, inject, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from "vue-router"
import { useDisplay } from 'vuetify'
import { chains } from '@/constants/chains'

const setChain = inject('setChain')

const mintStore = useMintStore()
const stakeStore = useStakeStore()
const menftStore = useMenftStore()

const { mobile } = useDisplay()
const router = useRouter()
const route = useRoute()

const walletStore = useWalletStore()
const { wallet } = storeToRefs(walletStore)

if (route.path === '/') {
  router.push({
    name: 'MintStep1'
  })
}

// --------------------------------------------
const model = ref(null)
const splitPath = route.path.split('/')
if (splitPath.includes('mint')) {
  model.value = 0
} else if (splitPath.includes('stake')) {
  model.value = 1
} else if (splitPath.includes('menft')) {
  model.value = 2
} else {
  model.value = 0
}

const goMint = () => {
  mintStore.initData()
  router.push({
    name: 'MintStep1'
  })
}
const goStake = () => {
  stakeStore.initData()
  router.push({
    name: 'StakeStep1'
  })
}
const goMENFT = () => {
  menftStore.initData()
  router.push({
    name: 'MintMENFT'
  })
}

const updateModel = (model) => {
  switch (model) {
    case 0:
      goMint()
      break;
    case 1:
      goStake()
      break;
    case 2:
      goMENFT()
      break;
    default:
      break;
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
.wallet-icon> :deep svg,
img {
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