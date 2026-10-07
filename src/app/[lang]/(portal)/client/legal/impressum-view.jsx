import { getDictionary } from '@/lib/i18n/dictionaries';
import { COMPANY } from '@/lib/portal/legal';
import LegalDocument, { LegalSection } from './legal-document';

// Impressum (§5 DDG), from documents/7 Impressum.docx. Details come from
// lib/portal/legal.js (PLAN.md 10.10). The old note about the EU online
// dispute resolution platform is left out on purpose: the platform closed in 2025.

const TEXT = {
    de: {
        asOf: 'Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)',
        provider: 'Anbieter',
        representedBy: 'Vertreten durch den Geschäftsführer',
        contact: 'Kontakt',
        phone: 'Telefon',
        email: 'E-Mail',
        register: 'Registereintrag',
        registerCourt: 'Registergericht',
        registerNumber: 'Registernummer',
        vat: 'Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG',
        content: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
        addressAsAbove: 'Anschrift wie oben',
        dpo: 'Datenschutzbeauftragter',
        disputesTitle: 'Verbraucherstreitbeilegung',
        disputes: 'Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
        liabilityTitle: 'Haftung für Inhalte und Links',
        liability: 'Wir sind für eigene Inhalte nach den allgemeinen Gesetzen verantwortlich. Kandidatenprofile werden von den Kandidatinnen und Kandidaten selbst in der App „I2Go Portal“ erstellt; Anfragen stammen von Arbeitgebern, die für deren Inhalt selbst verantwortlich sind. Bei Bekanntwerden von Rechtsverletzungen entfernen wir solche Inhalte umgehend. Für Inhalte verlinkter externer Seiten sind ausschließlich deren Betreiber verantwortlich.',
    },
    en: {
        asOf: 'Information according to § 5 Digital Services Act (DDG)',
        provider: 'Provider',
        representedBy: 'Represented by the managing director',
        contact: 'Contact',
        phone: 'Phone',
        email: 'Email',
        register: 'Commercial register',
        registerCourt: 'Register court',
        registerNumber: 'Register number',
        vat: 'VAT identification number (§ 27a UStG)',
        content: 'Responsible for content (§ 18(2) MStV)',
        addressAsAbove: 'address as above',
        dpo: 'Data protection officer',
        disputesTitle: 'Consumer dispute resolution',
        disputes: 'We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.',
        liabilityTitle: 'Liability for content and links',
        liability: 'We are responsible for our own content under the general laws. Candidates write their own profiles in the I2Go Portal app; enquiries come from employers, who are responsible for what they write. If we become aware of unlawful content, we remove it promptly. The operators of linked external sites are solely responsible for their content.',
    },
};

/** Impressum (§5 DDG). */
export default function ImpressumView({ lang }) {
    const x = TEXT[lang] ?? TEXT.de;
    return (
        <LegalDocument lang={lang} notice={getDictionary(lang).legal.germanPrevails} title="Impressum" asOf={x.asOf}>
            <LegalSection id="provider" title={x.provider}>
                <address>
                    {COMPANY.name}<br />
                    {COMPANY.street}<br />
                    {COMPANY.city}<br />
                    {COMPANY.country[lang] ?? COMPANY.country.de}
                </address>
                <p>{x.representedBy}: {COMPANY.managingDirectors}</p>
            </LegalSection>

            <LegalSection id="contact" title={x.contact}>
                <p>
                    {x.phone}: {COMPANY.phone}<br />
                    {x.email}: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                </p>
            </LegalSection>

            <LegalSection id="register" title={x.register}>
                <p>
                    {x.registerCourt}: {COMPANY.registerCourt}<br />
                    {x.registerNumber}: {COMPANY.registerNumber}<br />
                    {x.vat}: {COMPANY.vatId}
                </p>
            </LegalSection>

            <LegalSection id="content" title={x.content}>
                <p>{COMPANY.managingDirectors}, {x.addressAsAbove}</p>
            </LegalSection>

            {COMPANY.dpo && (
                <LegalSection id="dpo" title={x.dpo}>
                    <p>{COMPANY.dpo}</p>
                </LegalSection>
            )}

            <LegalSection id="disputes" title={x.disputesTitle}>
                <p>{x.disputes}</p>
            </LegalSection>

            <LegalSection id="liability" title={x.liabilityTitle}>
                <p>{x.liability}</p>
            </LegalSection>
        </LegalDocument>
    );
}
