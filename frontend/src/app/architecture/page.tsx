export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-[#070A12] text-gray-200 font-sans selection:bg-[#00F0FF] selection:text-black overflow-hidden relative pt-20">
      
      {/* Background Orbs */}
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header Section */}
      <section className="pt-24 pb-16 px-6 max-w-4xl mx-auto text-left relative z-10 animate-fade-in-up border-b border-white/10">
        <div className="text-xs font-mono text-gray-500 mb-4 tracking-widest uppercase">RFC 001: Technical Architecture</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6 font-mono">
          AegisClaw System Topology
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl font-light leading-relaxed mb-6 font-mono">
          Author: Core Engineering<br/>
          Status: <span className="text-green-400">Production Active</span><br/>
          Version: 1.0.0
        </p>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 max-w-4xl mx-auto relative z-10 space-y-16">
        
        {/* Topology Diagram */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 font-mono border-b border-white/5 pb-2">1. System Topology</h2>
          <p className="text-gray-400 font-light mb-8 leading-relaxed">
            The AegisClaw proxy is deployed as an in-VPC sidecar cluster. It intercepts outbound traffic from autonomous agents before forwarding sanitized, validated requests to external/internal APIs.
          </p>
          <div className="glass-card rounded-xl p-8 overflow-x-auto text-sm bg-[#0B0F19]/80 font-mono text-gray-300 whitespace-pre shadow-inner border border-white/10">
{`          +-------------------+
          |                   |
          |  Autonomous Agent | (LangChain/CrewAI/LlamaIndex)
          |                   |
          +--------+----------+
                   |
                   | HTTP/JSON (Inbound Call)
                   v
          +--------+----------+
          |                   |
          | NGINX TLS Ingress | (Port 443)
          |                   |
          +--------+----------+
                   |
                   | gRPC / HTTP
                   v
          +--------+----------+      +-----------------------+
          |                   |----->| AWS Cedar PDP (Rust)  |
          | FastAPI Proxy Core|<-----| (Policy Evaluation)   |
          |                   |      +-----------------------+
          +--------+----------+
            |      |      |          +-----------------------+
            |      |      +--------->| Redis 7 (Async)       |
            |      |      <----------| (Velocity Killswitch) |
            |      |                 +-----------------------+
            |      |
            |      |                 +-----------------------+
            |      +---------------->| PostgreSQL 16         |
            |                        | (Audit Merkle Ledger) |
            |                        +-----------------------+
            v
          +--------+----------+
          |                   |
          | Upstream API Core | (Banking/Fintech endpoints)
          |                   |
          +-------------------+`}
          </div>
        </div>

        {/* Cryptographic Proofs */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 font-mono border-b border-white/5 pb-2">2. Cryptographic Proofs (Merkle Ledger)</h2>
          <p className="text-gray-400 font-light mb-6 leading-relaxed">
            To satisfy CERT-In non-repudiation requirements, every intercept decision is cryptographically chained. The resulting hash forms a continuous Merkle tree ensuring 10-year tamper-proof record retention.
          </p>
          
          <div className="bg-[#0B0F19] border border-white/10 rounded-xl p-6 font-mono text-sm text-gray-300 shadow-inner mb-6">
            <div className="text-green-400 mb-4">Formula:</div>
            <div className="bg-white/5 p-4 rounded text-white overflow-x-auto">
              Hash<sub>N</sub> = SHA-256( Payload<sub>N</sub> + Decision<sub>N</sub> + Timestamp<sub>N</sub> + Hash<sub>N-1</sub> )
            </div>
          </div>
          
          <p className="text-gray-400 font-light leading-relaxed">
            If a malicious internal actor attempts to delete or modify a past transaction (e.g., an unauthorized refund approval), the `Hash<sub>N-1</sub>` link is broken, invalidating the entire subsequent chain and instantly alerting SOC teams.
          </p>
        </div>

        {/* Resiliency & Fail-Closed */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 font-mono border-b border-white/5 pb-2">3. Resiliency & Fail-Closed Circuit Breakers</h2>
          <p className="text-gray-400 font-light mb-6 leading-relaxed">
            AegisClaw integrates `pybreaker` state machines to handle transient network partitions between the FastAPI proxy and its dependent sidecars (Redis, Cedar, PostgreSQL).
          </p>
          
          <div className="glass-card rounded-xl p-6 text-sm bg-[#0B0F19]/80 font-mono text-gray-300 mb-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-green-500/30 p-4 rounded-lg bg-green-500/5">
                <div className="text-green-400 font-bold mb-2">CLOSED (Normal)</div>
                <div className="text-gray-400 text-xs">Traffic flows normally. Sidecars are responsive &lt;5ms.</div>
              </div>
              <div className="border border-yellow-500/30 p-4 rounded-lg bg-yellow-500/5">
                <div className="text-yellow-400 font-bold mb-2">HALF-OPEN (Testing)</div>
                <div className="text-gray-400 text-xs">After timeout, allows 1 test request through to check health.</div>
              </div>
              <div className="border border-red-500/30 p-4 rounded-lg bg-red-500/5">
                <div className="text-red-400 font-bold mb-2">OPEN (Fail-Closed)</div>
                <div className="text-gray-400 text-xs">5 consecutive failures. ALL traffic blocked to prevent unvalidated actions.</div>
              </div>
            </div>
          </div>

          <p className="text-gray-400 font-light leading-relaxed">
            By defaulting to a <strong className="text-white font-medium">Fail-Closed</strong> architecture, AegisClaw guarantees that if the security policy engine goes offline, the autonomous agent is completely immobilized, preventing unverified transactions from reaching upstream systems.
          </p>
        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-10 bg-[#0B0F19]/50 backdrop-blur-xl py-16 relative z-10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 font-light">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center font-bold text-gray-300 text-sm">A</div>
            <span>&copy; 2026 AegisClaw Security Systems.</span>
          </div>
          <div className="flex items-center">
            <span className="flex h-2 w-2 relative mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-blue-400 font-mono tracking-widest text-xs uppercase font-bold">Architecture Docs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
