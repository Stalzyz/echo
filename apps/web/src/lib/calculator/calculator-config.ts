export interface WebsiteTypeOption {
  id: string;
  title: string;
  startingPrice: number;
  description: string;
  includedPages: number; // base pages included (e.g. 1 for landing, 5 for business)
  featuresIncluded: string[]; // IDs of features inherently included in this package
  badge?: string;
}

export interface PageTierOption {
  id: string;
  label: string;
  minPages: number;
  maxPages: number;
  ratePerPage: number;
  description: string;
}

export interface DesignTierOption {
  id: string;
  title: string;
  price: number;
  description: string;
}

export interface FeatureOption {
  id: string;
  title: string;
  price: number;
  description: string;
  category?: 'general' | 'ecommerce';
  requiredFeatures?: string[]; // IDs of features required if this is picked
  includedInWebsites?: string[]; // package IDs where this is ₹0/included
}

export interface ProductTierOption {
  id: string;
  label: string;
  price: number;
  isCustomQuote?: boolean;
}

export interface ProductUploadOption {
  id: string;
  label: string;
  price: number;
  isCustomQuote?: boolean;
}

export interface IntegrationOption {
  id: string;
  title: string;
  price: number;
  description: string;
}

export interface SeoOption {
  id: string;
  title: string;
  price: number;
  isMonthly?: boolean;
  features: string[];
}

export interface ContentOption {
  id: string;
  title: string;
  price: number;
  description: string;
}

export interface ImageOption {
  id: string;
  title: string;
  price: number;
  isContactOnly?: boolean;
  description: string;
}

export interface BrandingOption {
  id: string;
  title: string;
  price: number;
  description: string;
  items?: string[];
}

export interface MigrationOption {
  id: string;
  title: string;
  price: number;
  requiresProductCount?: boolean;
  isCustomQuote?: boolean;
  description: string;
}

export interface DomainHostingOption {
  id: string;
  title: string;
  price: number;
  period: 'year';
  description: string;
}

export interface MaintenanceOption {
  id: string;
  title: string;
  price: number;
  period: 'month';
  features: string[];
}

export interface DeliverySpeedOption {
  id: string;
  title: string;
  multiplier: number;
  description: string;
}

export interface CalculatorConfig {
  gstRate: number; // e.g. 0.18 for 18%
  customProjectThreshold: number; // e.g. 250000
  websiteTypes: WebsiteTypeOption[];
  pageTiers: PageTierOption[];
  designTiers: DesignTierOption[];
  features: FeatureOption[];
  ecommerceFeatures: FeatureOption[];
  productTiers: ProductTierOption[];
  productUploadTiers: ProductUploadOption[];
  integrations: IntegrationOption[];
  seoOptions: SeoOption[];
  contentOptions: ContentOption[];
  imageOptions: ImageOption[];
  brandingOptions: BrandingOption[];
  migrationOptions: MigrationOption[];
  domainHostingOptions: DomainHostingOption[];
  maintenanceOptions: MaintenanceOption[];
  deliverySpeeds: DeliverySpeedOption[];
}

