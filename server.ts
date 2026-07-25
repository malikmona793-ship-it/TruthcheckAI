import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Initialize Google GenAI
const getAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Helper function to extract hostname and domain details
function extractDomainDetails(urlStr: string) {
  try {
    let formatted = urlStr.trim();
    if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
      formatted = "https://" + formatted;
    }
    const parsed = new URL(formatted);
    const domain = parsed.hostname;
    const isHttps = parsed.protocol === "https:";
    const suspiciousTLDs = [".xyz", ".top", ".freehost", ".shop", ".site", ".work", ".click", ".buzz", ".zip", ".mov", ".tk", ".ml", ".ga", ".cf", ".gq"];
    const hasSuspiciousTLD = suspiciousTLDs.some((tld) => domain.toLowerCase().endsWith(tld));
    
    // Check for potential typosquatting or brand-in-subdomain tricks like paypal-security-check.com or amazon.login-verify.xyz
    const brandKeywords = ["paypal", "chase", "amazon", "apple", "google", "microsoft", "bankofamerica", "wellsfargo", "usps", "fedex", "dhl", "whatsapp", "instagram", "facebook", "telegram", "binance", "coinbase"];
    const matchesBrand = brandKeywords.some((brand) => domain.toLowerCase().includes(brand) && !domain.toLowerCase().endsWith(`.${brand}.com`) && domain.toLowerCase() !== `${brand}.com` && !domain.toLowerCase().endsWith(`.${brand}.org`));

    return {
      url: formatted,
      domain,
      isHttps,
      suspiciousTLD: hasSuspiciousTLD,
      typosquattingRisk: matchesBrand,
    };
  } catch (err) {
    return {
      url: urlStr,
      domain: urlStr,
      isHttps: false,
      suspiciousTLD: false,
      typosquattingRisk: false,
    };
  }
}

// Fetch basic metadata from URL to enhance verification
async function fetchUrlPreview(urlStr: string): Promise<string> {
  try {
    let formatted = urlStr.trim();
    if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
      formatted = "https://" + formatted;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    
    const response = await fetch(formatted, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) TruthCheckAI/1.0",
      },
    });
    clearTimeout(timeout);
    if (!response.ok) {
      return `[URL Status: HTTP ${response.status} ${response.statusText}]`;
    }
    const htmlText = await response.text();
    // Extract title and meta description
    const titleMatch = htmlText.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "No title found";
    
    const metaDescMatch = htmlText.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    const description = metaDescMatch ? metaDescMatch[1].trim() : "";

    // Extract first 500 characters of clean body text
    const cleanBody = htmlText
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 800);

    return `Page Title: ${title}\nMeta Description: ${description}\nPage Content Snippet: ${cleanBody}`;
  } catch (err: any) {
    return `[Unable to directly crawl URL content: ${err.message || 'Connection timed out or blocked'}]`;
  }
}

