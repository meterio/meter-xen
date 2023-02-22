/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerPlugins(app)

import MInput from '@/components/MInput'
import MPanel from '@/components/MPanel'
import MAlert from '@/components/MAlert'

app.component('m-input', MInput)
app.component('m-panel', MPanel)
app.component('m-alert', MAlert)

import { validate } from "@/utils"

window.mValidate = validate

app.mount('#app')
