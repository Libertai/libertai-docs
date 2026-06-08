# Usage

Our TTS models expose the OpenAI-compatible [Speech API](https://platform.openai.com/docs/api-reference/audio/createSpeech):
- `/v1/audio/speech`: synthesize speech audio from input text

This means you can use our TTS models with any of [the OpenAI SDKs](https://platform.openai.com/docs/libraries#install-an-official-sdk) or with any framework that supports custom OpenAI-compatible audio endpoints.

> 💡 Speech is billed on **input characters only**. v1 returns **WAV** audio; pass raw model voice IDs (e.g. `af_heart`) in the `voice` field.

## Examples

### Generate speech

:::tabs

== Shell
```sh
curl -X POST https://api.libertai.io/v1/audio/speech \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "kokoro",
    "input": "Hello from LibertAI.",
    "voice": "af_heart",
    "response_format": "wav"
  }' --output speech.wav
```

== Python
```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.libertai.io/v1",
    api_key="YOUR_API_KEY",
)

response = client.audio.speech.create(
    model="kokoro",
    input="Hello from LibertAI.",
    voice="af_heart",
    response_format="wav",
)
response.write_to_file("speech.wav")
```

== TypeScript
```ts
import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({
  baseURL: "https://api.libertai.io/v1",
  apiKey: "YOUR_API_KEY",
});

const response = await client.audio.speech.create({
  model: "kokoro",
  input: "Hello from LibertAI.",
  voice: "af_heart",
  response_format: "wav",
});

fs.writeFileSync("speech.wav", Buffer.from(await response.arrayBuffer()));
```

:::

## Parameters

| Field | Required | Notes |
|-------|:--------:|-------|
| `model` | ✅ | e.g. `kokoro` |
| `input` | ✅ | Text to synthesize (max 8192 characters) |
| `voice` | — | Raw model voice ID; defaults to the model's default voice (`af_heart` for Kokoro) |
| `response_format` | — | `wav` only (default) in the current release |
| `speed` | — | 0.25–4.0, default 1.0 |

## See also

- [x402 payments](/apis/x402) — pay per request without an API key
- [Architecture](/architecture)
