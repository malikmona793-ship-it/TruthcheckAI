import { ExamplePreset } from '../types';

export const PRESET_EXAMPLES: ExamplePreset[] = [
  {
    id: 'fake-job',
    title: 'Urgent Remote HR Job Offer',
    badge: 'Fake Job Scam',
    category: 'Job Advertisement',
    type: 'text',
    text: `URGENT RECRUITMENT! Google Remote Data Entry & HR Assistant position open. 
Salary: $65/hour ($5,200/month). Flexible hours. No interview or experience required. 
All candidates must purchase an initial training software package ($180 refundable fee) via Zelle or Crypto before orientation. 
Reply YES or email hr-onboarding-team@gmail.com with your SSN and passport copy immediately to secure your spot!`,
    description: 'Requests upfront training fee, non-company Gmail address, urgent pressure, no interview.'
  },
  {
    id: 'phishing-email',
    title: 'Urgent Bank Account Suspension',
    badge: 'Phishing Email',
    category: 'Bank Fraud',
    type: 'text',
    text: `From: Security Team <alert-security-update921@bank-login-auth-verify.xyz>
Subject: ACTION REQUIRED: Your Chase Account Has Been Suspended!

Dear Valued Customer,
We detected unusual unauthorized sign-in attempts from an unknown IP address in Moscow, Russia.
To protect your funds, your account access has been temporarily restricted.
Failure to verify your identity within 12 hours will result in permanent account termination.

Click here to restore your account immediately: http://chase-bank-security-reactivate.freehost.net/login?ref=customer

Chase Customer Protection Services`,
    description: 'Fake domain header, extreme urgency, suspicious link, host site spoofing.'
  },
  {
    id: 'scam-sms',
    title: 'Postal Service Package On Hold',
    badge: 'Scam SMS',
    category: 'Delivery Scam',
    type: 'text',
    text: `[USPS Alert]: Your package #89321-US could not be delivered due to an incorrect house number address.
Please update your address and pay the $1.99 redelivery fee within 24 hours at http://usps-redelivery-tracking-fee.com/update or your parcel will be returned to sender.`,
    description: 'Classic Smishing attack targeting package delivery with fake link.'
  },
  {
    id: 'whatsapp-lottery',
    title: 'WhatsApp International Prize Win',
    badge: 'WhatsApp Scam',
    category: 'Lottery / Prize Scam',
    type: 'text',
    text: `🎉 CONGRATULATIONS! Your WhatsApp number was randomly selected in the 2026 International Global Cyber Lottery!
You have won $250,000 USD and a Brand New iPhone 16 Pro Max.
To claim your prize money, send your Full Name, Bank Account Number, Home Address, and a $50 processing tax claim fee to claim-agent@whatsapp-lottery-promo.org via Telegram or WhatsApp.`,
    description: 'Unsolicited prize notification requiring advance tax fee payment.'
  },
  {
    id: 'fake-news',
    title: 'Miracle Cure Health Misinformation',
    badge: 'Fake News',
    category: 'Health Misinformation',
    type: 'text',
    text: `BREAKING NEWS: Doctors in Europe reveal secret home recipe! Drinking boiled garlic water mixed with baking soda every morning completely cures all diabetes, cancer, and hypertension in just 3 days! Big Pharma has been hiding this 100% natural cure from the public to sell expensive drugs. Share this with 10 friends immediately before the government censors this article!`,
    description: 'Sensationalized medical claims, conspiracy framing, call to share rapidly.'
  },
  {
    id: 'suspicious-url',
    title: 'Fake E-Commerce Luxury Store',
    badge: 'Fake Website',
    category: 'Fraudulent E-Commerce',
    type: 'url',
    url: 'http://discount-designer-outlet-store-90off.shop/checkout',
    description: 'Unsecured http link, unrealistic 90% discount domain name, generic shop TLD.'
  }
];
