# Trust model & TEE

LibertAI's privacy story has two layers: the **decentralized infrastructure** (no single operator controls inference)
and the **Trusted Execution Environment** option (the operator running the hardware can't read your data either).
This page explains what's guaranteed today and what's still in progress.

## What you're trusting, by default

A standard request flows through:

1. The **load balancer** at `api.libertai.io` — routes your request to a compute node.
2. The **CRN** (computing resource node) — runs the inference VM.
3. The **inference VM** — receives your prompt, runs the model, returns the answer.

Without TEE, the CRN operator could in principle inspect VM memory or disk. LibertAI mitigates this with the
decentralized architecture — there is no central party that sees every request — but the individual node operator
still has hardware-level access to whatever lands on their machine.

If you want to eliminate that operator from the trust boundary, use a **TEE-enabled model**.

## TEE-enabled models

Models flagged with 🔒 on the [text models list](/apis/text/#available-models) run inside an
[Aleph confidential VM](https://docs.aleph.cloud/devhub/compute-resources/confidential-instances/01-confidential-instance-introduction).
Today, that's:

| Model | TEE |
|-------|-----|
| `hermes-3-8b-tee` | ✅ |

More TEE-backed models are being added; the model list is the source of truth.

### What confidential VMs guarantee

Aleph confidential instances use **AMD SEV** (Secure Encrypted Virtualization), which means:

- **Memory is encrypted in hardware.** The CPU generates per-VM encryption keys; the operating system, hypervisor,
  and even a malicious host with root cannot read the VM's RAM in plaintext.
- **Disk is encrypted before deployment.** The model image is encrypted off-host and loaded into the VM behind
  the SEV boundary.
- **Operator cannot introspect.** With confidential computing, the CRN operator running the hardware cannot read
  prompts, completions, or model weights — they only see encrypted traffic in and out of the VM.

In other words: with a TEE model, your prompt is visible to the LibertAI gateway (for routing) and to the model
itself, but not to the human running the box.

### What confidential VMs do not protect against

- **Network-level metadata** — the gateway sees that you made a request, from what IP, of what size, at what time.
  If that matters, talk directly to the model host (see [Direct model interaction](/apis/text/usage#direct-model-interaction))
  to remove the gateway, or front the call with your own egress.
- **Logged outputs** — the SEV boundary protects the VM, not whatever your client does with the response.
- **Model behavior** — TEE proves the *operator* didn't read your data. It does not prove the *model* is
  trustworthy or hasn't been fine-tuned in a particular way.

## Remote attestation — status

Remote attestation is the cryptographic proof that a given response came from a genuine SEV VM running the expected
software. The pieces:

| Layer | Status |
|-------|--------|
| AMD SEV memory + disk encryption | ✅ Live for `hermes-3-8b-tee` |
| Aleph confidential instance deployment | ✅ Live (currently in beta) |
| LibertAI-exposed attestation endpoint | 🚧 Not yet exposed |
| Client-side verification tooling | 🚧 Planned |

Today you can rely on the deployment-time guarantees: the model VM was registered with Aleph as a confidential
instance, and SEV enforces the runtime isolation. What's not yet available is a live API where your client can
fetch an SEV attestation report at request time and verify it against the published measurement. That's on the
roadmap.

If you're building something where attestation is load-bearing, [reach out](https://t.me/libertai).

## Choosing the right level

| Your priority | What to use |
|---|---|
| Standard privacy, lowest latency, widest model choice | Any model via `api.libertai.io` |
| Minimize parties that see prompts | TEE model + [direct CRN call](/apis/text/usage#direct-model-interaction) |
| Pay without revealing identity | TEE model + [x402 payments](/apis/x402) (USDC on Base, no API key) |
| Cryptographic proof of execution | Wait for attestation tooling (or contact us) |

## See also

- [Architecture](/architecture) — how requests are routed through the network
- [Aleph confidential computing](https://docs.aleph.cloud/devhub/compute-resources/confidential-instances/01-confidential-instance-introduction) — the underlying TEE primitive
- [Direct model interaction](/apis/text/usage#direct-model-interaction) — bypass the gateway for sensitive calls
