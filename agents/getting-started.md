# Getting started

This guide walks you through building an autonomous agent that pays for its own inference and compute using [Coinbase AgentKit](https://github.com/coinbase/agentkit) and the `@libertai/agentkit-plugin`.

## Prerequisites

- Node.js 18+
- A wallet private key with **USDC on Base** (chain ID 8453)

::: tip
You need USDC on Base for x402 payments (inference) and optionally ETH for gas if your agent sends onchain transactions.
:::

## Installation

:::tabs

== npm
```sh
npm install @libertai/agentkit-plugin @coinbase/agentkit openai viem
```

== yarn
```sh
yarn add @libertai/agentkit-plugin @coinbase/agentkit openai viem
```

== pnpm
```sh
pnpm add @libertai/agentkit-plugin @coinbase/agentkit openai viem
```

:::

## Create a wallet

The plugin provides a helper to create a viem wallet client wrapped in an AgentKit-compatible provider:

```ts
import { createAgentWallet } from "@libertai/agentkit-plugin";
import { base } from "viem/chains";

const wallet = await createAgentWallet(
  process.env.PRIVATE_KEY as `0x${string}`,
  base,
);

console.log(`Agent wallet: ${wallet.account.address}`);
```

## Set up AgentKit

Register action providers — these define what tools the agent can use:

```ts
import { AgentKit, walletActionProvider, erc20ActionProvider } from "@coinbase/agentkit";
import { createAlephActionProvider } from "@libertai/agentkit-plugin";

const privateKey = process.env.PRIVATE_KEY as `0x${string}`;

const agentkit = await AgentKit.from({
  walletProvider: wallet.provider,
  actionProviders: [
    walletActionProvider(),
    erc20ActionProvider(),
    createAlephActionProvider(privateKey),
  ],
});
```

`createAlephActionProvider` adds two tools the agent can call:

| Tool               | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `get_credits_info` | Returns credit balance (USD), cost/day (USD), and runway in days |
| `buy_credits`      | Buys Aleph credits via x402 payment (amount in USD)              |

## Create the LLM client

The plugin wraps the OpenAI SDK with automatic x402 payment handling:

```ts
import { createLLMClient, actionsToTools } from "@libertai/agentkit-plugin";

const openai = createLLMClient(privateKey);
const { tools, executeTool } = actionsToTools(agentkit.getActions());
```

`actionsToTools` converts AgentKit actions into OpenAI-compatible tool definitions and returns an `executeTool` dispatcher.

## Run the agent loop

Put it all together in an autonomous loop:

```ts
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";

const SYSTEM_PROMPT = `You are an autonomous AI agent on the Base blockchain.
You have a wallet with ETH and USDC. You pay for compute via Aleph credits.

Each cycle:
1. Check your balances (ETH, USDC) and credit info
2. If credits are running low, buy more credits
3. Report your status

Be concise. Only take action when needed.`;

while (true) {
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: "Check status and take any necessary actions." },
  ];

  let response = await openai.chat.completions.create({
    model: "qwen3.5-35b-a3b",
    messages,
    tools,
  });

  // Handle tool calls
  while (response.choices[0]?.finish_reason === "tool_calls") {
    const assistantMessage = response.choices[0].message;
    messages.push(assistantMessage);

    for (const toolCall of assistantMessage.tool_calls ?? []) {
      const result = await executeTool(
        toolCall.function.name,
        toolCall.function.arguments,
      );
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result,
      });
    }

    response = await openai.chat.completions.create({
      model: "qwen3.5-35b-a3b",
      messages,
      tools,
    });
  }

  const text = response.choices[0]?.message?.content;
  if (text) console.log(`Agent: ${text}`);

  // Wait before next cycle
  await new Promise((r) => setTimeout(r, 60_000));
}
```

## Full example

See the complete working example in the [libertai-agents repository](https://github.com/Libertai/libertai-agents/tree/main/examples/agentkit).

## Links

- [npm package](https://www.npmjs.com/package/@libertai/agentkit-plugin)
- [GitHub source](https://github.com/Libertai/libertai-agents/tree/main/packages/agentkit-plugin)
- [Coinbase AgentKit](https://github.com/coinbase/agentkit)
- [x402 payments](/apis/x402)
