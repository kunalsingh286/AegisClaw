# 🦅 AegisClaw

**The World's First Unified 3-Layer AI Agent Governance Engine for Global Enterprises**

AegisClaw is an ultra-low latency, multi-tenant network proxy designed to secure, monitor, and regulate autonomous AI fleets. It sits inline between your enterprise AI agents and external LLM providers (e.g., OpenAI, Anthropic), ensuring that every token transmitted complies with strict global regulatory frameworks.

## 🌟 Why AegisClaw?

As AI agents become fully autonomous, enterprises face massive liability risks ranging from prompt injection attacks and budget overruns to catastrophic regulatory breaches (e.g., GDPR, HIPAA, DPDP).

AegisClaw eliminates these risks at the network data-path level. By passing traffic through our **7-Gate Proxy Core**, AegisClaw intercepts non-compliant traffic in RAM, guaranteeing zero-trust enforcement *before* a payload ever reaches the LLM.

## 🛡️ The 3-Layer Governance Pipeline

1. **Layer 1: Ingress Prompt Guard**
   - Heuristically blocks malicious payload injections and jailbreak vectors (e.g., "ignore previous instructions").
2. **Layer 2: FinOps Router**
   - Uses Redis Sorted Sets (ZSET) to enforce sliding 24-hour token budgets and hard financial rate limits.
3. **Layer 3: Runtime Egress Firewall**
   - Evaluates payloads dynamically based on the `X-Compliance-Region` header.
   - **AWS Cedar:** Mathematical Policy-as-Code enforcement blocking unauthorized actions.
   - **Microsoft Presidio:** Contextual NLP scanning to redact PII (SSN, Aadhaar, IBAN).

## 🌍 Global Compliance Packs

AegisClaw treats global compliance as a modular plug-and-play system. A single API key works worldwide—the proxy dynamically routes traffic based on the region header:
- **🇮🇳 India (DPDP/RBI):** Aadhaar redaction & automated Human-in-the-Loop (HITL) step-up queues for financial limits.
- **🇺🇸 US (HIPAA/NIST):** PHI egress blocking and deterministic halting of destructive actions.
- **🇪🇺 EU (AI Act/GDPR):** Mandatory HITL triggers and GDPR data minimization.

## 🔒 Cryptographic Audit Ledger (Article 12)

AegisClaw replaces basic text logs with a **SHA-256 Merkle-Tree Hash Chain** built directly into Redis. CISOs can download immutable PDF audits that cryptographically prove to regulators that logs have never been tampered with.

## 🛠️ Tech Stack

- **Backend Proxy:** FastAPI (Python), Uvicorn, httpx
- **Frontend Dashboard:** Next.js, React, TailwindCSS
- **State & Auditing:** Redis
- **Engines:** AWS Cedar (Rust/Python), Microsoft Presidio

## 📚 Deep Dives

To understand the core philosophy and technical architecture of AegisClaw, review the following documents:
- [THESIS.md](./THESIS.md) - The strategic vision and problem thesis.
- [ARCHITECTURE.md](./ARCHITECTURE.md) - The complete technical implementation and system topology.
- [MARKETS.md](./MARKETS.md) - Deep dive into regional regulatory mappings.

---
*Built for the enterprise. Governed by math. Secured at the network layer.*