export const DEFAULT_CALCULATOR_CONFIG: CalculatorConfig = {
  gstRate: 0.18,
  customProjectThreshold: 250000,
  websiteTypes: [
    {
      id: 'landing',
      title: 'Landing Page',
      startingPrice: 8000,
      includedPages: 1,
      featuresIncluded: ['whatsapp_btn'],
      description: 'Single-page high-converting layout built for product launches, ad campaigns, and targeted marketing lead capture.',
      badge: 'Starter'
    },
    {
      id: 'business',
      title: 'Business Website',
      startingPrice: 15000,
      includedPages: 5,
      featuresIncluded: ['contact_form', 'whatsapp_btn', 'testimonials'],
      description: 'For companies that need a professional website to showcase their business, services, credibility, and contact information.',
      badge: 'Popular'
    },
    {
      id: 'professional',
      title: 'Professional Website',
      startingPrice: 25000,
      includedPages: 5,
      featuresIncluded: ['contact_form', 'whatsapp_btn', 'testimonials', 'faq', 'portfolio', 'basic_seo'],
      description: 'For established firms and consultants looking for custom layouts, high trust signals, portfolio showcases, and lead generation.',
      badge: 'Best Value'
    },
    {
      id: 'corporate',
      title: 'Premium Corporate Website',
      startingPrice: 40000,
      includedPages: 8,
      featuresIncluded: ['contact_form', 'whatsapp_btn', 'testimonials', 'faq', 'portfolio', 'blog', 'lead_form', 'basic_seo'],
      description: 'High-end enterprise presentation with custom animations, multi-section architecture, and comprehensive corporate presence.'
    },
    {
      id: 'webapp',
      title: 'Custom Web Application',
      startingPrice: 75000,
      includedPages: 8,
      featuresIncluded: ['contact_form', 'customer_login', 'customer_dashboard', 'basic_seo'],
      description: 'Interactive web software, client portals, SaaS MVPs, booking platforms, and custom operational tools.'
    },
    {
      id: 'ecommerce',
      title: 'E-commerce Website',
      startingPrice: 35000,
      includedPages: 6,
      featuresIncluded: ['contact_form', 'whatsapp_btn', 'cart', 'checkout', 'product_catalog', 'customer_accounts', 'payment_gateway', 'basic_seo'],
      description: 'Complete online store to sell products, accept instant UPI/Card payments, manage catalogs, and track orders 24/7.',
      badge: 'Online Store'
    }
  ],

  pageTiers: [
    { id: 'p1', label: '1 Page', minPages: 1, maxPages: 1, ratePerPage: 0, description: 'Single-page scroll layout' },
    { id: 'p3_5', label: '3–5 Pages', minPages: 3, maxPages: 5, ratePerPage: 0, description: 'Included in standard business packages' },
    { id: 'p6_10', label: '6–10 Pages', minPages: 6, maxPages: 10, ratePerPage: 2500, description: '₹2,500 per additional page' },
    { id: 'p11_20', label: '11–20 Pages', minPages: 11, maxPages: 20, ratePerPage: 2250, description: '₹2,250 per additional page' },
    { id: 'p20_plus', label: '20+ Pages', minPages: 21, maxPages: 30, ratePerPage: 2000, description: '₹2,000 per additional page' },
  ],

  designTiers: [
    {
      id: 'basic',
      title: 'Basic',
      price: 0,
      description: 'Clean, clean-cut, and professional visual styling tailored with your brand colors.'
    },
    {
      id: 'custom',
      title: 'Custom',
      price: 7500,
      description: 'Designed specifically from scratch for your business identity with custom typography & layout accents.'
    },
    {
      id: 'premium',
      title: 'Premium',
      price: 15000,
      description: 'High-end UI/UX, micro-animations, rich imagery, and premium visual design that inspires instant credibility.'
    },
    {
      id: 'luxury',
      title: 'Luxury / Advanced',
      price: 30000,
      description: 'Highly customized interactive experience with 3D accents, bespoke cursor motion, and award-winning aesthetics.'
    }
  ],

  features: [
    { id: 'contact_form', title: 'Contact Form', price: 1000, description: 'Standard enquiry form with email notifications.', includedInWebsites: ['business', 'professional', 'corporate', 'webapp', 'ecommerce'] },
    { id: 'whatsapp_btn', title: 'WhatsApp Button', price: 500, description: 'Direct one-tap WhatsApp floating chat icon.', includedInWebsites: ['landing', 'business', 'professional', 'corporate', 'ecommerce'] },
    { id: 'booking', title: 'Appointment / Booking System', price: 5000, description: 'Interactive calendar for clients to book consultations or time slots.' },
    { id: 'lead_form', title: 'Lead Capture Form', price: 2000, description: 'High-converting popup or embedded lead intake form with CRM link.', includedInWebsites: ['corporate'] },
    { id: 'customer_login', title: 'Customer Login', price: 5000, description: 'Secure user registration, authentication & password management.', includedInWebsites: ['webapp', 'ecommerce'] },
    { id: 'customer_dashboard', title: 'Customer Dashboard', price: 10000, description: 'Private client member portal to view data, history, and status.', requiredFeatures: ['customer_login'], includedInWebsites: ['webapp'] },
    { id: 'blog', title: 'Blog / Article System', price: 3000, description: 'Article publishing engine with categories, tags, and reading views.', includedInWebsites: ['corporate'] },
    { id: 'portfolio', title: 'Portfolio / Gallery', price: 2000, description: 'Visual showcase grid to display completed projects and client work.', includedInWebsites: ['professional', 'corporate'] },
    { id: 'testimonials', title: 'Testimonials / Reviews', price: 1000, description: 'Customer review carousel and trust badges.', includedInWebsites: ['business', 'professional', 'corporate'] },
    { id: 'faq', title: 'FAQ Section', price: 1000, description: 'Interactive accordion for frequently asked questions.', includedInWebsites: ['professional', 'corporate'] },
    { id: 'search', title: 'Advanced Search', price: 5000, description: 'Instant live predictive search across pages, articles, or records.' },
    { id: 'filters', title: 'Advanced Filters', price: 5000, description: 'Multi-criteria filter bars by category, tags, and parameters.' },
    { id: 'membership', title: 'Membership System', price: 10000, description: 'Gated content access with membership levels and user roles.', requiredFeatures: ['customer_login'] },
    { id: 'subscription', title: 'Subscription System', price: 15000, description: 'Automated recurring billing cycles and payment reminders.', requiredFeatures: ['customer_login'] },
    { id: 'calculator', title: 'Custom Calculator', price: 5000, description: 'Bespoke interactive calculation tool tailored to your services.' },
    { id: 'custom_dash', title: 'Custom Dashboard', price: 15000, description: 'Custom-built administrative management control center.', requiredFeatures: ['customer_login'] }
  ],

  ecommerceFeatures: [
    { id: 'product_catalog', title: 'Product Catalogue', price: 5000, description: 'Organized product categories, grid listings, and detail pages.', includedInWebsites: ['ecommerce'] },
    { id: 'product_variants', title: 'Product Variants', price: 5000, description: 'Sizes, colors, materials, and dynamic variant pricing.' },
    { id: 'cart', title: 'Shopping Cart', price: 3000, description: 'Slide-out cart drawer with live subtotal updates.', includedInWebsites: ['ecommerce'] },
    { id: 'checkout', title: 'Checkout System', price: 3000, description: 'Frictionless single-page or multi-step checkout flow.', includedInWebsites: ['ecommerce'] },
    { id: 'customer_accounts', title: 'Customer Accounts', price: 5000, description: 'Account order history, saved addresses, and profile settings.', includedInWebsites: ['ecommerce'] },
    { id: 'payment_gateway', title: 'Payment Gateway', price: 5000, description: 'Razorpay / Cashfree / Stripe setup for UPI, cards, netbanking.', includedInWebsites: ['ecommerce'] },
    { id: 'coupon_system', title: 'Coupon System', price: 3000, description: 'Discount promo codes, percentage discounts, and order limits.' },
    { id: 'wishlist', title: 'Wishlist', price: 3000, description: 'Allow shoppers to bookmark their favorite items for later.' },
    { id: 'reviews_ratings', title: 'Reviews & Ratings', price: 2500, description: 'Verified buyer stars, text reviews, and photo uploads.' },
    { id: 'shipping_api', title: 'Shipping Integration', price: 7500, description: 'Automated courier rates calculation at checkout.' },
    { id: 'shiprocket', title: 'Shiprocket Integration', price: 7500, description: 'Direct Shiprocket sync for 1-click AWB label generation and courier pickup.' },
    { id: 'whatsapp_orders', title: 'WhatsApp Order Notifications', price: 5000, description: 'Automated WhatsApp confirmations and shipping tracking alerts.' },
    { id: 'gst_invoicing', title: 'GST Invoice System', price: 7500, description: 'Automated tax-compliant PDF invoice generation with HSN/GST numbers.' },
    { id: 'wallet', title: 'Wallet / Store Credits', price: 10000, description: 'Customer wallet balance for returns, refunds, and cashback.' },
    { id: 'loyalty', title: 'Loyalty Points', price: 7500, description: 'Reward points system earned per purchase and redeemable at checkout.' },
    { id: 'referral', title: 'Referral Program', price: 10000, description: 'Give ₹X, Get ₹Y friend referral link mechanism.' },
    { id: 'wholesale_b2b', title: 'Wholesale / B2B System', price: 15000, description: 'Tiered wholesale pricing, minimum order quantities, and GST bulk sales.' },
    { id: 'pos_integration', title: 'POS Integration', price: 15000, description: 'Sync physical store counter billing with online inventory.' },
    { id: 'advanced_reports', title: 'Advanced Reports', price: 10000, description: 'Sales analytics, product performance, and customer retention metrics.' },
    { id: 'subscription_products', title: 'Subscription Products', price: 15000, description: 'Recurring auto-ship orders (weekly, monthly, quarterly).' },
    { id: 'marketplace', title: 'Multi-vendor Marketplace', price: 40000, description: 'Multi-seller portal with vendor commissions and individual seller stores.' }
  ],

  productTiers: [
    { id: 'prod_50', label: 'Up to 50 Products', price: 0 },
    { id: 'prod_200', label: '51–200 Products', price: 3000 },
    { id: 'prod_500', label: '201–500 Products', price: 7500 },
    { id: 'prod_1000', label: '501–1,000 Products', price: 15000 },
    { id: 'prod_1000_plus', label: '1,000+ Products', price: 25000, isCustomQuote: true }
  ],

  productUploadTiers: [
    { id: 'upload_self', label: "No, I'll upload them myself", price: 0 },
    { id: 'upload_100', label: 'Yes, up to 100 products', price: 3000 },
    { id: 'upload_500', label: '101–500 products', price: 7500 },
    { id: 'upload_500_plus', label: '500+ products', price: 15000, isCustomQuote: true }
  ],

  integrations: [
    { id: 'google_analytics', title: 'Google Analytics 4', price: 1000, description: 'Track visitor counts, page views, and user journeys.' },
    { id: 'search_console', title: 'Google Search Console', price: 1000, description: 'Submit sitemaps and monitor Google search performance.' },
    { id: 'meta_pixel', title: 'Meta Pixel (Facebook/Instagram)', price: 1000, description: 'Track ad conversions and build retargeting audiences.' },
    { id: 'whatsapp_api', title: 'WhatsApp Business API', price: 5000, description: 'Official Meta WhatsApp API connection for automated customer messaging.' },
    { id: 'crm_integration', title: 'CRM Integration', price: 7500, description: 'Direct lead sync into HubSpot, Zoho, Salesforce or Grekam CRM.' },
    { id: 'payment_gw', title: 'Payment Gateway Integration', price: 5000, description: 'Setup of Razorpay, Cashfree, Stripe, or PhonePe.' },
    { id: 'shipping_api_int', title: 'Shipping API', price: 7500, description: 'Live courier API connection for automated dispatch.' },
    { id: 'shiprocket_int', title: 'Shiprocket Integration', price: 7500, description: 'Direct Shiprocket account linking and automated pickup creation.' },
    { id: 'erp_integration', title: 'ERP Integration', price: 15000, description: 'Sync sales, orders, and customer data with corporate ERP systems.' },
    { id: 'accounting_software', title: 'Accounting Software', price: 10000, description: 'Connect with Tally, QuickBooks, or Zoho Books.' },
    { id: 'custom_api', title: 'Custom API Integration', price: 10000, description: 'Connect your website to proprietary software or third-party databases.' }
  ],

  seoOptions: [
    {
      id: 'basic_seo',
      title: 'Basic SEO',
      price: 0,
      features: ['Meta titles', 'Meta descriptions', 'XML Sitemap', 'Robots.txt', 'Basic technical SEO audit']
    },
    {
      id: 'seo_setup',
      title: 'SEO Setup + Optimization',
      price: 10000,
      features: ['Keyword research', 'On-page content optimization', 'Technical speed SEO', 'Internal linking structure', 'Rich schema snippet markup']
    },
    {
      id: 'ongoing_seo',
      title: 'Ongoing SEO Services',
      price: 15000,
      isMonthly: true,
      features: ['Monthly keyword ranking tracking', 'Content optimization updates', 'Backlink acquisition', 'Monthly competitor & ranking report']
    }
  ],

  contentOptions: [
    { id: 'content_self', title: "I'll provide everything", price: 0, description: 'You will furnish written copy, headlines, and details.' },
    { id: 'content_help', title: 'I need help with content', price: 5000, description: 'Agency polishing, proofreading, and structuring of your raw notes.' },
    { id: 'content_pro', title: 'Professional copywriting', price: 15000, description: 'Compelling sales-oriented copywriting written by expert brand copywriters.' },
    { id: 'content_seo', title: 'SEO-focused content', price: 25000, description: 'In-depth, keyword-rich copy engineered to rank on Google search.' }
  ],

  imageOptions: [
    { id: 'img_self', title: "I'll provide images", price: 0, description: 'You provide photos, banners, and product imagery.' },
    { id: 'img_stock', title: 'Agency to source stock images', price: 3000, description: 'Curated high-resolution licensed stock photography.' },
    { id: 'img_photo', title: 'Professional photography', price: 0, isContactOnly: true, description: 'On-site commercial product or team shoot (quoted separately).' }
  ],

  brandingOptions: [
    { id: 'brand_existing', title: 'Yes, I already have branding', price: 0, description: 'You have existing logo, colors, and font styles.' },
    { id: 'brand_logo', title: 'I need a logo', price: 7500, description: 'Custom vector logo design with primary and secondary marks.' },
    { id: 'brand_identity', title: 'Logo + Brand Identity', price: 15000, description: 'Vector logo, custom color palette, font system, and social media badges.' },
    {
      id: 'brand_complete',
      title: 'Complete Branding',
      price: 30000,
      description: 'Full brand system including guidelines manual, stationery, business cards, letterhead, and social kits.',
      items: ['Logo & marks', 'Brand guidelines manual', 'Color palette & fonts', 'Business card & letterhead', 'Social media launch pack']
    }
  ],

  migrationOptions: [
    { id: 'mig_none', title: 'No migration', price: 0, description: 'Brand new website starting from scratch.' },
    { id: 'mig_wp', title: 'WordPress migration', price: 5000, description: 'Migrate blog posts, pages, and media from an existing WordPress site.' },
    { id: 'mig_shopify', title: 'Shopify migration', price: 10000, requiresProductCount: true, description: 'Transfer customer data, order records, and products from Shopify.' },
    { id: 'mig_other', title: 'Other platform migration', price: 15000, description: 'Migrate from Wix, Squarespace, Magento, or custom CMS.' },
    { id: 'mig_large', title: 'Large / Complex migration', price: 35000, isCustomQuote: true, description: 'Enterprise migration with 10k+ records, custom databases, and 301 SEO redirects.' }
  ],

  domainHostingOptions: [
    { id: 'host_existing', title: 'I already have them', price: 0, period: 'year', description: 'You already own your domain name and cloud hosting.' },
    { id: 'host_domain', title: 'Domain setup (.com / .in)', price: 1500, period: 'year', description: 'Domain registration, DNS setup, and WHOIS privacy.' },
    { id: 'host_setup', title: 'Hosting setup & Cloud VPS', price: 5000, period: 'year', description: 'High-speed cloud server deployment with automated SSL security.' },
    { id: 'host_managed', title: 'Managed Cloud Hosting', price: 10000, period: 'year', description: 'High-performance cloud VPS with 24/7 uptime monitoring, CDN & daily backups.' }
  ],

  maintenanceOptions: [
    { id: 'maint_none', title: 'No maintenance', price: 0, period: 'month', features: ['Self-managed after handover'] },
    { id: 'maint_basic', title: 'Basic Maintenance', price: 2000, period: 'month', features: ['Core software updates', 'Weekly cloud backups', 'Security checks', 'Minor bug fixes'] },
    { id: 'maint_business', title: 'Business Maintenance', price: 5000, period: 'month', features: ['Software & security updates', 'Daily cloud backups', 'Content & text changes', 'Technical support'] },
    { id: 'maint_priority', title: 'Priority Maintenance', price: 10000, period: 'month', features: ['Priority SLA support', '24/7 uptime monitoring', 'Content updates', 'Minor development', 'Speed & performance audits'] }
  ],

  deliverySpeeds: [
    { id: 'normal', title: 'Normal timeline', multiplier: 1.0, description: 'Standard sprint delivery schedule.' },
    { id: 'priority', title: 'Priority delivery (+15%)', multiplier: 1.15, description: 'Expedited production queue with dedicated engineering allocation.' },
    { id: 'urgent', title: 'Urgent delivery (+30%)', multiplier: 1.30, description: 'Fast-track sprint with double daily engineering capacity.' }
  ]
};

