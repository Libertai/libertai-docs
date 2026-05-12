# Usage

All of our text generation models support the following endpoints:
- `/v1/completions`: OpenAI-compatible [Completions API](https://platform.openai.com/docs/api-reference/completions) endpoint
- `/v1/chat/completions`: OpenAI-compatible [Chat Completions API](https://platform.openai.com/docs/api-reference/chat/create) endpoint
- `/v1/responses`: OpenAI-compatible [Responses API](https://platform.openai.com/docs/api-reference/responses) endpoint
- `/v1/messages`: Anthropic-compatible [Messages API](https://docs.anthropic.com/en/api/messages) endpoint
- `/v1/models`: OpenAI-compatible endpoint to [list the available models](https://platform.openai.com/docs/api-reference/models/list)
- `/completions`: llama.cpp-style completions endpoint

> 💡 More endpoints will be provided in the future. If you have a specific need, feel free to [contact us on Telegram](https://t.me/libertai)!

This means that you can use our models with any of [the OpenAI SDKs](https://platform.openai.com/docs/libraries#install-an-official-sdk) or with frameworks that support custom OpenAI-compatible models.

## Examples

### Basic chat completion

:::tabs

== Shell
```sh
curl -X POST https://api.libertai.io/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "hermes-3-8b-tee",
    "messages": [
      {
        "role": "user",
        "content": "Hello!"
      }
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

completion = client.chat.completions.create(
    model="hermes-3-8b-tee",
    messages=[
        {
            "role": "user",
            "content": "What is a Trusted Execution Environment?"
        }
    ]
)

print(completion.choices[0].message.content)
```

== TypeScript
```ts
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: 'https://api.libertai.io/v1',
  apiKey: "YOUR_API_KEY",
});

const completion = await client.chat.completions.create({
    model: "hermes-3-8b-tee",
    messages: [
        {
            role: "user",
            content: "What is a Trusted Execution Environment?",
        },
    ],
});

console.log(completion.choices[0].message.content);
```

:::

### Vision

:::tabs

== Shell
```sh
curl -X POST https://api.libertai.io/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gemma-4-31b-it",
    "messages": [
      {
        "role": "user",
        "content": [
          { "type": "text", "text": "What is in this image?" },
          {
            "type": "image_url",
            "image_url": {
              "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
            }
          }
        ]
      }
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

completion = client.chat.completions.create(
    model="gemma-4-31b-it",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe this image."},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
                    }
                }
            ]
        }
    ]
)

print(completion.choices[0].message.content)
```

== TypeScript
```ts
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.libertai.io/v1",
  apiKey: "YOUR_API_KEY",
});

const completion = await client.chat.completions.create({
  model: "gemma-4-31b-it",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What do you see in this image?" },
        {
          type: "image_url",
          image_url: {
            url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...",
          },
        },
      ],
    },
  ],
});

console.log(completion.choices[0].message.content);
```

:::

### Streaming

Pass `stream: true` to receive tokens incrementally as they're generated. The endpoint emits server-sent events
matching the OpenAI streaming format.

:::tabs

== Shell
```sh
curl -N -X POST https://api.libertai.io/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gemma-4-31b-it",
    "stream": true,
    "messages": [
      { "role": "user", "content": "Count from 1 to 5, one number per line." }
    ]
  }'
```

== Python
```python
from openai import OpenAI

client = OpenAI(base_url="https://api.libertai.io/v1", api_key="YOUR_API_KEY")

stream = client.chat.completions.create(
    model="gemma-4-31b-it",
    messages=[{"role": "user", "content": "Count from 1 to 5, one number per line."}],
    stream=True,
)

for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)
```

== TypeScript
```ts
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.libertai.io/v1",
  apiKey: "YOUR_API_KEY",
});

const stream = await client.chat.completions.create({
  model: "gemma-4-31b-it",
  messages: [{ role: "user", content: "Count from 1 to 5, one number per line." }],
  stream: true,
});

for await (const chunk of stream) {
  const delta = chunk.choices[0]?.delta?.content;
  if (delta) process.stdout.write(delta);
}
```

:::

### Function (tool) calling

Models flagged with ⚙️ on the [models list](./index.md#available-models) support OpenAI-style tool calls.

:::tabs

== Python
```python
from openai import OpenAI

client = OpenAI(base_url="https://api.libertai.io/v1", api_key="YOUR_API_KEY")

tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get the current weather for a city",
        "parameters": {
            "type": "object",
            "properties": {"city": {"type": "string"}},
            "required": ["city"],
        },
    },
}]

resp = client.chat.completions.create(
    model="gemma-4-31b-it",
    messages=[{"role": "user", "content": "What's the weather in Paris?"}],
    tools=tools,
)

tool_call = resp.choices[0].message.tool_calls[0]
print(tool_call.function.name, tool_call.function.arguments)
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
  messages: [{ role: "user", content: "What's the weather in Paris?" }],
  tools: [{
    type: "function",
    function: {
      name: "get_weather",
      description: "Get the current weather for a city",
      parameters: {
        type: "object",
        properties: { city: { type: "string" } },
        required: ["city"],
      },
    },
  }],
});

const call = resp.choices[0].message.tool_calls?.[0];
console.log(call?.function.name, call?.function.arguments);
```

:::

After your code runs the tool, append a `role: "tool"` message with `tool_call_id` and `content` to the conversation
and call the model again — same flow as the OpenAI API.

### Anthropic Messages format

The `/v1/messages` endpoint accepts requests in [Anthropic's Messages format](https://docs.anthropic.com/en/api/messages),
so the Anthropic SDK works against LibertAI by changing the base URL.

:::tabs

== Shell
```sh
curl -X POST https://api.libertai.io/v1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "gemma-4-31b-it",
    "max_tokens": 256,
    "messages": [
      { "role": "user", "content": "Hello!" }
    ]
  }'
```

== Python
```python
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.libertai.io",
    api_key="YOUR_API_KEY",
)

msg = client.messages.create(
    model="gemma-4-31b-it",
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello!"}],
)

print(msg.content[0].text)
```

:::

## Direct model interaction

You can bypass the `api.libertai.io` load balancer and call a model's CRN (computing resource node) directly.
This is useful when you want as few intermediaries as possible — for data confidentiality, latency, or to talk to a
specific instance such as one running in a Trusted Execution Environment. See
[Trust model & TEE](/concepts/trust-model) for what each layer protects against.

### Discover the hosts for a model

The `GET /libertai/models` endpoint returns the list of servers currently backing each model:

```sh
curl https://api.libertai.io/libertai/models
```

```json
{
  "hermes-3-8b-tee": {
    "servers": ["https://hermes-3-8b-2.tee.models.libertai.io"]
  },
  "qwen3.6-27b": {
    "servers": [
      "https://qwen3-5-27b-1.models.libertai.io",
      "https://qwen3-5-27b-2.models.libertai.io"
    ]
  },
  "z-image-turbo": {
    "servers": ["https://z-image-turbo-1.models.libertai.io"]
  }
}
```

Each entry maps a model `id` (the same one you'd pass to `/v1/chat/completions`) to one or more server URLs.
This endpoint covers every model exposed by LibertAI — text, image, etc. — so it's the same discovery path for any
direct-host use case.

### Call a host directly

The servers expose the same OpenAI-compatible endpoints (`/v1/chat/completions`, `/v1/completions`, `/v1/messages`, …)
as the main API. Your LibertAI API key works on them too — keys are distributed to each backing server, so authenticate
exactly the same way:

:::tabs

== Shell
```sh
curl -X POST https://hermes-3-8b-2.tee.models.libertai.io/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "hermes-3-8b-tee",
    "messages": [
      { "role": "user", "content": "Hello!" }
    ]
  }'
```

== Python
```python
import httpx
from openai import OpenAI

# 1. Discover hosts for the model
models = httpx.get("https://api.libertai.io/libertai/models").json()
host = models["hermes-3-8b-tee"]["servers"][0]

# 2. Point the OpenAI client straight at the host
client = OpenAI(
    base_url=f"{host}/v1",
    api_key="YOUR_API_KEY",
)

completion = client.chat.completions.create(
    model="hermes-3-8b-tee",
    messages=[{"role": "user", "content": "Hello!"}],
)

print(completion.choices[0].message.content)
```

== TypeScript
```ts
import OpenAI from "openai";

// 1. Discover hosts for the model
const models = await fetch("https://api.libertai.io/libertai/models").then(r => r.json());
const host = models["hermes-3-8b-tee"].servers[0];

// 2. Point the OpenAI client straight at the host
const client = new OpenAI({
  baseURL: `${host}/v1`,
  apiKey: "YOUR_API_KEY",
});

const completion = await client.chat.completions.create({
  model: "hermes-3-8b-tee",
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(completion.choices[0].message.content);
```

:::

### Things to know

- **No load balancing or failover** — when you call a host directly you lose the gateway's health-aware routing across
  multiple instances and the sticky-session cookie used for KV-cache locality. If a model has several servers, your
  client is responsible for choosing one and retrying on another if it fails.
- **Hosts can change** — the `servers` list reflects the network's current state. Re-query `/libertai/models`
  periodically rather than hardcoding URLs.
- **TEE confidentiality** — for models running in a TEE (look for `🔒` on the [models list](./index.md#available-models)),
  calling the host directly minimizes the parties that see your prompt. See [Trust model & TEE](/concepts/trust-model)
  for what's guaranteed today and how remote attestation will work.

## Verifying your API key

`GET /libertai/auth/check` returns `200 OK` if your key is valid, `401 Unauthorized` otherwise — useful for sanity-checking
configuration during onboarding without spending tokens.

```sh
curl -i https://api.libertai.io/libertai/auth/check \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Errors

| Status | Meaning | What to do |
|--------|---------|------------|
| `401` | Missing or invalid API key | Verify your key in the [Console](https://console.libertai.io) or via `/libertai/auth/check` |
| `402` | Payment required (x402 flow) | Sign and resubmit with `X-PAYMENT` — see [x402](/apis/x402) |
| `404` | Unknown model | Pull the list from `/v1/models` or `/libertai/models` |
| `422` | Validation error | Check field types and enum values |
| `503` | All servers failed for this model | Retry shortly — the gateway tried every CRN and none responded |

Errors return JSON of the form `{"detail": "..."}`. Streaming responses can fail mid-stream — handle `error` events
in your SSE consumer.

## See also

- [Available models & pricing](./index.md)
- [Direct CRN access](#direct-model-interaction)
- [x402 payments](/apis/x402) — pay per request without an API key
- [Trust model & TEE](/concepts/trust-model)
- [Architecture](/architecture)
