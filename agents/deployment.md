# Deployment

Deploy your agent to [Aleph Cloud](https://aleph.cloud) using the LibertAI CLI. The CLI handles wallet setup, credit purchase, instance creation, and code deployment — all in one command.

## Prerequisites

- Python 3.10+
- An agent project with a `docker-compose.yml` at the root
- An SSH key pair (auto-detected from `~/.ssh/` or pass `--ssh-key`)

## Install the CLI

```sh
pip install libertai-client
```

## Prepare your agent

Your agent directory must contain a `docker-compose.yml` (or `docker-compose.yaml`). The CLI uploads your code and runs `docker compose up -d --build` on the remote instance.

A minimal setup:

:::tabs

== TypeScript

```
my-agent/
├── src/
│   ├── index.ts
│   └── agent.ts
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── .env.prod          # created by the CLI on first deploy
```

**Dockerfile**
```dockerfile
FROM node:22-slim

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .

CMD ["npx", "tsx", "src/index.ts"]
```

**docker-compose.yml**
```yaml
services:
  agent:
    build: .
    restart: unless-stopped
    env_file:
      - path: .env.prod
        required: false
      - path: .env
        required: false
```

== Python

```
my-agent/
├── agent.py
├── config.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── .env.prod          # created by the CLI on first deploy
```

**Dockerfile**
```dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

CMD ["python", "agent.py"]
```

**docker-compose.yml**
```yaml
services:
  agent:
    build: .
    restart: unless-stopped
    env_file:
      - path: .env.prod
        required: false
      - path: .env
        required: false
```

:::

::: tip
`restart: unless-stopped` ensures your agent survives reboots — no systemd needed.
:::

## Deploy

From your agent directory:

```sh
libertai agentkit deploy
```

Or specify a path:

```sh
libertai agentkit deploy ./my-agent
```

### What happens

1. **Wallet** — generates a new Base wallet (or reuses one from `.env.prod`)
2. **Funding** — prompts you to send USDC to the wallet if the balance is low
3. **Credits** — buys Aleph Cloud credits with USDC via x402
4. **Instance** — creates an Aleph Cloud VM and waits for it to boot
5. **Deploy** — uploads your code, installs Docker, and runs `docker compose up -d --build`
6. **Verify** — confirms that the container is running

### Options

| Flag              | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `--ssh-key PATH`  | Path to SSH public key (default: auto-detect from `~/.ssh/`)       |
| `--credits FLOAT` | Amount in USD to spend on Aleph credits at creation (default: 1.0) |
| `--register-only` | Only create the Aleph instance, skip code deployment               |

## Stop

Tear down the Aleph instance and clean up resources:

```sh
libertai agentkit stop
```

This deletes the VM — your agent code remains on your local machine.

## Environment variables

The CLI creates `.env.prod` in your agent directory with the generated `WALLET_PRIVATE_KEY`. Your `docker-compose.yml` should reference it via `env_file` so the container picks it up.

Any variables in `.env` are also included. Use `.env` for local overrides and `.env.prod` for production secrets.

## Examples

Full working examples with Docker setup:
- [TypeScript](https://github.com/Libertai/libertai-agents/tree/main/examples/agentkit/typescript)
- [Python](https://github.com/Libertai/libertai-agents/tree/main/examples/agentkit/python)
