import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Scanner } from './components/Scanner';
import { ResultView } from './components/ResultView';
import { ScamGuide } from './components/ScamGuide';
import { HistoryList } from './components/HistoryList';
import { DomainInspector } from './components/DomainInspector';
import { JobVerifier } from './components/JobVerifier';
import { NotificationInspector } from './components/NotificationInspector';
import { Footer } from './components/Footer';
import { AnalysisResult, AppTab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('scanner');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved history from LocalStorage
  const [history, setHistory] = useState<AnalysisResult[]>(() => {
    try {
      const saved = localStorage.getItem('truthcheck_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync history to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('truthcheck_history', JSON.stringify(history));
    } catch (err) {
      console.error('Failed to save history to localStorage', err);
    }
  }, [history]);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setCurrentResult(result);
    setActiveTab('scanner');
  };

  const handleResetScanner = () => {
    setCurrentResult(null);
    setError(null);
  };

  const handleToggleSave = (result: AnalysisResult) => {
    const exists = history.some((item) => item.id === result.id);
    if (exists) {
      setHistory(history.filter((item) => item.id !== result.id));
    } else {
      setHistory([result, ...history]);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(history.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all saved verification reports?')) {
      setHistory([]);
    }
  };

  const isCurrentSaved = currentResult ? history.some((item) => item.id === currentResult.id) : false;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#141414] font-sans flex flex-col antialiased selection:bg-[#E63946] selection:text-white">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setError(null);
        }}
        savedCount={history.length}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'scanner' && (
          <div>
            {currentResult ? (
              <ResultView
                result={currentResult}
                onReset={handleResetScanner}
                onSave={handleToggleSave}
                isSaved={isCurrentSaved}
              />
            ) : (
              <Scanner
                onAnalysisComplete={handleAnalysisComplete}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                error={error}
                setError={setError}
              />
            )}
          </div>
        )}

        {activeTab === 'job' && (
          <JobVerifier
            onAnalysisComplete={handleAnalysisComplete}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setError={setError}
          />
        )}

        {activeTab === 'notification' && (
          <NotificationInspector
            onAnalysisComplete={handleAnalysisComplete}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setError={setError}
          />
        )}

        {activeTab === 'domain' && <DomainInspector />}

        {activeTab === 'guide' && <ScamGuide />}

        {activeTab === 'history' && (
          <HistoryList
            history={history}
            onSelectResult={(res) => {
              setCurrentResult(res);
              setActiveTab('scanner');
            }}
            onClearHistory={handleClearHistory}
            onDeleteResult={handleDeleteHistoryItem}
          />
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

