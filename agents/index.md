# AI Agents

Build autonomous agents that pay for their own compute and inference — no API keys, no billing dashboards.\
Your agent holds a wallet, calls LibertAI models via [x402](/apis/x402), and manages its own [Aleph Cloud](https://aleph.cloud) credits to stay alive.

## How it works

1. **Wallet** — the agent has a private key with USDC on Base
2. **Inference** — each LLM call is paid individually via x402 (no API key needed)
3. **Compute** — the agent monitors its Aleph credit balance and buys more when needed
4. **Actions** — using [Coinbase AgentKit](https://github.com/coinbase/agentkit), the agent can interact with any onchain protocol

## Stack

| Layer     | What                             | Package                     |
| --------- | -------------------------------- | --------------------------- |
| Framework | Coinbase AgentKit                | `@coinbase/agentkit`        |
| Inference | LibertAI API (OpenAI-compatible) | `openai`                    |
| Payment   | x402 protocol                    | `@libertai/x402`            |
| Plugin    | Wallet, credits, tools bridge    | `@libertai/agentkit-plugin` |

## Get started

Follow the [Getting started](./getting-started) guide to create your first autonomous agent.
