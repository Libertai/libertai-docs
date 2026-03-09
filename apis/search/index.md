# Web Search

LibertAI offers web search models with competitive pricing.\
These models are currently available through [LiberClaw.ai](https://liberclaw.ai) and are not directly accessible via the API.

<script setup>
import { ref, onMounted } from 'vue'
import { z } from 'zod'

// Define schema for data validation
const ModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  hf_id: z.string().optional(),
  capabilities: z.object({
    text: z.object({
      context_window: z.number(),
      function_calling: z.boolean(),
      reasoning: z.boolean(),
      tee: z.boolean().optional(),
      vision: z.boolean()
    }).optional(),
    image: z.boolean().optional(),
    search: z.boolean().optional()
  }),
  pricing: z.object({
    text: z.object({
      price_per_million_input_tokens: z.number(),
      price_per_million_output_tokens: z.number(),
    }).optional(),
    image: z.number().optional(),
    search: z.number().optional()
  })
})

const RedirectionSchema = z.object({
  from: z.string(),
  to: z.string(),
  type: z.enum(['DEPRECATED', 'INTERNAL']),
  category: z.string(),
  description: z.string().optional()
})

const ModelsResponseSchema = z.object({
  models: z.array(ModelSchema),
  redirections: z.array(RedirectionSchema).optional().default([])
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
const deprecatedRedirections = ref([])

// Fetch and validate data
const fetchModelsData = async () => {
  try {
    const response = await fetch('https://api2.aleph.im/api/v0/aggregates/0xe1F7220D201C64871Cefb25320a8a588393eE508.json?keys=LTAI_PRICING')
    const data = await response.json()

    // Validate data with Zod schema
    const validatedData = AlephResponseSchema.parse(data)
    // Filter only search models
    const searchModels = validatedData.data.LTAI_PRICING.models.filter(model => model.capabilities.search)
    modelsData.value = { models: searchModels }

    // Filter DEPRECATED redirections for search models
    deprecatedRedirections.value = validatedData.data.LTAI_PRICING.redirections
      .filter(r => r.type === 'DEPRECATED' && r.category === 'search')

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

## Available Search Providers

<div v-if="modelsData" class="models-list">
  <div v-for="model in modelsData.models" :key="model.id" class="model-card">
    <div class="model-header">
      <div>
        <strong>{{ model.name }}</strong> (<code>{{ model.id }}</code>)
      </div>
    </div>
  </div>
</div>

## Pricing

Search pricing is per query.

<div v-if="modelsData" class="table-responsive">
  <table class="pricing-table">
    <thead>
      <tr>
        <th>Provider</th>
        <th>Price per Query</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="model in modelsData.models" :key="model.id">
        <td>{{ model.name }}</td>
        <td>${{ model.pricing.search.toFixed(4) }}</td>
      </tr>
    </tbody>
  </table>
</div>

<div v-if="deprecatedRedirections.length > 0">
  <h2>Deprecated Models</h2>
  <p>The following model names have been deprecated but still work through automatic redirection.</p>
  <div class="table-responsive">
    <table class="pricing-table">
      <thead>
        <tr>
          <th>Old Model Name</th>
          <th>Redirects To</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in deprecatedRedirections" :key="r.from">
          <td><code>{{ r.from }}</code></td>
          <td><code>{{ r.to }}</code></td>
          <td>{{ r.description || '-' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
