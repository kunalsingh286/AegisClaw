import Link from 'next/link';

export default function IndiaMarketSolution() {
  return (
    <div className="min-h-screen bg-[#070A12] text-gray-200 font-sans pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[150px] animate-blob mix-blend-screen pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto relative z-10 animate-fade-in-up">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-card text-green-400 text-xs font-semibold mb-6 uppercase tracking-widest border border-green-500/30">
          🇮🇳 India Market
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
          DPDP Act & RBI eMRM <br/><span className="text-green-400">Governance Engine.</span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-3xl font-light leading-relaxed mb-16">
          India's Digital Personal Data Protection (DPDP) Act of 2023 and the RBI's stringent guidelines for model risk management require absolute control over what autonomous financial agents can do. AegisClaw serves as your un-bypassable control plane.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="glass-card p-10 rounded-3xl border border-white/10 hover:border-green-500/50 transition-all">
            <h3 className="text-2xl font-bold text-white mb-4">1. Aadhaar & PAN Redaction</h3>
            <p className="text-gray-400 font-light leading-relaxed mb-6">
              Our advanced Presidio configuration is tuned specifically for the Indian market. It actively identifies and masks Aadhaar Numbers, PAN Cards, and UPI Virtual Payment Addresses (VPAs) before they can be logged or sent to global LLMs.
            </p>
            <div className="bg-[#0B0F19] rounded-xl p-4 border border-white/5 font-mono text-xs text-green-400">
              [PROXY-INTERCEPT] Masked INDIA_AADHAAR and INDIA_PAN in payload.
            </div>
          </div>
          
          <div className="glass-card p-10 rounded-3xl border border-white/10 hover:border-green-500/50 transition-all">
            <h3 className="text-2xl font-bold text-white mb-4">2. RBI Zero-Trust Policies</h3>
            <p className="text-gray-400 font-light leading-relaxed mb-6">
              RBI Electronic Model Risk Management (eMRM) requires strict execution boundaries. Using AWS Cedar, define exactly which internal core-banking APIs an agent is allowed to access, blocking arbitrary code execution or unauthorized endpoint hits.
            </p>
            <div className="bg-[#0B0F19] rounded-xl p-4 border border-white/5 font-mono text-xs text-blue-400 overflow-x-auto whitespace-pre">
{`forbid(
  principal,
  action,
  resource == Resource::"CoreBanking_Write"
);`}
            </div>
          </div>
        </div>
        
        <div className="glass-card p-12 rounded-3xl border border-white/10 text-center mb-12 bg-gradient-to-br from-[#0B0F19] to-[#0a1a10]">
          <h2 className="text-3xl font-bold text-white mb-4">CERT-In Ready Audit Logging</h2>
          <p className="text-gray-400 font-light max-w-2xl mx-auto">
            Every layer of the AegisClaw pipeline generates immutable, SHA-256 hashed audit logs. When CERT-In requires incident response tracing, your security team can instantly export a mathematically irrefutable ledger of all AI agent activities.
          </p>
        </div>

        <Link href="/" className="inline-flex items-center text-green-400 hover:text-white transition-colors font-bold group">
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Home
        </Link>
      </div>
    </div>
  );
}
