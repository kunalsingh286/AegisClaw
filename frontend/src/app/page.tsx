"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [logFeed, setLogFeed] = useState<any[]>([]);

  useEffect(() => {
    const mockLogs = [
      { id: 1, text: "POST /proxy/api/v1/payments/refund", status: "PERMITTED", delay: 500, type: "green" },
      { id: 2, text: "Aadhaar Match: 4920 1928 XXXX", status: "PII REDACTED", delay: 1500, type: "yellow" },
      { id: 3, text: "Cedar Policy: Refund Scope Authorized", status: "PERMITTED", delay: 2500, type: "green" },
      { id: 4, text: "Amount ₹15,000 exceeds velocity cap", status: "HITL ESCALATED", delay: 4000, type: "red" },
      { id: 5, text: "POST /proxy/api/v1/wire/transfer", status: "PERMITTED", delay: 5500, type: "green" },
      { id: 6, text: "PAN Match: ABCDE1234F", status: "PII REDACTED", delay: 6500, type: "yellow" }
    ];

    let currentLogs: any[] = [];
    const timeouts = mockLogs.map((log) => {
      return setTimeout(() => {
        currentLogs = [...currentLogs, log].slice(-4);
        setLogFeed([...currentLogs]);
      }, log.delay);
    });

    const loop = setInterval(() => {
      currentLogs = [];
      setLogFeed([]);
      mockLogs.forEach(log => {
        setTimeout(() => {
          currentLogs = [...currentLogs, log].slice(-4);
          setLogFeed([...currentLogs]);
        }, log.delay);
      });
    }, 8000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#070A12] text-gray-200 font-sans selection:bg-[#00F0FF] selection:text-black overflow-hidden relative">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00F0FF]/10 rounded-full blur-[120px] animate-blob mix-blend-screen pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[#006FCF]/10 rounded-full blur-[150px] animate-blob mix-blend-screen pointer-events-none" style={{animationDelay: "2s"}}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-blob mix-blend-screen pointer-events-none" style={{animationDelay: "4s"}}></div>


      {/* Hero Section */}
      <section className="pt-48 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 animate-fade-in-up">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-card text-[#00F0FF] text-xs font-semibold mb-10 uppercase tracking-widest shadow-[0_0_20px_rgba(0,240,255,0.1)]">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-glow-pulse mr-3"></span>
          AegisClaw Core v1.0 is Live
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
          The World's First <br className="hidden md:block"/>
          <span className="text-gradient">
            Unified AI Control Plane.
          </span>
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mb-12 leading-relaxed font-light">
          Inbound Prompt Guard (Layer 1). In-VPC Model Gateway (Layer 2). Zero-Trust Egress Sandbox (Layer 3). Intercept LLM vulnerabilities in &lt;5ms without modifying application code.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button className="w-full sm:w-auto px-8 py-4 rounded-full font-bold bg-gradient-to-r from-[#00F0FF] to-[#006FCF] text-black hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,111,207,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)]">
            Schedule a Demo
          </button>
          <Link href="/docs" className="w-full sm:w-auto px-8 py-4 rounded-full font-bold glass-card hover:bg-white/10 text-white hover:scale-105 transition-all">
            Read Documentation
          </Link>
        </div>
      </section>

      {/* Live Interactive Split-Screen Component */}
      <section className="py-24 px-6 max-w-6xl mx-auto relative z-10" id="architecture">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-3xl glass-card animate-float">
          {/* Left: Cedar Policy */}
          <div className="bg-[#0B0F19]/80 backdrop-blur-md p-8 rounded-2xl border border-white/5 font-mono text-sm overflow-hidden flex flex-col h-[400px] shadow-inner">
            <div className="flex items-center space-x-2 mb-6 border-b border-gray-800/50 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className="ml-4 text-gray-500 text-xs font-sans tracking-widest">bfsi_refund_policy.cedar</span>
            </div>
            <div className="text-gray-300 leading-relaxed text-[13px]">
              <span className="text-purple-400 font-bold">permit</span> (<br/>
              &nbsp;&nbsp;principal == AgentRole::<span className="text-green-400">"customer_bot"</span>,<br/>
              &nbsp;&nbsp;action == Action::<span className="text-green-400">"execute_refund"</span>,<br/>
              &nbsp;&nbsp;resource == Endpoint::<span className="text-green-400">"/api/v1/refund"</span><br/>
              ) <span className="text-purple-400 font-bold">when</span> {'{'}<br/>
              &nbsp;&nbsp;context.requested_amount &lt;= <span className="text-yellow-400">5000</span><br/>
              {'}'};<br/><br/>
              <span className="text-red-400 font-bold">forbid</span> (<br/>
              &nbsp;&nbsp;principal == AgentRole::<span className="text-green-400">"customer_bot"</span>,<br/>
              &nbsp;&nbsp;action == Action::<span className="text-green-400">"increase_credit"</span><br/>
              );
            </div>
          </div>
          
          {/* Right: Simulator Stream */}
          <div className="bg-[#0B0F19]/80 backdrop-blur-md p-8 rounded-2xl border border-white/5 font-mono text-sm overflow-hidden flex flex-col h-[400px] relative shadow-inner">
            <div className="text-gray-500 mb-6 text-xs font-sans tracking-widest border-b border-gray-800/50 pb-4 flex justify-between items-center">
              <span>LIVE TRAFFIC SIMULATOR</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-400 animate-glow-pulse mr-2"></span> INTERCEPTING</span>
            </div>
            <div className="flex-1 space-y-4 flex flex-col justify-end">
              {logFeed.map((log, i) => (
                <div key={`${log.id}-${i}`} className="flex flex-col p-4 bg-white/5 rounded-xl border-l-4 border-gray-600 animate-fade-in-up backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-300 truncate mr-3 font-mono">{log.text}</span>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                      log.type === 'green' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      log.type === 'yellow' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute top-[70px] left-0 w-full h-16 bg-gradient-to-b from-[#0B0F19]/90 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Core Moat Bento Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10" id="features">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Enterprise-Grade AI Security</h2>
          <p className="text-xl text-gray-400 font-light">Four pillars of autonomous agent governance.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-10 rounded-3xl glass-card hover:border-[#006FCF]/50 transition-all hover:shadow-[0_0_30px_rgba(0,111,207,0.15)] group">
            <div className="w-14 h-14 rounded-2xl bg-[#006FCF]/10 flex items-center justify-center text-[#00F0FF] mb-8 text-2xl group-hover:scale-110 transition-transform">⚡</div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Layer 3 Zero-Trust Proxy</h3>
            <p className="text-gray-400 text-base leading-relaxed font-light">Inline network interception operating at &lt;5ms latency. Sits directly between your AI agent fleet and external APIs. Stops hallucinations before they reach production endpoints without requiring any changes to your application code.</p>
          </div>
          <div className="p-10 rounded-3xl glass-card hover:border-yellow-500/50 transition-all hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] group">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 mb-8 text-2xl group-hover:scale-110 transition-transform">🛡️</div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Global PII Redactor</h3>
            <p className="text-gray-400 text-base leading-relaxed font-light">In-memory contextual text analysis powered by Python regex engines. Automatically strips Indian Aadhaar & PAN, US SSNs & Credit Cards, and EU IBAN numbers from outbound JSON payloads.</p>
          </div>
          <div className="p-10 rounded-3xl glass-card hover:border-purple-500/50 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] group">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-8 text-2xl group-hover:scale-110 transition-transform">⚖️</div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Market-Specific Cedar Policies</h3>
            <p className="text-gray-400 text-base leading-relaxed font-light">AWS Cedar-backed Policy Decision Point (PDP). Enforces strict role-based execution boundaries and sliding-window velocity caps tailored to HIPAA, GDPR, and RBI guidelines.</p>
          </div>
          <div className="lg:col-span-2 p-10 rounded-3xl glass-card hover:border-green-500/50 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] group">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 mb-8 text-2xl group-hover:scale-110 transition-transform">⛓️</div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">SHA-256 Merkle Ledger</h3>
            <p className="text-gray-400 text-base leading-relaxed font-light">Cryptographically chained audit receipts for every single agent tool call. Exposes 1-Click CISO PDF Audit generation for global compliance (GDPR, HIPAA, CERT-In) and irrefutable proof of agent actions.</p>
          </div>
        </div>
      </section>

      {/* Enterprise Trust Banner */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="bg-gradient-to-r from-[#006FCF]/10 to-transparent border border-[#006FCF]/30 p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between backdrop-blur-xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F0FF]/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">VPC Isolation & Zero Data Exfiltration</h3>
            <p className="text-gray-300 text-lg font-light max-w-xl">100% Self-Hosted VPC Sidecar Deployment. Your sensitive data and models never leave your network boundaries.</p>
          </div>
          <button className="mt-8 md:mt-0 px-8 py-4 rounded-full font-bold bg-white text-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] relative z-10 whitespace-nowrap">
            Contact Enterprise Sales
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20 bg-[#0B0F19]/50 backdrop-blur-xl py-16 relative z-10">
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
