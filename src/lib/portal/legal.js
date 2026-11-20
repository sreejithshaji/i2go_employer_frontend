// Legal details shown on the Impressum, privacy and terms pages (PLAN.md 10.7,
// 10.9, 10.10; LEGAL_COMPLIANCE_MIGRATION_PLAN.md).
//
// Operator since November 2026: ITOOGO ALQWA HR CONSULTANCY - FZCO, Dubai.
// Source of the registration details: the company's trade licence no. 80053,
// issued by the Dubai Integrated Economic Zones Authority (document
// 006-0080053-190226, issued 19/02/2026, expires 18/02/2027). The earlier
// operator, i2GO Personal Management, Indian Ocean GmbH (Münster), is no
// longer named as provider or controller.
//
// Values in [brackets] are not confirmed yet. Don't fill them from the company
// website or online directories: take them from official documents only
// (LEGAL_COMPLIANCE_MIGRATION_PLAN.md, section 2.2). Keep in step with
// mobile_app/lib/constants/company.dart.

/**
 * Version of the employer terms of use. Stored on public.users at signup
 * (terms_version) and when an employer accepts them from the portal. Bump it
 * when the terms change: employers on an older version are asked to accept
 * again, and see only the teaser until they do.
 *
 * Version 2 (2026-10-07): the GmbH's terms, adapted to the portal.
 * Version 3 (2026-11-18): the contracting party is now the Dubai FZCO. On
 * 20 Nov 2026 I2Go decided that no governing law or jurisdiction clause is
 * needed (P7), so § 12 keeps only the severability clause. Not yet
 * lawyer-reviewed.
 */
export const TERMS_VERSION = '3';
/** "As of" dates shown on the pages, per language. */
export const TERMS_DATE = { de: 'November 2026', en: 'November 2026' };
export const PRIVACY_DATE = { de: 'November 2026', en: 'November 2026' };

/** True for a value that is still a [bracketed] placeholder. */
export const isPlaceholder = (value) => typeof value === 'string' && value.startsWith('[');

export const COMPANY = {
    // As printed on the trade licence (licensee and trade name are the same).
    name: 'ITOOGO ALQWA HR CONSULTANCY - FZCO',
    nameAr: 'ايتوجو القوى لاستشارات الموارد البشرية - ش م ح',
    shortName: 'i2go',
    legalForm: { de: 'Free Zone Company (FZCO)', en: 'Free Zone Company (FZCO)' },
    // Registered office address, as confirmed by I2Go (18 Nov 2026). Matches
    // the IFZA unit lease (premises 80053-001, IFZA Business Park, Dubai
    // Digital Park) and the licence area (Dubai Silicon Oasis).
    addressLines: {
        de: ['OFFICE-80053-001, IFZA Business Park — DDP', 'Dubai', 'Vereinigte Arabische Emirate'],
        en: ['OFFICE-80053-001, IFZA Business Park — DDP', 'Dubai', 'United Arab Emirates'],
    },
    // Dubai Makani number from the unit lease; not shown on the pages.
    makani: 'A1 - 3641379065',
    // "First Manager" on the licence, written as printed there.
    manager: 'Sathish Kumar Maney Maney',
    licence: {
        number: '80053',
        issuer: {
            de: 'Dubai Integrated Economic Zones Authority (DIEZ)',
            en: 'Dubai Integrated Economic Zones Authority (DIEZ)',
        },
        freeZone: 'International Free Zone Authority (IFZA)',
        // The only licensed activity. It is not confirmed to cover recruitment
        // or placement (migration plan Q-UAE-5, Q-IFZA-1).
        activity: { de: 'Human Resources Consultancies (Personalberatung)', en: 'Human Resources Consultancies' },
    },
    // Not VAT-registered, so there is no TRN (confirmed by I2Go, 20 Nov 2026).
    // The legal notice leaves the line out while this is null.
    trn: null,
    // Confirmed by I2Go on 18 Nov 2026 (as shown on i2goalqwa.ae).
    email: 'info@i2goalqwa.ae',
    phone: '+971 8558 7747',
    privacyEmail: 'info@i2goalqwa.ae',
    // The company's own website (given by I2Go as official).
    website: 'i2goalqwa.ae',
    // Where this portal runs (confirmed by I2Go, 20 Nov 2026). Set SITE_URL to
    // https://i2go-jobportal.com in production (lib/seo/config.js).
    portalDomain: 'i2go-jobportal.com',
    // No data protection officer is required (I2Go, 20 Nov 2026). Stays null;
    // the privacy policy says none is appointed.
    dpo: null,
    // GDPR Art. 27 representative in the EU; required if the company has no
    // EU establishment (migration plan 3.B5). Null until appointed.
    euRepresentative: null,
    // Person responsible for content under § 18(2) MStV: the manager
    // (confirmed by I2Go, 20 Nov 2026), at the company address.
    contentResponsible: 'Sathish Kumar Maney Maney',
};

export const PROCESSORS = {
    supabaseRegion: '[REGION: Supabase project region, to be confirmed in the Supabase dashboard]',
    host: '[HOST: hosting provider and region]',
    indiaPartner: '[PARTNER: name of the partner in India]',
};

/** Legal pages linked from every page (10.10.3): [{ key, href }]; labels come from t.legal[key]. */
export const legalLinks = (lang) => ['impressum', 'privacy', 'terms'].map((key) => ({ key, href: `/${lang}/${key}` }));
