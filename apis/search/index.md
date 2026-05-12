# Web search

LibertAI provides a privacy-preserving web search API that queries multiple engines in parallel, deduplicates results
by URL, and re-ranks them by cross-engine consensus. It also exposes a `fetch` endpoint that returns the cleaned
readable text of a page — useful for grounding LLM responses.

Search is billed per query, per engine — only successful engines are charged. See [Usage](./usage.md) for endpoints,
parameters, and examples.

You can also use search through [LiberClaw.ai](https://liberclaw.ai), the LibertAI search frontend.

<ModelsPricing category="search" />

## See also

- [Search usage](./usage.md) — endpoints, engines, search types, code examples
- [x402 payments](/apis/x402) — pay per request without an API key
- [Architecture](/architecture)
