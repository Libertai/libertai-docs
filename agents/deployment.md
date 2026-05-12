# Deployment

Deploy your agent to [Aleph Cloud](https://aleph.cloud) using the LibertAI CLI. The CLI handles wallet setup,
credit purchase, instance creation, and code deployment — all in one command.

## Prerequisites

- Python 3.11+ (≤ 3.13)
- An agent project with a `docker-compose.yml` at the root
- An SSH key pair (auto-detected from `~/.ssh/` or pass `--ssh-key`)
- A wallet with USDC on Base — the CLI prompts you to fund it during the first deploy

## Install the CLI

```sh
pip install libertai-client
```

## Prepare your agent

Your agent directory must contain a `docker-compose.yml` (or `docker-compose.yaml`). The CLI uploads your code and
runs `docker compose up -d --build` on the remote instance.

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
FROM node:24-slim

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

ENV PYTHONUNBUFFERED=1

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
`restart: unless-stopped` ensures the Docker daemon respawns your container after host reboots. Prefer `-slim` or
`-alpine` base images — Aleph VMs are billed for storage, and the default disk is small.
:::

::: warning Compose version
The `env_file: [{ path, required }]` syntax above needs Docker Compose **v2.24+**. The CLI installs a recent Docker
on the VM, so deploys are fine; if you're testing locally with an older Compose, fall back to the flat list form:

```yaml
env_file:
  - .env.prod
  - .env
```

The flat form requires both files to exist — touch an empty `.env` if you don't have one.
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
3. **Credits** — buys Aleph Cloud credits with USDC via [x402](/apis/x402)
4. **Instance** — creates an Aleph Cloud VM and waits for it to boot
5. **Deploy** — uploads your code, installs Docker, and runs `docker compose up -d --build`
6. **Verify** — confirms that the container is running

### Options

| Flag              | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `--ssh-key PATH`  | Path to SSH public key (default: auto-detect from `~/.ssh/`)       |
| `--credits FLOAT` | Amount in USD to spend on Aleph credits at creation (default: 1.0) |
| `--register-only` | Only create the Aleph instance, skip code deployment               |

## VM specs and cost

By default the CLI provisions a small Aleph VM:

- **2 vCPUs, 4 GB RAM, Debian 12** on `crn10.leviathan.so`
- **Credits**: `--credits 1.0` buys $1 USD worth at deploy time

Aleph credits are consumed continuously while the VM is running. Use the `get_credits_info` tool inside your agent (or
the [console](https://console.libertai.io)) to see remaining balance and projected runway in days. The agent itself can
top up via `buy_credits` when running low — that's the autonomous-funding loop.

## Redeploy

Re-running `libertai agentkit deploy` from the same directory reuses the wallet in `.env.prod` and re-runs
`docker compose up -d --build` on the existing instance — there is no separate `update` command. Code changes ship
this way; for runtime config changes, edit `.env.prod` (or `.env`) and redeploy.

If the instance is unhealthy and you want a fresh one, run `libertai agentkit stop` first (which tears down the VM),
then `deploy` again.

## Logs and shell access

The CLI doesn't ship a `logs` subcommand yet. To inspect or tail logs:

```sh
# The instance IPv6 is printed at the end of `deploy` and saved in .env.prod
ssh root@<instance-ipv6>

# Once inside:
docker compose -f /opt/libertai-agentkit/docker-compose.yml logs -f
docker compose -f /opt/libertai-agentkit/docker-compose.yml ps
```

The SSH key used is the one auto-detected during deploy (or passed via `--ssh-key`).

## Stop

Tear down the Aleph instance and clean up resources:

```sh
libertai agentkit stop
```

This deletes the VM. Your agent code, `.env.prod`, and wallet remain on your local machine — re-running `deploy`
provisions a fresh VM using the same wallet.

## Environment variables

The CLI creates `.env.prod` in your agent directory with the generated `WALLET_PRIVATE_KEY` and the deployed instance
metadata. Your `docker-compose.yml` should reference it via `env_file` so the container picks it up.

Use `.env` for local-only overrides and `.env.prod` for production state.

::: warning
`.env.prod` contains a live private key. The CLI sets it to `0600` locally, but it's also uploaded to the Aleph VM in
plaintext (the container needs to read it). Treat both the file and the VM as production secrets — back up the wallet,
revoke the key if it leaks, and never commit `.env.prod` to git.
:::

## Examples

Full working examples with Docker setup:

- [TypeScript](https://github.com/Libertai/libertai-agents/tree/main/examples/agentkit/typescript)
- [Python](https://github.com/Libertai/libertai-agents/tree/main/examples/agentkit/python)

## See also

- [Getting started](/agents/getting-started) — build the agent first
- [x402 payments](/apis/x402) — how the wallet funds itself
- [Architecture](/architecture) — what happens after the agent calls the API
