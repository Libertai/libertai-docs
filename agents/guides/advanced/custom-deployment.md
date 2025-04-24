# Deploy a custom AI Agent

In this guide, we'll cover the usage of a custom deployment script to handle any special use case you might have,
including (but not limited to):

- Customizing the runtime before the deployment
- Installing and connecting additional programs to your software (multi-agents architecture, in-memory or vector
  database...)
- Decentralizing the deployment of your agent deployed with another framework (not limited to Python, anything works)

So let's get started 🚀

## ⚙ Requirements

You just need to be familiar with shell scripting and Docker.

## ❓Understanding the deployment process

Let's first get a quick overview of the general deployment process so you can understand how to customize it.

LibertAI's agents deployment on [Aleph Cloud](https://aleph.cloud) instances is centered around a simple shell script that
you can find [in our repository](https://github.com/Libertai/libertai-agents/blob/main/deployment/deploy.sh).\
Every time a deployment is triggered, a ZIP archive of the code will be sent on the instance, along with this script
that has 3 main purposes:

- Making sure all the necessary tools (mainly Docker) are installed
- If an agent is already running, stopping it and cleaning its data properly
- Start the new version of the agent

This is done by receiving 3 information regarding the agent in the script's arguments:

- The Python version used in the project (to choose the right docker image)
- The package manager (to choose the right Dockerfile that will perform optimizations)
- The way the agent is triggered (to use the right entrypoint for the docker container)

## ✍ Customizing it

While it is great for most use cases, if you need to perform additional steps or want to deploy your agent in a
different way, you just have to write your own script (and Dockerfile if applicable).

:::tip Testing your script
We don't currently have an easy way for you to test this script, you can reach out to us and we'll give you a way to
reset your deployment instances on-demand to ease testing.
You can also use an Ubuntu VPS to manually run and test your script.
:::

Just remember a few things while creating your script:

- It will always receive the same arguments detailed above
- It should be able to handle all the possible scenarios, including
    - First deployment on a fresh instance (some tooling missing)
    - Deployment of a new version (older version needs to be properly stopped)
- It shouldn't emit unnecessary/unwanted logs on `stderr` (as those will always be reported in the CLI after deployments
  to help you debug)

> 💡 We are planning to provide a small scripts library in the future, please reach out to us if you'd like to contribute
> with your script!

## 🚀 Usage

Your script is ready to be used, or you want to test it?\
Either way, to use it install our CLI if you don't already have it:

```shell
pip install libertai-client
```

and use the `deploy` command with the `--deploy-script-url` option:

```shell
libertai agent deploy . --deploy-script-url https://link-to-your.com/script.sh
```

> 💡 It needs to be accessible online as we'll use `wget` to fetch it on the deployment instance.

And just like that, your AI Agent is deployed using your custom deployment process 😎\
If you'd like to go further, feel free to check [other guides](../index.md) and
to [join our Telegram](https://t.me/libertai) if you need assistance from the team.
