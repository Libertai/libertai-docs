# LangChain & LlamaIndex

Both frameworks talk to LibertAI through their standard OpenAI classes, pointed at the LibertAI base URL. Your chains,
agents, and indexes run on open-weights models, and moving to or from any other OpenAI-compatible provider is a
constructor argument.

## Prerequisites

- A LibertAI API key — see [Get an API key](./index.md#get-an-api-key)
- `pip install langchain-openai` and/or `pip install llama-index llama-index-llms-openai-like`

## LangChain

Use `ChatOpenAI` from `langchain_openai` with a custom `base_url`:

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    base_url="https://api.libertai.io/v1",
    api_key="YOUR_API_KEY",
    model="qwen3.5-122b-a10b",
)

print(llm.invoke("In one sentence: what is decentralized inference?").content)
```

Tool calling, streaming, and structured output work as with any OpenAI-compatible chat model, so `bind_tools`,
`with_structured_output`, and LangGraph agents run unchanged.

## LlamaIndex

Use `OpenAILike`, which is built for OpenAI-compatible endpoints serving non-OpenAI models:

```python
from llama_index.llms.openai_like import OpenAILike

llm = OpenAILike(
    api_base="https://api.libertai.io/v1",
    api_key="YOUR_API_KEY",
    model="qwen3.5-122b-a10b",
    is_chat_model=True,
    is_function_calling_model=True,
    context_window=262144,
)

print(llm.complete("In one sentence: what is decentralized inference?"))
```

Pass the `llm` into `Settings.llm` or any query engine as usual. For RAG pipelines, LibertAI's
[Embeddings API](/apis/embeddings/) is OpenAI-compatible too, so the standard OpenAI embedding classes work the same
way with the same base URL.

## Verify it works

Run either snippet above. A one-sentence answer means everything is wired up. On a `401`, check the key directly:

```sh
curl -i https://api.libertai.io/libertai/auth/check \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Models

`qwen3.5-122b-a10b` is a strong general default (262k context, vision, tools). See the full
[model and pricing table](./index.md#models), including the TEE option for confidential workloads.
