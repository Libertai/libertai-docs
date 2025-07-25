# Create your first LibertAI agent with Pydantic AI

In this guide, we'll show you how to create and deploy a LibertAI agent using the [Pydantic AI framework](https://ai.pydantic.dev) 🚀

You can find the full code of this tutorial in our [GitHub repository](https://github.com/Libertai/libertai-agents/tree/main/examples/pydantic-ai)
## ⚙ Requirements

You need to have:
- IPv6 support on your network (run a command like `ping6 libertai.io` to make sure it works)
- a recent version of Python installed (3.9 or more, which is the range supported by Pydantic AI currently)
- a LibertAI Agent subscription (that you can get in [our developer console](https://console.libertai.io/agents) after logging in).
- a LibertAI API key (that you can also get in the [dev console](https://console.libertai.io/api-keys))

:::tip
If you are participating to one of our workshops, you should get a free subscription for a limited period of time, don't
hesitate to ask a team member if you don't see it in the UI 😄
:::

## Project setup 🧰 {#setup}

Let's get started!\
For this basic agent, we chose to use the official [Pydantic AI tool calling example](https://ai.pydantic.dev/tools/#registering-function-tools-via-decorator).\
You can go ahead and create a folder with a `main.py` file containing the example from Pydantic AI.

Then you need to setup your Python environment and install dependencies.\
We are using [Poetry](https://python-poetry.org/) here, but feel free to use your favorite tool:
```sh
poetry init
poetry add pydantic-ai python-dotenv
```

## Customize your agent 📈 {#customize}

Now let's start customizing it to integrate LibertAI's confidential inference 🚀\
Add the following code to create a custom OpenAI model provider:
```py
from dotenv import load_dotenv
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.openai import OpenAIProvider

load_dotenv()

# Custom provider to use LibertAI
model = OpenAIModel(
    "hermes-3-8b-tee",
    provider=OpenAIProvider(
        base_url="https://api.libertai.io/v1", api_key=os.getenv("LIBERTAI_API_KEY")
    ),
)
```

Then use the model in the agent instead of the default one:
```py
agent = Agent(
    model=model,
    deps_type=str,
    system_prompt=(
        "You're a dice game, you should roll the die and see if the number "
        "you get back matches the user's guess. If so, tell them they're a winner. "
        "Use the player's name in the response."
    ),
)
```

Your agent is now ready for a first test, run it with `python main.py` to make sure the LibertAI integration works correctly 😄

All good? Perfect, you now have 2 choices:
- You want your agent to have an API to be reachable from outside when deployed so you can interact with it
- You want your agent to be autonomous and run continuously in a loop

We will cover the first case here, but feel free to modify the agent for autonomous behaviors too!

:::tip
We are planning a dedicated tutorial for that, in the meantime we are available to help [on Telegram](https://t.me/libertai) if needed.
:::

## Add an API 🤖

Using your favorite package manager, install [FastAPI](https://fastapi.tiangolo.com/):
```sh
poetry add fastapi[standard]
```

And create a simple API route to expose the agent:
```py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="LibertAI x Pydantic AI Example",
)

class PromptRequest(BaseModel):
    prompt: str
    player_name: str


class PromptResponse(BaseModel):
    response: str


@app.post("/chat")
async def chat(request: PromptRequest) -> PromptResponse:
    result = await agent.run(request.prompt, deps=request.player_name)
    return PromptResponse(response=result.output)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
```

And again, run `python main.py` to make sure the API launches correctly (you can also try to make a request using the autogenerated documentation at <a href="http://localhost:8000/docs">localhost:8000/docs</a>).

## Deployment 🚀 {#deployment}

Now that your agent is ready, let's deploy it in a decentralized environment using [Aleph Cloud](https://aleph.cloud)!
For this, you need to install [our CLI](https://pypi.org/project/libertai-client) that will simplify the deployment
process.

You can do this inside on your system or inside your virtual environment (just make sure that it doesn't get added to
your agent project dependencies):

```shell
pip install libertai-client
```

You'll also need the ID of your agent that you got when subscribing in our UI.\
Make sure your `.env` file is similar to this one:

```text
LIBERTAI_API_KEY=YOUR-API-KEY
LIBERTAI_AGENT_ID=YOUR-AGENT-ID
```

You also need to create the `Dockerfile` and `docker-compose.yaml` files for the deployment.
Here are basic versions that work with Poetry and that you can customize if you use a different package manager:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

RUN pip install poetry

COPY ./pyproject.toml ./poetry.lock ./

RUN poetry install

COPY . .

CMD ["poetry", "run", "fastapi", "run", "main.py", "--host", "0.0.0.0"]
```

```text
services:
  libertai-agent:
    build:
      dockerfile: ./Dockerfile
    container_name: libertai-agent
    restart: always
    ports:
      - "8000:8000"
    env_file:
      - .env
```

Now you can run the following command to start deploying your agent:

```shell
libertai agent deploy <project_path>
```

Then you can sit back and relax while the CLI deploys your agent 😎\
It can take a few minutes the first time as your code and its dependencies are packaged and sent to the Aleph instance, installing Docker and the necessary dependencies.

Your LibertAI agent is now deployed on [Aleph](https://aleph.cloud)'s decentralized cloud 🚀\
You can now call it on the `/chat` endpoint to interact with it.

:::tip
Feel free to use the OpenAPI documentation at the `/docs` endpoint of your VM for the first call to familiarize yourself
with the route parameters if you haven't already!
:::

> 💡 You can also directly connect to the instance where you agent is running using the `ssh` command shown
> in the developer console to tweak and customize some details

That's it for this tutorial 😎\
If you'd like to go further, feel free to check [other Agent guides](../index.md) and
to [join our Telegram](https://t.me/libertai) if you need assistance from the team.
