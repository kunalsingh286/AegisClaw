"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://justambition.up.railway.app";

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    killswitch_active: false,
    total_pii_redactions: 0,
    daily_aggregate_spend: 0,
    active_agent_count: 0,
    total_tokens_used: 0,
    prompt_injections_blocked: 0
  });
  const [logs, setLogs] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [auditStatus, setAuditStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('aegisclaw_auth')) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const statsRes = await fetch(`${API_BASE}/admin/stats`);
        if (statsRes.ok) setStats(await statsRes.json());
        
        const logsRes = await fetch(`${API_BASE}/admin/logs`);
        if (logsRes.ok) setLogs(await logsRes.json());
        
        const appRes = await fetch(`${API_BASE}/admin/approvals`);
        if (appRes.ok) setApprovals(await appRes.json());
      } catch (err) {
        console.error("Error fetching admin APIs", err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 1500);
    return () => clearInterval(interval);
  }, [router]);

  const toggleKillswitch = async () => {
    try {
      await fetch(`${API_BASE}/admin/killswitch/toggle`, { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
  };

  const resolveApproval = async (id: string, decision: string) => {
    try {
      await fetch(`${API_BASE}/admin/approval/${id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const verifyAudit = async () => {
    try {
      setAuditStatus("Verifying...");
      const res = await fetch(`${API_BASE}/proxy/audit/verify`);
      const data = await res.json();
      if (data.chain_valid) {
        setAuditStatus("MERKLE CHAIN VALID");
      } else {
        setAuditStatus(`TAMPERED AT INDEX ${data.tampered_at}`);
      }
    } catch (err) {
      console.error(err);
      setAuditStatus("ERROR");
    }
  };

  const spendPercentage = Math.min((stats.daily_aggregate_spend / 50000) * 100, 100);

  const [activeRegion, setActiveRegion] = useState("IN");

  return (
    <div className="min-h-screen bg-[#070A12] text-gray-200 font-sans selection:bg-[#00F0FF] selection:text-black overflow-hidden relative">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00F0FF]/5 rounded-full blur-[150px] animate-blob mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#006FCF]/5 rounded-full blur-[150px] animate-blob mix-blend-screen pointer-events-none" style={{animationDelay: "2s"}}></div>

      {/* Header */}
      <header className="relative z-50 glass-nav transition-all duration-300 border-b border-white/5 bg-[#0B0F19]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 group mr-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00F0FF] to-[#006FCF] flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all">A</div>
              </Link>
              <h1 className="text-2xl font-bold tracking-widest text-white font-mono uppercase">
                <span className="text-gradient from-gray-400 to-white">AEGISCLAW</span> CISO DASHBOARD
              </h1>
            </div>
            
            {/* Region & Regulatory Pack Selector */}
            <div className="flex items-center mt-3 space-x-2">
              <button 
                onClick={() => setActiveRegion("IN")}
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase transition-all ${activeRegion === 'IN' ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'bg-white/5 text-gray-500 border border-white/10 hover:text-gray-300'}`}
              >
                🇮🇳 India (DPDP/RBI)
              </button>
              <button 
                onClick={() => setActiveRegion("US")}
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase transition-all ${activeRegion === 'US' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-white/5 text-gray-500 border border-white/10 hover:text-gray-300'}`}
              >
                🇺🇸 US (HIPAA/NIST)
              </button>
              <button 
                onClick={() => setActiveRegion("EU")}
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase transition-all ${activeRegion === 'EU' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-white/5 text-gray-500 border border-white/10 hover:text-gray-300'}`}
              >
                🇪🇺 EU (AI Act/GDPR)
              </button>
            </div>
          </div>
          
          <div className="flex space-x-6 items-center">
            <Link 
              href="/dashboard/keys"
              className="px-6 py-2.5 text-xs font-bold font-mono tracking-widest transition-all bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white rounded-full flex items-center shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              API KEYS
            </Link>
            <a 
              href={`${API_BASE}/admin/reports/pdf`}
              download
              className="px-6 py-2.5 text-xs font-bold font-mono tracking-widest transition-all bg-[#006FCF]/10 hover:bg-[#006FCF]/20 border border-[#006FCF]/30 hover:border-[#006FCF]/60 text-[#00F0FF] rounded-full flex items-center shadow-lg hover:shadow-[0_0_15px_rgba(0,111,207,0.3)]"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              PDF AUDIT
            </a>
            <button 
              onClick={toggleKillswitch}
              className={`px-8 py-3 text-xs font-black font-mono tracking-widest transition-all rounded-full flex items-center justify-center relative overflow-hidden group ${
                stats.killswitch_active 
                  ? 'bg-red-900 border border-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse' 
                  : 'bg-[#0B0F19] border border-red-500/50 hover:bg-red-500/10 text-red-500 hover:text-red-400 hover:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]'
              }`}
            >
              <span className="relative z-10 flex items-center">
                <span className={`w-2 h-2 rounded-full mr-3 ${stats.killswitch_active ? 'bg-white' : 'bg-red-500 group-hover:bg-red-400 glow'}`}></span>
                FLEET EMERGENCY STOP
              </span>
              {stats.killswitch_active && (
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
              )}
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('aegisclaw_auth');
                router.push('/');
              }}
              className="px-4 py-2 text-xs font-bold font-mono tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 mt-4">
        
        {/* Real-Time Traffic Feed */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 h-[700px] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-[#0B0F19] to-transparent pointer-events-none z-10"></div>
          
          <div className="flex justify-between items-center mb-6 z-20">
            <h2 className="text-xl font-bold font-mono text-white tracking-widest uppercase">Live Traffic Stream</h2>
            <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div>
              <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-widest font-bold">
                {activeRegion === "IN" ? "Intercepting (DPDP)" : activeRegion === "US" ? "Intercepting (HIPAA)" : "Intercepting (EU AI Act)"}
              </span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10 z-20">
            {logs.length === 0 ? (
              <div className="text-gray-500 italic font-mono text-sm pt-4">Awaiting inbound traffic...</div>
            ) : (
              logs.map((log, i) => {
                const isDenied = log.decision === "Deny" || log.decision === "Error";
                const isRedacted = JSON.stringify(log.redacted_payload_snippet).includes("REDACTED");
                
                return (
                  <div key={i} className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors font-mono text-sm animate-fade-in-up">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs mb-1">{log.timestamp}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-bold">{log.agent_id}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-[#00F0FF]">{log.action}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {isRedacted && <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-[10px] px-2 py-1 rounded font-bold tracking-widest shadow-[0_0_10px_rgba(234,179,8,0.2)]">PII REDACTED</span>}
                        {isDenied ? (
                          <span className="bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] px-2 py-1 rounded font-bold tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.2)]">BLOCKED</span>
                        ) : (
                          <span className="bg-green-500/10 text-green-400 border border-green-500/30 text-[10px] px-2 py-1 rounded font-bold tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.2)]">PERMITTED</span>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-500 text-[10px] bg-black/30 rounded p-2 border border-black/50 truncate flex items-center">
                      <svg className="w-3 h-3 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                      {log.current_hash}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Spend Capacity Gauges */}
          <div className="glass-card rounded-3xl p-6 group hover:border-white/10 transition-all">
            <h2 className="text-xs font-bold font-mono text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Velocity Gauges</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-gray-400 uppercase">Daily Fleet Budget</span>
                  <span className="font-bold text-white">₹{stats.daily_aggregate_spend.toFixed(2)} <span className="text-gray-600">/ ₹50,000</span></span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-2 border border-white/5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full shadow-[0_0_10px_rgba(0,240,255,0.5)] transition-all duration-500 ${spendPercentage > 80 ? 'bg-gradient-to-r from-red-600 to-red-400' : spendPercentage > 50 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' : 'bg-gradient-to-r from-[#00F0FF] to-[#006FCF]'}`} 
                    style={{ width: `${spendPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all text-center group-hover:-translate-y-1">
                  <div className="text-gray-500 text-[10px] font-bold font-mono uppercase tracking-widest mb-1">Active Agents</div>
                  <div className="text-2xl font-black text-white font-mono">{stats.active_agent_count}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all text-center group-hover:-translate-y-1" style={{transitionDelay: '50ms'}}>
                  <div className="text-gray-500 text-[10px] font-bold font-mono uppercase tracking-widest mb-1">PII Redactions</div>
                  <div className="text-2xl font-black text-yellow-400 font-mono">{stats.total_pii_redactions}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all text-center group-hover:-translate-y-1" style={{transitionDelay: '100ms'}}>
                  <div className="text-gray-500 text-[10px] font-bold font-mono uppercase tracking-widest mb-1">Tokens Used</div>
                  <div className="text-xl font-black text-[#00F0FF] font-mono mt-1">{stats.total_tokens_used.toLocaleString()}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all text-center group-hover:-translate-y-1" style={{transitionDelay: '150ms'}}>
                  <div className="text-gray-500 text-[10px] font-bold font-mono uppercase tracking-widest mb-1">Prompt Blocks</div>
                  <div className="text-2xl font-black text-pink-400 font-mono">{stats.prompt_injections_blocked}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Human Approvals */}
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden border-orange-500/20 hover:border-orange-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[40px] pointer-events-none"></div>
            <h2 className="text-xs font-bold font-mono text-orange-400 uppercase tracking-widest mb-4 flex items-center border-b border-orange-500/10 pb-2">
              <span className="animate-pulse h-2 w-2 bg-orange-500 rounded-full mr-3 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></span>
              Pending HITL Approvals
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-900/50">
              {approvals.length === 0 ? (
                <div className="text-gray-500 italic font-mono text-xs pt-2">No pending step-up requests...</div>
              ) : (
                approvals.map((app, i) => (
                  <div key={i} className="flex flex-col p-4 bg-orange-950/20 rounded-xl border border-orange-500/20 text-sm font-mono backdrop-blur-sm shadow-inner">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-white font-bold text-xs">{app.agent_id}</div>
                      <div className="text-orange-400 font-black text-sm">₹{app.amount}</div>
                    </div>
                    <div className="text-gray-400 text-xs mb-4 uppercase">{app.action}</div>
                    <div className="flex space-x-3 mt-auto">
                      <button onClick={() => resolveApproval(app.approval_id, 'APPROVED')} className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 py-2 rounded-lg border border-green-500/30 font-bold text-[10px] uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]">Approve</button>
                      <button onClick={() => resolveApproval(app.approval_id, 'REJECTED')} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg border border-red-500/30 font-bold text-[10px] uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">Reject</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cryptographic Verification Badge */}
          <div className="glass-card rounded-3xl p-6 group hover:border-purple-500/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-purple-500/10 transition-all"></div>
            <h2 className="text-xs font-bold font-mono text-gray-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Audit Ledger</h2>
            
            <button 
              onClick={verifyAudit}
              className="w-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold font-mono text-[10px] uppercase tracking-widest py-3 px-4 rounded-xl border border-purple-500/30 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] mb-4"
            >
              Verify Merkle Chain
            </button>
            
            {auditStatus && (
              <div className={`p-4 text-center font-bold font-mono text-[10px] tracking-widest uppercase rounded-xl transition-all ${
                auditStatus.includes('VALID') ? 'bg-green-500/10 text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 
                auditStatus.includes('Verifying') ? 'bg-black/30 text-gray-400 border border-white/5' :
                'bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse'
              }`}>
                {auditStatus}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
