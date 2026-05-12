import type { Theme } from 'vitepress'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ModelsPricing from './components/ModelsPricing.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
    app.component('ModelsPricing', ModelsPricing)
  }
} satisfies Theme
