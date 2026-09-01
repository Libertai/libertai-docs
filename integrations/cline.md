# Cline

[Cline](https://cline.bot) is an autonomous coding agent for VS Code. Pointed at LibertAI, it runs on open-weights
models behind an endpoint you can swap out at any time, and your code stays off the big providers' servers.

## Prerequisites

- The [Cline extension](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) installed in VS Code
- A LibertAI API key — see [Get an API key](./index.md#get-an-api-key)

## Configure

Cline has a built-in "OpenAI Compatible" provider, which is what LibertAI speaks.

1. Open the Cline panel in VS Code and click the **settings gear** (⚙️) at the top of the panel.
2. In the **API Provider** dropdown, select **OpenAI Compatible**.
3. Fill in the fields:
   - **Base URL**: `https://api.libertai.io/v1`
   - **API Key**: your LibertAI API key
   - **Model ID**: `qwen3.5-122b-a10b`
4. Save (**Done**).

Cline lets Plan and Act modes use different model configurations. If you enable that, you can pair a cheaper model
such as `qwen3.6-35b-a3b` for planning with `qwen3.5-122b-a10b` for acting.

## Verify it works

Start a new Cline task and ask something trivial:

```
List the files in this project and tell me what it does.
```

If Cline answers and starts using tools, the integration is live. If you get a `401`, check the key directly:

```sh
curl -i https://api.libertai.io/libertai/auth/check \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Models

`qwen3.5-122b-a10b` is the recommended default for coding agents (262k context, vision, tools). See the full
[model and pricing table](./index.md#models) for budget and TEE options.
