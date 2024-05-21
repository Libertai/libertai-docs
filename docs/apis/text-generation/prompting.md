# Prompt formatting

Each mode has its own formatting. Knowing which format you should provide for a specific model will help getting better results out of it.
Please refer to the available models table to know which format is the best for your model.

## Simple format (user-assistant)

The bare minimum, that works with nearly all chat-oriented models is to use a chat-log style pattern.

Example:
```
USER: {prompt}
ASSISTANT:
```

You then let the model continue the conversation. You can also add a system prompt just before.

```
{system}

USER: {prompt}
ASSISTANT:
```

## Alpaca format

Following the release of alpaca by stanford, the [instruction prompting used in their dataset](https://github.com/tatsu-lab/stanford_alpaca#data-release) has been widely used in models.

Example of prompting:
```
Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{instruction}

### Input:
{input}

### Response:
```

Please note that the input part is optional. There has been variants of it for chats too. Where each chat participant has its name prepended with "### " and replaces the Instruction/Input/Response pattern:

```
{system}

### USER:
{prompt}

### ASSISTANT:
```


## ChatML

ChatML format has become a standard to avoid prompt injection.

Here is an example of its use:

```
<|im_start|>system 
Provide some context and/or instructions to the model.
<|im_end|> 
<|im_start|>user 
The user’s message goes here
<|im_end|> 
<|im_start|>assistant 
```

You then let the model continue, and it will create an answer for the assistant.
