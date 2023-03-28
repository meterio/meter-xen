<template>
  <v-card elevation="6" class="pa-4 my-4 white-bg" :class="{'mx-6': !mobile}" :style="backgroundImage">
    <v-card-title class="pl-0 white-text">New MENFT <span v-if="!!nextNFTNum">#{{ nextNFTNum }}</span></v-card-title>

    <m-alert :type="alertInfo.type" :msg="alertInfo.msg"></m-alert>

    <section class="mt-5">
      <div class="white-text">
        <span>VMU count</span>
        <v-tooltip size="small" location="bottom" max-width="400" text="VMU (virtual minting unit) is a virtual wallet created by smart contract and controlled by you through the same contract. No-one has the keys to these wallets; access to them is controlled by MENFT that you receive. Actual possible count of VMUs is determined by the network block gas limit">
          <template v-slot:activator="{ props }">
            <v-icon size="small" v-bind="props" icon="mdi:mdi-help-circle-outline"></v-icon>
          </template>
        </v-tooltip>
      </div>
      <v-sheet
        rounded
        class="mx-auto w-100 pa-2 mt-1"
        color="transparent"
        border
      >

        <m-input v-model="VMUCount" :max="maxVMUCount" color="white" />
      </v-sheet>
    </section>

    <section class="mt-5">
      <div class="white-text d-flex justify-space-between">
        <span>Term, days</span>
        <!-- <v-btn icon size="xsmall" @click="switchInputTermMode">
          <v-icon v-if="isDatepicker" icon="mdi:mdi-clock-outline"></v-icon>
          <span v-else :style="{width: '25px'}">#</span>
        </v-btn> -->
      </div>
      <v-sheet
        rounded
        class="mx-auto w-100 pa-2 mt-1"
        color="transparent"
        border
      >

        <m-input v-model="term" :max="maxTerm" color="white" />
      </v-sheet>
    </section>

    <section class="mt-5">
      <div class="white-text">
        <span>Category</span>
      </div>
      <v-sheet
        rounded
        class="mx-auto w-100 pa-2 mt-1"
        color="transparent"
        border
      >
        <v-select
          label=""
          v-model="category"
          :items="categoryItems"
          bg-color="transparent"
          class="white-text"
          hide-details
        ></v-select>
      </v-sheet>
    </section>

    <section v-if="category !== 'Limited'" class="mt-5">
      <div class="white-text">
        <span>{{ classLabel }}</span>
        <span v-if="!!left">({{ left }} left)</span>
      </div>
      <v-sheet
        rounded
        class="mx-auto w-100 pa-2 mt-1"
        color="transparent"
        border
      >
        <v-select
          label=""
          v-model="nftClass"
          :items="nftClassItems"
          bg-color="transparent"
          class="white-text"
          hide-details
        ></v-select>
      </v-sheet>
    </section>

    <template v-if="['Apex', 'Limited'].includes(category)">
      <section class="mt-5">
        <div class="white-text">
          <span>MEN to burn</span>
          <v-tooltip size="small" location="bottom" max-width="400" text="This Category requires burning of MEN tokens to mint MENFT. MENFT minting function will be inactive until you bought or minted enough MEN">
            <template v-slot:activator="{ props }">
              <v-icon size="small" v-bind="props" icon="mdi:mdi-help-circle-outline"></v-icon>
            </template>
          </v-tooltip>
        </div>
        <v-sheet
          rounded
          class="mx-auto w-100 pa-2 mt-1"
          color="transparent"
          border
        >

          <m-input v-model="menToBurn" :max="xenAmount" @blur="burnInputBlur" color="white" />
        </v-sheet>
      </section>

      <section class="mt-5 d-flex justify-space-between">
        <div class="white-text">
          <span>Approved MEN</span>
          <v-tooltip location="bottom" max-width="400" text="This Category requires burning of MEN tokens. Approval to burn is required prior to minting. Default approval amount is 10B MEN; you can adjust this amount in your wallet while approving">
            <template v-slot:activator="{ props }">
              <v-icon size="small" v-bind="props" icon="mdi:mdi-help-circle-outline"></v-icon>
            </template>
          </v-tooltip>
        </div>
        <div>
          <span class="white-text">{{ approvedMEN }}</span>
        </div>
      </section>
    </template>
    <v-btn
      block
      size="large"
      class="my-4"
      color="black"
      @click="startAction"
      :loading="false"
      :disabled="false"
      rounded="pill"
    >
      <span>{{ optName }}</span>
    </v-btn>
  </v-card>
</template>

