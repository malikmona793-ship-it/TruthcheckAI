export type ContentType = 'text' | 'image' | 'url';

export type AppTab = 'scanner' | 'job' | 'notification' | 'domain' | 'guide' | 'history';

export type SeverityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type LabelType = 'REAL' | 'SUSPICIOUS' | 'FAKE';

export interface RedFlag {
  title: string;
  description: string;
  severity: SeverityLevel;
}

export interface GreenFlag {
  title: string;
  description: string;
}

export interface DomainAnalysis {
  url: string;
  domain: string;
  isHttps: boolean;
  suspiciousTLD: boolean;
  typosquattingRisk: boolean;
  notes: string;
}

export interface GroundingLink {
  title: string;
  url: string;
}

export interface AnalysisResult {
  id: string;
  contentType: ContentType;
  inputText?: string;
  inputUrl?: string;
  hasImage?: boolean;
  imagePreviewUrl?: string;
  trustScore: number; // 0 to 100
  label: LabelType;
  category: string;
  summary: string;
  explanation: string;
  redFlags: RedFlag[];
  greenFlags: GreenFlag[];
  verifiableFacts: string[];
  domainAnalysis?: DomainAnalysis;
  safetyTips: string[];
  recommendedActions: string[];
  groundingLinks?: GroundingLink[];
  timestamp: string;
}

export interface ExamplePreset {
  id: string;
  title: string;
  badge: string;
  category: string;
  type: ContentType;
  text?: string;
  url?: string;
  description: string;
}

export interface JobVerificationInput {
  companyName: string;
  jobTitle: string;
  recruiterContact: string;
  offeredSalary: string;
  paymentDemand: string;
  jobDescription: string;
}

export interface NotificationVerificationInput {
  appName: string; // e.g. "Bank Alert", "USPS", "WhatsApp", "System Alert"
  notificationTitle: string;
  notificationBody: string;
  senderAddressOrId: string;
}

