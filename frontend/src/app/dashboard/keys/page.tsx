"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ApiKeysPage() {
  const router = useRouter();
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('aegisclaw_auth');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchKeys(token);
  }, [router]);

  const fetchKeys = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/keys`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setKeys(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const generateKey = async () => {
    const token = localStorage.getItem('aegisclaw_auth');
    if (!token) return;
    setLoading(true);
    try {
      const name = prompt("Enter a name for this API Key (e.g. Production Refund Bot):");
      if (!name) {
        setLoading(false);
        return;
      }
      
      const res = await fetch(`${API_BASE}/admin/keys`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        await fetchKeys(token);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-gray-200 font-sans selection:bg-[#00F0FF] selection:text-black overflow-hidden relative">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00F0FF]/5 rounded-full blur-[150px] animate-blob mix-blend-screen pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-50 glass-nav transition-all duration-300 border-b border-white/5 bg-[#0B0F19]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-3 group mr-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00F0FF] to-[#006FCF] flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all">A</div>
              </Link>
              <h1 className="text-2xl font-bold tracking-widest text-white font-mono uppercase">
                API KEYS <span className="text-gray-500 font-light">| ACCESS MANAGEMENT</span>
              </h1>
            </div>
            <div className="mt-2 ml-16">
              <span className="text-xs font-mono text-gray-500">Manage cryptographic tokens used to authenticate your agent fleets.</span>
            </div>
          </div>
          
          <div className="flex space-x-6 items-center">
            <Link 
              href="/dashboard"
              className="px-6 py-2.5 text-xs font-bold font-mono tracking-widest transition-all bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white rounded-full flex items-center shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] group"
            >
              <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> BACK TO DASHBOARD
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 relative z-10 mt-8">
        
        <section className="glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#006FCF]/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
            <h2 className="text-xl font-bold font-mono text-white tracking-widest uppercase">Active Tokens</h2>
            <button 
              onClick={generateKey}
              disabled={loading}
              className="px-6 py-3 font-bold font-mono text-xs uppercase tracking-widest bg-gradient-to-r from-[#00F0FF] to-[#006FCF] hover:from-[#00d0dd] hover:to-[#005bb5] text-black rounded-full transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Generate New Key
            </button>
          </div>
          
          <div className="space-y-4">
            {keys.length === 0 ? (
              <div className="text-gray-500 italic p-8 bg-white/5 rounded-2xl border border-white/5 text-center font-mono text-sm">
                No API keys found. Generate one to authenticate your agents.
              </div>
            ) : (
              keys.map((keyObj, i) => (
                <div key={i} className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                  <div>
                    <div className="text-white font-bold font-mono tracking-wide">{keyObj.name}</div>
                    <div className="text-[10px] font-mono text-gray-500 mt-2 uppercase tracking-widest">Created: {new Date(keyObj.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <code className="bg-black/50 text-[#00F0FF] px-4 py-2 rounded-lg text-sm font-mono border border-white/5 shadow-inner">
                      {keyObj.api_key}
                    </code>
                    <button className="text-red-500/70 hover:text-red-400 text-xs font-bold font-mono uppercase tracking-widest transition-colors">
                      Revoke
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
