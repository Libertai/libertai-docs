# APIs

LibertAI exposes OpenAI- and Anthropic-compatible APIs for text, image, embeddings, audio, and web search. Each API is
documented with its own models, pricing, and usage examples.

| API | What it does | OpenAI-compat | x402-eligible |
|-----|--------------|:-------------:|:-------------:|
| [Text](text/index.md) | Chat completions, completions, Anthropic Messages, function calling, vision, streaming | ✅ | ✅ |
| [Image](image/index.md) | Stable Diffusion WebUI and OpenAI images endpoints | ✅ | ✅ |
| [Embeddings](embeddings/index.md) | Text embeddings for semantic search, RAG, clustering | ✅ | ✅ |
| [Audio](audio/index.md) | Text-to-speech (TTS) with selectable voices | ✅ | ✅ |
| [Search](search/index.md) | Multi-engine search + URL fetch for RAG | — | ✅ |

## Authentication

Two options, interchangeable on every endpoint:

- **API key** — create one in the [Developer console](https://console.libertai.io) and pass it as
  `Authorization: Bearer YOUR_API_KEY`. Verify with [`GET /libertai/auth/check`](text/usage.md#verifying-your-api-key).
- **x402 payments** — sign an EIP-712 authorization with your wallet and pay per request in USDC on Base. Useful for
  agents that fund themselves. See [x402](x402.md).

## What's where

- [Quickstart](/quickstart) — first call in under five minutes
- [Text usage](text/usage.md) — streaming, function calling, vision, Anthropic Messages, direct CRN access
- [Trust model & TEE](/concepts/trust-model) — what 🔒 models guarantee
- [Architecture](/architecture) — how requests flow through the network
