import Link from 'next/link';

export default function USMarketSolution() {
  return (
    <div className="min-h-screen bg-[#070A12] text-gray-200 font-sans pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00F0FF]/10 rounded-full blur-[150px] animate-blob mix-blend-screen pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto relative z-10 animate-fade-in-up">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-card text-[#00F0FF] text-xs font-semibold mb-6 uppercase tracking-widest border border-[#00F0FF]/30">
          🇺🇸 United States Market
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
          HIPAA & NIST AI RMF <br/><span className="text-[#00F0FF]">Ready out of the box.</span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-3xl font-light leading-relaxed mb-16">
          Deploying autonomous AI in US Healthcare, Federal, or Financial sectors carries strict liability. AegisClaw's zero-trust proxy intercept pipeline ensures your generative AI models are fundamentally incapable of violating HIPAA or NIST AI RMF guidelines.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="glass-card p-10 rounded-3xl border border-white/10 hover:border-[#00F0FF]/50 transition-all">
            <h3 className="text-2xl font-bold text-white mb-4">1. Real-Time PHI Redaction</h3>
            <p className="text-gray-400 font-light leading-relaxed mb-6">
              Our Layer 3 Presidio engine actively scans all outgoing LLM requests in memory. It deterministically strips US Social Security Numbers (SSNs), Medicare IDs, and Credit Card numbers before the payload ever reaches an external model like OpenAI or Anthropic.
            </p>
            <div className="bg-[#0B0F19] rounded-xl p-4 border border-white/5 font-mono text-xs text-green-400">
              [PROXY-INTERCEPT] Masked 1 entity (US_SSN) in outgoing payload.
            </div>
          </div>
          
          <div className="glass-card p-10 rounded-3xl border border-white/10 hover:border-[#00F0FF]/50 transition-all">
            <h3 className="text-2xl font-bold text-white mb-4">2. Cedar RBAC Enforcement</h3>
            <p className="text-gray-400 font-light leading-relaxed mb-6">
              Leverage AWS Cedar policies to enforce strict geographic and role-based access. Ensure that only specialized "Medical Agents" have permission to read from internal FHIR APIs, blocking unauthorized horizontal escalation.
            </p>
            <div className="bg-[#0B0F19] rounded-xl p-4 border border-white/5 font-mono text-xs text-blue-400 overflow-x-auto whitespace-pre">
{`permit(
  principal in Role::"MedicalAgent",
  action == Action::"read_patient_record",
  resource
);`}
            </div>
          </div>
        </div>
        
        <div className="glass-card p-12 rounded-3xl border border-white/10 text-center mb-12 bg-gradient-to-br from-[#0B0F19] to-[#001020]">
          <h2 className="text-3xl font-bold text-white mb-4">100% Data Sovereignty</h2>
          <p className="text-gray-400 font-light max-w-2xl mx-auto">
            AegisClaw runs entirely within your AWS, Azure, or GCP VPC. No telemetry, logs, or prompts are ever sent to our servers. Your federal and health data never leaves US soil.
          </p>
        </div>

        <Link href="/" className="inline-flex items-center text-[#00F0FF] hover:text-white transition-colors font-bold group">
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Home
        </Link>
      </div>
    </div>
  );
}
