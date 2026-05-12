# Usage

Search exposes two endpoints, both served through the main LibertAI gateway:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/search` | Query one or more engines in parallel and get a unified, deduplicated, consensus-ranked list of results |
| `POST` | `/search/fetch` | Fetch a URL and return its cleaned readable text |

**Base URL:** `https://api.libertai.io`

**Authentication:** pass your LibertAI API key as `Authorization: Bearer YOUR_API_KEY` (get one from the
[Developer console](https://console.libertai.io)). You can also pay per request without an API key via
[x402 payments](../x402.md).

## `POST /search`

Run the same query against several engines at once. Results are deduplicated by URL, with `found_in` listing every engine
that returned that URL, so you can rank by cross-engine consensus.

### Request

```json
{
  "query": "rust programming language",
  "engines": ["google", "bing", "duckduckgo"],
  "max_results": 10,
  "search_type": "web"
}
```

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `query` | Yes | — | Search query string |
| `engines` | No | `["google", "bing", "duckduckgo"]` | Engines to query — see [Engines](#engines) |
| `max_results` | No | `10` | Maximum results per engine |
| `search_type` | No | `"web"` | One of `web`, `news`, `images`, `academic` |

### Response

```json
{
  "results": [
    {
      "title": "The Rust Programming Language",
      "url": "https://doc.rust-lang.org/book/",
      "snippet": "Official documentation for the Rust programming language...",
      "engine": "google",
      "rank": 1,
      "found_in": ["google", "bing"],
      "search_type": "web"
    }
  ],
  "meta": {
    "duration_ms": 1234,
    "engines_used": ["google", "bing", "duckduckgo"],
    "engines_failed": [],
    "engine_errors": []
  }
}
```

#### Result fields

| Field | Always present | Description |
|-------|----------------|-------------|
| `title`, `url`, `snippet` | Yes | Standard result fields |
| `engine` | Yes | The engine whose ranking is reflected in `rank` |
| `rank` | Yes | Position in the original engine's results (1-indexed) |
| `found_in` | Yes | Engines that returned this URL — use it for consensus scoring |
| `search_type` | Yes | Echoes the request's `search_type` |
| `published_at`, `source` | `news` results | Publication date and news source name |
| `thumbnail_url`, `image_url`, `width`, `height` | `images` results | Image-specific metadata |

#### Meta fields

| Field | Description |
|-------|-------------|
| `duration_ms` | Total wall-clock time |
| `engines_used` | Engines that returned at least one result |
| `engines_failed` | Engines that errored or timed out |
| `engine_errors` | `[{"engine": "...", "reason": "..."}]` — per-engine failure details |

## `POST /search/fetch`

Fetch a URL and return its readable text — useful for grounding LLM responses without writing your own scraper.

### Request

```json
{ "url": "https://example.com/article" }
```

### Response

```json
{
  "url": "https://example.com/article",
  "title": "Article Title",
  "content": "The cleaned article text content...",
  "word_count": 1234
}
```

## Examples

:::tabs

== Shell
```sh
# Web search
curl -X POST https://api.libertai.io/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "query": "rust programming language",
    "engines": ["google", "bing"],
    "max_results": 10
  }'

# News search
curl -X POST https://api.libertai.io/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "query": "artificial intelligence",
    "engines": ["google", "bing"],
    "search_type": "news",
    "max_results": 5
  }'

# Image search
curl -X POST https://api.libertai.io/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "query": "rust programming logo",
    "engines": ["google"],
    "search_type": "images",
    "max_results": 5
  }'

# Academic search
curl -X POST https://api.libertai.io/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "query": "transformer architecture",
    "engines": ["semantic_scholar"],
    "search_type": "academic"
  }'

# Fetch URL content
curl -X POST https://api.libertai.io/search/fetch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{ "url": "https://doc.rust-lang.org/book/" }'
```

== Python
```python
import requests

BASE = "https://api.libertai.io"
HEADERS = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
}

# Web search
response = requests.post(
    f"{BASE}/search",
    headers=HEADERS,
    json={
        "query": "rust programming language",
        "engines": ["google", "bing", "duckduckgo"],
        "max_results": 10,
    },
)
data = response.json()

for result in data["results"]:
    consensus = len(result["found_in"])
    print(f"[{consensus}x] {result['title']} — {result['url']}")

# Fetch a page
content = requests.post(
    f"{BASE}/search/fetch",
    headers=HEADERS,
    json={"url": "https://doc.rust-lang.org/book/"},
).json()

print(f"{content['title']} ({content['word_count']} words)")
```

== TypeScript
```ts
const BASE = "https://api.libertai.io";
const HEADERS = {
  Authorization: "Bearer YOUR_API_KEY",
  "Content-Type": "application/json",
};

// Web search
const response = await fetch(`${BASE}/search`, {
  method: "POST",
  headers: HEADERS,
  body: JSON.stringify({
    query: "rust programming language",
    engines: ["google", "bing"],
    max_results: 10,
  }),
});
const data = await response.json();

for (const result of data.results) {
  const consensus = result.found_in.length;
  console.log(`[${consensus}x] ${result.title} — ${result.url}`);
}

// Fetch a page
const content = await fetch(`${BASE}/search/fetch`, {
  method: "POST",
  headers: HEADERS,
  body: JSON.stringify({ url: "https://doc.rust-lang.org/book/" }),
}).then(r => r.json());

console.log(`${content.title} (${content.word_count} words)`);
```

:::

## Engines

Pick `engines` based on what `search_type` you want. Not every engine supports every type:

| Engine | `web` | `news` | `images` | `academic` |
|--------|:-----:|:------:|:--------:|:----------:|
| `google` | ✅ | ✅ | ✅ | — |
| `bing` | ✅ | ✅ | ✅ | — |
| `duckduckgo` | ✅ | — | — | — |
| `brave` | ✅ | — | — | — |
| `semantic_scholar` | — | — | — | ✅ |

If you ask an engine for a `search_type` it doesn't support, that engine reports an error in `engine_errors` and the
other engines still return results. See [Timeouts & partial results](#timeouts-partial-results).

For pricing per engine, see the [Available providers table](./index.md#available-models). You're only billed for
engines that successfully returned results.

## Timeouts & partial results

- Each engine is queried in parallel with a **10-second timeout**.
- Engines that succeed return results; engines that fail or time out are listed in `meta.engines_failed`, with
  reasons in `meta.engine_errors`.
- HTTP `503` is returned only when **every** requested engine fails.
- Use `meta.engines_used` to know which engines actually contributed to a given response.

```python
response = requests.post(
    f"{BASE}/search",
    headers=HEADERS,
    json={"query": "test", "engines": ["google", "bing"]},
    timeout=30,
)

if response.status_code == 503:
    print("All engines failed")
else:
    data = response.json()
    print(f"Used:   {data['meta']['engines_used']}")
    print(f"Failed: {data['meta']['engines_failed']}")
    for err in data["meta"]["engine_errors"]:
        print(f"  {err['engine']}: {err['reason']}")
```

## Direct host access?

Unlike the [text](../text/usage.md#direct-model-interaction) and image APIs, search has no per-CRN host you can call
directly — `/search` is gateway-only. Workers run behind a single upstream pool and are not registered in
`/libertai/models`. If you need to remove the gateway from your trust path, use a TEE-backed text model with direct
CRN access instead, then perform retrieval yourself.

## Consensus scoring

Results returned by multiple engines are stronger signals. Rank or filter on `found_in`:

```python
for result in response.json()["results"]:
    consensus = len(result["found_in"])
    if consensus >= 2:
        print(f"{consensus} engines agree: {result['title']}")
```

## See also

- [Engines & pricing](./index.md)
- [x402 payments](/apis/x402) — pay per request without an API key
- [Architecture](/architecture)
