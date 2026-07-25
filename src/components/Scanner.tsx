import React, { useState, useRef } from 'react';
import { FileText, Image as ImageIcon, Link2, Upload, AlertCircle, ArrowRight, Sparkles, Check, X, RefreshCw, Zap, Camera } from 'lucide-react';
import { ContentType, AnalysisResult } from '../types';
import { PRESET_EXAMPLES } from '../data/presetExamples';

interface ScannerProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (err: string | null) => void;
}

export const Scanner: React.FC<ScannerProps> = ({
  onAnalysisComplete,
  isLoading,
  setIsLoading,
  error,
  setError,
}) => {
  const [contentType, setContentType] = useState<ContentType>('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/png');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image file selection
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WEBP, GIF).');
      return;
    }
    setError(null);
    setImageMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handlePastePreset = (presetId: string) => {
    const found = PRESET_EXAMPLES.find((p) => p.id === presetId);
    if (!found) return;
    setError(null);
    setContentType(found.type);
    if (found.type === 'text') {
      setTextInput(found.text || '');
      setUrlInput('');
    } else if (found.type === 'url') {
      setUrlInput(found.url || '');
      setTextInput('');
    }
  };

  const handleClear = () => {
    setTextInput('');
    setUrlInput('');
    setSelectedImage(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (contentType === 'text' && !textInput.trim()) {
      setError('Please enter or paste the text content, message, or email body you wish to verify.');
      return;
    }
    if (contentType === 'url' && !urlInput.trim()) {
      setError('Please enter a website link or domain address to verify.');
      return;
    }
    if (contentType === 'image' && !selectedImage) {
      setError('Please upload or drag a screenshot image to verify.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          text: contentType === 'text' ? textInput : textInput || undefined,
          url: contentType === 'url' ? urlInput : undefined,
          imageBase64: contentType === 'image' ? selectedImage : undefined,
          imageMimeType: contentType === 'image' ? imageMimeType : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed. Please try again.');
      }

      onAnalysisComplete(data);
    } catch (err: any) {
      setError(err.message || 'Verification system error. Please check connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* Hero Badge & Editorial Heading */}
      <div className="text-center space-y-3 py-2 border-b-2 border-[#141414] pb-6">
        <div className="inline-block bg-[#141414] text-white text-[10px] font-black px-3 py-1 uppercase tracking-[0.2em]">
          Intelligence Scan Stream • Multimodal TC-Engine
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#141414] tracking-tighter leading-none font-serif uppercase italic">
          Verify Real vs Fake <span className="underline decoration-[#E63946] decoration-4">Instantly</span>
        </h1>
        <p className="text-xs sm:text-sm font-serif italic text-[#141414]/80 max-w-2xl mx-auto">
          Cross-reference phishing emails, scam messages, fake job advertisements, fraudulent domains, and news stories against verified intelligence patterns.
        </p>
      </div>

      {/* Main Input Card - Editorial Border & Palette */}
      <div className="bg-white border-2 border-[#141414] p-5 sm:p-8 space-y-6">
        
        {/* Content Type Selector Tabs */}
        <div>
          <label className="text-[11px] font-black uppercase tracking-widest text-[#141414]/50 block mb-2">
            Input Stream Format
          </label>
          <div className="grid grid-cols-3 gap-2 border-2 border-[#141414] p-1.5 bg-[#FAF9F6]">
            <button
              type="button"
              onClick={() => { setContentType('text'); setError(null); }}
              className={`flex items-center justify-center gap-2 py-3 px-3 text-xs font-black uppercase tracking-widest transition-all ${
                contentType === 'text'
                  ? 'bg-[#2563EB] text-white border-2 border-[#1E40AF] shadow-[2px_2px_0px_0px_#141414]'
                  : 'text-[#141414] hover:bg-[#2563EB]/10'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Text / Message</span>
            </button>

            <button
              type="button"
              onClick={() => { setContentType('image'); setError(null); }}
              className={`flex items-center justify-center gap-2 py-3 px-3 text-xs font-black uppercase tracking-widest transition-all ${
                contentType === 'image'
                  ? 'bg-[#7C3AED] text-white border-2 border-[#6D28D9] shadow-[2px_2px_0px_0px_#141414]'
                  : 'text-[#141414] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 border-2 border-[#7C3AED]'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-[#7C3AED] group-hover:text-white" />
              <span className="font-bold">📸 Screenshot Upload</span>
            </button>

            <button
              type="button"
              onClick={() => { setContentType('url'); setError(null); }}
              className={`flex items-center justify-center gap-2 py-3 px-3 text-xs font-black uppercase tracking-widest transition-all ${
                contentType === 'url'
                  ? 'bg-[#0D9488] text-white border-2 border-[#0F766E] shadow-[2px_2px_0px_0px_#141414]'
                  : 'text-[#141414] hover:bg-[#0D9488]/10'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>URL Link</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* TAB 1: TEXT INPUT */}
          {contentType === 'text' && (
            <div className="space-y-2 relative">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#141414]/60">
                <label htmlFor="text-input">Paste Copy Below:</label>
                <span>{textInput.length} Characters</span>
              </div>
              <div className="relative">
                <textarea
                  id="text-input"
                  rows={6}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste text copy here... e.g. 'URGENT: Your bank account is suspended! Click here to restore...' or 'Remote HR job offer paying $60/hr. Send $150 fee...'"
                  className="w-full bg-[#FAF9F6] border-2 border-[#141414] p-5 text-sm font-serif italic text-[#141414] placeholder-[#141414]/40 focus:outline-none focus:bg-white transition-all resize-none"
                />
                {textInput && (
                  <button
                    type="button"
                    onClick={() => setTextInput('')}
                    className="absolute top-3 right-3 p-1 text-[#141414] hover:bg-[#141414] hover:text-white border border-[#141414] transition-all"
                    title="Clear text"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: IMAGE UPLOAD */}
          {contentType === 'image' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#7C3AED] flex items-center gap-1.5">
                  <Camera className="w-4 h-4" /> Attach Screenshot (WhatsApp, Email, SMS, Job Flyer, Bank Alert)
                </label>
                {!selectedImage && (
                  <button
                    type="button"
                    onClick={() => {
                      const canvas = document.createElement('canvas');
                      canvas.width = 600;
                      canvas.height = 340;
                      const ctx = canvas.getContext('2d');
                      if (!ctx) return;
                      ctx.fillStyle = '#0F172A';
                      ctx.fillRect(0, 0, 600, 340);
                      ctx.fillStyle = '#1E293B';
                      ctx.fillRect(0, 0, 600, 55);
                      ctx.fillStyle = '#FFFFFF';
                      ctx.font = 'bold 16px sans-serif';
                      ctx.fillText('💬 Chat Alert (+1 800 555-0199)', 20, 34);
                      ctx.fillStyle = '#1D4ED8';
                      ctx.fillRect(20, 75, 560, 220);
                      ctx.fillStyle = '#FFFFFF';
                      ctx.font = 'bold 16px sans-serif';
                      ctx.fillText('URGENT: BANK ACCOUNT SUSPENDED', 40, 110);
                      ctx.font = '14px sans-serif';
                      ctx.fillText('Unauthorized debit of $1,250.00 requested from your account.', 40, 140);
                      ctx.fillText('To prevent permanent lockout, click to verify identity:', 40, 170);
                      ctx.fillStyle = '#FDE047';
                      ctx.font = 'bold 14px monospace';
                      ctx.fillText('http://bank-security-restore.xyz/verify', 40, 210);
                      ctx.fillStyle = '#CBD5E1';
                      ctx.font = 'italic 12px sans-serif';
                      ctx.fillText('Sent today 10:42 AM • Do not share OTP with anyone', 40, 255);
                      const dataUrl = canvas.toDataURL('image/png');
                      setSelectedImage(dataUrl);
                      setImageMimeType('image/png');
                      setError(null);
                    }}
                    className="text-[11px] font-black uppercase tracking-wider text-[#7C3AED] bg-[#7C3AED]/10 hover:bg-[#7C3AED] hover:text-white px-2.5 py-1 border border-[#7C3AED] transition-colors"
                  >
                    ⚡ Try Sample Scam Screenshot
                  </button>
                )}
              </div>

              {!selectedImage ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed border-[#7C3AED] p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 bg-[#F5F3FF] hover:bg-white ${
                    dragActive ? 'bg-[#DDD6FE]' : ''
                  }`}
                >
                  <div className="p-3 bg-[#7C3AED] text-white rounded-full shadow-[2px_2px_0px_0px_#141414]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#141414]">
                      Drag & Drop Screenshot image or <span className="underline italic font-serif text-[#7C3AED]">Browse Device Files</span>
                    </p>
                    <p className="text-[10px] font-bold text-[#141414]/60 mt-1 uppercase tracking-widest">
                      Supports WhatsApp Chat Screenshots, Bank SMS Alerts, Email Header Snaps (PNG, JPG, WEBP)
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative border-2 border-[#141414] bg-[#F5F3FF] p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="Selected Screenshot"
                      className="w-20 h-20 object-cover border-2 border-[#141414] bg-white shrink-0"
                    />
                    <div className="truncate">
                      <p className="text-xs font-black uppercase tracking-widest text-[#7C3AED] truncate">✓ Screenshot Attached</p>
                      <p className="text-[11px] font-serif italic text-[#141414]/80 mt-0.5">Ready for OCR text extraction & visual AI fraud check</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="p-2 border-2 border-[#141414] bg-white text-[#141414] hover:bg-[#E11D48] hover:text-white transition-all shrink-0"
                    title="Remove image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Optional context text for image */}
              <div className="mt-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Optional Context Note (e.g. 'Received via WhatsApp from unknown contact')"
                  className="w-full bg-[#FAF9F6] border-2 border-[#141414] px-4 py-3 text-xs text-[#141414] placeholder-[#141414]/50 focus:outline-none focus:bg-white font-serif"
                />
              </div>
            </div>
          )}

          {/* TAB 3: URL INPUT */}
          {contentType === 'url' && (
            <div className="space-y-3">
              <label htmlFor="url-input" className="text-[10px] font-black uppercase tracking-widest text-[#141414]/60 block">
                Target Web Address / Domain Link
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#141414]">
                  <Link2 className="w-4 h-4" />
                </div>
                <input
                  id="url-input"
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://chase-security-login.xyz or http://job-onboarding.freehost.net"
                  className="w-full bg-[#FAF9F6] border-2 border-[#141414] pl-11 pr-10 py-3.5 text-xs text-[#141414] placeholder-[#141414]/40 font-mono focus:outline-none focus:bg-white"
                />
                {urlInput && (
                  <button
                    type="button"
                    onClick={() => setUrlInput('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#141414]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-[10px] font-bold text-[#141414]/60 uppercase tracking-widest">
                Analyzes TLD extensions, SSL encryption, typosquatting vectors, and metadata snippets.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-[#FFEBEB] border-2 border-[#E63946] text-[#E63946] text-xs font-bold uppercase tracking-wider flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleClear}
              className="w-full sm:w-auto px-6 py-4 border-2 border-[#141414] bg-white text-[#141414] font-black text-xs uppercase tracking-widest hover:bg-[#141414]/10 transition-colors"
            >
              Reset Input
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:flex-1 px-8 py-4 bg-[#141414] hover:bg-[#E63946] text-white border-2 border-[#141414] font-black text-xs uppercase tracking-[0.15em] transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Intelligence Scan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Intelligence Scan</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>

        </form>

        {/* Preset Sample Quick Test Buttons */}
        <div className="mt-8 pt-6 border-t-2 border-[#141414]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#141414]">
              ● 1-Click Intelligence Test Presets:
            </span>
            <span className="text-[10px] font-bold text-[#141414]/50 uppercase tracking-widest hidden sm:inline">
              Select Sample to Auto-Fill
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRESET_EXAMPLES.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePastePreset(preset.id)}
                className="p-3 bg-[#FAF9F6] border-2 border-[#141414] hover:bg-[#141414] hover:text-white text-left transition-all group"
              >
                <span className="text-xs font-black uppercase tracking-wider block group-hover:text-white truncate">
                  {preset.title}
                </span>
                <span className="inline-block text-[9px] font-black px-1.5 py-0.5 mt-1 bg-[#141414] text-white group-hover:bg-[#E63946] uppercase tracking-widest">
                  {preset.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
