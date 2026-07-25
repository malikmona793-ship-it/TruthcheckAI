import React, { useState } from 'react';
import { Globe, ShieldAlert, Lock, AlertTriangle, CheckCircle2, Search, ArrowRight, ExternalLink } from 'lucide-react';

export const DomainInspector: React.FC = () => {
  const [domainInput, setDomainInput] = useState('');
  const [analyzed, setAnalyzed] = useState<any | null>(null);

  const handleInspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    let clean = domainInput.trim().toLowerCase();
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      clean = clean.replace(/^https?:\/\//, '');
    }
    clean = clean.split('/')[0]; // get hostname

    const isHttpsGuess = domainInput.startsWith('https://') || (!domainInput.startsWith('http://'));
    const suspiciousTLDs = ['.xyz', '.top', '.freehost', '.shop', '.site', '.work', '.click', '.buzz', '.zip', '.mov', '.tk', '.ml', '.ga', '.cf', '.gq'];
    const hasSuspiciousTLD = suspiciousTLDs.some((tld) => clean.endsWith(tld));

    const brandKeywords = ['paypal', 'chase', 'amazon', 'apple', 'google', 'microsoft', 'bankofamerica', 'wellsfargo', 'usps', 'fedex', 'dhl', 'whatsapp', 'instagram', 'facebook', 'telegram', 'binance', 'coinbase', 'netflix'];
    const matchedBrand = brandKeywords.find((brand) => clean.includes(brand) && !clean.endsWith(`.${brand}.com`) && clean !== `${brand}.com` && !clean.endsWith(`.${brand}.org`));

    setAnalyzed({
      originalInput: domainInput,
      domain: clean,
      isHttps: isHttpsGuess,
      hasSuspiciousTLD,
      matchedBrand,
      tld: '.' + clean.split('.').pop(),
      riskLevel: matchedBrand || hasSuspiciousTLD || !isHttpsGuess ? 'HIGH' : 'LOW',
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2 border-b-2 border-[#141414] pb-6">
        <div className="inline-block bg-[#7C3AED] text-white text-[10px] font-black px-3 py-1 uppercase tracking-[0.2em]">
          Protocol Inspector • Telemetry & Domain Spoofing
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#141414] tracking-tighter leading-none font-serif uppercase italic">
          Website & <span className="text-[#7C3AED]">Domain Inspector</span>
        </h2>
        <p className="text-xs sm:text-sm font-serif italic text-[#141414]/80 max-w-2xl mx-auto">
          Deconstruct web addresses for typosquatting, high-risk TLD extensions (.xyz, .freehost, .shop), and brand impersonation vectors used in phishing.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white border-2 border-[#141414] p-6 space-y-4">
        <form onSubmit={handleInspect} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-[#141414] absolute left-3.5 top-4" />
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="e.g. paypal-security-update.xyz or amazon.login-verify.site"
              className="w-full bg-[#FAF9F6] border-2 border-[#141414] pl-10 pr-4 py-3.5 text-xs font-mono text-[#141414] placeholder-[#141414]/40 focus:outline-none focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white border-2 border-[#141414] font-black text-xs uppercase tracking-[0.15em] shadow-[3px_3px_0px_0px_#141414] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Inspect Domain</span>
          </button>
        </form>

        {/* Quick Demo Domains */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#141414]/20">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#141414]/50">Sample Test Nodes:</span>
          {[
            'chase-bank-verify.freehost.net',
            'paypal-security-auth.xyz',
            'amazon.com'
          ].map((demo) => (
            <button
              key={demo}
              type="button"
              onClick={() => {
                setDomainInput(demo);
              }}
              className="px-3 py-1 bg-[#FAF9F6] border border-[#141414] text-[10px] font-mono font-bold text-[#141414] hover:bg-[#141414] hover:text-white transition-colors"
            >
              {demo}
            </button>
          ))}
        </div>
      </div>

      {/* Inspection Output */}
      {analyzed && (
        <div className="bg-white border-2 border-[#141414] p-6 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-[#141414] pb-4 gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#141414]/50">Target Anatomy</span>
              <h3 className="text-xl font-mono font-black text-[#141414] mt-0.5">{analyzed.domain}</h3>
            </div>

            <span className={`px-3 py-1 font-black text-xs uppercase tracking-widest border-2 border-[#141414] ${
              analyzed.riskLevel === 'HIGH'
                ? 'bg-[#FFEBEB] text-[#E63946]'
                : 'bg-[#F0FDF4] text-[#0D5C3A]'
            }`}>
              {analyzed.riskLevel === 'HIGH' ? '🚨 High Risk / Phishing Suspect' : '✅ Standard Domain'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Metric 1: Brand Spoofing */}
            <div className="p-4 bg-[#FAF9F6] border-2 border-[#141414] space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#141414]/50 block">Brand Impersonation</span>
              {analyzed.matchedBrand ? (
                <div className="text-xs font-black text-[#E63946] flex items-center gap-1.5 mt-1 uppercase">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Spoofs '{analyzed.matchedBrand}'</span>
                </div>
              ) : (
                <div className="text-xs font-black text-[#0D5C3A] flex items-center gap-1.5 mt-1 uppercase">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>No Spoofing Flag</span>
                </div>
              )}
            </div>

            {/* Metric 2: TLD Risk */}
            <div className="p-4 bg-[#FAF9F6] border-2 border-[#141414] space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#141414]/50 block">Extension ({analyzed.tld})</span>
              {analyzed.hasSuspiciousTLD ? (
                <div className="text-xs font-black text-[#B45309] flex items-center gap-1.5 mt-1 uppercase">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>High Spam TLD ({analyzed.tld})</span>
                </div>
              ) : (
                <div className="text-xs font-black text-[#141414] flex items-center gap-1.5 mt-1 uppercase">
                  <Globe className="w-4 h-4 shrink-0" />
                  <span>Standard TLD ({analyzed.tld})</span>
                </div>
              )}
            </div>

            {/* Metric 3: Encryption */}
            <div className="p-4 bg-[#FAF9F6] border-2 border-[#141414] space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#141414]/50 block">Encryption</span>
              {analyzed.isHttps ? (
                <div className="text-xs font-black text-[#0D5C3A] flex items-center gap-1.5 mt-1 uppercase">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>HTTPS Encrypted</span>
                </div>
              ) : (
                <div className="text-xs font-black text-[#E63946] flex items-center gap-1.5 mt-1 uppercase">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Unencrypted HTTP</span>
                </div>
              )}
            </div>

          </div>

          <div className="p-4 bg-[#FAF9F6] border-2 border-[#141414] text-xs font-serif leading-relaxed text-[#141414]">
            <span className="font-sans font-black uppercase tracking-widest text-[10px] text-[#141414] block mb-1">Inspector Advisory:</span>
            {analyzed.matchedBrand ? (
              <span className="text-[#E63946] font-bold">
                CRITICAL WARNING: This domain contains the name "{analyzed.matchedBrand}" but is hosted on an independent non-official server. Legitimate companies never instruct users to log in on alternative domain names.
              </span>
            ) : analyzed.hasSuspiciousTLD ? (
              <span className="text-[#B45309] font-bold">
                CAUTION: Top-level domain extensions like {analyzed.tld} are frequently used in bulk phishing and spam email campaigns because of low registration costs.
              </span>
            ) : (
              <span>
                Domain format appears standard. Remember to verify the full URL path and verify that sensitive credentials are only entered on bookmarked or official apps.
              </span>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
