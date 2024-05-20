# Text Generation

Text generation is supported on the network. 

As explained in the [architecture](/architecture) page, inference takes place in virtual machines.

We are providing multiple VMs, with an inference stack that can change with time. It means the API is subject to change on newer models.

## Available models

| Model                  | Base     | API type    | Prompt format | Base URL | Completion URL |
| ---------------------- | -------- | ----------- | ------------- | -------- | -------------- |
| NeuralBeagle 7B     | Mistral  | [Llama-like](/apis/text-generation/llama)  | [ChatML](/apis/text-generation/prompting#chatml)        | [API Url](https://curated.aleph.cloud/vm/a8b6d895cfe757d4bc5db9ba30675b5031fe3189a99a14f13d5210c473220caf/) | [ Completion Url](https://curated.aleph.cloud/vm/a8b6d895cfe757d4bc5db9ba30675b5031fe3189a99a14f13d5210c473220caf/completion) |
| NeuralBeagle 7B     | Mistral  | [OpenAI-compatible](/apis/text-generation/openai)  | [ChatML](/apis/text-generation/prompting#chatml)        | [API Base Url](https://curated.aleph.cloud/vm/a8b6d895cfe757d4bc5db9ba30675b5031fe3189a99a14f13d5210c473220caf/v1/) | [ Completion Url](https://curated.aleph.cloud/vm/a8b6d895cfe757d4bc5db9ba30675b5031fe3189a99a14f13d5210c473220caf/v1/chat/completions) |
| Mixtral Instruct 8x7B MoE       | Mixtral  | [Llama-like](/apis/text-generation/llama)  | [ChatML](/apis/text-generation/prompting#chatml) or [Alpaca Instruct](/apis/text-generation/prompting#alpaca-format)       | [API Url](https://curated.aleph.cloud/vm/cb6a4ae6bf93599b646aa54d4639152d6ea73eedc709ca547697c56608101fc7/) | [ Completion Url](https://curated.aleph.cloud/vm/cb6a4ae6bf93599b646aa54d4639152d6ea73eedc709ca547697c56608101fc7/completion) |
| DeepSeek Coder 6.7B    | DeepSeek | [Llama-like](/apis/text-generation/llama)  | [Alpaca Instruct](/apis/text-generation/prompting#alpaca-format)        | [API Url](https://curated.aleph.cloud/vm/b950fef19b109ef3770c89eb08a03b54016556c171b9a32475c085554b594c94) | [ Completion Url](https://curated.aleph.cloud/vm/b950fef19b109ef3770c89eb08a03b54016556c171b9a32475c085554b594c94/completion) |

## API details

Please see the according API documentation based on the model of your choice:

- [LLama-like API](/apis/text-generation/llama)
- [OpenAI-compatible API](/apis/text-generation/openai)

## Prompting formats

Each mode has its own formatting. Knowing which format you should provide for a specific model will help getting better results out of it. Please refer to the available models table to know which format is the best for your model.

- [Simple](/apis/text-generation/prompting#simple-format-user-assistant)
- [Alpaca](/apis/text-generation/prompting#alpaca-format)
- [ChatML](/apis/text-generation/prompting#chatml)
