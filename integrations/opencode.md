# OpenCode

[OpenCode](https://opencode.ai) is an open-source coding agent for the terminal. Running it on LibertAI keeps your
code on open-weights models behind a provider entry you control, with nothing proprietary in the setup.

## Prerequisites

- OpenCode installed (`curl -fsSL https://opencode.ai/install | bash` or your package manager)
- A LibertAI API key — see [Get an API key](./index.md#get-an-api-key)

## Easiest path: the LibertAI CLI

The [LibertAI CLI](https://github.com/Libertai/libertai-cli) ships an OpenCode launcher that does the wiring for you:

```sh
libertai login       # one-time: browser sign-in or paste an API key
libertai opencode
```

`libertai opencode` writes a `libertai` provider block into `~/.config/opencode/opencode.json` (idempotently, leaving
your other providers untouched), exports `LIBERTAI_API_KEY` from the CLI's saved credentials, and launches OpenCode
with `--model libertai/<your default code model>`. It also installs LibertAI's image-generation and web-search agent
skills, which OpenCode picks up.

## Manual setup

OpenCode ignores `OPENAI_*` environment variables for custom providers; it needs a provider entry in
`~/.config/opencode/opencode.json` (or a project-local `opencode.json`):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "libertai": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "LibertAI",
      "options": {
        "baseURL": "https://api.libertai.io/v1",
        "apiKey": "{env:LIBERTAI_API_KEY}"
      },
      "models": {
        "qwen3.5-122b-a10b": {
          "name": "Qwen 3.5 122B"
        },
        "qwen3.6-35b-a3b": {
          "name": "Qwen 3.6 35B A3B"
        }
      }
    }
  }
}
```

Then launch with the key in the environment:

```sh
LIBERTAI_API_KEY=YOUR_API_KEY opencode --model libertai/qwen3.5-122b-a10b
```

## Verify it works

Inside OpenCode, send a trivial prompt:

```
What model are you, and can you list the files in this directory?
```

A streamed answer plus a tool call means the provider is live. On an auth error, check the key directly:

```sh
curl -i https://api.libertai.io/libertai/auth/check \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Models

`qwen3.5-122b-a10b` is the recommended default for coding agents (262k context, vision, tools). Add any model id from
the [model and pricing table](./index.md#models) to the `models` map and select it with `--model libertai/<id>`.
