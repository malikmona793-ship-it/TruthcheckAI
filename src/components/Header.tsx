import React from 'react';
import { ShieldCheck, Search, BookOpen, History, Globe, Briefcase, BellRing } from 'lucide-react';
import { AppTab } from '../types';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, savedCount }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#FBFBF9] border-b-2 border-[#141414] text-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 border-b border-[#141414]/10 gap-3">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('scanner')}
            className="flex items-center gap-4 cursor-pointer group shrink-0"
          >
            <div className="p-2.5 bg-[#141414] text-white border-2 border-[#141414] group-hover:bg-[#E63946] group-hover:border-[#E63946] transition-colors">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-serif font-black text-3xl tracking-tighter uppercase italic text-[#141414]">
                  TruthCheck AI
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-[#141414] text-white">
                  Agency 2.0
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#141414]/60">
                Digital Verification • Anti-Fraud Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === 'scanner'
                  ? 'bg-[#2563EB] text-white border-2 border-[#1E40AF] shadow-[2px_2px_0px_0px_#141414]'
                  : 'bg-white text-[#141414] border-2 border-[#141414] hover:bg-[#2563EB]/10'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Scanner</span>
            </button>

            <button
              onClick={() => setActiveTab('job')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === 'job'
                  ? 'bg-[#059669] text-white border-2 border-[#047857] shadow-[2px_2px_0px_0px_#141414]'
                  : 'bg-white text-[#141414] border-2 border-[#141414] hover:bg-[#059669]/10'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Job Verifier</span>
            </button>

            <button
              onClick={() => setActiveTab('notification')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === 'notification'
                  ? 'bg-[#EA580C] text-white border-2 border-[#C2410C] shadow-[2px_2px_0px_0px_#141414]'
                  : 'bg-white text-[#141414] border-2 border-[#141414] hover:bg-[#EA580C]/10'
              }`}
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Notification Alert</span>
            </button>

            <button
              onClick={() => setActiveTab('domain')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === 'domain'
                  ? 'bg-[#7C3AED] text-white border-2 border-[#6D28D9] shadow-[2px_2px_0px_0px_#141414]'
                  : 'bg-white text-[#141414] border-2 border-[#141414] hover:bg-[#7C3AED]/10'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Domain Inspector</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === 'guide'
                  ? 'bg-[#E11D48] text-white border-2 border-[#BE123C] shadow-[2px_2px_0px_0px_#141414]'
                  : 'bg-white text-[#141414] border-2 border-[#141414] hover:bg-[#E11D48]/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Scam Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === 'history'
                  ? 'bg-[#0D9488] text-white border-2 border-[#0F766E] shadow-[2px_2px_0px_0px_#141414]'
                  : 'bg-white text-[#141414] border-2 border-[#141414] hover:bg-[#0D9488]/10'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
              {savedCount > 0 && (
                <span className={`px-1.5 py-0.2 text-[10px] font-black ${
                  activeTab === 'history' ? 'bg-[#E63946] text-white' : 'bg-[#141414] text-white'
                }`}>
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};

