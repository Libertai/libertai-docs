---
outline: [ 2, 3 ]
---

# Specifications

Looking for the technologies and models supported by LibertAI agents?\
You're in the right place 😎

## 🧠 Models

We provide several open-source models running in decentralized instances with agentic capabilities that can be used in
our framework:

- [Hermes 3 - 8B version](https://huggingface.co/NousResearch/Hermes-3-Llama-3.1-8B) (fast)
- [Mistral Nemo Instruct 2407](https://huggingface.co/mistralai/Mistral-Nemo-Instruct-2407) (big context window)

### Using a gated model

Some models, like [Mistral-Nemo-Instruct-2407](https://huggingface.co/mistralai/Mistral-Nemo-Instruct-2407) are gated
(generally to require you to accept some usage conditions).\
To use those models, you need to create an [access token](https://huggingface.co/settings/tokens) from your Hugging Face
account and pass it to the `get_model` function.
