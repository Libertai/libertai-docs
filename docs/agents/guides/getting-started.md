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

TODO: clone repository, explain code and archi, create tools, env vars etc

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

```dotenv
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

TODO: generate requirements.txt

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
TODO: add screenshot of result
