export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#070A12] text-gray-200 font-sans selection:bg-[#00F0FF] selection:text-black overflow-hidden relative pt-20">
      
      {/* Background Orbs */}
      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-[#00F0FF]/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header Section */}
      <section className="pt-24 pb-16 px-6 max-w-7xl mx-auto text-center relative z-10 animate-fade-in-up">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-card text-[#00F0FF] text-xs font-semibold mb-6 uppercase tracking-widest border border-[#00F0FF]/30">
          Core Engine Modules
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
          The Unified 7-Gate <br className="hidden md:block"/> 
          <span className="text-gradient">Proxy Pipeline</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed mb-10">
          AegisClaw intercepts AI tool executions at the network layer. Every outbound request passes through 7 cryptographic and deterministic gates before ever touching your internal banking APIs.
        </p>
      </section>

      {/* Section 1: Execution Flow */}
      <section className="py-16 px-6 max-w-6xl mx-auto relative z-10">
        <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#006FCF]/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 text-center">Execution Flow</h2>
          
          <div className="space-y-4 relative">
            {/* Connecting Line */}
            <div className="absolute left-[28px] md:left-[50%] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#00F0FF] via-[#006FCF] to-green-500 opacity-30 md:-translate-x-1/2"></div>
            
            {[
              { num: 1, title: "Bearer Auth", desc: "JWT Verification of Agent Identity.", color: "text-white", border: "border-gray-700" },
              { num: 2, title: "Layer 1 Prompt Guard", desc: "Regex check for injection & jailbreak patterns.", color: "text-pink-400", border: "border-pink-500/30" },
              { num: 3, title: "Layer 2 Token Budget Check", desc: "Verify agent has remaining token allocation.", color: "text-yellow-400", border: "border-yellow-500/30" },
              { num: 4, title: "Layer 3 Redis Velocity", desc: "Check sliding-window RPM limits.", color: "text-orange-400", border: "border-orange-500/30" },
              { num: 5, title: "Layer 3 Cedar Policy", desc: "Role-based AWS Cedar PDP evaluation.", color: "text-purple-400", border: "border-purple-500/30" },
              { num: 6, title: "Layer 3 Presidio PII Mask", desc: "Aadhaar, PAN, and VPA contextual redaction.", color: "text-[#00F0FF]", border: "border-[#00F0FF]/30" },
              { num: 7, title: "SHA-256 Merkle Receipt", desc: "Cryptographic ledger entry for CERT-In.", color: "text-green-400", border: "border-green-500/30" },
            ].map((step, idx) => (
              <div key={idx} className={`relative flex items-center md:justify-between flex-row ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="hidden md:block md:w-1/2"></div>
                <div className={`absolute left-0 md:left-1/2 w-14 h-14 rounded-full bg-[#0B0F19] border-2 ${step.border} flex items-center justify-center font-bold text-lg ${step.color} z-10 md:-translate-x-1/2 shadow-lg`}>
                  {step.num}
                </div>
                <div className={`ml-20 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pl-16' : 'md:pr-16 text-left md:text-right'} py-4`}>
                  <div className={`glass-card p-6 rounded-2xl border ${step.border} bg-[#0B0F19]/80 hover:bg-white/5 transition-colors`}>
                    <h3 className={`text-lg font-bold mb-1 ${step.color}`}>{step.title}</h3>
                    <p className="text-sm text-gray-400 font-light">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Technical Deep-Dive Benchmarks */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 mb-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Latency Benchmarks</h2>
          <p className="text-gray-400 font-light">Engineered in Python & Rust for high-frequency financial trading environments.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Layer 1 */}
          <div className="glass-card rounded-3xl p-8 hover:border-pink-500/50 transition-all hover:-translate-y-2 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-pink-500/20 transition-all"></div>
            <div className="text-pink-400 font-mono text-sm mb-4 tracking-widest uppercase font-bold">Layer 1</div>
            <h3 className="text-2xl font-bold text-white mb-2">Prompt Guard</h3>
            <div className="text-4xl font-extrabold text-white my-6 font-mono">&lt;1ms</div>
            <p className="text-gray-400 text-sm leading-relaxed font-light mb-6">
              In-memory regex pipeline utilizing compiled deterministic state machines to scan strings for SQLi and system prompt leaks before forwarding to the LLM.
            </p>
            <div className="bg-white/5 rounded-lg p-3 text-xs font-mono text-gray-300 border border-white/5">
              Time complexity: O(n)
            </div>
          </div>

          {/* Layer 2 */}
          <div className="glass-card rounded-3xl p-8 hover:border-[#00F0FF]/50 transition-all hover:-translate-y-2 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F0FF]/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-[#00F0FF]/20 transition-all"></div>
            <div className="text-[#00F0FF] font-mono text-sm mb-4 tracking-widest uppercase font-bold">Layer 2</div>
            <h3 className="text-2xl font-bold text-white mb-2">Cedar Policy</h3>
            <div className="text-4xl font-extrabold text-white my-6 font-mono">&lt;2ms</div>
            <p className="text-gray-400 text-sm leading-relaxed font-light mb-6">
              AWS Cedar-rs engine bindings executing directly in process memory. Evaluates deeply nested RBAC/ABAC role hierarchies without database roundtrips.
            </p>
            <div className="bg-white/5 rounded-lg p-3 text-xs font-mono text-gray-300 border border-white/5">
              Written in Rust (cedar-policy)
            </div>
          </div>

          {/* Layer 3 */}
          <div className="glass-card rounded-3xl p-8 hover:border-orange-500/50 transition-all hover:-translate-y-2 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-orange-500/20 transition-all"></div>
            <div className="text-orange-400 font-mono text-sm mb-4 tracking-widest uppercase font-bold">Layer 3</div>
            <h3 className="text-2xl font-bold text-white mb-2">Redis Killswitch</h3>
            <div className="text-4xl font-extrabold text-white my-6 font-mono">&lt;2ms</div>
            <p className="text-gray-400 text-sm leading-relaxed font-light mb-6">
              Asynchronous Redis connection pools maintaining atomic sliding-window velocity caps (e.g. max 5 refunds/minute). Instantly trips pybreaker circuits upon threshold breach.
            </p>
            <div className="bg-white/5 rounded-lg p-3 text-xs font-mono text-gray-300 border border-white/5">
              Protocol: RESP3 / Asyncio
            </div>
          </div>
          
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0B0F19]/50 backdrop-blur-xl py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 font-light">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center font-bold text-gray-300 text-sm">A</div>
            <span>&copy; 2026 AegisClaw Security Systems.</span>
          </div>
          <div className="flex items-center">
            <span className="flex h-2 w-2 relative mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-green-500 font-mono tracking-widest text-xs uppercase font-bold">Proxy Core Stable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
