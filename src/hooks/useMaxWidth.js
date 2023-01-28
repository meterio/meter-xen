import { computed } from "vue"
import { useDisplay } from "vuetify"

export default () => {
  const { mobile } = useDisplay()

  let maxWidth = computed(() => {
    if (!mobile.value) {
      return 500
    } else {
      return null
    }
  })

  return maxWidth
}