# Trust model & TEE

LibertAI's privacy story has two layers: the **decentralized infrastructure** (no single operator controls
inference) and the **Trusted Execution Environment** option (the operator running the hardware can't read your data
either). On TEE models you can now also *check* that claim from your own client, before you send a prompt.

## What you're trusting, by default

A standard request flows through:

1. The **load balancer** at `api.libertai.io` — routes your request to a compute node.
2. The **CRN** (computing resource node) — runs the inference VM.
3. The **inference VM** — receives your prompt, runs the model, returns the answer.

Without TEE, the CRN operator could in principle inspect VM memory or disk. LibertAI mitigates this with the
decentralized architecture — there is no central party that sees every request — but the individual node operator
still has hardware-level access to whatever lands on their machine.

If you want to remove that operator from the trust boundary, use a **TEE-enabled model**.

## TEE-enabled models

Models flagged 🔒 on the [text models list](/apis/text/index.html#available-models) run inside an AMD SEV-SNP confidential VM
published on Aleph. That list is generated from the live model catalog, so it is the source of truth for which
models qualify.

### What the hardware guarantees

- **Memory is encrypted and integrity-protected.** The CPU holds per-VM keys; the host OS, the hypervisor and a
  root user on the box cannot read the VM's RAM in plaintext, nor silently alter it.
- **The GPU is in confidential mode.** On GPU-backed TEE models the accelerator runs with NVIDIA Confidential
  Computing enabled, so prompts, activations and weights in GPU memory are protected from the host too.
- **Disk is integrity-verified, not hidden.** Every disk image is measured with dm-verity and its root hash is
  folded into the VM's launch measurement. The images are deliberately public: the guarantee is that the VM booted
  *exactly these bytes*, and you can rebuild them yourself to see what they contain.
- **The guest cannot be debugged.** A VM launched with debugging permitted would let the host read its memory, and
  attestation refuses such a report.

## Remote attestation

This is the part that turns "trust us" into something checkable. The VM generates its TLS certificate at boot and
embeds an AMD-signed attestation report in it, committing to that certificate's public key. Your client verifies,
**during the handshake and before sending anything**:

1. **AMD signed the report** — the chain ARK → ASK → VCEK → report. AMD's root keys are compiled into the client,
   so trust ends at AMD rather than at whoever served the certificate.
2. **The report is bound to the key being served** — otherwise a genuine enclave's report could be replayed in
   front of someone else's key.
3. **The launch measurement is one the deployment published** — this is what ties the server to a specific model,
   image and set of serving flags.
4. **The guest is not debuggable.**

If any check fails the connection is refused, so a failed check means no prompt was sent.

### Verifying it yourself

Install the client and point your usual SDK at it:

:::tabs

== npm
```bash
npm install @libertai/confidential-inference openai
```

== pip
```bash
pip install libertai-confidential-inference openai
```

:::

:::tabs

== TypeScript
```ts
import OpenAI from "openai";
import { connect } from "@libertai/confidential-inference";

const tee = await connect({ model: "qwen3.8-27b-tee" });
const openai = new OpenAI({ apiKey, baseURL: tee.baseURL, fetch: tee.fetch });
```

== Python
```python
from openai import OpenAI
from libertai_confidential import connect

tee = connect(model="qwen3.8-27b-tee")
client = OpenAI(api_key=key, base_url=tee.base_url, http_client=tee.http_client)
```

:::

Requests then go **straight to the enclave**: nothing in between can read them, LibertAI's own API included.

Verification needs the peer's certificate before any request is sent, which needs a TLS API browsers do not expose,
so the clients are Node and Python for now. A browser needs a local verifying proxy.

### Two paths

Both reach the same enclave and the same model. What differs is who handles the request on the way there.

| | Via `api.libertai.io` | Via the attested client |
|---|---|---|
| **Can the node operator read it?** | No — SEV-SNP encrypts guest memory in hardware | No, same |
| **Can LibertAI read it?** | In principle yes. TLS has to terminate somewhere to be routed, and that is our gateway. We do not log or inspect prompts, but that is a policy you cannot verify from outside. | No. The session runs end to end into the enclave, pinned to the certificate attestation proved. |
| **Request metadata** (your IP, size, timing) | Visible to the gateway | Not visible to us |
| **What you need** | Any HTTP client | Node or Python (not a browser yet) |

Use the gateway when convenience matters and your concern is the machine's operator. Use the attested client when
your threat model includes *us* — it is the same model and the same enclave, but the guarantee becomes something
your own client checks instead of something we assert.

### How a client finds the deployment

`connect({ model })` reads a manifest published as a signed Aleph aggregate, naming the deployments LibertAI
currently stands behind:

```json
{
  "source_repo": "https://github.com/Libertai/confidential-inference",
  "models": {
    "qwen3.8-27b-tee": {
      "deployments": [
        { "item_hash": "<deployment message hash>", "source_commit": "<commit it was built from>", "status": "active" }
      ]
    }
  }
}
```

No server in the path is trusted:

- The manifest is checked against LibertAI's signature. Clients fetch the raw signed messages rather than the
  merged view a node serves, so a node can withhold an update but cannot forge one.
- Each `item_hash` names a deployment message whose content the client re-hashes, and the expected measurements come
  from there — not from the manifest.
- The machine and port come from a scheduler that is **not** trusted at all. Point a client at the wrong host and
  attestation simply fails.

A deployment is revoked by deleting it, not by editing the manifest: you can be served a stale manifest, but not a
running enclave that no longer exists.

Pass `itemHash` / `item_hash` instead of `model` to pin one deployment and skip discovery.

### Checking what the model actually is

A measurement identifies *which* image booted, not what that image does. The manifest records the `source_commit`
each deployment was built from, so you can check out that commit, rebuild the images, and confirm the dm-verity root
hashes match what the deployment published. The procedure is in
[`VERIFYING.md`](https://github.com/Libertai/confidential-inference/blob/main/VERIFYING.md), together with a table
of every input that lands in the measurement and where it is pinned.

## What TEE does not protect against

- **Network-level metadata** — on the gateway path, LibertAI sees that you made a request, from what IP, of what
  size, at what time. Use the attested client to remove that.
- **Logged outputs** — the hardware boundary protects the VM, not whatever your client does with the response.
- **Model behaviour** — attestation proves which weights and serving flags booted. It does not make the model
  truthful or unbiased.
- **Unpatched platforms** — a CPU running vulnerable firmware still gets a valid certificate from AMD. Firmware
  currency is a policy decision, so the clients let you set a minimum (`tcbFloor` / `tcb_floor`) and raise it when
  AMD publishes an advisory.

## Status

| Layer | Status |
|-------|--------|
| SEV-SNP memory encryption and integrity | ✅ Live |
| Confidential GPU (NVIDIA CC) | ✅ Live on GPU-backed TEE models |
| Attestation in the TLS certificate | ✅ Live |
| Client-side verification tooling | ✅ Published for Node and Python |
| Reproducible image rebuild | ✅ Documented |
| Browser-side verification | 🚧 Needs a local verifying proxy |

## Choosing the right level

| Your priority | What to use |
|---|---|
| Standard privacy, lowest latency, widest model choice | Any model via `api.libertai.io` |
| Keep the hardware operator out | A 🔒 TEE model via `api.libertai.io` |
| Keep everyone out, including LibertAI | A 🔒 TEE model via the attested client |
| Proof of what ran | The attested client, plus a rebuild against `source_commit` |
| Pay without revealing identity | TEE model + [x402 payments](/apis/x402.html) (USDC on Base, no API key) |

## See also

- [Architecture](/architecture.html) — how requests are routed through the network
- [Direct model interaction](/apis/text/usage.html#direct-model-interaction) — reaching a host without the load balancer
- [Aleph confidential computing](https://docs.aleph.cloud/devhub/compute-resources/confidential-instances/01-confidential-instance-introduction) — the underlying TEE primitive