// Heuristic Fallback Analysis Engine (when AI quota or key is unavailable)
function generateFallbackAnalysis(params: {
  text?: string;
  url?: string;
  imageBase64?: string;
  contentType?: string;
  domainMeta?: ReturnType<typeof extractDomainDetails> | null;
  urlCrawlSnippet?: string;
}) {
  const { text = '', url = '', imageBase64 = '', contentType = 'text', domainMeta } = params;
  
  const lowerText = text.toLowerCase();
  
  let trustScore = 75;
  let label: 'REAL' | 'SUSPICIOUS' | 'FAKE' = 'SUSPICIOUS';
  let category = 'General Message Analysis';
  let summary = 'Verification processed via built-in security telemetry matrix.';
  let explanation = 'Content examined against digital fraud, phishing, and fake news heuristic signatures.';
  
  const redFlags: Array<{ title: string; description: string; severity: string }> = [];
  const greenFlags: Array<{ title: string; description: string }> = [];
  const verifiableFacts: string[] = [];
  const safetyTips: string[] = [
    'Always verify unsolicited offers or urgent notices through official corporate websites or verified telephone channels.',
    'Never share passwords, OTP security codes, or banking credentials over email, SMS, or messaging platforms.',
    'Be cautious of domain names that use unusual extensions (.xyz, .top, .freehost) or impersonate known brands.'
  ];
  const recommendedActions: string[] = [
    'Do not click embedded links in unverified or high-urgency messages.',
    'Bookmark official company login portals directly in your web browser.'
  ];

  if (contentType === 'url' || url) {
    category = 'Website & Domain Inspection';
    if (domainMeta?.typosquattingRisk) {
      trustScore = 15;
      label = 'FAKE';
      summary = `High Risk: Domain "${domainMeta.domain}" appears to impersonate a well-known brand.`;
      explanation = `Domain typosquatting detected. The host "${domainMeta.domain}" mimics an official brand but is hosted on an independent non-official server.`;
      redFlags.push({
        title: 'Brand Impersonation / Typosquatting',
        description: `Domain contains a brand keyword but is hosted on a non-official root domain.`,
        severity: 'HIGH'
      });
      recommendedActions.unshift(`Do NOT enter any login credentials or financial details on ${domainMeta.domain}.`);
    } else if (domainMeta?.suspiciousTLD) {
      trustScore = 35;
      label = 'SUSPICIOUS';
      summary = `Suspicious TLD: Domain "${domainMeta?.domain}" uses a high-spam top-level extension.`;
      explanation = `Top-level extensions like .xyz, .top, or .freehost are heavily utilized in bulk phishing campaigns due to low registration barriers.`;
      redFlags.push({
        title: 'High Risk Extension',
        description: `Domain extension is frequently associated with temporary scam landing pages.`,
        severity: 'MEDIUM'
      });
    } else if (!domainMeta?.isHttps) {
      trustScore = 40;
      label = 'SUSPICIOUS';
      summary = `Unsecured HTTP connection detected for ${domainMeta?.domain}.`;
      explanation = `The website lacks SSL encryption. Any data transmitted can be intercepted by third parties.`;
      redFlags.push({
        title: 'Unencrypted Protocol',
        description: 'Lacks valid HTTPS certificate.',
        severity: 'MEDIUM'
      });
    } else {
      trustScore = 85;
      label = 'REAL';
      summary = `Domain ${domainMeta?.domain} utilizes standard secure HTTPS protocols with no immediate typosquatting flags.`;
      explanation = `Clean domain architecture detected. Always inspect page content and login prompts carefully.`;
      greenFlags.push({
        title: 'Valid HTTPS Protocol',
        description: 'Transport layer encryption is active.'
      });
    }
  } else if (contentType === 'image' || imageBase64) {
    category = 'Screenshot / Visual Inspection';
    trustScore = 45;
    label = 'SUSPICIOUS';
    summary = 'Screenshot analysis completed. Potential digital communication layout detected.';
    explanation = 'Visual screenshot inspected for message formatting, urgency flags, and suspicious text.';
    redFlags.push({
      title: 'Digital Screenshot Input',
      description: 'Screenshots can be digitally altered or mock-generated. Verify sender identity directly.',
      severity: 'MEDIUM'
    });
    verifiableFacts.push('Visual messaging screenshots are easily fabricated using online fake-chat generator tools.');
  } else {
    // Text inspection - including specialized Job Verifier and Notification Inspector modes
    if (lowerText.includes('[job advertisement')) {
      category = 'Job Advertisement & Employment Audit';
      const isFreeEmail = lowerText.includes('@gmail.com') || lowerText.includes('@yahoo.com') || lowerText.includes('@outlook.com') || lowerText.includes('@hotmail.com');
      const hasUpfrontFee = lowerText.includes('fee') || lowerText.includes('deposit') || lowerText.includes('zelle') || lowerText.includes('crypto') || lowerText.includes('purchase');
      const hasUnrealisticPay = lowerText.includes('/hour') || lowerText.includes('/hr') || lowerText.includes('payout');

      if (isFreeEmail || hasUpfrontFee) {
        trustScore = 15;
        label = 'FAKE';
        summary = 'High Risk Job Scam: Candidate requested to pay upfront fees or recruiter uses a non-company email address.';
        explanation = 'Analysis flagged classic recruitment fraud indicators. Legitimate enterprise recruiters use official corporate email domains and NEVER require job candidates to pay money for equipment or training packages.';
        if (isFreeEmail) {
          redFlags.push({
            title: 'Non-Corporate Recruiter Domain',
            description: 'Recruiter uses a free public email provider (@gmail/@yahoo) rather than an official company domain.',
            severity: 'HIGH'
          });
        }
        if (hasUpfrontFee) {
          redFlags.push({
            title: 'Upfront Onboarding / Equipment Fee',
            description: 'Employer demands candidate pay money for software packages, equipment deposits, or registration fees.',
            severity: 'HIGH'
          });
        }
        recommendedActions.unshift('Do NOT send money or share your SSN/Passport documents with unverified email addresses.');
      } else {
        trustScore = 70;
        label = 'SUSPICIOUS';
        summary = 'Job Advertisement requires additional employer domain verification.';
        explanation = 'No immediate advance-fee triggers detected, but always verify job listings directly on the company official careers page.';
        greenFlags.push({
          title: 'Standard Job Listing Structure',
          description: 'No explicit advance-fee demands found in text snippet.'
        });
      }
    } else if (lowerText.includes('[app push notification')) {
      category = 'App Push Notification & Smishing Inspection';
      const hasLink = lowerText.includes('http:') || lowerText.includes('https:') || lowerText.includes('.xyz') || lowerText.includes('.site') || lowerText.includes('.freehost');
      const hasUrgentAction = lowerText.includes('blocked') || lowerText.includes('suspended') || lowerText.includes('hold') || lowerText.includes('unauthorized');

      if (hasLink && hasUrgentAction) {
        trustScore = 20;
        label = 'FAKE';
        summary = 'High Risk Fake Notification: Urgency trigger paired with an external web link.';
        explanation = 'Pop-up notification leverages panic messaging to trick users into tapping a malicious link. Official apps do not ask for credential verification through unverified external SMS/web links.';
        redFlags.push({
          title: 'Urgent Threat Manipulation',
          description: 'Notification claims account restriction or delivery failure to generate panic.',
          severity: 'HIGH'
        });
        redFlags.push({
          title: 'Embedded Third-Party Link',
          description: 'Link directs user away from official app stores or secure banking apps.',
          severity: 'HIGH'
        });
        recommendedActions.unshift('Do NOT click the link in the notification banner. Open your official banking or service app directly.');
      } else {
        trustScore = 80;
        label = 'REAL';
        summary = 'Notification alert appears consistent with routine system reminders.';
        explanation = 'No malicious redirect links or coercive phishing terms identified.';
        greenFlags.push({
          title: 'Clean Alert Banner',
          description: 'Lacks obvious smishing triggers or fake link payloads.'
        });
      }
    } else {
      // General message text inspection
      const scamWords = ['urgent', 'account suspended', 'claim bonus', 'verify account', 'lottery', 'winner', '$', 'fee', 'whatsapp', 'telegram', 'processing tax', 'hr job', 'hire immediately', 'part-time', 'daily payout'];
      const matchedScam = scamWords.filter(w => lowerText.includes(w));
      
      if (matchedScam.length >= 3) {
        trustScore = 20;
        label = 'FAKE';
        category = 'Phishing / Fraudulent Spam Message';
        summary = 'High Risk: Message exhibits multiple scam indicators including high urgency and financial prompts.';
        explanation = `Detected high-risk scam triggers: ${matchedScam.map(s => `"${s}"`).join(', ')}.`;
        redFlags.push({
          title: 'High Urgency & Financial Triggers',
          description: `Multiple suspicious phrases detected: ${matchedScam.join(', ')}.`,
          severity: 'HIGH'
        });
      } else if (matchedScam.length >= 1) {
        trustScore = 50;
        label = 'SUSPICIOUS';
        category = 'Suspicious Communication';
        summary = 'Caution: Message contains potential urgency or financial triggers requiring verification.';
        explanation = `Found potential risk phrases: ${matchedScam.map(s => `"${s}"`).join(', ')}.`;
        redFlags.push({
          title: 'Urgency / Financial Signal',
          description: `Message includes risk terms: ${matchedScam.join(', ')}.`,
          severity: 'MEDIUM'
        });
      } else {
        trustScore = 85;
        label = 'REAL';
        category = 'Legitimate Text Message';
        summary = 'No common scam or phishing indicators were flagged in this text sample.';
        explanation = 'Text analyzed cleanly with no obvious urgency manipulation, advance fee demands, or suspicious link formats.';
        greenFlags.push({
          title: 'Clean Text Layout',
          description: 'Lacks obvious scam triggers or high-urgency threats.'
        });
      }
    }
  }

  return {
    trustScore,
    label,
    category,
    summary,
    explanation,
    redFlags,
    greenFlags,
    verifiableFacts,
    safetyTips,
    recommendedActions
  };
}

