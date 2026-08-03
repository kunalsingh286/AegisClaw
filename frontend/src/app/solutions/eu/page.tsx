import Link from 'next/link';

export default function EUMarketSolution() {
  return (
    <div className="min-h-screen bg-[#070A12] text-gray-200 font-sans pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-blob mix-blend-screen pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto relative z-10 animate-fade-in-up">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-card text-purple-400 text-xs font-semibold mb-6 uppercase tracking-widest border border-purple-500/30">
          🇪🇺 European Union Market
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
          GDPR & EU AI Act <br/><span className="text-purple-400">Strictly Enforced.</span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-3xl font-light leading-relaxed mb-16">
          The upcoming EU AI Act classifies financial and biometric AI systems as "High-Risk". AegisClaw guarantees compliance by inserting Human-In-The-Loop (HITL) circuits and providing cryptographic proof of the "Right to be Forgotten".
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="glass-card p-10 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all">
            <h3 className="text-2xl font-bold text-white mb-4">1. High-Risk Velocity Caps</h3>
            <p className="text-gray-400 font-light leading-relaxed mb-6">
              Autonomous agents can execute dangerous API calls. Our Redis-backed Layer 3 proxy enforces sliding-window velocity caps. If an agent attempts to execute more than 5 bank transfers per minute, the circuit trips and pauses execution for human review.
            </p>
            <div className="bg-[#0B0F19] rounded-xl p-4 border border-white/5 font-mono text-xs text-orange-400">
              [REDIS-BREAKER] Velocity exceeded for action=IBAN_TRANSFER. Escalating to HITL.
            </div>
          </div>
          
          <div className="glass-card p-10 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all">
            <h3 className="text-2xl font-bold text-white mb-4">2. Cryptographic Right-to-be-Forgotten</h3>
            <p className="text-gray-400 font-light leading-relaxed mb-6">
              GDPR mandates you must know exactly what PII an AI model processed. Every single prompt that passes through AegisClaw generates a SHA-256 Merkle ledger receipt. You can instantly query our logs to prove compliance during DPA audits.
            </p>
            <div className="bg-[#0B0F19] rounded-xl p-4 border border-white/5 font-mono text-xs text-purple-400 overflow-x-auto whitespace-pre">
{`hash: a2f4b18c...e98d
timestamp: 1718224590
status: clean (PII stripped)`}
            </div>
          </div>
        </div>
        
        <div className="glass-card p-12 rounded-3xl border border-white/10 text-center mb-12 bg-gradient-to-br from-[#0B0F19] to-[#1a0b2e]">
          <h2 className="text-3xl font-bold text-white mb-4">100% Data Sovereignty</h2>
          <p className="text-gray-400 font-light max-w-2xl mx-auto">
            Host AegisClaw entirely in your Frankfurt or Paris data centers. Ensure that European citizen data (like IBANs and National ID numbers) never inadvertently crosses the Atlantic.
          </p>
        </div>

        <Link href="/" className="inline-flex items-center text-purple-400 hover:text-white transition-colors font-bold group">
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Home
        </Link>
      </div>
    </div>
  );
}
