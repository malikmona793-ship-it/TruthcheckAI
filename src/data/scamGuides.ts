export interface ScamGuideItem {
  id: string;
  title: string;
  category: string;
  iconName: string;
  shortDesc: string;
  realExamples: string[];
  redFlags: string[];
  protectionSteps: string[];
}

export const SCAM_GUIDE_ITEMS: ScamGuideItem[] = [
  {
    id: 'fake-jobs',
    title: 'Fake Job Advertisements & Remote Recruitment Scams',
    category: 'Employment Fraud',
    iconName: 'Briefcase',
    shortDesc: 'Scammers offer high-paying remote positions requiring upfront software or equipment fees.',
    realExamples: [
      '"Remote Data Entry Clerk - $60/hr. No experience needed. Pay $150 onboarding fee for mandatory equipment."',
      'Job offer sent via Telegram or WhatsApp from a free @gmail.com address impersonating major brands like Amazon or Microsoft.'
    ],
    redFlags: [
      'No formal video/in-person interview conducted before hiring.',
      'Requirement to pay for background checks, laptops, or software packages upfront.',
      'Recruiter uses WhatsApp, Telegram, or free webmail addresses instead of official company domain.',
      'Unrealistically high hourly pay for entry-level work.'
    ],
    protectionSteps: [
      'Always verify job openings on the official corporate careers page (e.g. google.com/about/careers).',
      'Never send money or crypto for job training or starter kits.',
      'Check the email domain extension after the @ symbol carefully.'
    ]
  },
  {
    id: 'phishing-email',
    title: 'Phishing Emails & Fake Bank Alerts',
    category: 'Identity Theft',
    iconName: 'Mail',
    shortDesc: 'Spoofed emails designed to mimic banks, PayPal, or Netflix to steal login credentials and passwords.',
    realExamples: [
      '"Urgent! Your account access has been restricted due to suspicious activity. Verify now at http://chase-update-security.site"',
      'Fake invoice from PayPal claiming $499 was debited for a crypto purchase you never made.'
    ],
    redFlags: [
      'Sender address does not match the official domain (e.g., alert@chase-support-login.net instead of chase.com).',
      'Artificial urgency ("Your account will be terminated in 24 hours").',
      'Generic greeting like "Dear Customer" instead of your actual name.',
      'Hyperlinks pointing to non-standard domains or free hosting sites.'
    ],
    protectionSteps: [
      'Never click links in unexpected security alert emails.',
      'Navigate to your bank or provider by manually typing the official URL into your browser.',
      'Enable Two-Factor Authentication (2FA) using an authenticator app on all accounts.'
    ]
  },
  {
    id: 'smishing-delivery',
    title: 'Package Delivery & SMS Smishing Scams',
    category: 'Mobile Fraud',
    iconName: 'MessageSquare',
    shortDesc: 'Fake text messages claiming your parcel is delayed or requires a small redelivery fee.',
    realExamples: [
      '"[USPS]: Your parcel is held at the distribution center. Click here to confirm your address and pay $1.50 fee: http://usps-parcel-redelivery.info"',
      '"[FedEx]: Exception on tracking #98231. Update details now."'
    ],
    redFlags: [
      'SMS comes from a regular 10-digit phone number instead of an official shortcode.',
      'Link leads to an unofficial domain (e.g., usps-redelivery.com instead of usps.com).',
      'Requests small payment ($1 - $3) to harvest your credit card information.'
    ],
    protectionSteps: [
      'Check package tracking directly on the official USPS/FedEx/UPS app or main website.',
      'Do not tap shortened or suspicious URLs in SMS text messages.',
      'Report SMS spam to 7726 (SPAM) on major mobile networks.'
    ]
  },
  {
    id: 'whatsapp-lottery',
    title: 'WhatsApp & Social Media Impersonation Scams',
    category: 'Social Engineering',
    iconName: 'PhoneCall',
    shortDesc: 'Messages claiming a loved one is in an emergency or that you won an international lottery.',
    realExamples: [
      '"Hi Mom! I lost my phone and this is my new temporary number. I urgently need $800 to pay an emergency hospital bill."',
      '"Congratulations! You won $50,000 in WhatsApp Anniversary Giveaway."'
    ],
    redFlags: [
      'Sender claims to be a relative or friend asking for urgent financial assistance via gift cards or wire transfer.',
      'Unsolicited claims that you won a raffle or lottery you never entered.',
      'Pressure to keep the communication secret or act immediately.'
    ],
    protectionSteps: [
      'Call your family member or friend on their original known phone number before sending money.',
      'Ask a personal verification question that only the real person would know.',
      'Block and report unknown numbers requesting money.'
    ]
  },
  {
    id: 'fake-news-health',
    title: 'Fake News & Health Misinformation',
    category: 'Misinformation',
    iconName: 'Newspaper',
    shortDesc: 'Sensationalized headlines, fabricated quote images, and fake medical cures intended to manipulate.',
    realExamples: [
      '"Scientists confirm drinking baking soda eliminates all tumors overnight!"',
      'Fabricated screenshot showing a famous politician making a fake controversial statement.'
    ],
    redFlags: [
      'Sensationalized ALL-CAPS headlines with emotional triggers.',
      'No references to peer-reviewed scientific studies or recognized medical authorities (WHO, CDC).',
      'Encouragement to "Share before this gets deleted by the government!"'
    ],
    protectionSteps: [
      'Verify claims across established global news wire services (Reuters, AP, BBC).',
      'Check recognized fact-checking databases like Snopes, FactCheck.org, or PolitiFact.',
      'Inspect screenshots for mismatched fonts, alignment errors, or AI artifacts.'
    ]
  },
  {
    id: 'fake-ecommerce',
    title: 'Fraudulent E-Commerce & Fake Discount Outlets',
    category: 'E-Commerce Fraud',
    iconName: 'ShoppingBag',
    shortDesc: 'Fake online shops advertising designer products or electronics at 80-90% discount.',
    realExamples: [
      '"Ray-Ban Sunglasses Outlet Store: 90% Off Sale Today Only! $19.99 per pair at rayban-clearance-sale.shop"',
      'Instagram ads linking to cloned fashion store pages that steal payment card details.'
    ],
    redFlags: [
      'Unbelievably low prices on luxury or high-demand goods.',
      'Newly registered domain name (less than 30 days old) with generic contact emails.',
      'Missing physical address, privacy policy, or phone number in footer.',
      'Payment page forces direct wire transfer, Zelle, or Crypto instead of credit card/PayPal.'
    ],
    protectionSteps: [
      'Research shop reviews on Trustpilot or ScamAdviser before purchasing.',
      'Use credit cards or PayPal Buyer Protection for online purchases so transactions can be disputed.',
      'Verify the website URL matches the official brand site.'
    ]
  }
];
