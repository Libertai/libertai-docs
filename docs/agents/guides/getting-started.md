# Create your first LibertAI agent

In this guide, we'll show you how to create and deploy a LibertAI agent 🚀

## ⚙ Requirements

You'll the need the following tools installed on your system:

- A [compatible version of Python](../specifications.md#python)
- Docker

and a LibertAI Agent subscription (that you should see in [our chat UI](https://chat.libertai.io/#/agents) after
connecting your wallet).
:::tip
If you are participating to one of our workshops, you should get a free subscription for a limited period of time, don't
hesitate to ask a team member if you don't see it in the UI 😄
:::

## 🧰 Project setup

Let's get started!\
To simplify your experience, you can use [our template repository](https://github.com/Libertai/libertai-agent-template)
to bootstrap your project.\
Simplify click the "Use this template" button in GitHub and clone the created repository.

You should end up with a structure similar to this one:

```text
template/
├─ src/
│  ├─ run
│  ├─ main.py
├─ .env.example
├─ .env.libertai.example
├─ .gitignore
├─ poetry.lock
├─ pyproject.toml
```

Here's a small explanation of the important files:

- `src/main.py` contains the boilerplate code and will be the main entrypoint of your agent
- `src/run` is shell script that is used for the agent deployment, you don't need to touch it
- `.env.example` and `.env.libertai.example` are files that you can rename to drop the `.example` suffix. The first can
  be used to pass
  environment variables to your program, while the `.libertai` one will be used in the [deployment step](#-deployment)
  (don't worry about it for now).

:::tip Dependency management
We are using [Poetry](https://python-poetry.org/) in this template to manage dependencies, hence the presence of
`pyproject.toml` and `poetry.lock` files.\
Feel free to use `pip` directly if you want and are more experienced with it!
:::

Take a moment to familiarize yourself with the few lines of code contained in `src/main.py`.\
As you can see, it's pretty simple:

- We are defining a function that gets the temperature of a given location 🌡
- Then creating a `ChatAgent` with
    - a given model among [the available ones](../specifications.md#-models) (your IDE
      should provide autocomplete for the model ID, else you can use the name from the model page
      on [HuggingFace](https://huggingface.co)) 🤗
    - a system prompt (useful if we want to add some context to the objectives of the agent)
    - a list of tools that includes our fake temperature function

And that's it!\
The `ChatAgent` object will contain a FastAPI application in its `app` property that you can expose and even extend with
your own routes if you need to (like the Hello World here).

Now let's see how we can use this base to create a useful agent 😎

## 📈 Customize your agent

Now the most interesting part: create the agent that fits your needs.\

Create your own tools, change the system prompt and give birth to any idea you have in mind 😄\
Feel free to install any dependency you might need, use environment variables... classic Python code 🐍

[//]: # (TODO)
> 🏗 More details are coming soon to this section to give you ideas, examples and tips

:::tip Non-API agent
If you don't want your agent to respond to users via an API call, you can use the `expose_api=False` parameter when
creating the agent, and instead use Python code to call the functions that correspond to the API routes (eg:
`agent.generate_answer`, `agent.get_model_information`...).\
This might be useful if you want to encapsulate your agent in a Telegram bot
using [pyTelegramBotAPI](https://github.com/eternnoir/pyTelegramBotAPI) for example (dedicated tutorial for this coming
soon 😉)
:::

## 🚀 Deployment

Now that your agent is ready, let's deploy it in a decentralized environment using [Aleph.im](https://aleph.im)!
For this, you need to install [our CLI](https://pypi.org/project/libertai-client) that will simplify the deployment
process.

You can do this inside on your system or inside your virtual environment (just make sure that it doesn't get added to
your agent project dependencies):

```shell
pip install libertai-client
```

You'll also need the ID of your agent and the related secret key that you got when subscribing in our UI.\
In the code template, you should see a `.env.libertai.example` file with a content similar to this one:

```text
# Public agent ID
LIBERTAI_AGENT_ID=

# Secret key that allows you to deploy or redeploy an agent
LIBERTAI_AGENT_SECRET=
```

Remove the `.example` from the file name and fill the values with the ones that you can
find [agents page](https://chat.libertai.io/#/agents) of our UI.

:::warning
The secret key should stay private, view it as an API key that anyone can use to modify your agent, including
redeploying it with a malicious code.
:::

If you don't have a `requirements.txt` file yet, you should create one that contains the list of your dependencies.
> 💡 With poetry you can use the [export command](https://python-poetry.org/docs/cli/#export) to generate one
> automatically

Finally, you can run the following command to start deploying your agent:

```shell
libertai agent deploy
```

It will ask you for:

- The path to your project (the current directory by default, press enter or change it if you are running the command
  from a different place)
- The path to the code (which is the place where you have the `run` and `main.py` files, `./src` by default or change it
  if needed)

Then you can sit back and relax while the CLI deploys your agent 😎\
It can take a few minutes as your code and its dependencies are packaged inside a Docker container and then sent to
our backend (that is itself located in an Aleph.im Confidential VM of course 😉) that will publish it on Aleph with
specific optimizations for your agent to run smoothly.\
Once everything is done, you should have a result similar to this one:\
![Agent deployment with libertai-client](/assets/agents/deploy.png)

Your LibertAI agent is now deployed on [Aleph](https://aleph.im)'s decentralized cloud 🚀\
You can now call it on the `/generate_answer` endpoint to get completion responses.

> 💡 Agents are currently deployed on serverless VMs for simplicity, so the first call might take some time (around 5
> seconds) for the VM to load on a random node of the Aleph network.\
> It will be garbage collected after some time without usage, so this might happen more or less frequently.\
> We are planning to offer more performant options for the stable release.

:::tip
Feel free to use the OpenAPI documentation at the `/docs` endpoint of your VM for the first call to familiarize yourself
with the route parameters if you haven't already!
:::

That's it for this tutorial 😎\
If you'd like to go further, feel free to check [other Agent guides](./index.md) and
to [join our Telegram](https://t.me/libertai) if you need assistance from the team.
