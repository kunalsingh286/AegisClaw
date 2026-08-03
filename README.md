# AegisClaw Layer 3 AI Agent Egress Proxy Core

A production-grade, low-latency "Layer 3" AI Agent Egress Proxy Core with real-time PII masking (DPDP Act), formal execution scopes (RBI / Cedar), Redis velocity controls, and SHA-256 Merkle-chain cryptography.

## How to Run the Platform Right Now

Open your terminal in the repository root:

### Step 1: Launch the Docker Container Stack

```bash
docker-compose up --build
```
This spins up FastAPI, Redis, Cedar PDP, and the Next.js Frontend together.

### Step 2: Open the CISO Command Center

Navigate your browser to:
```
http://localhost:3000
```

### Step 3: Run the Multi-Bot Simulation

In a second terminal window, run:
```bash
python simulate_fleet.py
```
Watch the dark-mode dashboard light up live as Agent 1 passes green, Agent 2 gets blocked by spend caps, and Agent 3 has its Aadhaar/PAN details sanitized in real time!
