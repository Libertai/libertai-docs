# Roo Code

[Roo Code](https://roocode.com) is an AI coding agent for VS Code with multiple modes (Code, Architect, Ask, Debug).
With LibertAI as the provider, every mode runs on open-weights models you can inspect, on an endpoint you are free to
leave.

## Prerequisites

- The [Roo Code extension](https://marketplace.visualstudio.com/items?itemName=RooVeterinaryInc.roo-cline) installed in VS Code
- A LibertAI API key — see [Get an API key](./index.md#get-an-api-key)

## Configure

1. Open the Roo Code panel in VS Code and click the **settings gear** (⚙️) at the top of the panel.
2. Under **Providers**, select **OpenAI Compatible** in the **API Provider** dropdown.
3. Fill in the fields:
   - **Base URL**: `https://api.libertai.io/v1`
   - **API Key**: your LibertAI API key
   - **Model**: `qwen3.5-122b-a10b`
4. Save.

Roo Code stores provider settings in named configuration profiles, and each mode can use a different profile. A common
split is `qwen3.5-122b-a10b` for Code and Architect with the cheaper `qwen3.6-35b-a3b` for Ask.

## Verify it works

Open a new Roo Code chat in Code mode and ask:

```
Summarize what this repository does in two sentences.
```

A streamed answer means everything is wired up. On a `401`, check the key directly:

```sh
curl -i https://api.libertai.io/libertai/auth/check \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Models

`qwen3.5-122b-a10b` is the recommended default for coding agents (262k context, vision, tools). See the full
[model and pricing table](./index.md#models) for budget and TEE options.
