import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Libertai Documentation",
  description: "Libertai.io official documentation",

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  // cleanUrls: true, TODO: Check if this can be enabled if deployed on TwentySix
  lastUpdated: true,


  themeConfig: {
    siteTitle: false,
    logo: { light: '/logo_light.png', dark: '/logo_dark.png'}, // TODO: Replace light logo with a version with spaces removed

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    editLink: {
      pattern: 'https://github.com/libertai/libertai-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/libertai' },
      { icon: 'x', link: 'https://x.com/Libertai_DAI' },
      // TODO: Add link to chat
    ]
  }
})
