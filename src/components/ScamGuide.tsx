import React, { useState } from 'react';
import {
  Briefcase,
  Mail,
  MessageSquare,
  PhoneCall,
  Newspaper,
  ShoppingBag,
  ShieldAlert,
  X,
  ChevronRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { SCAM_GUIDE_ITEMS, ScamGuideItem } from '../data/scamGuides';

const ICON_MAP: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="w-5 h-5 text-[#141414]" />,
  Mail: <Mail className="w-5 h-5 text-[#141414]" />,
  MessageSquare: <MessageSquare className="w-5 h-5 text-[#141414]" />,
  PhoneCall: <PhoneCall className="w-5 h-5 text-[#E63946]" />,
  Newspaper: <Newspaper className="w-5 h-5 text-[#141414]" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5 text-[#141414]" />,
};

export const ScamGuide: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ScamGuideItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = SCAM_GUIDE_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      
      {/* Hero Header */}
      <div className="text-center space-y-2 border-b-2 border-[#141414] pb-6">
        <div className="inline-block bg-[#E11D48] text-white text-[10px] font-black px-3 py-1 uppercase tracking-[0.2em]">
          Knowledge Base • Prevention Protocols
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#141414] tracking-tighter leading-none font-serif uppercase italic">
          Scam & <span className="text-[#E11D48]">Misinformation Guide</span>
        </h2>
        <p className="text-xs sm:text-sm font-serif italic text-[#141414]/80 max-w-2xl mx-auto">
          Identify recurring tactics across fake job offers, phishing emails, SMS smishing, lottery scams, fraudulent online stores, and health misinformation.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#141414]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search scams (e.g. job fee, bank alert, USPS, WhatsApp)..."
          className="w-full bg-[#FAF9F6] border-2 border-[#141414] pl-10 pr-4 py-3 text-xs font-serif italic text-[#141414] placeholder-[#141414]/40 focus:outline-none focus:bg-white"
        />
      </div>

      {/* Scam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuides.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="p-5 bg-white border-2 border-[#141414] hover:bg-[#FAF9F6] cursor-pointer transition-colors flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-[#FAF9F6] border border-[#141414]">
                  {ICON_MAP[item.iconName] || <ShieldAlert className="w-5 h-5 text-[#141414]" />}
                </div>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-[#141414] text-white tracking-widest">
                  {item.category}
                </span>
              </div>

              <div>
                <h3 className="font-black text-sm text-[#141414] uppercase tracking-wider group-hover:text-[#E63946] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-serif text-[#141414]/80 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.shortDesc}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-[#141414] flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#141414] mt-4">
              <span>Examine Vector</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Drawer for Detailed Scam Guide */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-[#141414]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#141414] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative animate-scale-up text-[#141414]">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b-2 border-[#141414] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#141414] text-white">
                  {ICON_MAP[selectedItem.iconName]}
                </div>
                <div>
                  <span className="text-[9px] font-black px-2 py-0.5 uppercase tracking-widest bg-[#E63946] text-white">
                    {selectedItem.category}
                  </span>
                  <h3 className="text-2xl font-black font-serif italic text-[#141414] mt-1">{selectedItem.title}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 border-2 border-[#141414] text-[#141414] hover:bg-[#141414] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 text-xs text-[#141414]">
              
              {/* Real World Examples */}
              <div className="space-y-2">
                <h4 className="font-black uppercase tracking-widest text-[#E63946] text-xs">
                  ● Typical Attack Vectors & Copy
                </h4>
                <div className="space-y-2">
                  {selectedItem.realExamples.map((ex, i) => (
                    <div key={i} className="p-3 bg-[#FAF9F6] border-2 border-[#141414] font-serif italic text-[#141414]">
                      "{ex}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Red Flags */}
              <div className="space-y-2">
                <h4 className="font-black uppercase tracking-widest text-[#B45309] text-xs">
                  ● Primary Red Flags
                </h4>
                <ul className="space-y-2 bg-[#FAF9F6] p-4 border-2 border-[#141414]">
                  {selectedItem.redFlags.map((flag, i) => (
                    <li key={i} className="flex items-start gap-2 font-serif text-[#141414]">
                      <span className="text-[#E63946] font-bold">—</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* How to Protect Yourself */}
              <div className="space-y-2">
                <h4 className="font-black uppercase tracking-widest text-[#0D5C3A] text-xs">
                  ● Defense Protocols & Actions
                </h4>
                <ul className="space-y-2 bg-[#FAF9F6] p-4 border-2 border-[#141414]">
                  {selectedItem.protectionSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 font-serif text-[#141414]">
                      <CheckCircle2 className="w-4 h-4 text-[#0D5C3A] shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t-2 border-[#141414] flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-6 py-3 bg-[#141414] text-white font-black uppercase tracking-widest text-xs hover:bg-[#E63946] transition-colors"
              >
                Close Protocol Guide
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
