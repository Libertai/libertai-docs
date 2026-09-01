# Aider

[Aider](https://aider.chat) is an AI pair programmer for the terminal. Pointed at LibertAI, it edits your repo using
open-weights models on an endpoint you can swap for any other OpenAI-compatible one.

## Prerequisites

- Aider installed (`python -m pip install aider-install && aider-install`, see the [Aider docs](https://aider.chat/docs/install.html))
- A LibertAI API key — see [Get an API key](./index.md#get-an-api-key)

## Easiest path: the LibertAI CLI

The [LibertAI CLI](https://github.com/Libertai/libertai-cli) ships an Aider launcher:

```sh
libertai login       # one-time: browser sign-in or paste an API key
libertai aider
```

`libertai aider` injects the API base and key into the environment, passes `--model openai/<your default code model>`,
and loads a small instructions file (via `--read`) that teaches Aider about LibertAI's image and search commands.

## Manual setup

Aider treats any OpenAI-compatible endpoint as the `openai/` provider. Set the base URL and key in the environment and
prefix the model id with `openai/`:

```sh
OPENAI_API_BASE=https://api.libertai.io/v1 \
OPENAI_API_KEY=YOUR_API_KEY \
aider --model openai/qwen3.5-122b-a10b
```

To make it permanent, export the two variables in your shell profile or put them in a `.env` file in your project,
and set `model: openai/qwen3.5-122b-a10b` in `~/.aider.conf.yml`.

## Verify it works

In the Aider prompt, ask for something harmless:

```
/ask What does this repository do?
```

A streamed answer means the endpoint and key are working. On a `401`, check the key directly:

```sh
curl -i https://api.libertai.io/libertai/auth/check \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Models

`qwen3.5-122b-a10b` is the recommended default for coding (262k context, tools). Any model id from the
[model and pricing table](./index.md#models) works with the `openai/` prefix.
