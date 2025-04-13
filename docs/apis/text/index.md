# Text Generation

LibertAI offers various models with competitive pricing for text generation.\
Models are categorized in tiers that each offer different intelligence & reasoning capabilities.

<script setup>
import { ref, onMounted } from 'vue'
import { z } from 'zod'

// Define schema for data validation
const TextPricingSchema = z.object({
  price_per_million_input_tokens: z.number(),
  price_per_million_input_cached_tokens: z.number(),
  price_per_million_output_tokens: z.number(),
})

const CategorySchema = z.object({
  name: z.string(),
  pricing: z.object({
    text: TextPricingSchema,
  }),
})

const ModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  link: z.string().url(),
  category: z.string(),
  capabilities: z.object({
    text: z.object({
      context_window: z.number(),
      function_calling: z.boolean(),
      reasoning: z.boolean()
    })
  })
})

const ModelsDataSchema = z.object({
  models: z.array(ModelSchema),
  categories: z.array(CategorySchema),
})

const AlephResponseSchema = z.object({
  data: z.object({
    TEST_LTAI_PRICING: ModelsDataSchema,
  }),
})

const modelsData = ref(null)
const loading = ref(true)
const error = ref(null)
const parseError = ref(null)

// Fetch and validate data
const fetchModelsData = async () => {
  try {
    const response = await fetch('https://api2.aleph.im/api/v0/aggregates/0xe1F7220D201C64871Cefb25320a8a588393eE508.json?keys=TEST_LTAI_PRICING')
    const data = await response.json()

    // Validate data with Zod schema
    const validatedData = AlephResponseSchema.parse(data)
    modelsData.value = validatedData.data.TEST_LTAI_PRICING
    loading.value = false
  } catch (err) {
    if (err.errors) {
      // This is a Zod validation error
      parseError.value = `Validation error: ${err.errors.map(e => e.message).join(', ')}`
    } else {
      // This is a fetch or other error
      error.value = err
    }
    loading.value = false
  }
}

onMounted(fetchModelsData)

// Helper function to group models by category
const getModelsByCategory = (category) => {
  if (!modelsData.value) return []
  return modelsData.value.models.filter(model => model.category === category)
}
</script>

<div v-if="loading" class="loading">Loading models & pricing...</div>
<div v-else-if="parseError" class="error">{{ parseError }}</div>
<div v-else-if="error" class="error">Failed to load models & pricing. Please try again later.</div>
<div v-else-if="!modelsData" class="no-data">No data available</div>

<style>
.models-list {
  margin: 2rem 0;
}
.category-section {
  margin-bottom: 1.5rem;
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
.model-capabilities {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}
.capability {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}
.context-length {
  background-color: var(--vp-c-brand-soft);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}
.capability-icon {
  font-size: 1.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-brand);
}
.capability-tooltip {
  position: relative;
  cursor: help;
}
.capability-tooltip .tooltip-text {
  visibility: hidden;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  text-align: center;
  border-radius: 4px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.8rem;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.capability-tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>

## Available Models

<div v-if="modelsData" class="models-list">
  <div v-for="category in modelsData.categories" :key="category.name" class="category-section">
    <h3>{{ category.name }} Tier</h3>
    <div v-if="getModelsByCategory(category.name).length > 0">
          <div v-for="model in getModelsByCategory(category.name)" :key="model.id" class="model-card">
            <div class="model-header">
              <div>
                <strong>{{ model.name }}</strong> (<code>{{ model.id }}</code>)
              </div>
              <a :href="model.link" target="_blank" rel="noopener noreferrer">View on HF</a>
            </div>
            <div class="model-capabilities">
              <div class="capability">
                <span class="context-length">{{ model.capabilities.text.context_window.toLocaleString() }} context window</span>
              </div>
              <div v-if="model.capabilities.text.function_calling" class="capability capability-tooltip">
                <span class="capability-icon">⚙️</span>
                <span class="tooltip-text">Function calling supported</span>
              </div>
              <div v-if="model.capabilities.text.reasoning" class="capability capability-tooltip">
                <span class="capability-icon">
                  🧠
                </span>
                <span class="tooltip-text">Reasoning supported</span>
              </div>
            </div>
          </div>
    </div>
    <p v-else>No models available in this tier</p>
  </div>
</div>

## Pricing

The pricing for our text generation models is based on token usage.\
Different model categories have different pricing tiers.

<div v-if="modelsData" class="table-responsive">
  <table class="pricing-table">
    <thead>
      <tr>
        <th></th>
        <th>Input</th>
        <th>Cached input</th>
        <th>Output</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="category in modelsData.categories" :key="category.name">
        <td>{{ category.name }}</td>
        <td>${{ category.pricing.text.price_per_million_input_tokens.toFixed(2) }} / 1M tokens</td>
        <td>${{ category.pricing.text.price_per_million_input_cached_tokens.toFixed(2) }} / 1M tokens</td>
        <td>${{ category.pricing.text.price_per_million_output_tokens.toFixed(2) }} / 1M tokens</td>
      </tr>
    </tbody>
  </table>
</div>
