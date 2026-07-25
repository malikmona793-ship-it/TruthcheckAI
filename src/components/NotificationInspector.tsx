import React, { useState, useRef } from 'react';
import { BellRing, ShieldAlert, CheckCircle2, AlertTriangle, Smartphone, ExternalLink, Zap, ArrowRight, Lock, Bell, Upload, X, Camera } from 'lucide-react';
import { AnalysisResult, NotificationVerificationInput } from '../types';

interface NotificationInspectorProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
}

const NOTIFICATION_PRESETS = [
  {
    id: 'bank-alert-pop',
    appName: 'Bank Security Alert',
    notificationTitle: '🚨 Account Blocked - Fraud Warning',
    notificationBody: 'Unauthorized withdrawal of $1,450.00 detected. If this was not you, verify identity immediately: http://bank-security-claim.xyz',
    senderAddressOrId: 'SMS Alert #9921',
    isFake: true,
  },
  {
    id: 'usps-package-pop',
    appName: 'Postal Delivery Service',
    notificationTitle: '📦 Package On Hold: Redelivery Needed',
    notificationBody: 'Your parcel #US-88293 cannot be delivered due to invalid door number. Pay $1.99 fee: http://usps-redelivery-address.site',
    senderAddressOrId: '+1 (800) 923-1102',
    isFake: true,
  },
  {
    id: 'genuine-calendar-pop',
    appName: 'Google Calendar',
    notificationTitle: '📅 Meeting Reminder: Strategy Sync',
    notificationBody: 'Strategy Sync with Product Team starts in 10 minutes (11:00 AM - 11:30 AM). Join via Google Meet.',
    senderAddressOrId: 'Calendar System App',
    isFake: false,
  },
];

