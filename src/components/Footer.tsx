import React from 'react';
import { ShieldCheck, Heart, Lock, Globe, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t-2 border-[#141414] bg-[#FAF9F6] text-[#141414] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#141414] text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-[#141414] text-base uppercase tracking-tight">TruthCheck AI</span>
                <span className="text-[9px] font-black px-2 py-0.5 bg-[#141414] text-white uppercase tracking-widest">
                  Vol. 1.0
                </span>
              </div>
              <p className="text-xs font-serif italic text-[#141414]/70">Guardian against misinformation, fake news, and digital fraud.</p>
            </div>
          </div>

          {/* Quick Badges */}
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[#141414]">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#141414]" /> Zero Storage
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E63946]" /> Gemini AI Engine
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#141414]" /> Web Telemetry
            </span>
          </div>

        </div>

        <div className="pt-6 border-t border-[#141414]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-serif italic text-[#141414]/70">
          <p>© {new Date().getFullYear()} TruthCheck Gazette & Intelligence Systems. All rights reserved.</p>
          <p className="flex items-center gap-1 font-sans font-black text-[10px] uppercase tracking-widest text-[#141414]">
            ● Verified Autonomous Press Safeguard
          </p>
        </div>
      </div>
    </footer>
  );
};