export interface CalculatorState {
  websiteType: string;
  pageTier: string;
  exactPagesCount?: number;
  designTier: string;
  selectedFeatures: string[];
  selectedEcommerceFeatures: string[];
  productTier: string;
  productUploadTier: string;
  selectedIntegrations: string[];
  customIntegrationText?: string;
  seoOption: string;
  contentOption: string;
  imageOption: string;
  brandingOption: string;
  migrationOption: string;
  domainHostingOption: string;
  maintenanceOption: string;
  deliverySpeed: string;
  includeGst: boolean;
  // Customer Details
  customerName?: string;
  businessName?: string;
  email?: string;
  phone?: string;
  city?: string;
  websiteUrl?: string;
  additionalNotes?: string;
}

export const INITIAL_CALCULATOR_STATE: CalculatorState = {
  websiteType: 'business',
  pageTier: 'p3_5',
  designTier: 'basic',
  selectedFeatures: ['contact_form', 'whatsapp_btn'],
  selectedEcommerceFeatures: [],
  productTier: 'prod_50',
  productUploadTier: 'upload_self',
  selectedIntegrations: [],
  customIntegrationText: '',
  seoOption: 'basic_seo',
  contentOption: 'content_self',
  imageOption: 'img_self',
  brandingOption: 'brand_existing',
  migrationOption: 'mig_none',
  domainHostingOption: 'host_existing',
  maintenanceOption: 'maint_none',
  deliverySpeed: 'normal',
  includeGst: false,
};

