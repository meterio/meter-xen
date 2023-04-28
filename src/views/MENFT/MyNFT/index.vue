<template>
  <v-card elevation="6" class="pa-4 my-4 white-bg" :class="{'mx-6': !mobile}">
    <v-table>
      <thead>
        <tr>
          <th v-for="item in headers" :key="item.value" class="text-left">
            {{ item.text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in nftInfos"
          :key="item.name"
        >
          <td v-for="h in headers" :key="h.value">
            <span v-if="h.text === 'Image'">
              <img :src="item[h.value]" alt="">
            </span>
            <span v-else-if="h.text === 'Actions'">
              <v-btn
                :disabled="getIsDisabled(item)"
                density="compact"
                variant="outlined"
                color="primary"
                @click="clickActionsBtn(h.value, item)">{{ h.value }}</v-btn>
            </span>
            <span v-else-if="h.text === 'Redeemed'">{{ item[h.value] ? 'YES' : 'NO' }}</span>
            <span v-else>{{ item[h.value] }}</span>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup>
  import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue"
  import { useMyNFTStore } from "@/store/mynft"
  import { storeToRefs } from "pinia"
  import { useDisplay } from 'vuetify'

  const { mobile } = useDisplay()

  const myNFTStore = useMyNFTStore()
  const { nftInfos } = storeToRefs(myNFTStore)

  let alertInfo = reactive({
    type: '',
    msg: ''
  })

  onMounted(() => {
    myNFTStore.initData()
  })

  const headers = [
    {
      text: 'Name',
      value: 'name'
    },{
      text: 'Image',
      value: 'image'
    },{
      text: 'VMUs',
      value: 'VMUs'
    },{
      text: 'Term(days)',
      value: 'Term'
    },{
      text: 'Matures date',
      value: 'Maturity DateTime'
    },{
      text: 'cRank',
      value: 'cRank'
    },{
      text: 'AMP',
      value: 'AMP'
    },{
      text: 'EAA(%)',
      value: 'EAA (%)'
    },{
      text: 'Redeemed',
      value: 'redeemed'
    },{
      text: 'EstimateMEN',
      value: 'reward'
    },{
      text: 'Actions',
      value: 'claim'
    },
  ]

  const clickActionsBtn = (action, token) => {
    myNFTStore.bulkClaimMintReward(token.tokenId)
  }
  const getIsDisabled = (token) => {
    return new Date(token['Maturity DateTime']).getTime() > Date.now() || token['redeemed']
  }
</script>

<style scoped>

</style>