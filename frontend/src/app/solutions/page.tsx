export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-[#070A12] text-gray-200 font-sans selection:bg-[#00F0FF] selection:text-black overflow-hidden relative pt-20">
      
      {/* Background Orbs */}
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header Section */}
      <section className="pt-24 pb-16 px-6 max-w-7xl mx-auto text-center relative z-10 animate-fade-in-up">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-card text-purple-400 text-xs font-semibold mb-6 uppercase tracking-widest border border-purple-500/30">
          Compliance Mapping
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
          Regulatory Compliance <br className="hidden md:block"/> 
          <span className="text-gradient from-purple-400 to-[#00F0FF]">By Design.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed mb-10">
          AegisClaw inherently maps its technical interceptors to the most stringent legal frameworks in the Indian financial sector, shielding CISOs from DPDP penalties and RBI strictures.
        </p>
      </section>

      <section className="py-16 px-6 max-w-6xl mx-auto relative z-10 space-y-12">
        
        {/* DPDP Act */}
        <div className="glass-card rounded-3xl p-8 md:p-12 hover:border-yellow-500/50 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="text-yellow-400 font-bold tracking-widest text-sm uppercase mb-4">India DPDP Act 2023</div>
              <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Section 8(5) Data Protection</h2>
              <p className="text-gray-400 leading-relaxed font-light mb-6">
                Prevent sensitive PII data exfiltration to third-party LLMs. AegisClaw intercepts outbound payloads and utilizes an in-memory Presidio-based regex engine to aggressively mask sensitive Indian financial identifiers before they leave your VPC.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-300"><span className="text-yellow-400 mr-3">✓</span> 12-Digit Aadhaar Redaction (<code className="ml-1 text-xs bg-white/10 px-1 rounded">XXXX-XXXX-1234</code>)</li>
                <li className="flex items-center text-sm text-gray-300"><span className="text-yellow-400 mr-3">✓</span> 10-Character PAN Masking</li>
                <li className="flex items-center text-sm text-gray-300"><span className="text-yellow-400 mr-3">✓</span> UPI Virtual Payment Addresses (VPAs)</li>
              </ul>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="bg-[#070A12] border border-white/10 rounded-2xl p-6 font-mono text-xs text-gray-300 shadow-inner">
                <div className="text-gray-500 mb-3 border-b border-white/5 pb-2">Payload Intercept Log</div>
                <div className="text-red-400">OUTBOUND JSON DETECTED</div>
                <div className="my-2 p-3 bg-red-500/10 rounded border border-red-500/20">
                  {'{'} "user_query": "Refund PAN ABCDE1234F" {'}'}
                </div>
                <div className="text-yellow-400 my-2">APPLYING PRESIDIO MASKS...</div>
                <div className="text-green-400 mt-2">CLEANSED PAYLOAD FORWARDED</div>
                <div className="mt-2 p-3 bg-green-500/10 rounded border border-green-500/20">
                  {'{'} "user_query": "Refund PAN [REDACTED_PAN]" {'}'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RBI eMRM */}
        <div className="glass-card rounded-3xl p-8 md:p-12 hover:border-purple-500/50 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="flex flex-col md:flex-row gap-12 items-center md:flex-row-reverse">
            <div className="md:w-1/2">
              <div className="text-purple-400 font-bold tracking-widest text-sm uppercase mb-4">RBI Directive</div>
              <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Model Risk Management (eMRM)</h2>
              <p className="text-gray-400 leading-relaxed font-light mb-6">
                Regulators demand strict financial boundaries for autonomous systems. AegisClaw's Layer 3 enforces hard mathematical limits on agent spending, triggering Human-in-the-Loop (HITL) step-up authentication when thresholds are breached.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-300"><span className="text-purple-400 mr-3">✓</span> Atomic ₹5,000 Action Caps</li>
                <li className="flex items-center text-sm text-gray-300"><span className="text-purple-400 mr-3">✓</span> ₹50,000 Daily Aggregate Fleet Limits</li>
                <li className="flex items-center text-sm text-gray-300"><span className="text-purple-400 mr-3">✓</span> Redis Pub/Sub HITL Approval Queues</li>
              </ul>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="bg-[#070A12] border border-white/10 rounded-2xl p-6 font-mono text-xs text-gray-300 shadow-inner">
                <div className="text-gray-500 mb-3 border-b border-white/5 pb-2">Policy Evaluation</div>
                <div className="text-purple-400 mb-2">EVALUATING ACTION: execute_refund</div>
                <div className="flex justify-between items-center text-gray-400 mb-1">
                  <span>Requested Amount:</span>
                  <span className="text-red-400">₹15,000</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 mb-3">
                  <span>Policy Limit:</span>
                  <span className="text-green-400">₹5,000</span>
                </div>
                <div className="p-3 bg-purple-500/10 rounded border border-purple-500/20 text-purple-300">
                  <span className="font-bold text-red-400">DENY:</span> Threshold exceeded.<br/>
                  Triggering HITL Redis Pub/Sub Event...
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CERT-In */}
        <div className="glass-card rounded-3xl p-8 md:p-12 hover:border-green-500/50 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="text-green-400 font-bold tracking-widest text-sm uppercase mb-4">Cybersecurity Guidelines</div>
              <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">CERT-In Compliance</h2>
              <p className="text-gray-400 leading-relaxed font-light mb-6">
                Meet stringent logging and incident response mandates natively. Every proxy action is cryptographically chained, creating a tamper-proof audit trail for regulatory inquiries.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-300"><span className="text-green-400 mr-3">✓</span> Automated 6-Hour Incident Webhooks</li>
                <li className="flex items-center text-sm text-gray-300"><span className="text-green-400 mr-3">✓</span> 10-Year Record Retention Architecture</li>
                <li className="flex items-center text-sm text-gray-300"><span className="text-green-400 mr-3">✓</span> Cryptographic Merkle Proof Ledgers</li>
              </ul>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="bg-[#070A12] border border-white/10 rounded-2xl p-6 font-mono text-xs text-gray-300 shadow-inner">
                <div className="text-gray-500 mb-3 border-b border-white/5 pb-2">Merkle Chain Generation</div>
                <div className="text-green-400 mb-2">Block N-1 Hash:</div>
                <div className="break-all text-gray-500 mb-3">7d8f...39a1</div>
                <div className="text-green-400 mb-2">Hashing Payload + Decision:</div>
                <div className="p-3 bg-green-500/10 rounded border border-green-500/20 text-green-300 break-all mb-3">
                  SHA256(7d8f...39a1 + "execute_refund" + "DENY")
                </div>
                <div className="text-green-400 mb-1">New Block Hash:</div>
                <div className="break-all text-white font-bold">f4b29a8c...90e3f1</div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-10 bg-[#0B0F19]/50 backdrop-blur-xl py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 font-light">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center font-bold text-gray-300 text-sm">A</div>
            <span>&copy; 2026 AegisClaw Security Systems.</span>
          </div>
          <div className="flex items-center">
            <span className="flex h-2 w-2 relative mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-purple-400 font-mono tracking-widest text-xs uppercase font-bold">Compliance Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
