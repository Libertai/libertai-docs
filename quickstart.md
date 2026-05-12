# Quickstart

Make your first LibertAI call in under five minutes. If you already use OpenAI or Anthropic SDKs, you just change the
base URL.

## 1. Get an API key

Sign in to the [Developer console](https://console.libertai.io), create a key, and top it up. Or skip the key entirely
and pay per request in USDC on Base — see [x402 payments](/apis/x402).

## 2. Make a call

:::tabs

== Shell
```sh
curl -X POST https://api.libertai.io/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LIBERTAI_API_KEY" \
  -d '{
    "model": "gemma-4-31b-it",
    "messages": [
      { "role": "user", "content": "In one sentence: what is decentralized inference?" }
    ]
  }'
```

== Python
```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.libertai.io/v1",
    api_key="YOUR_API_KEY",
)

resp = client.chat.completions.create(
    model="gemma-4-31b-it",
    messages=[
        {"role": "user", "content": "In one sentence: what is decentralized inference?"}
    ],
)
print(resp.choices[0].message.content)
```

== TypeScript
```ts
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.libertai.io/v1",
  apiKey: "YOUR_API_KEY",
});

const resp = await client.chat.completions.create({
  model: "gemma-4-31b-it",
  messages: [
    { role: "user", content: "In one sentence: what is decentralized inference?" },
  ],
});

console.log(resp.choices[0].message.content);
```

:::

That's it. You're talking to an open-source LLM on a decentralized compute network.

## Already using OpenAI?

Two lines change. Keep the rest of your code.

```diff
- base_url="https://api.openai.com/v1"
+ base_url="https://api.libertai.io/v1"
- model="gpt-4o-mini"
+ model="gemma-4-31b-it"
```

The `/v1/chat/completions`, `/v1/completions`, `/v1/responses`, and `/v1/models` endpoints are all OpenAI-compatible.
`/v1/messages` is Anthropic-compatible.

## Already using Anthropic?

```diff
- base_url="https://api.anthropic.com"
+ base_url="https://api.libertai.io"
- model="claude-haiku-4-5"
+ model="gemma-4-31b-it"
```

The `/v1/messages` endpoint accepts the Anthropic Messages format directly.

## Next steps

- [Text API](/apis/text/) — list of models, pricing, context windows, capabilities
- [Text usage](/apis/text/usage) — streaming, function calling, vision, direct CRN calls
- [Image generation](/apis/image/) — Stable Diffusion and OpenAI-compatible endpoints
- [Web search](/apis/search/) — multi-engine search and URL fetching for RAG
- [Agents](/agents/) — build autonomous agents that pay for their own inference
- [x402 payments](/apis/x402) — call the API with crypto instead of an API key
- [Architecture](/architecture) — how requests are routed across the network