export const NotificationInspector: React.FC<NotificationInspectorProps> = ({
  onAnalysisComplete,
  isLoading,
  setIsLoading,
  setError,
}) => {
  const [formData, setFormData] = useState<NotificationVerificationInput>({
    appName: 'Bank Alert',
    notificationTitle: '',
    notificationBody: '',
    senderAddressOrId: '',
  });

  const [screenshotImage, setScreenshotImage] = useState<string | null>(null);
  const [screenshotMime, setScreenshotMime] = useState<string>('image/png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    setError(null);
    setScreenshotMime(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const [simulatedPushAlert, setSimulatedPushAlert] = useState<{
    appName: string;
    title: string;
    body: string;
    sender: string;
  } | null>(null);

  const handleApplyPreset = (preset: typeof NOTIFICATION_PRESETS[0]) => {
    setFormData({
      appName: preset.appName,
      notificationTitle: preset.notificationTitle,
      notificationBody: preset.notificationBody,
      senderAddressOrId: preset.senderAddressOrId,
    });
    setSimulatedPushAlert({
      appName: preset.appName,
      title: preset.notificationTitle,
      body: preset.notificationBody,
      sender: preset.senderAddressOrId,
    });
    setScreenshotImage(null);
  };

  const handleTriggerSimulatedToast = () => {
    if (!formData.notificationTitle && !formData.notificationBody && !screenshotImage) {
      setError('Please enter a notification title/body or attach a screenshot first.');
      return;
    }
    setError(null);
    setSimulatedPushAlert({
      appName: formData.appName || 'App Notification',
      title: formData.notificationTitle || 'Alert Title',
      body: formData.notificationBody || 'Notification body content...',
      sender: formData.senderAddressOrId || 'Sender ID',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.notificationTitle && !formData.notificationBody && !screenshotImage) {
      setError('Please provide notification text or attach a screenshot image of the push alert.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const compiledText = `[APP PUSH NOTIFICATION & POP-UP ALERT VERIFICATION]
Application Name / Service: ${formData.appName || 'Unknown App'}
Sender / Number ID: ${formData.senderAddressOrId || 'Unknown Sender'}
Notification Banner Title: ${formData.notificationTitle || 'None'}
Notification Message Body:
"""
${formData.notificationBody || 'See attached screenshot'}
"""`;

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: screenshotImage ? 'image' : 'text',
          text: compiledText,
          imageBase64: screenshotImage || undefined,
          imageMimeType: screenshotMime,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Notification analysis failed.');
      }

      const result: AnalysisResult = await response.json();
      result.category = 'App Push Notification & Smishing Alert';
      onAnalysisComplete(result);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze notification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 border-b-2 border-[#141414] pb-6">
        <div className="inline-block bg-[#EA580C] text-white text-[10px] font-black px-3 py-1 uppercase tracking-[0.2em]">
          Specialized Protocol • Mobile Notification & Push Alert Inspector
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#141414] tracking-tighter leading-none font-serif uppercase italic">
          Notification & <span className="text-[#EA580C]">Push Alert Inspector</span>
        </h2>
        <p className="text-xs sm:text-sm font-serif italic text-[#141414]/80 max-w-2xl mx-auto">
          Inspect pop-up notifications, SMS alerts, bank push warnings, and lockscreen banners before tapping embedded links or sharing security codes.
        </p>
      </div>

      {/* Preset Quick Loader */}
      <div className="bg-[#FFF7ED] border-2 border-[#C2410C] p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#9A3412]">
          <Bell className="w-4 h-4 text-[#EA580C]" />
          <span>Test Common Notification Vectors:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {NOTIFICATION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="p-3 text-left bg-white border-2 border-[#141414] hover:bg-[#EA580C] hover:text-white transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                  preset.isFake ? 'bg-amber-100 text-amber-900 group-hover:bg-amber-600 group-hover:text-white' : 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white'
                }`}>
                  {preset.isFake ? '● Fake Alert' : '● Valid Push'}
                </span>
              </div>
              <p className="text-xs font-bold font-serif truncate mt-2.5">{preset.appName}</p>
              <p className="text-[11px] text-[#141414]/70 group-hover:text-white/90 truncate">{preset.notificationTitle}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Mobile Lockscreen Simulator */}
      {simulatedPushAlert && (
        <div className="bg-[#141414] text-white p-6 border-2 border-[#141414] space-y-3">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/60">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#E63946]" /> Mobile Lockscreen Preview Simulation
            </span>
            <span>Live Render</span>
          </div>

          <div className="bg-[#242424] border border-white/20 p-4 rounded-xl shadow-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#E63946] text-white rounded">
                  <BellRing className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  {simulatedPushAlert.appName}
                </span>
              </div>
              <span className="text-[10px] text-white/40">now</span>
            </div>

            <div className="space-y-1 pl-7">
              <h4 className="text-xs font-bold text-white leading-tight">{simulatedPushAlert.title}</h4>
              <p className="text-xs font-serif text-white/80 leading-relaxed">{simulatedPushAlert.body}</p>
              <p className="text-[10px] font-mono text-[#E63946] pt-1">Sender ID: {simulatedPushAlert.sender}</p>
            </div>
          </div>
        </div>
      )}

      {/* Notification Inspection Form */}
      <form onSubmit={handleSubmit} className="bg-white border-2 border-[#141414] p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* App / Provider Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" /> App / Service Name
            </label>
            <input
              type="text"
              value={formData.appName}
              onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
              placeholder="e.g. Chase, USPS, WhatsApp, System Alert"
              className="w-full bg-[#FAF9F6] border-2 border-[#141414] px-3.5 py-2.5 text-xs font-mono text-[#141414] placeholder-[#141414]/40 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Sender Phone/Email/ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Sender Phone / SMS ID
            </label>
            <input
              type="text"
              value={formData.senderAddressOrId}
              onChange={(e) => setFormData({ ...formData, senderAddressOrId: e.target.value })}
              placeholder="e.g. +1 (800) 555-0199 or SMS Code 8829"
              className="w-full bg-[#FAF9F6] border-2 border-[#141414] px-3.5 py-2.5 text-xs font-mono text-[#141414] placeholder-[#141414]/40 focus:bg-white focus:outline-none"
            />
          </div>

        </div>

        {/* Notification Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-[#141414]">
            Notification Banner Title:
          </label>
          <input
            type="text"
            value={formData.notificationTitle}
            onChange={(e) => setFormData({ ...formData, notificationTitle: e.target.value })}
            placeholder="e.g. Account Locked: Verify Immediately or Package Delivery Failed"
            className="w-full bg-[#FAF9F6] border-2 border-[#141414] px-3.5 py-2.5 text-xs font-mono text-[#141414] placeholder-[#141414]/40 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Notification Body Content */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-[#141414]">
            Notification Message Text / Link Payload:
          </label>
          <textarea
            rows={4}
            value={formData.notificationBody}
            onChange={(e) => setFormData({ ...formData, notificationBody: e.target.value })}
            placeholder="Paste the notification text or SMS body here (e.g. Click http://bit.ly/claim to restore access)..."
            className="w-full bg-[#FAF9F6] border-2 border-[#141414] p-3 text-xs font-serif leading-relaxed text-[#141414] placeholder-[#141414]/40 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Screenshot Upload Option */}
        <div className="space-y-2 border-2 border-dashed border-[#EA580C] p-4 bg-[#FFF7ED]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-[#9A3412] flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#EA580C]" /> Or Attach Lockscreen / SMS Screenshot:
            </label>
            {screenshotImage && (
              <button
                type="button"
                onClick={() => setScreenshotImage(null)}
                className="text-[10px] font-bold uppercase text-red-600 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Remove Screenshot
              </button>
            )}
          </div>

          {!screenshotImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="bg-white border-2 border-[#141414] p-4 text-center cursor-pointer hover:bg-[#EA580C]/10 transition-colors flex items-center justify-center gap-3"
            >
              <Upload className="w-5 h-5 text-[#EA580C]" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#141414]">
                  Upload Notification / SMS Lockscreen Screenshot
                </p>
                <p className="text-[10px] text-[#141414]/60">Supports PNG, JPG, WEBP screenshot images</p>
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
            <div className="flex items-center gap-3 bg-white p-3 border-2 border-[#141414]">
              <img src={screenshotImage} alt="Uploaded Notification Screenshot" className="w-14 h-14 object-cover border border-[#141414]" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#EA580C]">✓ Screenshot Attached</p>
                <p className="text-[10px] text-[#141414]/70">AI will perform OCR & visual audit on this push notification</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleTriggerSimulatedToast}
            className="px-4 py-3 bg-[#FAF9F6] hover:bg-[#141414] hover:text-white border-2 border-[#141414] text-[#141414] font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Simulate Lockscreen Alert</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white border-2 border-[#141414] font-black text-xs uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_#141414] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="animate-pulse">Inspecting Notification Risk...</span>
            ) : (
              <>
                <BellRing className="w-4 h-4" />
                <span>Verify Notification Safety</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
