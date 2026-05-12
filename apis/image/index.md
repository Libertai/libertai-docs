# Image generation

LibertAI offers image generation models with competitive pricing. Generate high-quality images from text prompts via
two compatible endpoints — Stable Diffusion WebUI and OpenAI's image generation format.

<ModelsPricing category="image" />

## API endpoints

### Stable Diffusion WebUI API (sdapi)

Compatible with the Stable Diffusion WebUI format.

- **Endpoint:** `POST https://api.libertai.io/sdapi/v1/txt2img`

```json
{
  "model": "z-image-turbo",
  "prompt": "a cute cat, anime style",
  "width": 512,
  "height": 512
}
```

```json
{ "images": ["<base64_encoded_image>"] }
```

### OpenAI-compatible API

Compatible with [OpenAI's image generation format](https://platform.openai.com/docs/api-reference/images/create).

- **Endpoint:** `POST https://api.libertai.io/v1/images/generations`

```json
{
  "model": "z-image-turbo",
  "prompt": "a cute cat, anime style",
  "size": "512x512"
}
```

```json
{ "data": [{ "b64_json": "<base64_encoded_image>" }] }
```

## Usage examples

:::tabs

== Shell
```sh
curl -s -X POST "https://api.libertai.io/sdapi/v1/txt2img" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "z-image-turbo",
    "prompt": "a cute cat, anime style",
    "width": 512,
    "height": 512
  }' \
  | jq -r '.images[0]' | base64 -d > output.png

# OpenAI-compatible
curl -s -X POST "https://api.libertai.io/v1/images/generations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "z-image-turbo",
    "prompt": "a cute cat, anime style",
    "size": "512x512"
  }' \
  | jq -r '.data[0].b64_json' | base64 -d > output.png
```

== Python
```python
import base64
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.libertai.io/v1",
)

resp = client.images.generate(
    model="z-image-turbo",
    prompt="a cute cat, anime style",
    size="512x512",
    response_format="b64_json",
)

with open("output.png", "wb") as f:
    f.write(base64.b64decode(resp.data[0].b64_json))
```

== TypeScript
```ts
import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: "YOUR_API_KEY",
  baseURL: "https://api.libertai.io/v1",
});

const resp = await client.images.generate({
  model: "z-image-turbo",
  prompt: "a cute cat, anime style",
  size: "512x512",
  response_format: "b64_json",
});

fs.writeFileSync("output.png", Buffer.from(resp.data[0].b64_json, "base64"));
```

:::

## Parameters

### Required

- `model` — model ID, e.g. `z-image-turbo`
- `prompt` — text description of the image

### sdapi optional parameters

- `width`, `height` — image size in pixels (default: 1024)
- `steps` — diffusion steps (default: 9 — more steps = higher quality, slower)
- `seed` — seed for deterministic generation
- `n` — number of images (default: 1, max: 4)
- `remove_background` — strip the background post-generation (default: false)

### OpenAI-compatible optional parameters

- `size` — `WIDTHxHEIGHT` (e.g. `512x512`, default `1024x1024`)
- `n` — number of images (default: 1, max: 4)
- `remove_background` — strip the background post-generation (default: false)

## Direct model interaction

You can call the image model's CRN host directly using `GET /libertai/models` for discovery and the same
`/sdapi/v1/txt2img` or `/v1/images/generations` paths on the host with your LibertAI API key. The pattern, trade-offs,
and code samples are documented once in the text guide:
[Direct model interaction](../text/usage.md#direct-model-interaction).

## See also

- [Quickstart](/quickstart)
- [x402 payments](/apis/x402) — pay per request without an API key
- [Architecture](/architecture)
