<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { z } from 'zod'

const props = defineProps<{
  category: 'text' | 'image' | 'search' | 'embedding' | 'audio'
}>()

const TextCapsSchema = z.object({
  context_window: z.number(),
  function_calling: z.boolean(),
  reasoning: z.boolean(),
  tee: z.boolean().optional(),
  vision: z.boolean(),
}).optional()

const EmbeddingCapsSchema = z.object({
  context_window: z.number(),
  dimensions: z.number(),
}).optional()

const AudioCapsSchema = z.object({
  languages: z.array(z.string()),
  voices: z.array(z.string()),
}).optional()

const ModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  hf_id: z.string().optional(),
  capabilities: z.object({
    text: TextCapsSchema,
    image: z.boolean().optional(),
    search: z.boolean().optional(),
    embedding: EmbeddingCapsSchema,
    audio: AudioCapsSchema,
  }),
  pricing: z.object({
    text: z.object({
      price_per_million_input_tokens: z.number(),
      price_per_million_output_tokens: z.number(),
    }).optional(),
    image: z.number().optional(),
    search: z.number().optional(),
    embedding: z.object({
      price_per_million_input_tokens: z.number(),
    }).optional(),
    audio: z.object({
      price_per_million_input_characters: z.number(),
    }).optional(),
  }),
})

const RedirectionSchema = z.object({
  from: z.string(),
  to: z.string(),
  type: z.enum(['DEPRECATED', 'INTERNAL']),
  category: z.string(),
  description: z.string().optional(),
})

const AlephResponseSchema = z.object({
  data: z.object({
    LTAI_PRICING: z.object({
      models: z.array(ModelSchema),
      redirections: z.array(RedirectionSchema).optional().default([]),
    }),
  }),
})

const loading = ref(true)
const error = ref<string | null>(null)
const models = ref<z.infer<typeof ModelSchema>[]>([])
const deprecated = ref<z.infer<typeof RedirectionSchema>[]>([])

onMounted(async () => {
  try {
    const r = await fetch('https://api2.aleph.im/api/v0/aggregates/0xe1F7220D201C64871Cefb25320a8a588393eE508.json?keys=LTAI_PRICING')
    const data = AlephResponseSchema.parse(await r.json())
    models.value = data.data.LTAI_PRICING.models.filter(m => m.capabilities[props.category])
    deprecated.value = data.data.LTAI_PRICING.redirections
      .filter(r => r.type === 'DEPRECATED' && r.category === props.category)
  } catch (e: any) {
    error.value = e?.message ?? String(e)
  } finally {
    loading.value = false
  }
})

const noModels = computed(() => !loading.value && !error.value && models.value.length === 0)
</script>