export interface BreakdownItem {
  category: string;
  title: string;
  cost: number;
  isIncluded?: boolean;
  isCustomQuote?: boolean;
}

export interface CalculationResult {
  oneTimeSubtotal: number;
  multiplier: number;
  oneTimeBeforeGst: number;
  gstAmount: number;
  oneTimeTotal: number;
  yearlyHosting: number;
  monthlyMaintenance: number;
  monthlySeo: number;
  isCustomProject: boolean;
  customProjectReasons: string[];
  breakdown: BreakdownItem[];
  recommendedPackage: {
    title: string;
    description: string;
    badge?: string;
  };
}

/**
 * Rounds a number to professional pricing tiers:
 * e.g. 67,450 -> 67,500; 82,300 -> 82,500 / 85,000
 */
export function roundToProfessionalPrice(amount: number): number {
  if (amount <= 0) return 0;
  if (amount < 20000) {
    // Round to nearest 500
    return Math.ceil(amount / 500) * 500;
  }
  // Round to nearest 500 or 1000
  const rem500 = amount % 1000;
  if (rem500 === 0) return amount;
  if (rem500 <= 500) {
    return Math.floor(amount / 1000) * 1000 + 500;
  }
  return Math.ceil(amount / 1000) * 1000;
}

export function calculateWebsiteEstimate(
  state: CalculatorState,
  config: CalculatorConfig = DEFAULT_CALCULATOR_CONFIG
): CalculationResult {
  const breakdown: BreakdownItem[] = [];
  const customProjectReasons: string[] = [];

  // 1. Base Website Type
  const siteType = config.websiteTypes.find(w => w.id === state.websiteType) || config.websiteTypes[1];
  breakdown.push({
    category: 'Base Website',
    title: siteType.title,
    cost: siteType.startingPrice,
  });
  let baseSum = siteType.startingPrice;

  // 2. Additional Pages
  let pagesCost = 0;
  const pageTier = config.pageTiers.find(p => p.id === state.pageTier);
  if (pageTier) {
    if (state.websiteType === 'landing') {
      // Landing page includes 1 page
      pagesCost = 0;
    } else {
      // Deduct included pages
      const included = siteType.includedPages || 5;
      if (pageTier.id === 'p1' || pageTier.id === 'p3_5') {
        pagesCost = 0; // included in base
      } else if (pageTier.id === 'p6_10') {
        // e.g. 8 pages minus 5 included = 3 additional pages * 2,500
        const additional = Math.max(0, 8 - included);
        pagesCost = additional * 2500;
      } else if (pageTier.id === 'p11_20') {
        // e.g. 15 pages minus 5 included = 10 additional pages * 2,250
        const additional = Math.max(0, 15 - included);
        pagesCost = additional * 2250;
      } else if (pageTier.id === 'p20_plus') {
        // e.g. 25 pages minus 5 included = 20 additional pages * 2,000
        const additional = Math.max(0, 25 - included);
        pagesCost = additional * 2000;
      }
    }
  }
  breakdown.push({
    category: 'Pages',
    title: pageTier ? pageTier.label : 'Pages',
    cost: pagesCost,
    isIncluded: pagesCost === 0,
  });
  baseSum += pagesCost;

  // 3. Design Tier
  const design = config.designTiers.find(d => d.id === state.designTier);
  if (design) {
    breakdown.push({
      category: 'Design Style',
      title: `${design.title} Design`,
      cost: design.price,
      isIncluded: design.price === 0,
    });
    baseSum += design.price;
  }

  // 4. Website Features (with dependency & package inclusion checks)
  let featuresCost = 0;
  state.selectedFeatures.forEach(featId => {
    const feat = config.features.find(f => f.id === featId);
    if (!feat) return;

    // Check if included in selected website package
    const isIncludedInPackage = feat.includedInWebsites?.includes(state.websiteType) || siteType.featuresIncluded.includes(featId);
    const cost = isIncludedInPackage ? 0 : feat.price;
    featuresCost += cost;

    breakdown.push({
      category: 'Features',
      title: feat.title,
      cost,
      isIncluded: isIncludedInPackage,
    });
  });
  baseSum += featuresCost;

  // 5. E-commerce Features (Only if E-commerce)
  let ecomCost = 0;
  if (state.websiteType === 'ecommerce') {
    state.selectedEcommerceFeatures.forEach(eId => {
      const eFeat = config.ecommerceFeatures.find(f => f.id === eId);
      if (!eFeat) return;

      const isIncludedInPackage = eFeat.includedInWebsites?.includes('ecommerce') || siteType.featuresIncluded.includes(eId);
      const cost = isIncludedInPackage ? 0 : eFeat.price;
      ecomCost += cost;

      if (eId === 'marketplace') {
        customProjectReasons.push('Multi-vendor Marketplace platform');
      }

      breakdown.push({
        category: 'E-commerce',
        title: eFeat.title,
        cost,
        isIncluded: isIncludedInPackage,
      });
    });

    // 6. Product Tiers (E-commerce)
    const prodTier = config.productTiers.find(p => p.id === state.productTier);
    if (prodTier) {
      if (prodTier.isCustomQuote) customProjectReasons.push('1,000+ catalog inventory');
      breakdown.push({
        category: 'Catalogue Size',
        title: prodTier.label,
        cost: prodTier.price,
        isIncluded: prodTier.price === 0,
        isCustomQuote: prodTier.isCustomQuote,
      });
      baseSum += prodTier.price;
    }

    const uploadTier = config.productUploadTiers.find(u => u.id === state.productUploadTier);
    if (uploadTier && uploadTier.price > 0) {
      if (uploadTier.isCustomQuote) customProjectReasons.push('500+ product data entry');
      breakdown.push({
        category: 'Product Upload',
        title: uploadTier.label,
        cost: uploadTier.price,
        isCustomQuote: uploadTier.isCustomQuote,
      });
      baseSum += uploadTier.price;
    }
  }
  baseSum += ecomCost;

  // 7. Integrations
  let intCost = 0;
  state.selectedIntegrations.forEach(intId => {
    // Payment Gateway deduplication rule
    if (intId === 'payment_gw' && (state.websiteType === 'ecommerce' || state.selectedEcommerceFeatures.includes('payment_gateway'))) {
      breakdown.push({
        category: 'Integrations',
        title: 'Payment Gateway',
        cost: 0,
        isIncluded: true,
      });
      return;
    }
    // Shipping deduplication rule
    if (intId === 'shiprocket_int' && state.selectedEcommerceFeatures.includes('shiprocket')) {
      breakdown.push({
        category: 'Integrations',
        title: 'Shiprocket Integration',
        cost: 0,
        isIncluded: true,
      });
      return;
    }

    const item = config.integrations.find(i => i.id === intId);
    if (item) {
      if (item.id === 'erp_integration') customProjectReasons.push('Enterprise ERP integration');
      intCost += item.price;
      breakdown.push({
        category: 'Integrations',
        title: item.title,
        cost: item.price,
      });
    }
  });
  if (state.customIntegrationText && state.customIntegrationText.trim()) {
    breakdown.push({
      category: 'Integrations',
      title: `Custom Integration: ${state.customIntegrationText.trim()}`,
      cost: 10000,
    });
    intCost += 10000;
  }
  baseSum += intCost;

  // 8. SEO
  let monthlySeo = 0;
  const seo = config.seoOptions.find(s => s.id === state.seoOption);
  if (seo) {
    if (seo.isMonthly) {
      monthlySeo = seo.price;
    } else {
      const isBaseIncluded = seo.id === 'basic_seo' && siteType.featuresIncluded.includes('basic_seo');
      const cost = isBaseIncluded ? 0 : seo.price;
      baseSum += cost;
      breakdown.push({
        category: 'SEO',
        title: seo.title,
        cost,
        isIncluded: isBaseIncluded || cost === 0,
      });
    }
  }

  // 9. Content & Images
  const content = config.contentOptions.find(c => c.id === state.contentOption);
  if (content && content.price > 0) {
    baseSum += content.price;
    breakdown.push({
      category: 'Content',
      title: content.title,
      cost: content.price,
    });
  }

  const image = config.imageOptions.find(i => i.id === state.imageOption);
  if (image && image.price > 0) {
    baseSum += image.price;
    breakdown.push({
      category: 'Images',
      title: image.title,
      cost: image.price,
    });
  }

  // 10. Branding
  const branding = config.brandingOptions.find(b => b.id === state.brandingOption);
  if (branding && branding.price > 0) {
    baseSum += branding.price;
    breakdown.push({
      category: 'Branding',
      title: branding.title,
      cost: branding.price,
    });
  }

  // 11. Migration
  const migration = config.migrationOptions.find(m => m.id === state.migrationOption);
  if (migration && migration.price > 0) {
    if (migration.isCustomQuote) customProjectReasons.push('Large/Complex CMS Migration');
    baseSum += migration.price;
    breakdown.push({
      category: 'Migration',
      title: migration.title,
      cost: migration.price,
      isCustomQuote: migration.isCustomQuote,
    });
  }

  // 12. Recurring: Hosting & Domain
  let yearlyHosting = 0;
  const hosting = config.domainHostingOptions.find(h => h.id === state.domainHostingOption);
  if (hosting && hosting.price > 0) {
    yearlyHosting = hosting.price;
  }

  // 13. Recurring: Maintenance
  let monthlyMaintenance = 0;
  const maintenance = config.maintenanceOptions.find(m => m.id === state.maintenanceOption);
  if (maintenance && maintenance.price > 0) {
    monthlyMaintenance = maintenance.price;
  }

  // 14. Delivery Speed Multiplier
  const delivery = config.deliverySpeeds.find(d => d.id === state.deliverySpeed) || config.deliverySpeeds[0];
  const multiplier = delivery.multiplier;

  // Compute one-time total
  const oneTimeSubtotal = baseSum;
  const rawWithMultiplier = oneTimeSubtotal * multiplier;
  const oneTimeBeforeGst = roundToProfessionalPrice(rawWithMultiplier);

  const gstAmount = state.includeGst ? Math.round(oneTimeBeforeGst * config.gstRate) : 0;
  const oneTimeTotal = oneTimeBeforeGst + gstAmount;

  // Custom project evaluation (> ₹2,50,000 or enterprise flags)
  const isCustomProject = oneTimeBeforeGst >= config.customProjectThreshold || customProjectReasons.length > 0;

  // Package recommendation
  let recommendedPackage = {
    title: 'Professional Website',
    description: 'Based on your requirements, our Professional Website package offers the highest value and market authority.',
    badge: 'Recommended',
  };
  if (isCustomProject) {
    recommendedPackage = {
      title: 'Custom Development',
      description: 'Your project architecture requires bespoke enterprise engineering and tailored consultation.',
      badge: 'Bespoke',
    };
  } else if (state.websiteType === 'ecommerce') {
    recommendedPackage = {
      title: 'E-commerce Growth Store',
      description: 'Optimized for frictionless checkout, high conversion rate, and automated order fulfillment.',
      badge: 'Best For Commerce',
    };
  } else if (state.websiteType === 'webapp') {
    recommendedPackage = {
      title: 'Fullstack Web Application',
      description: 'Built with Next.js 15, PostgreSQL, and scalable microservices architecture.',
      badge: 'Scalable MVP',
    };
  } else if (state.websiteType === 'landing') {
    recommendedPackage = {
      title: 'High-Impact Landing Page',
      description: 'Engineered for ad campaigns, lightning-fast loading, and instant lead conversions.',
      badge: 'Quick Launch',
    };
  }

  return {
    oneTimeSubtotal,
    multiplier,
    oneTimeBeforeGst,
    gstAmount,
    oneTimeTotal,
    yearlyHosting,
    monthlyMaintenance,
    monthlySeo,
    isCustomProject,
    customProjectReasons,
    breakdown,
    recommendedPackage,
  };
}

