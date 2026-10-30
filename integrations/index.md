# Use LibertAI in your tools

LibertAI is an OpenAI-compatible API at the base URL `https://api.libertai.io/v1`. Any tool that lets you set a custom
OpenAI-compatible endpoint works with it: coding agents, IDE extensions, frameworks, desktop apps. You keep your
prompts private, run open-weights models, and can leave any time, since nothing in your setup is proprietary to us.

| Tool | Type | Guide |
|------|------|-------|
| Cline | VS Code coding agent | [Set up Cline](./cline.md) |
| Roo Code | VS Code coding agent | [Set up Roo Code](./roo-code.md) |
| Continue | IDE assistant (VS Code, JetBrains) | [Set up Continue](./continue.md) |
| OpenCode | Terminal coding agent | [Set up OpenCode](./opencode.md) |
| Aider | Terminal pair programmer | [Set up Aider](./aider.md) |
| Claude Code | Terminal coding agent | [Set up Claude Code](./claude-code.md) |
| LangChain & LlamaIndex | Python frameworks | [Set up LangChain & LlamaIndex](./langchain.md) |

Using something else? If it has an "OpenAI compatible" provider option, point it at `https://api.libertai.io/v1` with
your API key and a model id from the table below. That is the whole integration.

## Get an API key

Sign in to the [Developer console](https://console.libertai.io), create a key, and top it up. If you use the
[LibertAI CLI](https://github.com/Libertai/libertai-cli), `libertai login` walks you through browser sign-in and
`libertai keys create` mints keys from the terminal. You can also skip keys entirely and pay per request in USDC on
Base with [x402 payments](/apis/x402.html).

Check that a key works without spending tokens:

```sh
curl -i https://api.libertai.io/libertai/auth/check \
  -H "Authorization: Bearer YOUR_API_KEY"
```

`200 OK` means you are good to go; `401` means the key is missing or invalid.

## Models

Recommended default for coding agents: `qwen3.5-122b-a10b` (262k context, vision, tools). Budget option:
`qwen3.6-35b-a3b`. Flagship: `glm-5.3` (`glm-5.3-flash` is the cheap, 524k-context variant). For confidential
inference in a Trusted Execution Environment: `qwen3.8-27b-tee`.

| Model | Input / output (per M tokens) | Context | Capabilities |
|-------|-------------------------------|--------:|--------------|
| `qwen3.6-35b-a3b` | $0.15 / $0.50 | 262k | vision, tools |
| `qwen3.8-27b` | $0.15 / $0.50 | 262k | vision, tools |
| `glm-5.3-flash` | $0.15 / $0.50 | 524k | vision, tools |
| `qwen3.5-122b-a10b` | $0.25 / $1.75 | 262k | vision, tools |
| `deepseek-v4.1-flash` | $0.25 / $1.75 | 262k | vision, tools |
| `glm-5.3` | $1.40 / $4.40 | 262k | tools |

Thinking variants exist with a `-thinking` suffix (for example `qwen3.8-27b-thinking`). The live, authoritative list
with current pricing is on the [Text API page](/apis/text/#available-models), or via `GET /v1/models`.

## See also

- [Quickstart](/quickstart.html) — first API call in under five minutes
- [Text usage](/apis/text/usage.html) — streaming, function calling, vision, direct CRN access
- [Trust model & TEE](/concepts/trust-model.html) — what the 🔒 flag guarantees
- [x402 payments](/apis/x402.html) — pay per request without an API key