<template>
  <div v-if="loading" class="mp-state">Loading models & pricing…</div>
  <div v-else-if="error" class="mp-state mp-error">Failed to load models & pricing.</div>
  <div v-else-if="noModels" class="mp-state">No data available.</div>

  <template v-else>
    <h2 id="available-models">Available models</h2>
    <div class="mp-list">
      <div v-for="m in models" :key="m.id" class="mp-card">
        <div class="mp-header">
          <div><strong>{{ m.name }}</strong> (<code>{{ m.id }}</code>)</div>
          <a v-if="m.hf_id" :href="`https://huggingface.co/${m.hf_id}`" target="_blank" rel="noopener noreferrer">View on HF</a>
        </div>
        <div v-if="m.capabilities.text" class="mp-caps">
          <span class="mp-ctx">{{ m.capabilities.text.context_window.toLocaleString() }} context window</span>
          <span v-if="m.capabilities.text.function_calling" class="mp-cap" title="Function calling supported">⚙️ tools</span>
          <span v-if="m.capabilities.text.vision" class="mp-cap" title="Vision (image input) supported">👁️ vision</span>
          <span v-if="m.capabilities.text.reasoning" class="mp-cap" title="Reasoning supported">🧠 reasoning</span>
          <span v-if="m.capabilities.text.tee" class="mp-cap" title="Running in a Trusted Execution Environment">🔒 TEE</span>
        </div>
        <div v-else-if="m.capabilities.embedding" class="mp-caps">
          <span class="mp-ctx">{{ m.capabilities.embedding.context_window.toLocaleString() }} context window</span>
          <span class="mp-cap" title="Embedding vector dimensions">📐 {{ m.capabilities.embedding.dimensions }} dimensions</span>
        </div>
        <div v-else-if="m.capabilities.audio" class="mp-caps">
          <span class="mp-ctx">{{ m.capabilities.audio.languages.length }} languages</span>
          <span class="mp-cap" title="Built-in voices">🗣️ {{ m.capabilities.audio.voices.length }} voices</span>
        </div>
      </div>
    </div>

    <h2 id="pricing">Pricing</h2>
    <div class="mp-table-wrap">
      <table class="mp-table">
        <thead v-if="category === 'text'">
          <tr><th>Model</th><th>Input</th><th>Output</th></tr>
        </thead>
        <thead v-else-if="category === 'image'">
          <tr><th>Model</th><th>Price per image</th></tr>
        </thead>
        <thead v-else-if="category === 'embedding'">
          <tr><th>Model</th><th>Price per 1M input tokens</th></tr>
        </thead>
        <thead v-else-if="category === 'audio'">
          <tr><th>Model</th><th>Price per 1M input characters</th></tr>
        </thead>
        <thead v-else>
          <tr><th>Engine</th><th>Price per query</th></tr>
        </thead>
        <tbody>
          <tr v-for="m in models" :key="m.id">
            <td>{{ m.name }}</td>
            <template v-if="category === 'text'">
              <td>{{ m.pricing.text ? `$${m.pricing.text.price_per_million_input_tokens.toFixed(2)} / 1M tokens` : '—' }}</td>
              <td>{{ m.pricing.text ? `$${m.pricing.text.price_per_million_output_tokens.toFixed(2)} / 1M tokens` : '—' }}</td>
            </template>
            <template v-else-if="category === 'image'">
              <td>{{ m.pricing.image != null ? `$${m.pricing.image.toFixed(4)}` : '—' }}</td>
            </template>
            <template v-else-if="category === 'embedding'">
              <td>{{ m.pricing.embedding != null ? `$${m.pricing.embedding.price_per_million_input_tokens.toFixed(2)} / 1M tokens` : '—' }}</td>
            </template>
            <template v-else-if="category === 'audio'">
              <td>{{ m.pricing.audio != null ? `$${m.pricing.audio.price_per_million_input_characters.toFixed(2)} / 1M characters` : '—' }}</td>
            </template>
            <template v-else>
              <td>{{ m.pricing.search != null ? `$${m.pricing.search.toFixed(4)}` : '—' }}</td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <template v-if="deprecated.length > 0">
      <h2>Deprecated models</h2>
      <p>The following names still work via redirection but should not be used in new code.</p>
      <div class="mp-table-wrap">
        <table class="mp-table">
          <thead><tr><th>Old name</th><th>Redirects to</th><th>Description</th></tr></thead>
          <tbody>
            <tr v-for="r in deprecated" :key="r.from">
              <td><code>{{ r.from }}</code></td>
              <td><code>{{ r.to }}</code></td>
              <td>{{ r.description || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </template>
</template>

<style scoped>
.mp-state {
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
  background-color: var(--vp-c-bg-soft);
}
.mp-error {
  background-color: rgba(255, 0, 0, 0.1);
  color: var(--vp-c-danger);
}
.mp-list {
  margin: 1rem 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.mp-card {
  padding: 0.75rem;
  border-radius: 6px;
  background-color: var(--vp-c-bg-soft);
}
.mp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.mp-header code {
  color: inherit !important;
}
.mp-caps {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
.mp-ctx {
  background-color: var(--vp-c-brand-soft);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}
.mp-cap {
  cursor: help;
}
.mp-table-wrap {
  overflow-x: auto;
  margin: 1rem 0 2rem;
}
.mp-table {
  width: 100%;
  border-collapse: collapse;
}
.mp-table th,
.mp-table td {
  border: 1px solid var(--vp-c-divider);
  padding: 0.6rem;
  text-align: left;
}
.mp-table th {
  background-color: var(--vp-c-bg-soft);
}
.mp-table code {
  color: inherit !important;
}
</style>
