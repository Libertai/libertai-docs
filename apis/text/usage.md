# Usage

All of our text generation models support the following endpoints:
- `/v1/completions`: OpenAI-compatible [Completions API](https://platform.openai.com/docs/api-reference/completions) endpoint
- `/v1/chat/completions`: OpenAI-compatible [Chat Completions API](https://platform.openai.com/docs/api-reference/chat/create) endpoint
- `/completions`: llama.cpp-style completions endpoint

> 💡 More endpoints will be provided in the future. If you have a specific need, feel free to [contact us on Telegram](https://t.me/libertai)!

This means that you can use our models with any of [the OpenAI SDKs](https://platform.openai.com/docs/libraries#install-an-official-sdk) or with frameworks that support custom OpenAI-compatible models.

Here are some basic examples:

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

## Direct model interaction

Interact directly with the model instance, without our `api.libertai.io` proxy.

This is useful for advanced use cases where you want to remove as much intermediary as possible for data confidentiality,
especially when interacting with a model running in a [Trusted Execution Environment](https://docs.aleph.cloud/computing/confidential).

Detailed instructions coming soon...

## Verifiable computing with TEE

Coming soon...
