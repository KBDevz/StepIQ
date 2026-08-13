export type SegmentSlug = 'clinics' | 'facilities' | 'teams';

export interface SegmentFeature {
  title: string;
  body: string;
}

export interface SegmentStep {
  number: string;
  title: string;
  body: string;
}

export interface SegmentFAQ {
  q: string;
  a: string;
}

export interface SegmentConfig {
  slug: SegmentSlug;
  navLabel: string;
  cardLabel: string;
  cardSubtitle: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  socialProof: string;
  demoEmailSubject: string;
  features: SegmentFeature[];
  steps: SegmentStep[];
  pricingHeadline: string;
  pricingBody: string;
  faq: SegmentFAQ[];
}

export const SEGMENTS: Record<SegmentSlug, SegmentConfig> = {
  clinics: {
    slug: 'clinics',
    navLabel: 'For Clinics',
    cardLabel: 'For Clinics',
    cardSubtitle: 'Longevity, concierge & sports medicine practices',
    eyebrow: 'For Clinical Practice',
    headline: 'Cardiovascular fitness testing built for clinical practice.',
    subhead:
      'The Chester Step Test protocol — validated to r=0.92 vs. laboratory CPET. Deploy in your practice today. No capital equipment, no referrals out, no metabolic cart.',
    socialProof:
      'Built on the Chester Step Test — a validated submaximal protocol used in clinical and occupational health settings since 2004.',
    demoEmailSubject: 'StepIQ for Clinics — Demo Request',
    features: [
      {
        title: 'Multi-patient roster',
        body: 'Search, filter, and open longitudinal charts for every patient you\'ve tested. Track VO₂ trajectory across annual visits.',
      },
      {
        title: 'Branded PDF reports',
        body: 'Your clinic\'s logo, letterhead, and colors on every report. Chart-ready in one click.',
      },
      {
        title: 'HIPAA-ready infrastructure',
        body: 'BAA-eligible hosting, encryption at rest, audit logs, and patient consent capture. Compliance without the overhead.',
      },
      {
        title: 'Assisted-mode test flow',
        body: 'Your clinician holds the tablet, the patient steps. Six-minute protocol, real-time HR monitoring, automatic scoring.',
      },
      {
        title: 'Clinician roles & access',
        body: 'Admin, clinician, and front-desk roles with granular permissions. Onboard staff in minutes.',
      },
      {
        title: 'CSV export & EHR-ready data',
        body: 'Export patient results as CSV or PDF. FHIR and direct EHR integrations on the roadmap.',
      },
    ],
    steps: [
      {
        number: '01',
        title: 'Set up your practice',
        body: 'Add your logo, upload clinician accounts, configure your report branding. 15 minutes.',
      },
      {
        number: '02',
        title: 'Test patients in exam rooms',
        body: 'Assisted-mode protocol runs on any tablet. Six minutes per patient. A 30cm step and HR monitor are all you need.',
      },
      {
        number: '03',
        title: 'Deliver reports to charts',
        body: 'Branded PDF for the patient, CSV for the chart, longitudinal view for you. Retest reminders drive follow-up visits.',
      },
    ],
    pricingHeadline: '$299/mo per clinic',
    pricingBody:
      'Up to 3 clinicians, unlimited patients, unlimited tests. Custom pricing available for practices with 4+ clinicians or multiple locations.',
    faq: [
      {
        q: 'Is a submaximal test clinically defensible?',
        a: 'Yes. The Chester Step Test correlates with laboratory VO₂ max at r=0.92 (Sykes & Roberts, 2004). It\'s the protocol used in occupational health, cardiac rehab, and clinical research settings worldwide when a full CPET isn\'t warranted.',
      },
      {
        q: 'Do you support HIPAA compliance?',
        a: 'Yes. StepIQ runs on BAA-eligible infrastructure with encryption at rest, audit logs, and patient consent capture. We\'ll sign a BAA on request during onboarding.',
      },
      {
        q: 'Can this integrate with our EHR?',
        a: 'v1 supports CSV export and PDF-to-chart workflows. Direct integrations with Epic, athena, and Elation are on our roadmap based on customer demand — if you need one, tell us on your demo call.',
      },
      {
        q: 'What equipment do we need on-site?',
        a: 'A 30cm aerobic step and a chest-strap heart rate monitor (Polar H10 recommended). Total equipment cost under $150. No treadmill, no metabolic cart, no calibration.',
      },
      {
        q: 'How does billing work for our patients?',
        a: 'StepIQ is a software subscription — we don\'t handle patient billing. Most clinics bundle the test into an annual physical or offer it as a standalone $75-150 service.',
      },
    ],
  },

  facilities: {
    slug: 'facilities',
    navLabel: 'For Facilities',
    cardLabel: 'For Facilities',
    cardSubtitle: 'Gyms, wellness centers & studios',
    eyebrow: 'For Fitness & Wellness Facilities',
    headline: 'Give every member a real VO₂ score.',
    subhead:
      'Six-minute assisted-mode test. Branded member reports. Cohort challenges. Turn a corner of your facility into a science-grade testing station.',
    socialProof:
      'The same protocol used in clinical practice — now in the hands of wellness centers, boutique studios, and franchise fitness.',
    demoEmailSubject: 'StepIQ for Facilities — Demo Request',
    features: [
      {
        title: 'Assisted-mode testing',
        body: 'Your trainer holds the tablet, the member steps. Any staff member can run a valid test in six minutes.',
      },
      {
        title: 'Branded member reports',
        body: 'Your logo, colors, and messaging on the certificate. Members walk out with something they\'ll actually post to Instagram.',
      },
      {
        title: 'Cohort challenges',
        body: '8-week VO₂ challenges with leaderboards. The retention hook that keeps members showing up.',
      },
      {
        title: 'Personal training upsell',
        body: 'Every score comes with a training recommendation. Your trainers get a script for selling packages tied to real numbers.',
      },
      {
        title: 'Member progress dashboard',
        body: 'Track every member\'s VO₂ trajectory across retests. Identify who\'s improving, who\'s stalled, who\'s due to retest.',
      },
      {
        title: 'Flexible pricing',
        body: 'SaaS per location or per-test wholesale — pick what fits your business model.',
      },
    ],
    steps: [
      {
        number: '01',
        title: 'Set up your facility',
        body: 'Add your logo, brand your report, add staff accounts. One 30cm step and an HR monitor is all the equipment you need.',
      },
      {
        number: '02',
        title: 'Test members in your space',
        body: 'Offer it as intake for new members, as an à la carte service ($50-99), or as part of a challenge cohort.',
      },
      {
        number: '03',
        title: 'Retain and upsell',
        body: 'Retest at 8 weeks. Show progress. Convert into personal training packages, program upgrades, or premium memberships.',
      },
    ],
    pricingHeadline: 'From $149/mo per location',
    pricingBody:
      'Two paths: $149/mo unlimited tests per location, or per-test wholesale at $12/test (you retail at $50-99). Wellness centers typically prefer per-test; boutique fitness typically prefers SaaS. We\'ll help you pick.',
    faq: [
      {
        q: 'What equipment do we need?',
        a: 'A 30cm aerobic step (~$50) and a chest-strap heart rate monitor (Polar H10, ~$90). We can bundle a testing kit if you\'d rather not source it yourself.',
      },
      {
        q: 'Do our trainers need to be certified to run this?',
        a: 'No. The assisted-mode flow walks the trainer through every step of the protocol. If your staff can operate a stopwatch, they can run a valid test.',
      },
      {
        q: 'How should we integrate this into member flow?',
        a: 'Most facilities offer it as intake for new members (baseline VO₂ for every joiner), as an à la carte service ($50-99), or as a cohort challenge every 8-12 weeks. We\'ll walk you through what works best for your model.',
      },
      {
        q: 'Can I try this at one location before rolling out chain-wide?',
        a: 'Yes. Single-location pilots are our recommended starting point. Prove it works in one facility, then expand.',
      },
      {
        q: 'How is the report designed to drive retention?',
        a: 'Every member walks out with a shareable certificate, a personalized training zone card, and a retest date 8 weeks out. Retesting is the compounding loop that keeps them engaged.',
      },
    ],
  },

  teams: {
    slug: 'teams',
    navLabel: 'For Teams',
    cardLabel: 'For Teams',
    cardSubtitle: 'Fire departments, corporate wellness & workforce fitness',
    eyebrow: 'For Workforce Fitness Programs',
    headline: 'Annual VO₂ compliance for your whole roster.',
    subhead:
      'Test 100 firefighters or employees in a single week. NFPA 1582 pass/fail. Longitudinal tracking. Batch reports for command staff. In-house, on-site, no hospital referrals.',
    socialProof:
      'Built on the same protocol used in occupational health and fitness-for-duty testing for two decades.',
    demoEmailSubject: 'StepIQ for Teams — Demo Request',
    features: [
      {
        title: 'Roster management',
        body: 'Upload your roster as CSV, batch-invite testers, track completion. Simple admin dashboard for your safety officer.',
      },
      {
        title: 'Configurable pass/fail standards',
        body: 'NFPA 1582 (42 ml/kg/min), WFI, DOT medical, or custom thresholds. Set the standard, we handle the classification.',
      },
      {
        title: 'Compliance dashboard',
        body: 'See who\'s tested, who\'s due, who\'s below standard. Retest reminders and automatic due-date tracking.',
      },
      {
        title: 'Individual training plans',
        body: 'Below-standard employees get a personalized 8-week protocol to bring them back to compliance.',
      },
      {
        title: 'Annual roll-up reports',
        body: 'Single PDF for command staff, medical directors, or insurance auditors. Roster completion, pass rates, trends, individual histories.',
      },
      {
        title: 'On-site testing',
        body: 'Test in your station, gym, or workplace. No hospital referrals, no half-day duty losses, no $400 per employee.',
      },
    ],
    steps: [
      {
        number: '01',
        title: 'Upload your roster',
        body: 'CSV import for your team. Configure your standard (NFPA 1582, DOT, custom). Invite your fitness coordinator as admin.',
      },
      {
        number: '02',
        title: 'Test on-site',
        body: 'Six minutes per employee in your station or workplace. Any trained peer or fitness coordinator can run tests — no medical staff required.',
      },
      {
        number: '03',
        title: 'Track compliance year-round',
        body: 'Automatic due-date tracking, roll-up reports for command staff, individual training plans for below-standard members.',
      },
    ],
    pricingHeadline: 'From $40/employee/year',
    pricingBody:
      'Minimum 25 employees. Includes unlimited retests, individual training plans, and compliance reporting. A 100-person department pays $4,000/year vs. $30,000+ for hospital-based testing.',
    faq: [
      {
        q: 'What standards do you support?',
        a: 'NFPA 1582 (fire service), WFI/CPAT, DOT medical, and custom pass/fail thresholds. Tell us your standard on the demo call and we\'ll configure it before onboarding.',
      },
      {
        q: 'How much does this save vs. hospital-based testing?',
        a: 'Hospital VO₂ testing runs $300-800 per employee, plus half-day duty losses. StepIQ is $40-60/employee/year with unlimited retests. A 100-person department typically saves $25-70k annually.',
      },
      {
        q: 'Can our peer fitness coordinator run tests, or do we need medical staff?',
        a: 'Any trained peer can run the test. The Chester Step Test is a submaximal, standardized protocol — no medical staff required on-site. We provide training materials for your coordinator.',
      },
      {
        q: 'How does the annual compliance report work?',
        a: 'A single PDF showing roster completion rate, pass/fail counts, year-over-year trends, and individual histories. Formatted for medical directors, chiefs, and insurance auditors.',
      },
      {
        q: 'Do you support union approval processes?',
        a: 'Yes. We provide protocol documentation, validation studies (Sykes & Roberts 2004), and reference letters from other departments. Several have used our materials to secure union sign-off.',
      },
    ],
  },
};
