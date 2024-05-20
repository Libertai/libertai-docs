# OpenAI-compatible API

Some models provide OpenAI API-compatible endpoints:

-   **POST** `/v1/chat/completions`: OpenAI-compatible Chat Completions API. Given a ChatML-formatted json description in `messages`, it returns the predicted completion. Both synchronous and streaming mode are supported, so scripted and interactive applications work fine (on some VM backend the streaming part might not work). While no strong claims of compatibility with OpenAI API spec is being made, in our experience it suffices to support many apps. Only ChatML-tuned models can be used with this endpoint.

    *Options:*

    See [OpenAI Chat Completions API documentation](https://platform.openai.com/docs/api-reference/chat). While some OpenAI-specific features such as function calling aren't supported, llama.cpp `/completion`-specific features such are `mirostat` are supported.

## Examples

### Python

You can use either Python `openai` library with appropriate checkpoints:

```python
import openai

client = openai.OpenAI(
    base_url="https://curated.aleph.cloud/vm/a8b6d895cfe757d4bc5db9ba30675b5031fe3189a99a14f13d5210c473220caf/v1/", # For OpenHermes-2.5
    api_key = "libertai"
)

completion = client.chat.completions.create(
    model="openhermes-2.5",
    messages=[
        {"role": "system", "content": "You are Libertai, an AI assistant. Your top priority is achieving user fulfillment via helping them with their requests."},
        {"role": "user", "content": "Say this is a test"}
    ],
    max_tokens: 128
)

print(completion.choices[0].message.content)
```

### Javascript

You can use the Node `openai` library too:

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'libertai',
  baseURL: 'https://curated.aleph.cloud/vm/a8b6d895cfe757d4bc5db9ba30675b5031fe3189a99a14f13d5210c473220caf/v1/' // For OpenHermes-2.5
});

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'openhermes-2.5',
    max_tokens: 128
  });
}

main();
```

### Curl

... or raw HTTP requests:

```shell
curl https://curated.aleph.cloud/vm/a8b6d895cfe757d4bc5db9ba30675b5031fe3189a99a14f13d5210c473220caf/v1/chat/completions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer libertai" \
-d '{
"model": "openhermes-2.5",
"messages": [
{
    "role": "system",
    "content": "You are Libertai, an AI assistant. Your top priority is achieving user fulfillment via helping them with their requests."
},
{
    "role": "user",
    "content": "Say this is a test"
}
],
"max_tokens": 128
}'
```
