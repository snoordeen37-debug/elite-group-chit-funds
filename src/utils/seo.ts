/**
 * SEO & Local Search Keyword Metadata for ELITE GROUP SS CHIT FUNDS
 * Targeting Tamil Nadu, Coimbatore, Mettupalayam, and registered chit fund investments.
 */

export interface PageMetadata {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  ogTitle?: string;
  ogDescription?: string;
}

export const SEO_PAGE_METADATA: Record<string, PageMetadata> = {
  home: {
    title: 'ELITE GROUP SS CHIT FUNDS | Best Government Registered Chit Funds in Tamil Nadu',
    description: 'Trusted government registered chit fund company in Mettupalayam, Coimbatore & Tamil Nadu. Safe monthly savings, transparent auctions, high returns, and plans from ₹50,000 to ₹5,00,000. Regulated under Chit Funds Act 1982.',
    keywords: 'Chit funds in Tamil Nadu, SS Chit Funds Mettupalayam, registered chit funds Coimbatore, best chit fund company Tamil Nadu, monthly chit saving scheme, govt registered chit fund Tamil Nadu, safe chit fund Mettupalayam',
    canonicalPath: '/',
    ogTitle: 'ELITE GROUP SS CHIT FUNDS | Best Registered Chit Funds in Tamil Nadu',
    ogDescription: 'Disciplined monthly savings and transparent auctions with registered chit plans from ₹50k to ₹5L in Tamil Nadu.',
  },
  'chit-plans': {
    title: 'Chit Fund Investment Plans in Tamil Nadu | ₹50k to ₹5L Schemes | SS Chit Funds',
    description: 'Explore verified 21-month registered chit fund schemes in Tamil Nadu. Compare monthly contributions, dividend payouts, and bidding benefits for business owners and savers.',
    keywords: 'Chit fund plans Tamil Nadu, 1 lakh chit plan, 2 lakh chit fund, 5 lakh chit scheme, chit fund dividend calculation, chit auction Tamil Nadu, chit fund installment chart, Coimbatore chit funds',
    canonicalPath: '/chit-plans',
    ogTitle: 'Chit Fund Investment Plans in Tamil Nadu | SS Chit Funds',
    ogDescription: 'Official 21-month and 5-installment registered chit schemes from ₹50,000 to ₹5,00,000 in Tamil Nadu.',
  },
  calculator: {
    title: 'Chit Fund Calculator Tamil Nadu | Estimate Monthly Dividends & Take-Home Returns',
    description: 'Calculate monthly savings, auction discounts, and net take-home returns with our interactive Chit Fund Calculator for all Tamil Nadu chit schemes. Request a callback for detailed schedule.',
    keywords: 'Chit fund calculator Tamil Nadu, chit dividend calculator, chit savings calculator Coimbatore, monthly chit return calculator, chit auction calculation Tamil Nadu, Mettupalayam chit plans',
    canonicalPath: '/calculator',
    ogTitle: 'Chit Fund Calculator Tamil Nadu | SS Chit Funds',
    ogDescription: 'Interactive monthly installment, dividend, and auction take-home return calculator for Tamil Nadu chit schemes.',
  },
  contact: {
    title: 'Contact SS Chit Funds Mettupalayam | Branch Office & Phone Inquiries Tamil Nadu',
    description: 'Contact ELITE GROUP SS CHIT FUNDS in Mettupalayam, Tamil Nadu. Official business WhatsApp lines +91 7338736352 & +91 9345836032. Request callback & join verified chit groups.',
    keywords: 'SS Chit Funds contact number, Chit fund office Mettupalayam, chit funds phone number Coimbatore, chit fund helpline Tamil Nadu, chit fund near me Coimbatore, dual WhatsApp support',
    canonicalPath: '/contact',
    ogTitle: 'Contact SS Chit Funds Mettupalayam | Branch Office & Support',
    ogDescription: 'Official business branch in Mettupalayam, Tamil Nadu. Direct WhatsApp lines +91 7338736352 & +91 9345836032.',
  },
  'how-it-works': {
    title: 'How Chit Funds Work in Tamil Nadu | 5-Step Process & Auction Guidelines',
    description: 'Understand how registered chit funds operate under the Chit Funds Act 1982 in Tamil Nadu. Clear 5-step process from enrollment to auction payout.',
    keywords: 'How chit funds work Tamil Nadu, chit fund auction rules, chit funds act 1982 Tamil Nadu, chit dividend rules Tamil Nadu, chit fund process Coimbatore',
    canonicalPath: '/how-it-works',
  },
  benefits: {
    title: 'Why Invest in Chit Funds Tamil Nadu | 7 Key Benefits | SS Chit Funds',
    description: 'Discover the 7 core advantages of investing in registered chit funds in Tamil Nadu: dual saving and borrowing, monthly dividend bonus, and collateral-free emergency cash.',
    keywords: 'Benefits of chit funds Tamil Nadu, chit fund vs fixed deposit, save money Tamil Nadu, business borrowing chit fund Coimbatore, chit fund returns',
    canonicalPath: '/benefits',
  },
  about: {
    title: 'About ELITE GROUP SS CHIT FUNDS | Trusted Financial Heritage Mettupalayam',
    description: 'Learn about ELITE GROUP – SS CHIT FUNDS, managed by ELITE TURF in Mettupalayam, Tamil Nadu. Established on financial transparency, customer-first governance, and community trust.',
    keywords: 'Elite Group chit funds, SS Chit Funds heritage, Elite Turf Mettupalayam, chit fund company background Tamil Nadu, corporate governance chit funds',
    canonicalPath: '/about',
  },
  faq: {
    title: 'Chit Fund FAQs Tamil Nadu | Safety, Rules, Auctions & Prize Money Payouts',
    description: 'Get answers to top questions about government registered chit funds in Tamil Nadu, safety regulations, auction discounts, monthly dividends, and prize payouts.',
    keywords: 'Chit fund safety Tamil Nadu, is chit fund legal in Tamil Nadu, chit fund auction rules FAQ, chit fund dividend tax Tamil Nadu, prize money payout chit fund',
    canonicalPath: '/faq',
  },
};

