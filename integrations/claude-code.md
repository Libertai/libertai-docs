# Claude Code

[Claude Code](https://docs.claude.com/en/docs/claude-code) is Anthropic's terminal coding agent, and it can run
against any Anthropic-compatible endpoint. LibertAI's `/v1/messages` endpoint speaks the Anthropic Messages format,
so Claude Code works on open-weights models with your prompts staying on LibertAI's network.

## Prerequisites

- Claude Code installed (`npm install -g @anthropic-ai/claude-code`)
- A LibertAI API key — see [Get an API key](./index.md#get-an-api-key)

## Easiest path: the LibertAI CLI

The [LibertAI CLI](https://github.com/Libertai/libertai-cli) ships a launcher that pre-wires all the environment
variables:

```sh
libertai login       # one-time: browser sign-in or paste an API key
libertai claude
```

It also installs LibertAI's image-generation and web-search skills into `~/.claude/skills/`, so the agent can
generate images and search the web through LibertAI. `--model`, `--opus`, `--sonnet`, and `--haiku` flags override
individual model tiers.

## Manual setup

`libertai claude` is equivalent to setting these environment variables yourself:

```sh
env \
  ANTHROPIC_BASE_URL=https://api.libertai.io \
  ANTHROPIC_AUTH_TOKEN=YOUR_API_KEY \
  ANTHROPIC_DEFAULT_OPUS_MODEL=qwen3.6-35b-a3b \
  ANTHROPIC_DEFAULT_SONNET_MODEL=qwen3.6-35b-a3b \
  ANTHROPIC_DEFAULT_HAIKU_MODEL=qwen3.6-35b-a3b \
  CLAUDE_CODE_ATTRIBUTION_HEADER=0 \
  CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1 \
  CLAUDE_CODE_DISABLE_1M_CONTEXT=1 \
  DISABLE_TELEMETRY=1 \
  claude
```

Notes:

- The base URL is `https://api.libertai.io` without the `/v1` suffix; Claude Code appends `/v1/messages` itself.
- The three `ANTHROPIC_DEFAULT_*_MODEL` variables map Claude Code's model tiers to LibertAI model ids. Substitute any
  model from the [model table](./index.md#models), for example `ANTHROPIC_DEFAULT_OPUS_MODEL=qwen3.5-122b-a10b` for
  the strongest coding model.
- The `CLAUDE_CODE_*` and `DISABLE_TELEMETRY` variables turn off nonessential traffic to Anthropic. They are optional
  but recommended.

## Verify it works

Launch and ask the agent something simple:

```
> what model are you running on?
```

If it answers (it should name the mapped LibertAI model rather than a Claude model), the endpoint is live. On an auth
error, check the key directly:

```sh
curl -i https://api.libertai.io/libertai/auth/check \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Models

`qwen3.5-122b-a10b` is the recommended default for coding agents (262k context, vision, tools). See the full
[model and pricing table](./index.md#models) for budget and TEE options.
