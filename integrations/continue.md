# Continue

[Continue](https://continue.dev) is an open-source AI assistant for VS Code and JetBrains IDEs. Configured against
LibertAI, chat, edit, and apply all run on open-weights models, and switching providers later is a one-line config
change.

## Prerequisites

- The [Continue extension](https://docs.continue.dev/getting-started/install) installed in your IDE
- A LibertAI API key — see [Get an API key](./index.md#get-an-api-key)

## Configure

Continue is configured through `config.yaml` (`~/.continue/config.yaml`, or open it via the Continue panel with
**settings gear → Open configuration file**). Add a LibertAI model using the generic `openai` provider with a custom
`apiBase`:

```yaml
models:
  - name: LibertAI Qwen 3.5 122B
    provider: openai
    model: qwen3.5-122b-a10b
    apiBase: https://api.libertai.io/v1
    apiKey: YOUR_API_KEY
    roles:
      - chat
      - edit
      - apply
```

Save the file; Continue reloads the configuration automatically. You can add several entries (for example a second
one with `model: qwen3.6-35b-a3b`) and switch between them in the model dropdown.

## Verify it works

Open the Continue chat panel, select the LibertAI model in the model dropdown, and send:

```
Say "ready" if you can hear me.
```

If you get a reply, chat is working. Highlight some code and use **Edit** to confirm the `edit` role too. On a `401`,
check the key directly:

```sh
curl -i https://api.libertai.io/libertai/auth/check \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Models

`qwen3.5-122b-a10b` is the recommended default for coding (262k context, vision, tools). See the full
[model and pricing table](./index.md#models) for budget and TEE options.
