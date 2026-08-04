# AEGISCLAW: Global Market Capabilities & Regulatory Mapping

AegisClaw is not a generic "AI wrapper." It is a precision-engineered compliance firewall designed specifically for highly regulated enterprise environments. By simply attaching the `X-Compliance-Region` header to their AI agent's network requests, our enterprise customers instantly activate mathematical enforcement of their local laws.

This document details exactly how AegisClaw technically fulfills the regulatory requirements of our three primary target markets.

---

## 🇮🇳 INDIA: DPDP Act 2023 & RBI eMRM Framework

For Indian financial institutions and fintechs, the massive fines introduced by the Digital Personal Data Protection (DPDP) Act and the strict constraints of the RBI's Enterprise Model Risk Management (eMRM) guidelines make deploying autonomous AI highly risky. AegisClaw completely de-risks this.

### Technical Implementation:
1. **Dynamic Aadhaar & UPI Redaction:** 
   Our Microsoft Presidio NLP integration is tuned for the Indian market. It actively scans the payload context for Indian-specific PII (e.g., 12-digit Aadhaar numbers, PAN cards). If an AI agent attempts to send an Aadhaar number to OpenAI, AegisClaw intercepts and masks it in memory before it leaves the Indian VPC.
2. **RBI Financial Guardrails (Cedar Policy):** 
   Using the `default_tenant.cedar` policy, AegisClaw mathematically caps unauthorized financial transactions (e.g., UPI refunds) at ₹1,000. 
3. **Automated Step-up Queue (HITL):** 
   If an AI attempts a high-value transaction, AegisClaw automatically halts the request, suspends execution, and pushes the payload to the CISO Dashboard via Redis. A human administrator must manually approve the action to satisfy RBI human-oversight mandates.

---

## 🇺🇸 UNITED STATES: HIPAA & NIST AI RMF 1.0

US healthcare organizations and financial services cannot adopt autonomous agents if those agents are capable of breaching PHI (Protected Health Information) or taking unauthorized destructive actions.

### Technical Implementation:
1. **PHI Egress Blocking (HIPAA):** 
   AegisClaw uses heuristic scanning (Gate 2) and NLP (Gate 6) to detect patient data. Any attempt to egress sensitive health records instantly triggers the `phi_egress` action mapping, which is explicitly denied by our `us_hipaa_nist.cedar` policy.
2. **Deterministic Action Halting (NIST):**
   The NIST AI Risk Management Framework requires strict bounding of autonomous capabilities. AegisClaw maps REST endpoints to hard actions. High-risk vectors like `/api/v1/db/delete` are mapped to `database_deletion`. The AWS Cedar engine mathematically blocks these actions from executing unless initiated by a pre-authorized principal, neutralizing the risk of a rogue AI agent destroying a production database.

---

## 🇪🇺 EUROPEAN UNION: AI Act (2024) & GDPR

The EU AI Act classifies many autonomous AI systems as "High-Risk," requiring exhaustive auditing, human oversight, and data minimization. Non-compliance risks catastrophic GDPR-level fines (up to 7% of global revenue).

### Technical Implementation:
1. **Article 12: Immutable 10-Year Audit Trails:** 
   To satisfy the AI Act's rigorous transparency and logging requirements, AegisClaw does not just write text logs. It uses a **SHA-256 Merkle-Tree Hash Chain** built directly into Redis. Every transaction's hash includes the hash of the previous transaction. CISOs can instantly download a Cryptographic PDF Audit that legally proves to EU regulators that the AI logs have never been tampered with.
2. **Article 14: Mandatory Human Oversight:** 
   Our Prompt Guard layer and HITL interceptor ensure that high-risk requests (e.g., large wire transfers) trigger the `eu_ai_act.cedar` step-up policy, enforcing human-in-the-loop validation before execution.
3. **GDPR Data Minimization:** 
   By applying the EU Presidio profile, IBANs, passport numbers, and other EU-centric PII are automatically redacted. This ensures the enterprise complies with the GDPR principle of data minimization—never sending PII to a third-party LLM provider unless absolutely necessary.

---
*AegisClaw transforms compliance from a slow, legal roadblock into a high-speed, automated engineering primitive.*
