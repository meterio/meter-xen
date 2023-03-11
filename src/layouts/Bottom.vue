<template>
  <div class="d-flex justify-center global-bg-color">
    <v-btn
      class="mx-6 mb-2"
      size="x-small"
      icon
      color="lightGray"
      v-for="item in dataList"
      :key="item.name"
      @click="jump(item.link)"
    >
      <v-icon>{{ item.icon }}</v-icon>
    </v-btn>
  </div>
</template>

<script setup>
  const dataList = [
    {
      name: "docs",
      icon: "mdi:mdi-file-document",
      link: "https://docs.metermen.org/"
    },
    {
      name: "github",
      icon: "mdi:mdi-github",
      link: "https://github.com/meterio/MEN-Crypto"
    },
    {
      name: "twitter",
      icon: "mdi:mdi-twitter",
      link: "https://t.me/Meter_IO"
    },
    {
      name: "telegram",
      icon: "fab fa-telegram",
      link: "https://twitter.com/Meter_IO"
    }
  ]

  const jump = (link) => {
    window.open(link)
  }
</script>