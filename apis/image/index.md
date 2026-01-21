# Image Generation

LibertAI offers image generation models with competitive pricing.\
Generate high-quality images from text prompts using our API.

<script setup>
import { ref, onMounted } from 'vue'
import { z } from 'zod'

// Define schema for data validation
const ImagePricingSchema = z.number()

const ModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  hf_id: z.string(),
  capabilities: z.object({
    text: z.object({
      context_window: z.number(),
      function_calling: z.boolean(),
      reasoning: z.boolean(),
      tee: z.boolean().optional(),
      vision: z.boolean()
    }).optional(),
    image: z.boolean().optional()
  }),
  pricing: z.object({
    text: z.object({
      price_per_million_input_tokens: z.number(),
      price_per_million_output_tokens: z.number(),
    }).optional(),
    image: ImagePricingSchema.optional()
  })
})

const ModelsResponseSchema = z.object({
  models: z.array(ModelSchema)
})

const AlephResponseSchema = z.object({
  data: z.object({
    LTAI_PRICING: ModelsResponseSchema,
  }),
})

const modelsData = ref(null)
const loading = ref(true)
const error = ref(null)
const parseError = ref(null)

// Fetch and validate data
const fetchModelsData = async () => {
  try {
    const response = await fetch('https://api2.aleph.im/api/v0/aggregates/0xe1F7220D201C64871Cefb25320a8a588393eE508.json?keys=LTAI_PRICING')
    const data = await response.json()

    // Validate data with Zod schema
    const validatedData = AlephResponseSchema.parse(data)
    // Filter only image models
    const imageModels = validatedData.data.LTAI_PRICING.models.filter(model => model.capabilities.image)
    modelsData.value = { models: imageModels }
    loading.value = false
  } catch (err) {
    if (err.errors) {
      // This is a Zod validation error
      console.error(err.errors)
      parseError.value = `Validation error: ${err.errors.map(e => e.message).join(', ')}`
    } else {
      // This is a fetch or other error
      error.value = err
    }
    loading.value = false
  }
}

onMounted(fetchModelsData)
</script>

<div v-if="loading" class="loading">Loading models & pricing...</div>
<div v-else-if="parseError" class="error">{{ parseError }}</div>
<div v-else-if="error" class="error">Failed to load models & pricing. Please try again later.</div>
<div v-else-if="!modelsData" class="no-data">No data available</div>

<style>
.models-list {
  margin: 2rem 0;
}
.pricing-table {
  width: 100%;
  border-collapse: collapse;
}
.pricing-table th, .pricing-table td {
  border: 1px solid var(--vp-c-divider);
  padding: 0.6rem;
  text-align: left;
}
.pricing-table th {
  background-color: var(--vp-c-bg-soft);
}
.table-responsive {
  overflow-x: auto;
}
.loading, .error, .no-data {
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}
.loading {
  background-color: var(--vp-c-bg-soft);
}
.error {
  background-color: rgba(255, 0, 0, 0.1);
  color: var(--vp-c-danger);
}
code {
  color: initial !important;
}
.model-card {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  background-color: var(--vp-c-bg-soft);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

## Available Models

<div v-if="modelsData" class="models-list">
  <div v-for="model in modelsData.models" :key="model.id" class="model-card">
    <div class="model-header">
      <div>
        <strong>{{ model.name }}</strong> (<code>{{ model.id }}</code>)
      </div>
      <a :href="`https://huggingface.co/${model.hf_id}`" target="_blank" rel="noopener noreferrer">View on HF</a>
    </div>
  </div>
</div>

## Pricing

Image generation pricing is per image generated.

<div v-if="modelsData" class="table-responsive">
  <table class="pricing-table">
    <thead>
      <tr>
        <th>Model</th>
        <th>Price per Image</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="model in modelsData.models" :key="model.id">
        <td>{{ model.name }}</td>
        <td>${{ model.pricing.image.toFixed(4) }}</td>
      </tr>
    </tbody>
  </table>
</div>

## API Endpoints

LibertAI provides two compatible endpoints for image generation:

### 1. Stable Diffusion WebUI API (sdapi)

Compatible with Stable Diffusion WebUI format.

**Endpoint:** `POST https://api.libertai.io/sdapi/v1/txt2img`

**Request Body:**
```json
{
  "model": "z-image-turbo",
  "prompt": "a cute cat, anime style",
  "width": 512,
  "height": 512
}
```

**Response:**
```json
{
  "images": ["<base64_encoded_image>"]
}
```

### 2. OpenAI Compatible API

Compatible with [OpenAI's image generation format](https://platform.openai.com/docs/api-reference/images/create).

**Endpoint:** `POST https://api.libertai.io/v1/images/generations`

**Request Body:**
```json
{
  "model": "z-image-turbo",
  "prompt": "a cute cat, anime style",
  "size": "512x512"
}
```

**Response:**
```json
{
  "data": [
    {
      "b64_json": "<base64_encoded_image>"
    }
  ]
}
```

## Usage Examples

### Using curl

```bash
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
```

```bash
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

### Using Python

:::tabs
== OpenAI SDK
```python
from openai import OpenAI
import base64

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.libertai.io/v1"
)

response = client.images.generate(
    model="z-image-turbo",
    prompt="a cute cat, anime style",
    size="512x512",
    response_format="b64_json"
)

# Save the image
image_data = base64.b64decode(response.data[0].b64_json)
with open("output.png", "wb") as f:
    f.write(image_data)
```

== Requests
```python
import requests
import base64

response = requests.post(
    "https://api.libertai.io/v1/images/generations",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    json={
        "model": "z-image-turbo",
        "prompt": "a cute cat, anime style",
        "size": "512x512"
    }
)

# Save the image
image_data = base64.b64decode(response.json()["data"][0]["b64_json"])
with open("output.png", "wb") as f:
    f.write(image_data)
```
:::

### Using JavaScript/TypeScript

:::tabs
== Node.js
```javascript
import OpenAI from 'openai';
import fs from 'fs';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.libertai.io/v1'
});

const response = await client.images.generate({
  model: 'z-image-turbo',
  prompt: 'a cute cat, anime style',
  size: '512x512',
  response_format: 'b64_json'
});

// Save the image
const imageData = Buffer.from(response.data[0].b64_json, 'base64');
fs.writeFileSync('output.png', imageData);
```

== Fetch API
```javascript
const response = await fetch('https://api.libertai.io/v1/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'z-image-turbo',
    prompt: 'a cute cat, anime style',
    size: '512x512'
  })
});

const data = await response.json();

// Save the image (browser)
const imageData = atob(data.data[0].b64_json);
const blob = new Blob([new Uint8Array([...imageData].map(c => c.charCodeAt(0)))], { type: 'image/png' });
const url = URL.createObjectURL(blob);
```
:::

## Parameters

### Required

- `model`: The model ID to use for generation (e.g., `z-image-turbo`)
- `prompt`: Text description of the image to generate

### sdapi optional parameters

- `width`: Image width in pixels (default: 1024)
- `height`: Image height in pixels (default: 1024)
- `steps`: Number of steps (default: 9, more steps = higher quality but slower)
- `seed`: Seed to use to maintain consistency across generations
- `remove_background`: Enable to remove the background of the image after the generation (default: false)

### OpenAI-compatible optional parameters

- `size`: Image size in format `WIDTHxHEIGHT` (e.g., `512x512`, default `1024x1024`)
- `n`: Number of images to generate. Only `n=1` is supported right now, multiple images will be supported in the future
- `remove_background`: Enable to remove the background of the image after the generation (default: false)
