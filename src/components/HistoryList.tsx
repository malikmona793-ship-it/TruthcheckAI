import React, { useState } from 'react';
import { History, Trash2, ExternalLink, Search, ShieldAlert, ShieldCheck, AlertTriangle, Download } from 'lucide-react';
import { AnalysisResult } from '../types';

interface HistoryListProps {
  history: AnalysisResult[];
  onSelectResult: (result: AnalysisResult) => void;
  onClearHistory: () => void;
  onDeleteResult: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelectResult,
  onClearHistory,
  onDeleteResult,
}) => {
  const [filterLabel, setFilterLabel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter((item) => {
    const matchesLabel = filterLabel === 'ALL' || item.label === filterLabel;
    const matchesQuery =
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.inputText && item.inputText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.inputUrl && item.inputUrl.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLabel && matchesQuery;
  });

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `truthcheck_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border-2 border-[#141414] p-6">
        <div>
          <div className="inline-block bg-[#141414] text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-widest mb-1">
            Archival Registry
          </div>
          <h2 className="text-2xl font-black font-serif italic text-[#141414] flex items-center gap-2">
            <History className="w-5 h-5 text-[#141414]" /> Saved Verification Logs ({history.length})
          </h2>
          <p className="text-xs font-serif italic text-[#141414]/70 mt-1">
            Access past TruthCheck telemetry reports saved in your local session index.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#141414] bg-[#FAF9F6] hover:bg-[#141414] hover:text-white border-2 border-[#141414] transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export
            </button>
            <button
              onClick={onClearHistory}
              className="px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-[#E63946] hover:bg-[#141414] border-2 border-[#141414] transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" /> Clear Index
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center p-12 bg-white border-2 border-[#141414] space-y-3">
          <History className="w-10 h-10 text-[#141414]/40 mx-auto" />
          <h3 className="text-sm font-black uppercase tracking-widest text-[#141414]">No Saved Telemetry Records</h3>
          <p className="text-xs font-serif italic text-[#141414]/70 max-w-md mx-auto">
            Whenever you verify text, links, or screenshots, click "Bookmark Telemetry" on the analysis view to preserve records here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 bg-white p-1 border-2 border-[#141414] w-full sm:w-auto">
              {['ALL', 'FAKE', 'SUSPICIOUS', 'REAL'].map((label) => (
                <button
                  key={label}
                  onClick={() => setFilterLabel(label)}
                  className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-colors ${
                    filterLabel === label
                      ? 'bg-[#141414] text-white'
                      : 'text-[#141414] hover:bg-[#FAF9F6]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search index..."
                className="w-full bg-[#FAF9F6] border-2 border-[#141414] pl-9 pr-3 py-2 text-xs font-serif italic text-[#141414] placeholder-[#141414]/40 focus:outline-none focus:bg-white"
              />
              <Search className="w-3.5 h-3.5 text-[#141414] absolute left-3 top-3" />
            </div>

          </div>

          {/* History Item Cards */}
          <div className="space-y-3">
            {filteredHistory.map((item) => {
              const isFake = item.label === 'FAKE' || item.trustScore <= 35;
              const isSuspicious = item.label === 'SUSPICIOUS' || (item.trustScore > 35 && item.trustScore <= 70);

              return (
                <div
                  key={item.id}
                  className="p-4 bg-[#FAF9F6] border-2 border-[#141414] hover:bg-white transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div
                    onClick={() => onSelectResult(item)}
                    className="flex items-start gap-3.5 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="shrink-0 mt-0.5">
                      {isFake ? (
                        <ShieldAlert className="w-6 h-6 text-[#E63946]" />
                      ) : isSuspicious ? (
                        <AlertTriangle className="w-6 h-6 text-[#B45309]" />
                      ) : (
                        <ShieldCheck className="w-6 h-6 text-[#0D5C3A]" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-black px-2 py-0.5 uppercase tracking-widest border-2 border-[#141414] ${
                          isFake
                            ? 'bg-[#FFEBEB] text-[#E63946]'
                            : isSuspicious
                            ? 'bg-[#FEF3C7] text-[#B45309]'
                            : 'bg-[#F0FDF4] text-[#0D5C3A]'
                        }`}>
                          {item.trustScore}% TRUST • {item.label}
                        </span>
                        <span className="text-xs font-black uppercase text-[#141414]">{item.category}</span>
                        <span className="text-[10px] font-mono text-[#141414]/60">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs font-serif text-[#141414]/80 truncate">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onSelectResult(item)}
                      className="px-3 py-1.5 bg-[#141414] text-white text-xs font-black uppercase tracking-widest hover:bg-[#E63946] transition-colors flex items-center gap-1 border-2 border-[#141414]"
                    >
                      <span>Review</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteResult(item.id)}
                      className="p-1.5 border-2 border-[#141414] text-[#141414] hover:bg-[#E63946] hover:text-white transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
