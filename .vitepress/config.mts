import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

export default defineConfig({
    markdown: {
        config: (md) => {
            md.use(tabsMarkdownPlugin)
        }
    },
    title: "LibertAI Documentation",
    description: "Decentralized, private AI on Aleph Cloud — OpenAI-compatible text, image, and search APIs, plus autonomous agents.",
    lang: 'en-US',

    head: [
        ['link', {rel: 'icon', href: '/favicon.ico'}],
        ['meta', {name: 'theme-color', content: '#644DF9'}],
        ['meta', {property: 'og:type', content: 'website'}],
        ['meta', {property: 'og:site_name', content: 'LibertAI Documentation'}],
        ['meta', {property: 'og:image', content: 'https://docs.libertai.io/assets/home.png'}],
        ['meta', {property: 'og:title', content: 'LibertAI Documentation'}],
        ['meta', {property: 'og:description', content: 'Decentralized, private AI on Aleph Cloud — OpenAI-compatible APIs and autonomous agents.'}],
        ['meta', {name: 'twitter:card', content: 'summary_large_image'}],
        ['meta', {name: 'twitter:site', content: '@Libertai_DAI'}],
        ['meta', {name: 'twitter:image', content: 'https://docs.libertai.io/assets/home.png'}],
        ['script', {defer: '', src: 'https://analytics-01.testnet.network/script.js', 'data-website-id': '1060ebb7-81d2-4b7a-b14d-b837e8ccc6ea'}]
    ],

    // cleanUrls: true, TODO: Check if this can be enabled if deployed on Aleph
    lastUpdated: true,


    themeConfig: {
        siteTitle: false,
        logo: {light: '/logo_light.png', dark: '/logo_dark.png'},

        nav: [
            {text: 'Home', link: '/'},
            {text: 'Quickstart', link: '/quickstart'},
            {text: 'APIs', link: '/apis/text/'},
            {text: 'Agents', link: '/agents/'},
            {text: 'Console', link: 'https://console.libertai.io'},
        ],

        sidebar: [
            {
                text: 'Introduction',
                collapsed: false,
                items: [
                    {text: 'What is LibertAI?', link: '/what-is-libertai'},
                    {text: 'Quickstart', link: '/quickstart'},
                    {text: 'Architecture', link: '/architecture'},
                ],
            },
            {
                text: 'Concepts',
                collapsed: false,
                items: [
                    {text: 'Trust model & TEE', link: '/concepts/trust-model'},
                ],
            },
            {
                text: "APIs",
                collapsed: false,
                link: "/apis/",
                items: [
                    {
                        text: "Text",
                        link: "/apis/text/",
                        items: [
                            {text: "Available models", link: "/apis/text/#available-models"},
                            {text: "Pricing", link: "/apis/text/#pricing"},
                            {text: "Usage", link: "/apis/text/usage"},
                        ]
                    },
                    {
                        text: "Image",
                        link: "/apis/image/",
                        items: [
                            {text: "Available models", link: "/apis/image/#available-models"},
                            {text: "Pricing", link: "/apis/image/#pricing"},
                            {text: "Usage", link: "/apis/image/#usage-examples"},
                        ]
                    },
                    {
                        text: "Search",
                        link: "/apis/search/",
                        items: [
                            {text: "Available providers", link: "/apis/search/#available-models"},
                            {text: "Pricing", link: "/apis/search/#pricing"},
                            {text: "Usage", link: "/apis/search/usage"},
                        ]
                    },
                    {
                        text: "x402 payments",
                        link: "/apis/x402",
                    },
                ]
            },
            {
                text: "Agents",
                collapsed: false,
                link: "/agents/",
                items: [
                    {text: "Getting started", link: "/agents/getting-started"},
                    {text: "Deployment", link: "/agents/deployment"},
                ]
            },
        ],

        editLink: {
            pattern: 'https://github.com/libertai/libertai-docs/edit/main/:path',
            text: 'Edit this page on GitHub'
        },

        search: {
            provider: 'local'
        },

        socialLinks: [
            {icon: 'github', link: 'https://github.com/Libertai'},
            {icon: 'x', link: 'https://x.com/Libertai_DAI'},
            {
                icon: {
                    svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Telegram</title><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.464.139a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
                },
                link: 'https://t.me/libertai',
                ariaLabel: 'Telegram',
            },
        ],

        footer: {
            message: 'Released under the MIT License.',
            copyright: '© LibertAI · <a href="https://console.libertai.io">Console</a> · <a href="https://chat.libertai.io">Chat</a> · <a href="https://liberclaw.ai">LiberClaw</a>',
        },
    }
})
