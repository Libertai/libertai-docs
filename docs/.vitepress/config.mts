import {defineConfig} from 'vitepress'

export default defineConfig({
    title: "LibertAI Documentation",
    description: "LibertAI.io official documentation",

    head: [
        ['link', {rel: 'icon', href: '/favicon.ico'}]
    ],

    // cleanUrls: true, TODO: Check if this can be enabled if deployed on TwentySix
    lastUpdated: true,


    themeConfig: {
        siteTitle: false,
        logo: {light: '/logo_light.png', dark: '/logo_dark.png'},

        nav: [
            {text: 'Home', link: '/'},
            {text: 'APIs', link: '/apis/text-generation/'},
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
                        text: "Text Generation",
                        link: "/apis/text-generation/",
                        items: [
                            {text: "Available models", link: "/apis/text-generation/#available-models"},
                            {text: "Llama-like API", link: "/apis/text-generation/llama"},
                            {text: "OpenAI-compatible API", link: "/apis/text-generation/openai"},
                            {text: "Prompting styles", link: "/apis/text-generation/prompting"}
                        ]
                    },
                ]
            },
            {
                text: "Chat UI",
                collapsed: false,
                items: [
                    {
                        text: "Documents",
                        link: "/chat/documents",
                        items: [
                            {text: "Knowledge base", link: "/chat/documents/knowledge-base"},
                            {text: "Message attachment", link: "/chat/documents/message-attachment"},
                            {text: "Supported file types", link: "/chat/documents/file-types"}

                        ]
                    }
                ]
            },
            {
                text: "Agents",
                link: "/agents",
                collapsed: false,
                items: [
                    {
                        text: "Specifications",
                        link: "/agents/specifications"
                    }, {
                        text: "Guides",
                        link: "/agents/guides",
                        items: [
                            {text: "Getting started", link: "/agents/guides/general/getting-started"},
                            {text: "Custom deployment", link: "/agents/guides/advanced/custom-deployment"}
                        ]
                    }
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
            {icon: 'github', link: 'https://github.com/libertai'},
            {icon: 'x', link: 'https://x.com/Libertai_DAI'},
            // TODO: Add link to chat
        ]
    }
})
