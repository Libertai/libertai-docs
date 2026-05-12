# Getting started

Build an autonomous agent that pays for its own inference and onchain compute with [Coinbase AgentKit](https://github.com/coinbase/agentkit)
and the `@libertai/agentkit-plugin` (TypeScript) or `libertai-agentkit-plugin` (Python).

::: tip
Don't want to wire payments yourself? You can also use any LibertAI model with a regular API key from the
[Developer console](https://console.libertai.io) and skip the wallet plumbing entirely. See the
[Quickstart](/quickstart) for the simpler path.
:::

## Prerequisites

- A wallet private key with **USDC on Base** (chain ID 8453)
- **TypeScript:** Node.js 18+
- **Python:** Python 3.11+

::: tip
You need USDC on Base for x402 payments (inference) and optionally ETH for gas if your agent sends onchain transactions.
:::

## Installation

:::tabs

== TypeScript
```sh
npm install @libertai/agentkit-plugin @coinbase/agentkit openai viem
```

== Python
```sh
pip install libertai-agentkit-plugin coinbase-agentkit
```

:::

## Create a wallet

The plugin provides a helper to create a wallet client wrapped in an AgentKit-compatible provider:

:::tabs

== TypeScript
```ts
import { createAgentWallet } from "@libertai/agentkit-plugin";
import { base } from "viem/chains";

const privateKey = process.env.WALLET_PRIVATE_KEY as `0x${string}`;
const wallet = await createAgentWallet(privateKey, base);

console.log(`Agent wallet: ${wallet.account.address}`);
```

== Python
```python
import os
from libertai_agentkit_plugin import create_agent_wallet

PRIVATE_KEY = os.environ["WALLET_PRIVATE_KEY"]
wallet = create_agent_wallet(PRIVATE_KEY)

print(f"Agent wallet: {wallet.get_address()}")
```

:::

## Set up AgentKit

Register action providers — these define what tools the agent can use:

:::tabs

== TypeScript
```ts
import { AgentKit, walletActionProvider, erc20ActionProvider } from "@coinbase/agentkit";
import { createAlephActionProvider } from "@libertai/agentkit-plugin";

const agentkit = await AgentKit.from({
  walletProvider: wallet.provider,
  actionProviders: [
    walletActionProvider(),
    erc20ActionProvider(),
    createAlephActionProvider(privateKey),
  ],
});
```

== Python
```python
from coinbase_agentkit import AgentKit, AgentKitConfig
from coinbase_agentkit.action_providers.erc20.erc20_action_provider import ERC20ActionProvider
from coinbase_agentkit.action_providers.wallet.wallet_action_provider import WalletActionProvider
from libertai_agentkit_plugin.actions.aleph import AlephActionProvider

agentkit = AgentKit(AgentKitConfig(
    wallet_provider=wallet,
    action_providers=[
        WalletActionProvider(),
        ERC20ActionProvider(),
        AlephActionProvider(PRIVATE_KEY),
    ],
))
```

:::

`AlephActionProvider` adds two tools the agent can call:

| Tool               | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `get_credits_info` | Returns credit balance (USD), cost/day (USD), and runway in days |
| `buy_credits`      | Buys Aleph credits via x402 payment (amount in USD)              |

## Create the LLM client

The plugin wraps the OpenAI SDK with automatic x402 payment handling:

:::tabs

== TypeScript
```ts
import { createLLMClient, actionsToTools } from "@libertai/agentkit-plugin";

const openai = createLLMClient(privateKey);
const { tools, executeTool } = actionsToTools(agentkit.getActions());
```

== Python
```python
from libertai_agentkit_plugin import actions_to_tools, create_llm_client

openai = create_llm_client(PRIVATE_KEY)
tools, execute_tool = actions_to_tools(agentkit.get_actions())
```

:::

`actionsToTools` / `actions_to_tools` converts AgentKit actions into OpenAI tool definitions and returns an
`executeTool` / `execute_tool` dispatcher.

## Run the agent loop

Put it all together in an autonomous loop:

:::tabs

== TypeScript
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
    model: "qwen3.6-35b-a3b",
    messages,
    tools,
  });

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
      model: "qwen3.6-35b-a3b",
      messages,
      tools,
    });
  }

  const text = response.choices[0]?.message?.content;
  if (text) console.log(`Agent: ${text}`);

  await new Promise((r) => setTimeout(r, 60_000));
}
```

== Python
```python
import asyncio

SYSTEM_PROMPT = """You are an autonomous AI agent on the Base blockchain.
You have a wallet with ETH and USDC. You pay for compute via Aleph credits.

Each cycle:
1. Check your balances (ETH, USDC) and credit info
2. If credits are running low, buy more credits
3. Report your status

Be concise. Only take action when needed."""


async def main():
    while True:
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": "Check status and take any necessary actions."},
        ]

        response = await openai.chat.completions.create(
            model="qwen3.6-35b-a3b",
            messages=messages,
            tools=tools,
        )

        while response.choices[0].finish_reason == "tool_calls":
            assistant_msg = response.choices[0].message
            messages.append(assistant_msg)

            for tool_call in assistant_msg.tool_calls or []:
                result = await execute_tool(
                    tool_call.function.name,
                    tool_call.function.arguments,
                )
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": result,
                })

            response = await openai.chat.completions.create(
                model="qwen3.6-35b-a3b",
                messages=messages,
                tools=tools,
            )

        text = response.choices[0].message.content
        if text:
            print(f"Agent: {text}")

        await asyncio.sleep(60)


asyncio.run(main())
```

:::

::: tip
Pick a model that supports function calling (⚙️ on the [models list](/apis/text/#available-models)). Most
production agents use `qwen3.6-35b-a3b` or `gemma-4-31b-it`.
:::

## Adding custom tools

The pattern is the standard Coinbase AgentKit `ActionProvider`. Subclass and register it like any other action provider —
see [AgentKit docs](https://docs.cdp.coinbase.com/agentkit/docs/welcome) for the full API. Once registered, your tool
shows up in the `tools` array returned by `actionsToTools` / `actions_to_tools` automatically.

## Full examples

Complete working agents in the libertai-agents repository:

- [TypeScript example](https://github.com/Libertai/libertai-agents/tree/main/examples/agentkit/typescript)
- [Python example](https://github.com/Libertai/libertai-agents/tree/main/examples/agentkit/python)

## See also

- [Deploy your agent](/agents/deployment) — run it on Aleph Cloud with one command
- [x402 payments](/apis/x402) — how the wallet pays for inference under the hood
- [Architecture](/architecture) — what happens after the agent calls the API
- [npm](https://www.npmjs.com/package/@libertai/agentkit-plugin) · [PyPI](https://pypi.org/project/libertai-agentkit-plugin/) · [GitHub](https://github.com/Libertai/libertai-agents)