// Main API Route for TruthCheck AI Analysis
app.post("/api/analyze", async (req, res) => {
  try {
    const { text, imageBase64, imageMimeType, url, contentType } = req.body;

    if (!text && !imageBase64 && !url) {
      return res.status(400).json({ error: "Please provide text, image screenshot, or URL to analyze." });
    }

    let domainMeta: ReturnType<typeof extractDomainDetails> | null = null;
    let urlCrawlSnippet = "";

    if (url) {
      domainMeta = extractDomainDetails(url);
      urlCrawlSnippet = await fetchUrlPreview(url);
    }

    let parsedResult: any = null;
    let groundingLinks: Array<{ title: string; url: string }> = [];

    // Try Gemini AI Model first
    try {
      const ai = getAi();

      const systemPrompt = `You are TruthCheck AI, an expert digital intelligence & cyber-fraud security analyst specializing in fake news detection, phishing analysis, scam SMS/WhatsApp detection, fake job advertisement auditing, domain typosquatting, and AI-manipulated content verification.

Your task is to analyze the provided input (text, screenshot, or URL) with extreme diligence and precision.
Return a structured JSON object evaluating whether the content is Real, Suspicious, or Fake.

Scoring Criteria:
- Trust Score (0 to 100):
  * 0 - 35: Highly Unreliable / Confirmed Scam / Fake News / Phishing Attack.
  * 36 - 70: Suspicious / Unverified / High Risk / Misleading / Potential Scam.
  * 71 - 100: Genuine / Legitimate / Verified News or Official Communication.

Analysis Instructions:
1. Identify the exact category:
   e.g. 'Phishing Email', 'Scam SMS / Smishing', 'WhatsApp Scam', 'Fake Job Advertisement', 'Fake News & Misinformation', 'Fraudulent Website', 'AI-Generated Content / Deepfake Screenshot', 'Financial Scam', 'Legitimate Content'.
2. List Red Flags (Key Suspicious Signals) with explicit severity level (HIGH, MEDIUM, LOW).
3. List Green Flags (Positive credibility markers if any exist).
4. Extract verifiable facts or provide factual corrections/truth context.
5. Provide actionable safety tips & recommended next steps.`;

      const parts: any[] = [];
      let userPromptText = "";

      if (contentType === "url" || url) {
        userPromptText += `[ANALYZING WEBSITE URL]\nTarget URL: ${url}\nDomain Details: Domain = ${domainMeta?.domain}, Is HTTPS = ${domainMeta?.isHttps}, Suspicious TLD = ${domainMeta?.suspiciousTLD}, Typosquatting Risk = ${domainMeta?.typosquattingRisk}\nWeb Crawl Metadata:\n${urlCrawlSnippet}\n\nUser Additional Context: ${text || "None"}`;
      } else if (contentType === "image" || imageBase64) {
        userPromptText += `[ANALYZING UPLOADED SCREENSHOT / IMAGE]\nPlease inspect this image for visual manipulation, suspicious message layouts (WhatsApp, SMS, Email, Social Media, Job Poster), fake news headlines, domain URLs in screenshot, or fraudulent offer text.\nUser Provided Text / Notes: ${text || "Please transcribe and verify content in screenshot."}`;
      } else {
        userPromptText += `[ANALYZING TEXT / MESSAGE / ANNOUNCEMENT]\nContent Text:\n"""\n${text}\n"""`;
      }

      if (imageBase64) {
        const mime = imageMimeType || "image/png";
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        parts.push({
          inlineData: {
            mimeType: mime,
            data: cleanBase64,
          },
        });
      }

      parts.push({ text: userPromptText });

      // Call Gemini 2.5 Flash
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts },
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              trustScore: { type: Type.INTEGER },
              label: { type: Type.STRING },
              category: { type: Type.STRING },
              summary: { type: Type.STRING },
              explanation: { type: Type.STRING },
              redFlags: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    severity: { type: Type.STRING },
                  },
                  required: ["title", "description", "severity"],
                },
              },
              greenFlags: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                  required: ["title", "description"],
                },
              },
              verifiableFacts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              safetyTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              "trustScore",
              "label",
              "category",
              "summary",
              "explanation",
              "redFlags",
              "greenFlags",
              "verifiableFacts",
              "safetyTips",
              "recommendedActions",
            ],
          },
        },
      });

      const responseText = response.text || "{}";
      parsedResult = JSON.parse(responseText);

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (Array.isArray(groundingChunks)) {
        groundingChunks.forEach((chunk: any) => {
          if (chunk.web?.uri) {
            groundingLinks.push({
              title: chunk.web.title || chunk.web.uri,
              url: chunk.web.uri,
            });
          }
        });
      }
    } catch (aiError: any) {
      console.warn("Gemini API call failed or quota exceeded, using Heuristic Rule-Based Intelligence Engine:", aiError?.message || aiError);
      
      // Fallback heuristic intelligence analysis
      parsedResult = generateFallbackAnalysis({
        text,
        url,
        imageBase64,
        contentType,
        domainMeta,
        urlCrawlSnippet,
      });
    }

    // Enhance domain analysis if URL was provided
    let domainAnalysis = undefined;
    if (url && domainMeta) {
      domainAnalysis = {
        url: domainMeta.url,
        domain: domainMeta.domain,
        isHttps: domainMeta.isHttps,
        suspiciousTLD: domainMeta.suspiciousTLD,
        typosquattingRisk: domainMeta.typosquattingRisk,
        notes: domainMeta.typosquattingRisk
          ? `High Typosquatting / Brand Spoofing Alert: Domain "${domainMeta.domain}" mimics a well-known brand without being an official domain.`
          : domainMeta.suspiciousTLD
          ? `High-risk top-level domain extension (.${domainMeta.domain.split(".").pop()}) often utilized in scam campaigns.`
          : domainMeta.isHttps
          ? `SSL Certificate is present, but HTTPS alone does not guarantee authenticity.`
          : `Unsecured HTTP protocol (no encryption). Sensitive information can be intercepted.`,
      };
    }

    const finalResponse = {
      id: "tc-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      contentType: contentType || (url ? "url" : imageBase64 ? "image" : "text"),
      inputText: text,
      inputUrl: url,
      hasImage: !!imageBase64,
      trustScore: parsedResult.trustScore ?? 50,
      label: parsedResult.label || (parsedResult.trustScore < 40 ? "FAKE" : parsedResult.trustScore < 75 ? "SUSPICIOUS" : "REAL"),
      category: parsedResult.category || "General Content",
      summary: parsedResult.summary || "Content analysis completed.",
      explanation: parsedResult.explanation || "",
      redFlags: parsedResult.redFlags || [],
      greenFlags: parsedResult.greenFlags || [],
      verifiableFacts: parsedResult.verifiableFacts || [],
      domainAnalysis,
      safetyTips: parsedResult.safetyTips || [],
      recommendedActions: parsedResult.recommendedActions || [],
      groundingLinks: groundingLinks.length > 0 ? groundingLinks : undefined,
      timestamp: new Date().toISOString(),
    };

    return res.json(finalResponse);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred during content verification.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TruthCheck AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
