---
outline: [2,3]
---

# Llama-like API

Newer models are using the llama-like API, named after the [llama.cpp example server implementation](https://github.com/ggerganov/llama.cpp/blob/master/examples/server/README.md#api-endpoints) API.

## Examples

### Command-line

Using curl (on `Open Hermes 2.5 7B` model, change the URL to the correct model you want):
```bash
curl --request POST \
    --url https://curated.aleph.cloud/vm/a8b6d895cfe757d4bc5db9ba30675b5031fe3189a99a14f13d5210c473220caf/completion \
    --header "Content-Type: application/json" \
    --data '{"prompt": "Building a website can be done in 10 simple steps:","n_predict": 128}'
```

### Javascript (node.js)

You need to have Node.js installed.

```bash
mkdir llama-client
cd llama-client
```

Create a index.js file (again, on `Open Hermes 2.5 7B` model, change the URL to the correct model you want):

```javascript
const prompt = `Building a website can be done in 10 simple steps:`;

async function Test() {
    let response = await fetch("https://curated.aleph.cloud/vm/a8b6d895cfe757d4bc5db9ba30675b5031fe3189a99a14f13d5210c473220caf/completion", {
        method: 'POST',
        body: JSON.stringify({
            prompt,
            n_predict: 512,
        })
    })
    console.log((await response.json()).content)
}

Test()
```

And run it:

```bash
node index.js
```

### Python (requests)

You need to use Python 3 and have requests installed (I'm doing it in a virtualenv to avoid polluting your system):

```bash
mkdir llama-client
cd llama-client
virtualenv env
source env/bin/activate
pip install requests
```

Create a program.py file (again, on `Open Hermes 2.5 7B` model, change the URL to the correct model you want):
```python

import requests

API_URL = "https://curated.aleph.cloud/vm/a8b6d895cfe757d4bc5db9ba30675b5031fe3189a99a14f13d5210c473220caf/completion"

def get_response(prompt, length=None):
    params = {
        "prompt": prompt,
        "temperature": 0.9,
        "top_p": 1,
        "top_k": 40,
        "n": 1,
        "n_predict": length is None and 100 or length,
        "stop": ["\n", "Assistant:"]
    }
    response = requests.post(API_URL, json=params)
    if response.status_code == 200:
        return response.json()['content']
    else:
        return None
    
if __name__ == "__main__":
    response = get_response("User: Hello, how are you?\nAssistant: ")
    print(response)
```

And run it:
```bash
$ python program.py
```

#### Use with langchain

You can use it with langchain as well, here is an example custom LLM object in python:

```python
from typing import Any, List, Mapping, Optional

from langchain.callbacks.manager import CallbackManagerForLLMRun
from langchain.llms.base import LLM
import requests

API_BASE = "https://curated.aleph.cloud/vm/a8b6d895cfe757d4bc5db9ba30675b5031fe3189a99a14f13d5210c473220caf"

class Libertai(LLM):
    api_base: str = API_BASE
    temperature: float = 0.9
    top_p: float = 1
    top_k: int = 40
    cache_prompt: bool = True
    max_length: int = 100
    slot_id: int = -1
    session: requests.Session = None
    stop: list = ["<|"]

    @property
    def _llm_type(self) -> str:
        return "custom"

    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> str:
        """Call the LLM."""
        if self.session is None:
            self.session = requests.Session()

        params = {
            "prompt": prompt,
            "temperature": self.temperature,
            "top_p": self.top_p,
            "top_k": self.top_k,
            "n": 1,
            "n_predict": self.max_length,
            "stop": stop or self.stop,
            "slot_id": self.slot_id,
            "cache_prompt": True
        }
        print(params)
        response = requests.post(f"{self.api_base}/completion", json=params)
        if response.status_code == 200:
            output = response.json()
            print(output)
            self.slot_id = output['slot_id']
            return output['content']
        else:
            return None

    @property
    def _identifying_params(self) -> Mapping[str, Any]:
        """Get the identifying parameters."""
        return {
            "api_base": self.api_base,
            "temperature": self.temperature,
            "top_p": self.top_p,
            "top_k": self.top_k,
            "cache_prompt": self.cache_prompt,
            "max_length": self.max_length,
            }

openhermes = Libertai(api_base=API_BASE)
```

You can then use it with the rest of the langchain toolset.

## Caching context

If you are reusing context (or at least its beginning) from one call to another (static parts of the context, or chat usecase), you will want to cache it to speed-up inference.

Three things to do to keep it in cache:

- Set `cache_prompt` to true
- Keep the cookies (use a session in python, use pass_credentials in most js/ts libraries)
- keep the returned `slot_id` (use -1 the first time) and pass it to the next query

## API Endpoints

-   **POST** `/completion`: Given a `prompt`, it returns the predicted completion.

    *Options:*

    `prompt`: Provide the prompt for this completion as a string or as an array of strings or numbers representing tokens. Internally, the prompt is compared to the previous completion and only the "unseen" suffix is evaluated. If the prompt is a string or an array with the first element given as a string, a `bos` token is inserted in the front like `main` does.

    `temperature`: Adjust the randomness of the generated text (default: 0.8).

    `top_k`: Limit the next token selection to the K most probable tokens (default: 40).

    `top_p`: Limit the next token selection to a subset of tokens with a cumulative probability above a threshold P (default: 0.95).

    `min_p`: The minimum probability for a token to be considered, relative to the probability of the most likely token (default: 0.05).

    `n_predict`: Set the maximum number of tokens to predict when generating text. **Note:** May exceed the set limit slightly if the last token is a partial multibyte character. When 0, no tokens will be generated but the prompt is evaluated into the cache. (default: -1, -1 = infinity).

    `n_keep`: Specify the number of tokens from the prompt to retain when the context size is exceeded and tokens need to be discarded.
    By default, this value is set to 0 (meaning no tokens are kept). Use `-1` to retain all tokens from the prompt.

    `stream`: It allows receiving each predicted token in real-time instead of waiting for the completion to finish. To enable this, set to `true`.

    `stop`: Specify a JSON array of stopping strings.
    These words will not be included in the completion, so make sure to add them to the prompt for the next iteration (default: []).

    `tfs_z`: Enable tail free sampling with parameter z (default: 1.0, 1.0 = disabled).

    `typical_p`: Enable locally typical sampling with parameter p (default: 1.0, 1.0 = disabled).

    `repeat_penalty`: Control the repetition of token sequences in the generated text (default: 1.1).

    `repeat_last_n`: Last n tokens to consider for penalizing repetition (default: 64, 0 = disabled, -1 = ctx-size).

    `penalize_nl`: Penalize newline tokens when applying the repeat penalty (default: true).

    `presence_penalty`: Repeat alpha presence penalty (default: 0.0, 0.0 = disabled).

    `frequency_penalty`: Repeat alpha frequency penalty (default: 0.0, 0.0 = disabled);

    `mirostat`: Enable Mirostat sampling, controlling perplexity during text generation (default: 0, 0 = disabled, 1 = Mirostat, 2 = Mirostat 2.0).

    `mirostat_tau`: Set the Mirostat target entropy, parameter tau (default: 5.0).

    `mirostat_eta`: Set the Mirostat learning rate, parameter eta (default: 0.1).

    `grammar`: Set grammar for grammar-based sampling (default: no grammar)

    `seed`: Set the random number generator (RNG) seed (default: -1, -1 = random seed).

    `ignore_eos`: Ignore end of stream token and continue generating (default: false).

    `logit_bias`: Modify the likelihood of a token appearing in the generated text completion. For example, use `"logit_bias": [[15043,1.0]]` to increase the likelihood of the token 'Hello', or `"logit_bias": [[15043,-1.0]]` to decrease its likelihood. Setting the value to false, `"logit_bias": [[15043,false]]` ensures that the token `Hello` is never produced (default: []).

    `n_probs`: If greater than 0, the response also contains the probabilities of top N tokens for each generated token (default: 0)

    `image_data`: An array of objects to hold base64-encoded image `data` and its `id`s to be reference in `prompt`. You can determine the place of the image in the prompt as in the following: `USER:[img-12]Describe the image in detail.\nASSISTANT:` In this case, `[img-12]` will be replaced by the embeddings of the image id 12 in the following `image_data` array: `{..., "image_data": [{"data": "<BASE64_STRING>", "id": 12}]}`. Use `image_data` only with multimodal models, e.g., LLaVA.

    *Result JSON:*

    Note: When using streaming mode (`stream`) only `content` and `stop` will be returned until end of completion.

    `content`: Completion result as a string (excluding `stopping_word` if any). In case of streaming mode, will contain the next token as a string.

    `stop`: Boolean for use with `stream` to check whether the generation has stopped (Note: This is not related to stopping words array `stop` from input options)

    `generation_settings`: The provided options above excluding `prompt` but including `n_ctx`, `model`

    `model`: The path to the model loaded with `-m`

    `prompt`: The provided `prompt`

    `stopped_eos`: Indicating whether the completion has stopped because it encountered the EOS token

    `stopped_limit`: Indicating whether the completion stopped because `n_predict` tokens were generated before stop words or EOS was encountered

    `stopped_word`: Indicating whether the completion stopped due to encountering a stopping word from `stop` JSON array provided

    `stopping_word`: The stopping word encountered which stopped the generation (or "" if not stopped due to a stopping word)

    `timings`: Hash of timing information about the completion such as the number of tokens `predicted_per_second`

    `tokens_cached`: Number of tokens from the prompt which could be re-used from previous completion (`n_past`)

    `tokens_evaluated`: Number of tokens evaluated in total from the prompt

    `truncated`: Boolean indicating if the context size was exceeded during generation, i.e. the number of tokens provided in the prompt (`tokens_evaluated`) plus tokens generated (`tokens predicted`) exceeded the context size (`n_ctx`)

    `slot_id`: Assign the completion task to an specific slot. If is -1 the task will be assigned to a Idle slot (default: -1)

    `cache_prompt`: Save the prompt and generation for avoid reprocess entire prompt if a part of this isn't change (default: false)

    `system_prompt`: Change the system prompt (initial prompt of all slots), this is useful for chat applications.

-   **POST** `/tokenize`: Tokenize a given text.

    *Options:*

    `content`: Set the text to tokenize.

    Note that the special `BOS` token is not added in front of the text and also a space character is not inserted automatically as it is for `/completion`.

-   **POST** `/detokenize`: Convert tokens to text.

    *Options:*

    `tokens`: Set the tokens to detokenize.

-   **POST** `/infill`: For code infilling. Takes a prefix and a suffix and returns the predicted completion as stream.

    *Options:*

    `input_prefix`: Set the prefix of the code to infill.

    `input_suffix`: Set the suffix of the code to infill.

    It also accepts all the options of `/completion` except `stream` and `prompt`.

-   **GET** `/props`: Return the required assistant name and anti-prompt to generate the prompt in case you have specified a system prompt for all slots.
