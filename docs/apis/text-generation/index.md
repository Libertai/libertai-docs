# Text Generation

Text generation is supported on the network.

As explained in the [architecture](../../architecture) page, inference takes place in virtual machines.

We are providing multiple VMs, with an inference stack that can change with time. It means the API is subject to change on newer models.

## Available models

| Model                  | Base     | API type    | Prompt format | Base URL | Completion URL |
| ---------------------- | -------- | ----------- | ------------- | -------- | -------------- |
| Function Calling (Hermes 2 pro) | Llama 3 8B |  [Llama-like](./llama.md)  | [ChatML](./prompting.md#chatml) | [API Url](https://curated.aleph.cloud/vm/84df52ac4466d121ef3bb409bb14f315de7be4ce600e8948d71df6485aa5bcc3/) | [ Completion Url](https://curated.aleph.cloud/vm/84df52ac4466d121ef3bb409bb14f315de7be4ce600e8948d71df6485aa5bcc3/completion) |
| NeuralBeagle 7B     | Mistral  | [Llama-like](./llama.md)  | [ChatML](./prompting.md#chatml)        | [API Url](https://curated.aleph.cloud/vm/a8b6d895cfe757d4bc5db9ba30675b5031fe3189a99a14f13d5210c473220caf/) | [ Completion Url](https://curated.aleph.cloud/vm/a8b6d895cfe757d4bc5db9ba30675b5031fe3189a99a14f13d5210c473220caf/completion) |
| NeuralBeagle 7B     | Mistral  | [OpenAI-compatible](./openai.md)  | [ChatML](./prompting.md#chatml)        | [API Base Url](https://curated.aleph.cloud/vm/a8b6d895cfe757d4bc5db9ba30675b5031fe3189a99a14f13d5210c473220caf/v1/) | [ Completion Url](https://curated.aleph.cloud/vm/a8b6d895cfe757d4bc5db9ba30675b5031fe3189a99a14f13d5210c473220caf/v1/chat/completions) |
| Mixtral Instruct 8x7B MoE       | Mixtral  | [Llama-like](./llama.md)  | [ChatML](./prompting.md#chatml) or [Alpaca Instruct](./prompting.md#alpaca-format)       | [API Url](https://curated.aleph.cloud/vm/cb6a4ae6bf93599b646aa54d4639152d6ea73eedc709ca547697c56608101fc7/) | [ Completion Url](https://curated.aleph.cloud/vm/cb6a4ae6bf93599b646aa54d4639152d6ea73eedc709ca547697c56608101fc7/completion) |
| DeepSeek Coder 6.7B    | DeepSeek | [Llama-like](./llama.md)  | [Alpaca Instruct](./prompting.md#alpaca-format)        | [API Url](https://curated.aleph.cloud/vm/b950fef19b109ef3770c89eb08a03b54016556c171b9a32475c085554b594c94) | [ Completion Url](https://curated.aleph.cloud/vm/b950fef19b109ef3770c89eb08a03b54016556c171b9a32475c085554b594c94/completion) |

## API details

Please see the according API documentation based on the model of your choice:

- [LLama-like API](./llama.md)
- [OpenAI-compatible API](./openai.md)

## Prompting formats

Each mode has its own formatting. Knowing which format you should provide for a specific model will help getting better results out of it. Please refer to the available models table to know which format is the best for your model.

- [Simple](./prompting.md#simple-format-user-assistant)
- [Alpaca](./prompting.md#alpaca-format)
- [ChatML](./prompting.md#chatml)
