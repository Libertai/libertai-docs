import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

export default defineConfig({
    markdown: {
        config: (md) => {
            md.use(tabsMarkdownPlugin)
        }
    },
    title: "LibertAI Documentation",
    description: "LibertAI.io official documentation",

    head: [
        ['link', {rel: 'icon', href: '/favicon.ico'}]
    ],

    // cleanUrls: true, TODO: Check if this can be enabled if deployed on Aleph
    lastUpdated: true,


    themeConfig: {
        siteTitle: false,
        logo: {light: '/logo_light.png', dark: '/logo_dark.png'},

        nav: [
            {text: 'Home', link: '/'},
            {text: 'APIs', link: '/apis/text/'},
            {text: 'Agents', link: '/agents'}
        ],

        sidebar: [
            {
                text: 'Introduction',
                collapsed: false,
                items: [
                    {text: 'What is LibertAI?', link: '/what-is-libertai'},
                    {text: 'Architecture', link: '/architecture'}
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
                        text: "x402 payments",
                        link: "/apis/x402",
                    },
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
            {icon: 'github', link: 'https://github.com/libertai'},
            {icon: 'x', link: 'https://x.com/Libertai_DAI'},
        ]
    }
})
