"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Do not render on dashboard or login pages
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
    return null;
  }

  return (
    <nav className="fixed w-full z-50 glass-nav transition-all duration-300 border-b border-white/5 bg-[#0B0F19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00F0FF] to-[#006FCF] flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all">A</div>
          <span className="text-xl font-bold tracking-widest text-white group-hover:text-[#00F0FF] transition-colors">AEGISCLAW</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400 relative h-full">
          {/* Platform Link */}
          <Link href="/platform" className={`hover:text-white transition-colors ${pathname === '/platform' ? 'text-white font-semibold' : ''}`}>Platform</Link>

          {/* Solutions Dropdown */}
          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setActiveDropdown('solutions')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="hover:text-white transition-colors flex items-center">
              Solutions <span className="ml-1 text-xs">▾</span>
            </button>
            
            {activeDropdown === 'solutions' && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[750px] glass-card p-6 grid grid-cols-3 gap-4 rounded-2xl shadow-2xl border border-white/10 animate-fade-in-up">
                <div className="col-span-3 border-b border-white/10 pb-4 mb-2">
                  <div className="font-bold text-[#00F0FF] mb-1">Global Market Solutions</div>
                  <div className="text-sm text-gray-400 font-light">Dedicated zero-trust compliance guardrails tailored to your region's sovereign laws.</div>
                </div>
                
                <Link href="/solutions/us" className="group p-4 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] mb-4">🇺🇸</div>
                  <div className="font-bold text-white mb-2 group-hover:text-[#00F0FF]">United States</div>
                  <div className="text-xs text-gray-400 font-light leading-relaxed">
                    HIPAA & NIST AI RMF compliance. Instantly strip SSNs, Medicare numbers, and payment data before LLM egress.
                  </div>
                </Link>

                <Link href="/solutions/eu" className="group p-4 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-purple-500/30">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">🇪🇺</div>
                  <div className="font-bold text-white mb-2 group-hover:text-purple-400">European Union</div>
                  <div className="text-xs text-gray-400 font-light leading-relaxed">
                    GDPR & EU AI Act readiness. Enforce strict data sovereignty, right-to-be-forgotten tracing, and IBAN masking.
                  </div>
                </Link>

                <Link href="/solutions/india" className="group p-4 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-green-500/30">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 mb-4">🇮🇳</div>
                  <div className="font-bold text-white mb-2 group-hover:text-green-400">India</div>
                  <div className="text-xs text-gray-400 font-light leading-relaxed">
                    DPDP Act 2023 & RBI eMRM. Execute contextual redaction for Aadhaar, PAN, and restrict financial agent velocity.
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link href="/architecture" className={`hover:text-white transition-colors ${pathname === '/architecture' ? 'text-white font-semibold' : ''}`}>Architecture</Link>
          <Link href="/docs" className={`hover:text-white transition-colors ${pathname === '/docs' ? 'text-white font-semibold' : ''}`}>Docs</Link>
          <Link href="/pricing" className={`hover:text-white transition-colors ${pathname === '/pricing' ? 'text-white font-semibold' : ''}`}>Pricing</Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/login" className="text-sm font-bold text-white hover:text-[#00F0FF] transition-colors">Log In</Link>
          <Link href="/login" className="text-sm font-bold px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#006FCF] text-black hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]">
            Schedule CISO Briefing
          </Link>
        </div>
      </div>
    </nav>
  );
}
