import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Bookmark,
  Share2,
  RotateCcw,
  ExternalLink,
  Info,
  Lock,
  Globe,
  ArrowRight,
  ShieldQuestion,
  HelpCircle
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface ResultViewProps {
  result: AnalysisResult;
  onReset: () => void;
  onSave: (result: AnalysisResult) => void;
  isSaved: boolean;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onReset,
  onSave,
  isSaved,
}) => {
  const [copied, setCopied] = useState(false);

  // Helper colors based on trust score
  const getScoreTheme = (score: number, label: string) => {
    if (score <= 35 || label === 'FAKE') {
      return {
        bg: 'bg-[#FEF2F2]',
        border: 'border-2 border-[#DC2626]',
        text: 'text-[#DC2626]',
        badgeBg: 'bg-[#DC2626] text-white',
        meterColor: 'bg-[#DC2626]',
        statusTag: 'REPORT GENERATED • CONFIRMED SCAM',
        statusText: 'Verdict: Fake',
        statusDesc: 'High risk of financial fraud, phishing, or automated misinformation.',
      };
    }
    if (score <= 70 || label === 'SUSPICIOUS') {
      return {
        bg: 'bg-[#FFFBEB]',
        border: 'border-2 border-[#D97706]',
        text: 'text-[#D97706]',
        badgeBg: 'bg-[#D97706] text-white',
        meterColor: 'bg-[#D97706]',
        statusTag: 'REPORT GENERATED • SUSPICIOUS PATTERN',
        statusText: 'Verdict: High Risk',
        statusDesc: 'Multiple alarming indicators detected. Proceed with strict caution.',
      };
    }
    return {
      bg: 'bg-[#ECFDF5]',
      border: 'border-2 border-[#059669]',
      text: 'text-[#059669]',
      badgeBg: 'bg-[#059669] text-white',
      meterColor: 'bg-[#059669]',
      statusTag: 'REPORT GENERATED • VERIFIED LEGIT',
      statusText: 'Verdict: Authentic',
      statusDesc: 'Matches expected genuine domain and communication standards.',
    };
  };

  const theme = getScoreTheme(result.trustScore, result.label);

  const handleCopyReport = () => {
    const text = `🔍 TruthCheck AI Verification Report
Result: ${theme.statusText} (${result.trustScore}% Trust Score)
Category: ${result.category}
Summary: ${result.summary}

Check details on TruthCheck AI!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border-2 border-[#141414] p-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#141414] bg-[#FAF9F6] border-2 border-[#141414] hover:bg-[#141414] hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Run New Scan</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSave(result)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-colors border-2 border-[#141414] ${
              isSaved
                ? 'bg-[#141414] text-white'
                : 'bg-white text-[#141414] hover:bg-[#FAF9F6]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
            <span>{isSaved ? 'Archived' : 'Save Audit'}</span>
          </button>

          <button
            onClick={handleCopyReport}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#141414] bg-white border-2 border-[#141414] hover:bg-[#141414] hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Export Copy'}</span>
          </button>
        </div>
      </div>

      {/* Main Editorial Verdict Section */}
      <section className={`p-6 sm:p-10 ${theme.bg} ${theme.border} space-y-8`}>
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 border-b-2 border-[#141414] pb-8">
          
          <div className="space-y-2 flex-1">
            <span className={`inline-block text-[10px] font-black px-2.5 py-1 uppercase tracking-wider ${theme.badgeBg}`}>
              {theme.statusTag}
            </span>
            <h2 className={`text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none font-serif italic ${theme.text}`}>
              {theme.statusText}
            </h2>
            <p className="font-serif italic text-base sm:text-lg text-[#141414] pt-1">
              {result.summary}
            </p>
            <p className="text-xs text-[#141414]/80 leading-relaxed max-w-2xl font-medium pt-1">
              {result.explanation}
            </p>
          </div>

          {/* Editorial Score Display */}
          <div className="text-right shrink-0 self-center md:self-start bg-white p-4 border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414]">
            <div className={`text-[64px] sm:text-[72px] font-black leading-none tracking-tighter ${theme.text}`}>
              {result.trustScore}%
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest mt-1 text-[#141414] border-t-2 border-[#141414] pt-1">
              Trust Score
            </div>
            <div className="w-full h-2.5 bg-gray-200 border border-[#141414] mt-2 overflow-hidden">
              <div
                className={`h-full ${theme.meterColor} transition-all duration-700`}
                style={{ width: `${result.trustScore}%` }}
              />
            </div>
          </div>

        </div>

        {/* Anomaly Log vs Credibility Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Anomaly Log (Red Flags) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-[#141414] pb-1.5 text-[#141414] flex items-center justify-between">
              <span>Anomaly Log</span>
              <span className="text-[#E63946]">({result.redFlags.length} Signals)</span>
            </h3>

            {result.redFlags.length === 0 ? (
              <p className="text-xs font-serif italic text-[#141414]/60">No primary anomaly vectors detected.</p>
            ) : (
              <ul className="space-y-3">
                {result.redFlags.map((flag, idx) => (
                  <li key={idx} className="p-3 bg-white border-2 border-[#141414] space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
                        <span className="text-[#E63946]">●</span> {flag.title}
                      </span>
                      <span className="px-1.5 py-0.5 text-[9px] font-black uppercase bg-[#141414] text-white">
                        {flag.severity} RISK
                      </span>
                    </div>
                    <p className="text-xs font-serif text-[#141414]/80 leading-tight">{flag.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Credibility Log (Green Flags) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-[#141414] pb-1.5 text-[#141414] flex items-center justify-between">
              <span>Credibility Log</span>
              <span className="text-[#0D5C3A]">({result.greenFlags.length} Signals)</span>
            </h3>

            {result.greenFlags.length === 0 ? (
              <p className="text-xs font-serif italic text-[#141414]/60">No positive credibility markers identified.</p>
            ) : (
              <ul className="space-y-3">
                {result.greenFlags.map((flag, idx) => (
                  <li key={idx} className="p-3 bg-white border-2 border-[#141414] space-y-1">
                    <span className="text-xs font-black uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
                      <span className="text-emerald-600">●</span> {flag.title}
                    </span>
                    <p className="text-xs font-serif text-[#141414]/80 leading-tight">{flag.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </section>

      {/* Domain & Link Inspector Section */}
      {result.domainAnalysis && (
        <div className="bg-white border-2 border-[#141414] p-6 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-[#141414] pb-2 text-[#141414]">
            Domain & Protocol Telemetry
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#FAF9F6] border-2 border-[#141414]">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#141414]/50 block">Domain Name</span>
              <span className="text-xs font-black font-mono text-[#141414] truncate block mt-1">
                {result.domainAnalysis.domain}
              </span>
            </div>

            <div className="p-4 bg-[#FAF9F6] border-2 border-[#141414] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#141414]/50 block">Encryption</span>
                <span className={`text-xs font-black uppercase ${result.domainAnalysis.isHttps ? 'text-emerald-700' : 'text-[#E63946]'}`}>
                  {result.domainAnalysis.isHttps ? 'HTTPS Encrypted' : 'HTTP Unencrypted'}
                </span>
              </div>
              <Lock className="w-4 h-4 text-[#141414]" />
            </div>

            <div className="p-4 bg-[#FAF9F6] border-2 border-[#141414] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#141414]/50 block">Spoof Vector</span>
                <span className={`text-xs font-black uppercase ${
                  result.domainAnalysis.typosquattingRisk ? 'text-[#E63946]' : 'text-[#141414]'
                }`}>
                  {result.domainAnalysis.typosquattingRisk ? 'Brand Impersonation' : 'Standard Vector'}
                </span>
              </div>
              <AlertTriangle className="w-4 h-4 text-[#141414]" />
            </div>
          </div>

          <p className="text-xs font-serif italic text-[#141414] bg-[#FAF9F6] p-3 border border-[#141414]">
            {result.domainAnalysis.notes}
          </p>
        </div>
      )}

      {/* Fact-Checking & Ground Truth References */}
      {result.verifiableFacts && result.verifiableFacts.length > 0 && (
        <div className="bg-white border-2 border-[#141414] p-6 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-[#141414] pb-2 text-[#141414]">
            Ground Truth & Verifiable Facts
          </h3>
          <ul className="space-y-2">
            {result.verifiableFacts.map((fact, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs font-serif text-[#141414]">
                <span className="font-bold text-[#E63946]">—</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Search Grounding Links */}
      {result.groundingLinks && result.groundingLinks.length > 0 && (
        <div className="bg-white border-2 border-[#141414] p-6 space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#141414] block border-b border-[#141414] pb-1">
            Google Search Cross-Reference Index:
          </span>
          <div className="flex flex-wrap gap-2">
            {result.groundingLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAF9F6] border border-[#141414] text-xs font-bold text-[#141414] hover:bg-[#141414] hover:text-white transition-colors truncate max-w-xs"
              >
                <span className="truncate">{link.title}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Directives & Safeguards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Recommended Actions */}
        <div className="bg-white border-2 border-[#141414] p-6 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest border-b-2 border-[#141414] pb-2 text-[#141414]">
            Action Directives
          </h4>
          <ul className="space-y-2.5">
            {result.recommendedActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs font-serif text-[#141414]">
                <ArrowRight className="w-3.5 h-3.5 text-[#E63946] shrink-0 mt-0.5" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Safety Directives */}
        <div className="bg-white border-2 border-[#141414] p-6 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest border-b-2 border-[#141414] pb-2 text-[#141414]">
            Safety Protocols
          </h4>
          <ul className="space-y-2.5">
            {result.safetyTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs font-serif text-[#141414]">
                <span className="text-[#141414] font-black">●</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};
