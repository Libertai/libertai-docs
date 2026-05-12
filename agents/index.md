# AI Agents

Build autonomous agents that pay for their own compute and inference — no API keys, no billing dashboards. Your agent
holds a wallet, calls LibertAI models via [x402](/apis/x402), and manages its own
[Aleph Cloud](https://aleph.cloud) credits to stay alive.

## When to use this

The LibertAI agent stack is a thin layer over Coinbase AgentKit, not a full framework. Pick it when you want:

- **Wallet-funded inference** — the agent pays per call in USDC, no one issues it an API key.
- **Onchain interaction** — you need a wallet, tool calling, and EVM action primitives in one bundle.
- **Self-hosted runtime** — you ship a Docker image to your own Aleph VM with one command.

If you mainly want orchestration (memory, planning, tracing) on top of an OpenAI-compatible endpoint, a framework like
LangGraph or CrewAI pointed at `https://api.libertai.io/v1` with a regular API key is a simpler path. See
[Quickstart](/quickstart). The two approaches compose — you can run a LangGraph agent inside a wallet-funded loop.

## How it works

1. **Wallet** — the agent has a private key with USDC on Base
2. **Inference** — each LLM call is paid individually via x402 (no API key needed)
3. **Compute** — the agent monitors its Aleph credit balance and buys more when needed
4. **Actions** — using [Coinbase AgentKit](https://github.com/coinbase/agentkit), the agent can interact with any onchain protocol

## Stack

| Layer     | What                             | TypeScript                  | Python                     |
| --------- | -------------------------------- | --------------------------- | -------------------------- |
| Framework | Coinbase AgentKit                | `@coinbase/agentkit`        | `coinbase-agentkit`        |
| Inference | LibertAI API (OpenAI-compatible) | `openai`                    | `openai`                   |
| Payment   | x402 protocol                    | `@libertai/x402`            | `libertai-x402`            |
| Plugin    | Wallet, credits, tools bridge    | `@libertai/agentkit-plugin` | `libertai-agentkit-plugin` |

## Get started

1. [Getting started](./getting-started) — build the agent locally (TypeScript and Python parity)
2. [Deployment](./deployment) — push it to an Aleph Cloud VM with one command

## See also

- [x402 payments](/apis/x402) — payment protocol the wallet uses
- [Text API](/apis/text/) — models with function-calling support
- [Architecture](/architecture) — what happens after the agent calls the API
- [GitHub source](https://github.com/Libertai/libertai-agents)