export function generateWhatsAppQuoteMessage(
  state: CalculatorState,
  result: CalculationResult,
  config: CalculatorConfig = DEFAULT_CALCULATOR_CONFIG
): string {
  const siteType = config.websiteTypes.find(w => w.id === state.websiteType)?.title || state.websiteType;
  const pageTier = config.pageTiers.find(p => p.id === state.pageTier)?.label || state.pageTier;
  const designTier = config.designTiers.find(d => d.id === state.designTier)?.title || state.designTier;

  const selectedFeaturesList = [
    ...state.selectedFeatures.map(fId => config.features.find(f => f.id === fId)?.title),
    ...state.selectedEcommerceFeatures.map(eId => config.ecommerceFeatures.find(f => f.id === eId)?.title),
    ...state.selectedIntegrations.map(iId => config.integrations.find(i => i.id === iId)?.title),
  ].filter(Boolean);

  const formattedCost = result.isCustomProject
    ? 'Starting from ₹2,50,000 (Custom Planning)'
    : `₹${result.oneTimeTotal.toLocaleString('en-IN')}${state.includeGst ? ' (Incl. GST)' : ''}`;

  let msg = `Hi Grekam Visuals,\n\nI used your Website Cost Calculator and would like to discuss my project:\n\n`;
  if (state.businessName) msg += `*Business:* ${state.businessName}\n`;
  if (state.customerName) msg += `*Contact:* ${state.customerName}\n`;
  if (state.city) msg += `*City:* ${state.city}\n`;
  msg += `*Website Type:* ${siteType}\n`;
  msg += `*Pages:* ${pageTier}\n`;
  msg += `*Design Style:* ${designTier}\n`;
  msg += `*Estimated Cost:* ${formattedCost}\n`;

  if (result.yearlyHosting > 0 || result.monthlyMaintenance > 0 || result.monthlySeo > 0) {
    msg += `\n*Recurring Services:*\n`;
    if (result.yearlyHosting > 0) msg += `- Hosting/Domain: ₹${result.yearlyHosting.toLocaleString('en-IN')}/year\n`;
    if (result.monthlyMaintenance > 0) msg += `- Maintenance: ₹${result.monthlyMaintenance.toLocaleString('en-IN')}/month\n`;
    if (result.monthlySeo > 0) msg += `- SEO: ₹${result.monthlySeo.toLocaleString('en-IN')}/month\n`;
  }

  if (selectedFeaturesList.length > 0) {
    msg += `\n*Key Requirements:*\n`;
    msg += selectedFeaturesList.slice(0, 8).map(f => `• ${f}`).join('\n');
    if (selectedFeaturesList.length > 8) {
      msg += `\n• +${selectedFeaturesList.length - 8} more options`;
    }
    msg += `\n`;
  }

  if (state.additionalNotes && state.additionalNotes.trim()) {
    msg += `\n*Notes:* ${state.additionalNotes.trim()}\n`;
  }

  msg += `\nPlease contact me to discuss the project and provide the final quotation.`;

  return msg;
}