<script setup>
  import { computed, reactive, ref, watch, watchEffect } from "vue"
  import { useMenftStore } from "@/store/menft"
  import { storeToRefs } from "pinia"
  import { useDisplay } from 'vuetify'

  const { mobile } = useDisplay()

  const menftStore = useMenftStore()
  const { maxTerm, limitedCatetoryTimeThreshold, xenAmount, approvedMEN, genesisTs, error } = storeToRefs(menftStore)

  let alertInfo = reactive({
    type: '',
    msg: ''
  })

  watchEffect(() => {
    if (!!error.value) {
      alertInfo.type = 'error'
      alertInfo.msg = error
    }
  })

  const VMUCount = ref("128")
  const maxVMUCount = "128"
  watch(VMUCount, (val) => {
    if (Number(val) <= 0) {
      setTimeout(() => {
        VMUCount.value = 1
      }, 1);
    } else if (Number(val) > Number(maxVMUCount)) {
      setTimeout(() => {
        VMUCount.value = maxVMUCount
      }, 1);
    }
  })

  const isDatepicker = ref(true)
  const switchInputTermMode = () => {
    isDatepicker.value = !isDatepicker.value
  }

  const term = ref(0)
  watchEffect(() => {
    term.value = maxTerm.value 
  })
  watch(term, (val) => {
    if (Number(val) <= 0) {
      setTimeout(() => {
        term.value = 1
      }, 1);
    } else if (Number(val) > maxTerm.value) {
      setTimeout(() => {
        term.value = maxTerm.value
      }, 1);
    }
  })

  const apeList = [{
    name: 'Rare',
    minMen: '500000000',
    maxMen: '999999999',
    tier: '2'
  }, {
    name: 'Epic',
    minMen: '1000000000',
    maxMen: '2499999999',
    tier: '3'
  }, {
    name: 'Legendary',
    minMen: '2500000000',
    maxMen: '4999999999',
    tier: '4'
  }, {
    name: 'Exotic',
    minMen: '5000000000',
    maxMen: '9999999999',
    tier: '5'
  }, {
    name: 'Xunicorn',
    minMen: '10000000000',
    maxMen: Infinity,
    tier: '6'
  }]
  const limitedList = [
    {
      name: 'Limited',
      minMen: '250000000',
      maxMen: '499999999'
    }
  ]
  const collectorList = [{
    name: 'Ruby',
    minVmuMulTerm: '0',
    maxVmuMulTerm: '7499',
    image: 'linear-gradient(145deg, red, black)'
  }, {
    name: 'Opal',
    minVmuMulTerm: '7500',
    maxVmuMulTerm: '14990',
    image: 'linear-gradient(145deg, darkorange, red)'
  }, {
    name: 'Topaz',
    minVmuMulTerm: '15000',
    maxVmuMulTerm: '22499',
    image: 'linear-gradient(145deg, rgb(150, 126, 0), darkorange)'
  }, {
    name: 'Emerald',
    minVmuMulTerm: '22500',
    maxVmuMulTerm: '29999',
    image: 'linear-gradient(145deg, green, rgb(150, 126, 0))'
  }, {
    name: 'Aquamarine',
    minVmuMulTerm: '30000',
    maxVmuMulTerm: '37499',
    image: 'linear-gradient(145deg, darkcyan, green)'
  }, {
    name: 'Sapphire',
    minVmuMulTerm: '37500',
    maxVmuMulTerm: '44999',
    image: 'linear-gradient(145deg, blue, darkcyan)'
  }, {
    name: 'Amethyst',
    minVmuMulTerm: '45000',
    maxVmuMulTerm: '52499',
    image: 'linear-gradient(145deg, magenta, blue)'
  }, {
    name: 'Menturion',
    minVmuMulTerm: '52500',
    maxVmuMulTerm: Infinity,
    image: 'linear-gradient(145deg, black, darkmagenta)'
  }]
  const categoryObj = {
    Apex: apeList,
    Limited: limitedList,
    Collector: collectorList
  }
  const categoryItems = Object.keys(categoryObj)
  const category = ref(categoryItems[0])

  const nftClassItems = computed(() => {
    const list = categoryObj[category.value]
    return list.map(l => l.name)
  })

  const backgroundImage = computed(() => {
    if (category.value === 'Apex') {
      return {
        backgroundImage: 'linear-gradient(145deg, magenta 10%, rgb(29, 115, 201) 50%, rgb(29, 201, 169) 90%)'
      }
    } else if (category.value === 'Limited') {
      return {
        backgroundImage: 'linear-gradient(145deg, rgb(249, 186, 35), rgb(62, 30, 115))'
      }
    } else if (category.value === 'Collector') {
      const classVal = collectorList.find(c => c.name === nftClass.value)
      return {
        backgroundImage: classVal.image
      }
    }
  })

  const classLabel = computed(() => {
    if (category.value === 'Apex') {
      if (!left.value) {
        return 'Sold Out'
      }
    }
    return 'Class'
  })

  const nftClass = ref('')
  const menToBurn = ref(0)

  const left = ref(0)
  const nextNFTNum = ref(0)

  watchEffect(async () => {
    if (category.value === 'Apex') {
      nftClass.value = nftClassItems.value[0]

      // console.log(categoryObj['Apex'])
      const categoryList = categoryObj['Apex']
      // console.log(categoryList.find(c => c.name === nftClass.value))
      console.log('nftClass.value', nftClass.value)
      const nftClassVal = categoryList.find(c => c.name === nftClass.value)
      console.log('nftClassVal', nftClassVal.minMen)
      menToBurn.value = nftClassVal.minMen

      const { limits, counters } = await menftStore.getNFTLeft(nftClassVal.tier)
      // console.log({limits, counters})
      // todo: check class is soldout?
      left.value = limits - counters
      nextNFTNum.value = counters + 1
    }
    // console.log('category.value', category.value)
    if (category.value === 'Collector') {
      // console.log('nftClass.value', nftClass.value)
      if (nftClass.value) {}
      left.value = 0
      nextNFTNum.value = 0
      const categoryList = categoryObj['Collector']
      // console.log('categoryList', categoryList)
      const aim = categoryList.find(c => {
        const vmuMulTerm = Number(VMUCount.value) * Number(term.value)
        return vmuMulTerm >= Number(c.minVmuMulTerm) && vmuMulTerm <= Number(c.maxVmuMulTerm)
      })
      // console.log('aim', aim)
      if (aim) {
        nftClass.value = aim.name
      } else {
        nftClass.value = ''
      }
    }
    if (category.value === 'Limited') {
      left.value = 0
      nextNFTNum.value = 0
      const categoryList = categoryObj['Limited']
      // console.log('categoryList', categoryList)
      const aim = categoryList[0]
      nftClass.value = aim.name

      // const categoryList = categoryObj['Limited']
      // const nftClassVal = categoryList[0]
      menToBurn.value = aim.minMen
    }
  })

  const burnInputBlur = () => {
    if (category.value !== 'Collector') {
      const classVal = categoryObj[category.value].find(c => c.name === nftClass.value)
      console.log('classVal', classVal)
      if (Number(menToBurn.value) < Number(classVal.minMen) || Number(menToBurn.value) > Number(classVal.maxMen)) {
        console.log(Number(menToBurn.value) < Number(classVal.minMen))
        console.log(Number(menToBurn.value) > Number(classVal.maxMen))
        setTimeout(() => {
          menToBurn.value = classVal.minMen
        }, 1000);
      }
    }
  }

  const optName = computed(() => {
    if (category.value !== 'Collector') {
      const categoryList = categoryObj[category.value]
      const nftClassVal = categoryList.find(c => c.name === nftClass.value)
      const minMen = nftClassVal.minMen
      // console.log('nft class val', nftClassVal)
      
      if (Number(minMen) > Number(approvedMEN.value)) {
        return 'Approve MEN'
      } else {
        return 'Mint MENFT'
      }
    } else {
      return 'Mint MENFT'
    }
  })

  const startAction = () => {
    if (optName.value === 'Approve MEN') {
      menftStore.approveMEN(menToBurn.value)
    }
    if (optName.value === 'Mint MENFT') {
      if (category.value === 'Collector'){
        menftStore.bulkClaimRank(VMUCount.value, term.value)
      }
      if (category.value === 'Apex') {
        // todo: check menToBurn balance
        menftStore.bulkClaimRankLimited(VMUCount.value, term.value, menToBurn.value)
      }
      if (category.value === 'Limited') {
        // todo: check menToBurn balance
        // todo: check block.timestamp < genesisTs + LIMITED_CATEGORY_TIME_THRESHOLD(1 year)
        const doTime = genesisTs.value + limitedCatetoryTimeThreshold.value
        const doTimeRules = [
          v => v < doTime || `Date limit exceeded}`
        ]
        const valid = mValidate(doTimeRules, Date.now() / 1000)

        if (!valid.status) {
          alertInfo.type = 'warning'
          alertInfo.msg = valid.msg
        } else {
          alertInfo.msg = ''
          menftStore.bulkClaimRankLimited(VMUCount.value, term.value, menToBurn.value)
        }
      }
    }
  }
</script>

<style scoped>

</style>