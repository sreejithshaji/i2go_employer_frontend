// Legal details shown on the Impressum, privacy and terms pages (PLAN.md 10.7,
// 10.9, 10.10). Filled from I2Go's documents in documents/ (2026-10-07).
// Values in [brackets] are still missing: fill them in here once I2Go
// confirms them (10.10.1), and have the texts checked by the lawyer (10.15).

/**
 * Version of the employer terms of use. Stored on public.users at signup
 * (terms_version) and when an employer accepts them from the portal. Bump it
 * when the terms change: employers on an older version are asked to accept
 * again, and see only the teaser until they do.
 *
 * Version 2 (2026-10-07): the terms from documents/4 Nutzungsbedingungen
 * Arbeitgeber.docx, adapted to the portal.
 */
export const TERMS_VERSION = '2';
/** "As of" dates shown on the pages, per language. */
export const TERMS_DATE = { de: 'Oktober 2026', en: 'October 2026' };
export const PRIVACY_DATE = { de: 'Oktober 2026', en: 'October 2026' };

export const COMPANY = {
    // documents/ give "i2GO Personal Management, Indian Ocean GmbH". [I2GO:
    // confirm the exact name as registered (one GmbH with a trading name?).]
    name: 'i2GO Personal Management, Indian Ocean GmbH',
    shortName: 'i2go',
    street: 'Hafenweg 11a',
    city: '48155 Münster',
    country: { de: 'Deutschland', en: 'Germany' },
    managingDirectors: 'Dr. Sathish Kumar Maney',
    registerCourt: 'Amtsgericht Münster',
    registerNumber: '[HRB …]',
    vatId: '[DE …]',
    email: 'info@i2go-europe.de',
    phone: '02382 7728895',
    privacyEmail: 'datenschutz@i2go-europe.de',
    website: 'i2go-europe.de',
    // The documents name the managing director as data protection officer,
    // which Art. 38(6) GDPR doesn't allow. Set this once an officer is
    // appointed, or leave it null if none is required (10.12.3).
    dpo: null,
    jurisdiction: 'Münster',
    supervisoryAuthority: {
        name: 'Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)',
        address: 'Kavalleriestraße 2–4, 40213 Düsseldorf',
        url: 'https://www.ldi.nrw.de',
    },
};

export const PROCESSORS = {
    supabaseRegion: '[REGION: Supabase project region, e.g. EU (Frankfurt)]',
    host: '[HOST: hosting provider and region]',
    indiaPartner: '[PARTNER: name of the partner in India]',
};

/** Legal pages linked from every page (10.10.3): [{ key, href }]; labels come from t.legal[key]. */
export const legalLinks = (lang) => ['impressum', 'privacy', 'terms'].map((key) => ({ key, href: `/${lang}/${key}` }));
