"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function PricingPage() {
  const [isINR, setIsINR] = useState(true);
  
  // Calculator State
  const [monthlyCalls, setMonthlyCalls] = useState(50000);
  const [avgTxnValue, setAvgTxnValue] = useState(5000);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Constants
  const HALLUCINATION_RATE = 0.001; // 0.1% unauthorized action rate
  
  // Dynamic Calculations
  const estimatedSavings = monthlyCalls * avgTxnValue * HALLUCINATION_RATE;
  
  const formatCurrency = (val: number, inr: boolean) => {
    return new Intl.NumberFormat(inr ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: inr ? 'INR' : 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-gray-200 font-sans selection:bg-[#00F0FF] selection:text-black overflow-hidden relative">
      
      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-[#006FCF]/10 rounded-full blur-[150px] pointer-events-none"></div>


      {/* Pricing Header */}
      <section className="pt-48 pb-16 px-6 max-w-7xl mx-auto text-center relative z-10 animate-fade-in-up">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-card text-[#00F0FF] text-xs font-semibold mb-6 uppercase tracking-widest">
          🇮🇳 100% RBI eMRM & DPDP Act 2023 Compliant
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
          Predictable Security Pricing for <br className="hidden md:block"/> <span className="text-gradient">Autonomous Financial AI Fleets</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed mb-10">
          Self-hosted zero-data-exfiltration control plane. Deploys inside your private AWS/GCP/Kubernetes VPC in 15 minutes as a Docker sidecar.
        </p>

        {/* Currency Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <span className={`text-sm font-bold ${!isINR ? 'text-white' : 'text-gray-500'}`}>USD ($)</span>
          <button 
            onClick={() => setIsINR(!isINR)}
            className="w-16 h-8 rounded-full bg-white/10 border border-white/20 relative transition-colors focus:outline-none flex items-center"
          >
            <div className={`w-6 h-6 rounded-full bg-[#00F0FF] absolute transition-all transform shadow-[0_0_10px_rgba(0,240,255,0.5)] ${isINR ? 'translate-x-9' : 'translate-x-1'}`}></div>
          </button>
          <span className={`text-sm font-bold ${isINR ? 'text-white' : 'text-gray-500'}`}>INR (₹)</span>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Tier 1: Design Partner Sandbox */}
        <div className="glass-card rounded-3xl p-10 flex flex-col hover:border-white/20 transition-all hover:-translate-y-2 hover:shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Design Partner Sandbox</h3>
          <p className="text-gray-400 text-sm mb-8 h-10 font-light leading-relaxed">Target: Indian Fintechs, Staging Fleets, GCC Innovation Labs.</p>
          <div className="text-4xl lg:text-5xl font-extrabold text-white mb-8 font-mono">
            {isINR ? '₹1,25,000' : '$1,500'}<span className="text-lg font-sans text-gray-500 font-normal">/mo</span>
          </div>
          <ul className="space-y-4 mb-10 flex-1 text-sm text-gray-300 font-light">
            <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> Up to 5 Autonomous AI Agents</li>
            <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> Unified 3-Layer Control Plane (Layer 1 Prompt Guard, Layer 2 Model Router, Layer 3 Egress Proxy)</li>
            <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> In-Memory DPDP Aadhaar/PAN/UPI Redactor</li>
            <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> RBI ₹5,000 Refund Caps</li>
            <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> Sub-2ms Killswitch</li>
            <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> SHA-256 Merkle Ledger</li>
            <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> 1-Click CISO Audit Risk PDF Exporter</li>
          </ul>
          <Link href="/login" className="w-full text-center px-6 py-4 rounded-full font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all">
            Start 14-Day Free Pilot
          </Link>
        </div>

        {/* Tier 2: Enterprise Production */}
        <div className="relative group lg:-translate-y-4">
          <div className="absolute -inset-[2px] bg-gradient-to-b from-[#00F0FF] to-[#006FCF] rounded-3xl opacity-70 group-hover:opacity-100 transition-opacity blur-[2px]"></div>
          <div className="bg-[#0B0F19] rounded-3xl p-10 flex flex-col relative h-full">
            <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-gradient-to-r from-[#00F0FF] to-[#006FCF] text-black text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.5)]">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Enterprise Production</h3>
            <p className="text-gray-400 text-sm mb-8 h-10 font-light leading-relaxed">Target: Scale-stage Fintechs, Digital Banks, Large GCC Fleets.</p>
            <div className="text-4xl lg:text-5xl font-extrabold text-[#00F0FF] mb-8 font-mono">
              {isINR ? '₹3,75,000' : '$4,500'}<span className="text-lg font-sans text-gray-500 font-normal">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1 text-sm text-gray-300 font-light">
              <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> <strong className="text-white">Everything in Sandbox, plus:</strong></li>
              <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> Unlimited AI Agents</li>
              <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> Multi-Tenant Cedar Policy Isolation (X-Tenant-ID)</li>
              <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> PostgreSQL Persistent Storage</li>
              <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> Custom Vernacular PII Regex (Devanagari/IFSC/Voter ID)</li>
              <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> Redis Pub/Sub Human-in-the-Loop (HITL) Queue</li>
              <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> NGINX TLS/SSL Ingress</li>
              <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> Dedicated Slack/WhatsApp SOC Support</li>
            </ul>
            <Link href="/login" className="w-full text-center px-6 py-4 rounded-full font-bold bg-gradient-to-r from-[#00F0FF] to-[#006FCF] text-black hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]">
              Request Enterprise Trial
            </Link>
          </div>
        </div>

        {/* Tier 3: Global Banking Cluster */}
        <div className="glass-card rounded-3xl p-10 flex flex-col hover:border-white/20 transition-all hover:-translate-y-2 hover:shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Global Banking Cluster</h3>
          <p className="text-gray-400 text-sm mb-8 h-10 font-light leading-relaxed">Target: Tier-1 Indian Banks (HDFC, Axis) & Fortune 500 GCCs.</p>
          <div className="text-4xl lg:text-5xl font-extrabold text-white mb-8 font-mono">Custom</div>
          <ul className="space-y-4 mb-10 flex-1 text-sm text-gray-300 font-light">
            <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> Unlimited VPC Clusters</li>
            <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> Custom eBPF Socket Interceptors</li>
            <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> Air-Gapped Bare-Metal Support</li>
            <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> On-Premises SLA Guarantees</li>
            <li className="flex items-start"><span className="text-[#00F0FF] mr-3 font-bold">✓</span> Custom Cedar Compliance Policy Packs (US HIPAA/NIST & EU AI Act)</li>
          </ul>
          <Link href="/login" className="w-full text-center px-6 py-4 rounded-full font-bold bg-white text-black hover:bg-gray-200 transition-colors">
            Schedule CISO Briefing
          </Link>
        </div>

      </section>

      {/* ROI Calculator Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Interactive ROI & Risk Reduction Calculator</h2>
          <p className="text-gray-400 font-light">Calculate your enterprise exposure to non-deterministic AI tool executions.</p>
        </div>
        
        <div className="glass-card rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Controls */}
            <div className="space-y-10">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300 font-light">Monthly Automated Tool Calls</label>
                  <span className="font-mono text-[#00F0FF]">{monthlyCalls.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="500000" 
                  step="1000"
                  value={monthlyCalls} 
                  onChange={(e) => setMonthlyCalls(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300 font-light">Avg. Refund Transaction Value</label>
                  <span className="font-mono text-[#00F0FF]">{formatCurrency(avgTxnValue, true)}</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="25000" 
                  step="500"
                  value={avgTxnValue} 
                  onChange={(e) => setAvgTxnValue(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
                />
              </div>
              
              <div className="p-4 bg-[#006FCF]/10 border border-[#006FCF]/30 rounded-xl">
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  *Calculation assumes a highly conservative <strong className="text-white">0.1% hallucination rate</strong> where the LLM executes an unauthorized or over-limit financial tool call.
                </p>
              </div>
            </div>
            
            {/* Outputs */}
            <div className="space-y-4">
              <div className="bg-[#070A12] border border-white/5 rounded-2xl p-6">
                <div className="text-sm text-gray-400 mb-2 font-light">Estimated Unauthorized Over-payments Saved/mo</div>
                <div className="text-3xl font-mono font-bold text-green-400">{formatCurrency(estimatedSavings, true)}</div>
              </div>
              <div className="bg-[#070A12] border border-white/5 rounded-2xl p-6">
                <div className="text-sm text-gray-400 mb-2 font-light">DPDP Act Penalty Shield (Section 8)</div>
                <div className="text-2xl font-mono font-bold text-[#00F0FF]">Up to ₹250 Crore</div>
              </div>
              <div className="bg-[#070A12] border border-white/5 rounded-2xl p-6">
                <div className="text-sm text-gray-400 mb-2 font-light">CISO Audit Time Saved</div>
                <div className="text-2xl font-mono font-bold text-white">40 hours <span className="text-gray-500 font-sans font-light text-base">reduced to</span> 10 sec</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto relative z-10 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Enterprise Security & Data Isolation FAQ</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Does our customer financial data or prompt text ever touch AegisClaw servers?",
              a: "Never. AegisClaw is 100% self-hosted. You deploy our Docker container sidecar or Helm Chart inside your own AWS/GCP/Kubernetes VPC. Payload inspection, PII scrubbing, and policy checks happen strictly in your volatile local RAM."
            },
            {
              q: "Why is the Design Partner tier priced at $1,500/month (₹1,25,000/mo)?",
              a: "This price sits directly below discretionary spending and corporate credit card thresholds, allowing Engineering VPs and CISOs to issue a micro-PO instantly without 6-month legal procurement delays."
            },
            {
              q: "Does AegisClaw add latency to live agent calls?",
              a: "Our unified 7-gate proxy adds under 5ms latency using microsecond C/Rust-compiled Cedar Policy bindings and RAM pattern matching."
            }
          ].map((faq, idx) => (
            <div key={idx} className="glass-card rounded-2xl overflow-hidden">
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="font-bold text-white">{faq.q}</span>
                <span className={`text-[#00F0FF] transform transition-transform ${activeFaq === idx ? 'rotate-45' : ''}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </span>
              </button>
              <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === idx ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-400 font-light leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0B0F19]/50 backdrop-blur-xl py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 font-light">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center font-bold text-gray-300 text-sm">A</div>
            <span>&copy; 2026 AegisClaw Security Systems.</span>
          </div>
          <div className="flex space-x-8 mb-6 md:mb-0">
            <a href="#" className="hover:text-[#00F0FF] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#00F0FF] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#00F0FF] transition-colors">Security Disclaimers</a>
          </div>
          <div className="flex items-center">
            <span className="flex h-2 w-2 relative mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-green-500 font-mono tracking-widest text-xs uppercase font-bold">All Systems Governing</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
