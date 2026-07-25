import React, { useState, useRef } from 'react';
import { Briefcase, ShieldAlert, CheckCircle2, AlertTriangle, Search, Sparkles, Building2, Mail, DollarSign, ArrowRight, UserCheck, Upload, X, Camera } from 'lucide-react';
import { AnalysisResult, JobVerificationInput } from '../types';

interface JobVerifierProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
}

const JOB_PRESETS = [
  {
    id: 'fake-google-data-entry',
    companyName: 'Google LLC (Remote Branch)',
    jobTitle: 'Remote HR & Data Entry Specialist',
    recruiterContact: 'hr-onboarding-team@gmail.com',
    offeredSalary: '$65 / hour ($5,200/month for 2 hrs daily)',
    paymentDemand: '$180 initial equipment / training software fee',
    jobDescription: 'No interview required. Instant hire upon paying $180 equipment deposit via Zelle or Crypto. Work 2 hours daily sending emails from home.',
    isFake: true,
  },
  {
    id: 'fake-amazon-telegram',
    companyName: 'Amazon Fulfillment Logistics',
    jobTitle: 'Online Package Review Manager',
    recruiterContact: '+1 (555) 019-3821 (Telegram Only)',
    offeredSalary: '$350 daily payout',
    paymentDemand: '$50 account registration fee',
    jobDescription: 'Chat interview conducted exclusively over Telegram. Must register account with crypto deposit to unlock daily task list.',
    isFake: true,
  },
  {
    id: 'legit-software-dev',
    companyName: 'Stripe Inc.',
    jobTitle: 'Senior Frontend Engineer',
    recruiterContact: 'recruiting@stripe.com',
    offeredSalary: '$165,000 / year + equity',
    paymentDemand: 'None ($0)',
    jobDescription: 'Full technical interview loop including coding assessment, architecture review, and behavioral interviews with engineering managers.',
    isFake: false,
  },
];

