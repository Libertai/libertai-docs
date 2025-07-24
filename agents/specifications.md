# Specifications

Looking for the technologies and models supported by LibertAI agents?\
You're in the right place 😎

## Models 🧠 {#models}

You can use any of [our text inference models](/apis/text/#available-models) that supports function calling.

::: tip
For now we recommend that you stick with `hermes-3-8b-tee` as `gemma-3-27b` has a specific way of handling tool calls that may not be supported by the framework you choose.\
We are planning some improvements on this part and will update this documentation once Gemma & other models can be used easily.
:::

## Frameworks 🧰 {#frameworks}

The frameworks listed bellow are the ones that have been tested by our team and community.\
Other open-source frameworks might be compatible if they support custom OpenAI-compatible providers, feel free to [reach out on Telegram](https://t.me/libertai) for additional integration support

- [Pydantic AI](https://ai.pydantic.dev/)
- [LibertAI's framework](https://pypi.org/project/libertai-agents/) (will be deprecated in the future)
