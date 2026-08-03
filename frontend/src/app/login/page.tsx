"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) {
        throw new Error('Invalid email or password');
      }
      
      const data = await res.json();
      localStorage.setItem('aegisclaw_auth', data.access_token);
      localStorage.setItem('aegisclaw_tenant', data.tenant_id);
      router.push('/dashboard');
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] flex items-center justify-center p-6 text-gray-200 font-sans relative overflow-hidden">
      
      {/* Mesh Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#00F0FF]/10 rounded-full blur-[150px] animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#006FCF]/10 rounded-full blur-[150px] animate-blob pointer-events-none" style={{animationDelay: "3s"}}></div>

      <div className="w-full max-w-md glass-card p-10 rounded-3xl shadow-[0_0_50px_rgba(0,111,207,0.15)] relative z-10 animate-fade-in-up">
        <div className="flex justify-center mb-10">
          <Link href="/" className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00F0FF] to-[#006FCF] flex items-center justify-center font-bold text-black text-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all mb-4">A</div>
            <span className="text-2xl font-bold tracking-widest text-white group-hover:text-[#00F0FF] transition-colors">AEGISCLAW</span>
          </Link>
        </div>
        
        <h2 className="text-xl font-bold text-white mb-8 text-center tracking-tight">Sign in to Command Center</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 font-light">Work Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all"
              placeholder="ciso@enterprise.com"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-400 font-light">Password</label>
              <a href="#" className="text-xs text-[#00F0FF] hover:underline">Forgot?</a>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00F0FF] to-[#006FCF] hover:scale-[1.02] text-black font-bold py-4 rounded-xl mt-4 transition-all disabled:opacity-50 flex justify-center items-center shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              "Secure Sign In"
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-500 font-light">
          Don't have an account? <Link href="/pricing" className="text-white hover:text-[#00F0FF] transition-colors font-medium border-b border-white/20 hover:border-[#00F0FF]">View pricing</Link>
        </div>
      </div>
    </div>
  );
}