export const JobVerifier: React.FC<JobVerifierProps> = ({
  onAnalysisComplete,
  isLoading,
  setIsLoading,
  setError,
}) => {
  const [formData, setFormData] = useState<JobVerificationInput>({
    companyName: '',
    jobTitle: '',
    recruiterContact: '',
    offeredSalary: '',
    paymentDemand: '',
    jobDescription: '',
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

  const handleApplyPreset = (preset: typeof JOB_PRESETS[0]) => {
    setFormData({
      companyName: preset.companyName,
      jobTitle: preset.jobTitle,
      recruiterContact: preset.recruiterContact,
      offeredSalary: preset.offeredSalary,
      paymentDemand: preset.paymentDemand,
      jobDescription: preset.jobDescription,
    });
    setScreenshotImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName && !formData.jobDescription && !formData.recruiterContact && !screenshotImage) {
      setError('Please fill in job details or upload a screenshot of the job offer.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const compiledText = `[JOB ADVERTISEMENT & RECRUITER VERIFICATION]
Company Name: ${formData.companyName || 'Not specified'}
Job Title: ${formData.jobTitle || 'Not specified'}
Recruiter Email / Contact: ${formData.recruiterContact || 'Not specified'}
Offered Salary: ${formData.offeredSalary || 'Not specified'}
Payment / Fee Demanded: ${formData.paymentDemand || 'None / Not specified'}

Job Offer Details & Description:
"""
${formData.jobDescription}
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
        throw new Error(errData.error || 'Job analysis failed.');
      }

      const result: AnalysisResult = await response.json();
      result.category = 'Job Advertisement & Recruiter Verification';
      onAnalysisComplete(result);
    } catch (err: any) {
      setError(err.message || 'Failed to verify job offer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 border-b-2 border-[#141414] pb-6">
        <div className="inline-block bg-[#059669] text-white text-[10px] font-black px-3 py-1 uppercase tracking-[0.2em]">
          Specialized Protocol • HR & Recruiter Audit
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#141414] tracking-tighter leading-none font-serif uppercase italic">
          Job Offer & <span className="text-[#059669]">Employment Verifier</span>
        </h2>
        <p className="text-xs sm:text-sm font-serif italic text-[#141414]/80 max-w-2xl mx-auto">
          Audit employment offers, recruiter emails (@gmail.com vs corporate domains), upfront equipment fee demands, and fake work-from-home salary promises.
        </p>
      </div>

      {/* Preset Quick Loader */}
      <div className="bg-[#ECFDF5] border-2 border-[#047857] p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#065F46]">
          <Briefcase className="w-4 h-4 text-[#059669]" />
          <span>Load Sample Job Offer Contracts:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {JOB_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="p-3 text-left bg-white border-2 border-[#141414] hover:bg-[#059669] hover:text-white transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                  preset.isFake ? 'bg-red-100 text-red-700 group-hover:bg-red-600 group-hover:text-white' : 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white'
                }`}>
                  {preset.isFake ? '● Fraud Sample' : '● Genuine Sample'}
                </span>
              </div>
              <p className="text-xs font-bold font-serif truncate mt-2.5">{preset.companyName}</p>
              <p className="text-[11px] text-[#141414]/70 group-hover:text-white/90 truncate">{preset.jobTitle}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Audit Form */}
      <form onSubmit={handleSubmit} className="bg-white border-2 border-[#141414] p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Company Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Company Name
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="e.g. Google, Amazon, Deloitte, or Local Company"
              className="w-full bg-[#FAF9F6] border-2 border-[#141414] px-3.5 py-2.5 text-xs font-mono text-[#141414] placeholder-[#141414]/40 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Job Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> Job Title
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              placeholder="e.g. Remote HR Data Entry Assistant"
              className="w-full bg-[#FAF9F6] border-2 border-[#141414] px-3.5 py-2.5 text-xs font-mono text-[#141414] placeholder-[#141414]/40 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Recruiter Email / Contact */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Recruiter Email / Handle
            </label>
            <input
              type="text"
              value={formData.recruiterContact}
              onChange={(e) => setFormData({ ...formData, recruiterContact: e.target.value })}
              placeholder="e.g. hr-onboarding@gmail.com or Telegram @recruiter"
              className="w-full bg-[#FAF9F6] border-2 border-[#141414] px-3.5 py-2.5 text-xs font-mono text-[#141414] placeholder-[#141414]/40 focus:bg-white focus:outline-none"
            />
            <p className="text-[10px] font-serif italic text-[#141414]/60">
              🚩 Red Flag Check: Major companies NEVER recruit using free @gmail.com or @yahoo.com addresses.
            </p>
          </div>

          {/* Offered Salary */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Offered Salary / Payout
            </label>
            <input
              type="text"
              value={formData.offeredSalary}
              onChange={(e) => setFormData({ ...formData, offeredSalary: e.target.value })}
              placeholder="e.g. $80/hour for 2 hours daily"
              className="w-full bg-[#FAF9F6] border-2 border-[#141414] px-3.5 py-2.5 text-xs font-mono text-[#141414] placeholder-[#141414]/40 focus:bg-white focus:outline-none"
            />
          </div>

        </div>

        {/* Payment Demand */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-[#E63946] flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Requested Upfront Fee / Software Deposit (If Any)
          </label>
          <input
            type="text"
            value={formData.paymentDemand}
            onChange={(e) => setFormData({ ...formData, paymentDemand: e.target.value })}
            placeholder="e.g. $150 registration fee, $200 laptop security deposit, or None"
            className="w-full bg-[#FAF9F6] border-2 border-[#141414] px-3.5 py-2.5 text-xs font-mono text-[#141414] placeholder-[#141414]/40 focus:bg-white focus:outline-none"
          />
          <p className="text-[10px] font-serif italic text-[#E63946]">
            🚨 Critical Safeguard: Legitimate employers NEVER require job applicants to pay for training, onboarding packages, or laptop security fees upfront.
          </p>
        </div>

        {/* Job Offer / Letter Text */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-[#141414]">
            Full Job Description or Email Copy:
          </label>
          <textarea
            rows={5}
            value={formData.jobDescription}
            onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
            placeholder="Paste the job email, LinkedIn message, WhatsApp interview script, or offer letter text here..."
            className="w-full bg-[#FAF9F6] border-2 border-[#141414] p-3 text-xs font-serif leading-relaxed text-[#141414] placeholder-[#141414]/40 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Screenshot Upload Attachment Option */}
        <div className="space-y-2 border-2 border-dashed border-[#059669] p-4 bg-[#ECFDF5]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-[#065F46] flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#059669]" /> Or Attach Screenshot of Offer / Email / Chat:
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
              className="bg-white border-2 border-[#141414] p-4 text-center cursor-pointer hover:bg-[#059669]/10 transition-colors flex items-center justify-center gap-3"
            >
              <Upload className="w-5 h-5 text-[#059669]" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#141414]">
                  Upload Job Offer / Recruiter Chat Screenshot
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
              <img src={screenshotImage} alt="Uploaded Offer Screenshot" className="w-14 h-14 object-cover border border-[#141414]" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#059669]">✓ Screenshot Attached</p>
                <p className="text-[10px] text-[#141414]/70">AI will perform OCR & visual audit on this screenshot</p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#059669] hover:bg-[#047857] text-white border-2 border-[#141414] font-black text-xs uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_#141414] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="animate-pulse">Auditing Job Legitimacy...</span>
          ) : (
            <>
              <UserCheck className="w-4 h-4" />
              <span>Verify Job Offer & Recruiter</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
