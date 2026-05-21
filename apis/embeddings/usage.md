# Usage

Our embedding models expose the OpenAI-compatible [Embeddings API](https://platform.openai.com/docs/api-reference/embeddings):
- `/v1/embeddings`: create an embedding vector for the given input

This means you can use our embedding models with any of [the OpenAI SDKs](https://platform.openai.com/docs/libraries#install-an-official-sdk) or with any framework that supports custom OpenAI-compatible embedding endpoints.

> 💡 Embeddings are billed on **input tokens only** — there are no output tokens.

## Examples

### Create an embedding

:::tabs

== Shell
```sh
curl -X POST https://api.libertai.io/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "bge-m3",
    "input": "The quick brown fox jumps over the lazy dog"
  }'
```

== Python
```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.libertai.io/v1",
    api_key="YOUR_API_KEY",
)

response = client.embeddings.create(
    model="bge-m3",
    input="The quick brown fox jumps over the lazy dog",
)

print(len(response.data[0].embedding))  # vector dimensions
```

== TypeScript
```ts
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: 'https://api.libertai.io/v1',
  apiKey: "YOUR_API_KEY",
});

const response = await client.embeddings.create({
  model: "bge-m3",
  input: "The quick brown fox jumps over the lazy dog",
});

console.log(response.data[0].embedding.length);
```

:::

### Batch inputs

Pass a list of strings to embed many texts in a single request:

:::tabs

== Shell
```sh
curl -X POST https://api.libertai.io/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "bge-m3",
    "input": ["first document", "second document", "third document"]
  }'
```

== Python
```python
texts = ["first document", "second document", "third document"]

response = client.embeddings.create(model="bge-m3", input=texts)

for item in response.data:
    print(item.index, len(item.embedding))
```

:::

The response follows the OpenAI format: a `data` array of `{ "embedding": [...], "index": n }` objects, plus a
`usage` object reporting `prompt_tokens` (and `total_tokens`, equal — embeddings have no completion tokens).
