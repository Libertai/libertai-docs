# What is LibertAI?

LibertAI is a decentralized AI platform that runs open-source models on
[Aleph Cloud](https://aleph.cloud), a distributed compute network with no central operator. You get the same
developer experience as proprietary APIs — OpenAI-compatible, Anthropic-compatible — without sending your data
through a single corporate gateway.

## What you can build with it

| | |
|---|---|
| **Chat & reasoning** | Talk to open-source LLMs (Qwen, Gemma, DeepSeek, Hermes) via OpenAI or Anthropic SDKs — function calling, vision, and reasoning included. → [Text API](/apis/text/) |
| **Image generation** | Stable Diffusion WebUI and OpenAI-compatible image endpoints. → [Image API](/apis/image/) |
| **Web search & retrieval** | Multi-engine search (Google, Bing, DuckDuckGo, Brave, Semantic Scholar) with consensus ranking, plus a URL-fetch endpoint for RAG. → [Search API](/apis/search/) |
| **Autonomous agents** | Build agents that pay for their own inference and compute with crypto — no API key, no billing dashboard. → [Agents](/agents/) |

You can also use LibertAI through the [chat interface](https://chat.libertai.io) or
[LiberClaw](https://liberclaw.ai), our sovereign assistant frontend.

## How it's different

- **Decentralized infrastructure.** Inference runs on independent compute nodes (CRNs) coordinated by Aleph Cloud, not
  a single provider's data center. Read the [Architecture](/architecture) page for the request flow.
- **Privacy options.** Models marked with 🔒 run inside a Trusted Execution Environment so the operator running the
  hardware cannot see prompts or completions. See [Trust model & TEE](/concepts/trust-model).
- **Pay how you want.** Use a traditional API key from the [Developer console](https://console.libertai.io), or pay
  per request in USDC on Base via [x402 payments](/apis/x402) — useful for agents that fund themselves.
- **Open weights.** Every model is open source (most are on Hugging Face). No black-box endpoints.

## Where to start

- **Got 5 minutes?** → [Quickstart](/quickstart) — make your first call with curl, Python, or TypeScript.
- **Coming from OpenAI?** → [Text usage](/apis/text/usage) — swap your base URL and keep your code.
- **Building an agent?** → [Agents — Getting started](/agents/getting-started).
- **Want to understand the trust model?** → [Architecture](/architecture) and [Trust model & TEE](/concepts/trust-model).
