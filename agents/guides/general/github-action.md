# LibertAI Agent Deployment - GitHub Action

## Overview

This guide covers how to use the **LibertAI Agent Deployment** GitHub Action to automate the deployment of your LibertAI agents using GitHub workflows. This action is designed to streamline the deployment process and ensure consistency across environments.

For more details on agent deployment, refer to the [LibertAI documentation](https://docs.libertai.io/agents/guides/general/getting-started.html) and the [GitHub repository](https://github.com/Libertai/deploy-agent-action).

---

## Basic Usage

The most common setup deploys your agent whenever changes are pushed to the `main` branch. Below is a basic example:

```yaml
name: Agent deployment

on:
  push:
    branches:
      - main

jobs:
  deploy-agent:
    name: Agent deployment
    runs-on: ubuntu-latest
    steps:
      - name: libertai deployment
        uses: libertai/deploy-agent-action@v0.1.0
        with:
          agent-id: ${{ secrets.AGENT_ID }}
          agent-secret: ${{ secrets.AGENT_SECRET }}
          dependency-management-tool: poetry
          python-version: 3.13.3
          usage-type: fastapi
```

### Using Environment Variables

For agents that require specific environment variables, you can provide them directly or use GitHub Secrets for better security. Here’s an example of adding environment variables:

```yaml
- name: libertai deployment
  uses: libertai/deploy-agent-action@v0.1.0
  with:
    agent-id: ${{ secrets.AGENT_ID }}
    agent-secret: ${{ secrets.AGENT_SECRET }}
    dependency-management-tool: poetry
    python-version: 3.13.3
    usage-type: fastapi
    agent-environment: |
      API-KEY=VALUE
      LOCALHOST_URL=http://localhost:3000
```

For larger environments, consider using encrypted secrets or `.env` files for better maintainability.

---

## Required Inputs - Agent ID and Secret

Both `AGENT_ID` and `AGENT_SECRET` secrets are mandatory for deploying your LibertAI agent. These credentials are essential for securely linking your GitHub repository to your agent instance. You can find these values in the [LibertAI chat](https://chat.libertai.io/#/agents) under your agent's settings.

Make sure to add these credentials as GitHub secrets to avoid exposing sensitive information in your workflows.

## Advanced Configuration

You can further customize this action to handle multiple environments or conditional deployments based on branches or PRs. Refer to the [GitHub Actions documentation](https://docs.github.com/en/actions) for more advanced patterns.
