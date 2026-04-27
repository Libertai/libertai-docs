# Usage

The search API provides the following endpoints on `https://api.libertai.io`:
- `POST /search`: Search across multiple engines (Google, Bing, DuckDuckGo)
- `POST /search/fetch`: Fetch and clean content from a URL
- `GET /search/health`: Health check (no auth required)
- `GET /search/workers`: List available workers (no auth required)

`/search` and `/search/fetch` require an API key. Create one in the [Developer console](https://console.libertai.io).

## API Reference

### POST `/search`

Search the web across multiple engines simultaneously. Results are aggregated, deduplicated by URL, and ranked by cross-engine consensus.

**Request:**

```json
{
  "query": "rust programming language",
  "engines": ["google", "bing", "duckduckgo"],
  "max_results": 10,
  "search_type": "web"
}
```

| Field         | Required | Default                            | Description                                      |
| ------------- | -------- | ---------------------------------- | ------------------------------------------------ |
| `query`       | Yes      |                                    | Search query string                              |
| `engines`     | No       | `["google", "bing", "duckduckgo"]` | Engines to query: `google`, `bing`, `duckduckgo` |
| `max_results` | No       | `10`                               | Maximum results per engine                       |
| `search_type` | No       | `"web"`                            | Type of search: `web`, `news`, `images`          |

**Response:**

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

### POST `/search/fetch`

Fetch a URL and return its cleaned readable text content.

**Request:**

```json
{
  "url": "https://example.com/article"
}
```

**Response:**

```json
{
  "url": "https://example.com/article",
  "title": "Article Title",
  "content": "The cleaned article text content...",
  "word_count": 1234
}
```

:::tabs

== Shell
```sh
# Web Search
curl -X POST https://api.libertai.io/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "query": "rust programming language",
    "engines": ["google", "bing"],
    "max_results": 10
  }'

# News Search
curl -X POST https://api.libertai.io/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "query": "artificial intelligence",
    "engines": ["google", "bing"],
    "search_type": "news",
    "max_results": 5
  }'

# Image Search
curl -X POST https://api.libertai.io/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "query": "rust programming logo",
    "engines": ["google"],
    "search_type": "images",
    "max_results": 5
  }'

# Fetch URL Content
curl -X POST https://api.libertai.io/search/fetch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "url": "https://doc.rust-lang.org/book/"
  }'
```

== Python
```python
import requests

# Web Search
response = requests.post(
    "https://api.libertai.io/search",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    json={
        "query": "rust programming language",
        "engines": ["google", "bing", "duckduckgo"],
        "max_results": 10
    }
)

results = response.json()
for result in results["results"]:
    print(f"{result['title']} - {result['url']}")
    print(f"Found in: {result['found_in']}")
    print()

# News Search
news_response = requests.post(
    "https://api.libertai.io/search",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "query": "artificial intelligence",
        "engines": ["google", "bing"],
        "search_type": "news"
    }
)

# Fetch content
fetch_response = requests.post(
    "https://api.libertai.io/search/fetch",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={"url": "https://doc.rust-lang.org/book/"}
)

content = fetch_response.json()
print(f"Title: {content['title']}")
print(f"Word count: {content['word_count']}")
```

== TypeScript
```ts
import fetch from 'node-fetch';

// Web Search
const response = await fetch('https://api.libertai.io/search', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'rust programming language',
    engines: ['google', 'bing'],
    max_results: 10
  })
});

const data = await response.json();
for (const result of data.results) {
  console.log(`${result.title} - ${result.url}`);
  console.log(`Found in engines: ${result.found_in.join(', ')}`);
}

// News Search
const newsResponse = await fetch('https://api.libertai.io/search', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'artificial intelligence',
    engines: ['google', 'bing'],
    search_type: 'news'
  })
});

// Fetch content
const fetchResponse = await fetch('https://api.libertai.io/search/fetch', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://doc.rust-lang.org/book/'
  })
});

const content = await fetchResponse.json();
console.log(content.content);
```

:::

## Advanced Examples

### Cross-Engine Consensus Scoring

Results appearing in multiple engines are ranked higher. Use the `found_in` array to implement custom scoring:

```python
import requests

response = requests.post(
    "https://api.libertai.io/search",
    json={"query": "rust programming", "engines": ["google", "bing", "duckduckgo"]}
)

for result in response.json()["results"]:
    # Higher score for results found in multiple engines
    consensus_score = len(result["found_in"])
    print(f"{consensus_score}/3 engines: {result['title']}")
```

### Error Handling

The API returns partial results when some engines fail:

```python
import requests
from requests.exceptions import RequestException

try:
    response = requests.post(
        "https://api.libertai.io/search",
        json={"query": "test", "engines": ["google", "bing"]},
        timeout=30
    )

    if response.status_code == 503:
        print("All engines failed")
    else:
        data = response.json()
        print(f"Engines used: {data['meta']['engines_used']}")
        print(f"Engines failed: {data['meta']['engines_failed']}")

except RequestException as e:
    print(f"Request failed: {e}")
```

### Image Search with Metadata

```javascript
const response = await fetch('https://api.libertai.io/search', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
  body: JSON.stringify({
    query: 'rust programming logo',
    engines: ['google'],
    search_type: 'images',
    max_results: 5
  })
});

const data = await response.json();
for (const result of data.results) {
  console.log({
    title: result.title,
    thumbnail: result.thumbnail_url,
    fullSize: result.image_url,
    dimensions: `${result.width}x${result.height}`
  });
}
```

## Rate Limits

- **Timeout:** 10 seconds per engine (engines queried in parallel)
- **Partial results:** If some engines succeed and others fail, you receive results from successful engines
- **Error details:** Check `meta.engine_errors` for per-engine failure reasons

## Supported Search Types

| Search Type | Google | Bing | DuckDuckGo |
| ----------- | ------ | ---- | ---------- |
| `web`       | Yes    | Yes  | Yes        |
| `news`      | Yes    | Yes  | No         |
| `images`    | Yes    | Yes  | No         |

### Response Fields by Search Type

| Field           | Present for | Description            |
| --------------- | ----------- | ---------------------- |
| `thumbnail_url` | `images`    | Thumbnail image URL    |
| `image_url`     | `images`    | Full-size image URL    |
| `width`         | `images`    | Image width in pixels  |
| `height`        | `images`    | Image height in pixels |
| `published_at`  | `news`      | Publication date       |
| `source`        | `news`      | News source name       |
