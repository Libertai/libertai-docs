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
      { text: 'APIs', link: '/apis/text-generation/' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        collapsed: false,
        items: [
          { text: 'What is Libertai?', link: '/what-is-libertai' },
          { text: 'Architecture', link: '/architecture' }
        ],
      },
      {
        text: "APIs",
        collapsed: false,
        link: "/apis/",
        items: [
          {
            text: "Text Generation",
            link: "/apis/text-generation/",
            items: [
              { text: "Available models", link: "/apis/text-generation/#available-models" },
              { text: "Llama-like API", link: "/apis/text-generation/llama" },
              { text: "OpenAI-compatible API", link: "/apis/text-generation/openai" },
              { text: "Prompting styles", link: "/apis/text-generation/prompting" }
            ]
          },
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