const SITE_URL = 'https://ss-chit-funds.com';

/**
 * Updates DOM title, meta tags, and browser history URL seamlessly.
 */
export function applySeoMetadata(sectionId: string, updateUrl: boolean = true): void {
  const meta = SEO_PAGE_METADATA[sectionId] || SEO_PAGE_METADATA.home;

  // 1. Update document title
  document.title = meta.title;

  // 2. Helper to set or create meta tag
  const setMeta = (selector: string, attr: string, value: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      if (selector.includes('name=')) {
        const name = selector.match(/name="([^"]+)"/)?.[1];
        if (name) el.setAttribute('name', name);
      } else if (selector.includes('property=')) {
        const prop = selector.match(/property="([^"]+)"/)?.[1];
        if (prop) el.setAttribute('property', prop);
      }
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };

  // 3. Update description and keywords
  setMeta('meta[name="description"]', 'content', meta.description);
  setMeta('meta[name="keywords"]', 'content', meta.keywords);

  // 4. Update OpenGraph tags
  setMeta('meta[property="og:title"]', 'content', meta.ogTitle || meta.title);
  setMeta('meta[property="og:description"]', 'content', meta.ogDescription || meta.description);
  setMeta('meta[property="og:url"]', 'content', `${SITE_URL}${meta.canonicalPath}`);

  // 5. Update canonical link
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', `${SITE_URL}${meta.canonicalPath}`);

  // 6. Push / replace browser history state if requested
  if (updateUrl && typeof window !== 'undefined' && window.history) {
    const targetPath = meta.canonicalPath;
    if (window.location.pathname !== targetPath && !window.location.hash.includes('admin')) {
      window.history.replaceState({ sectionId }, meta.title, targetPath);
    }
  }
}
