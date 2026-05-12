---
layout: home

hero:
  name: LibertAI
  tagline: Private AI Secured by Blockchain
  actions:
    - theme: brand
      text: Get started
      link: /quickstart
    - theme: alt
      text: What is LibertAI?
      link: /what-is-libertai
    - theme: alt
      text: APIs
      link: /apis/
  image:
    src: /assets/home.png
    alt: LibertAI


features:
  - title: Private by Design
    icon: 🔒
    details: Optional Trusted Execution Environments isolate inference from operators — no logs, no training on your conversations.
    link: /concepts/trust-model
    linkText: How privacy works
  - title: Text & Vision APIs
    icon: 💬
    details: OpenAI-compatible API with open-source LLMs. Function calling, vision, reasoning — swap your base URL and go.
    link: /apis/text/
    linkText: Explore models
  - title: Image Generation
    icon: 🎨
    details: Generate images from text prompts. Stable Diffusion WebUI and OpenAI-compatible endpoints.
    link: /apis/image/
    linkText: Start generating
  - title: LiberClaw
    icon: 🐾
    details: Deploy sovereign AI agents on decentralized infrastructure. From concept to live agent in minutes, with encrypted comms and persistent memory.
    link: https://liberclaw.ai
    linkText: Try LiberClaw
  - title: AI Agents
    icon: 🤖
    details: Build autonomous agents that pay for their own compute and inference with x402, powered by Aleph Cloud and LibertAI.
    link: /agents/
    linkText: Learn more
  - title: Decentralized
    icon: ⛓️
    details: Runs on Aleph Cloud’s distributed compute network. No single point of failure, no corporate gatekeepers.
---

<style>
:root {

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
