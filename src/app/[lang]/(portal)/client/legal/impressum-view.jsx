import { getDictionary } from '@/lib/i18n/dictionaries';
import { COMPANY, isPlaceholder } from '@/lib/portal/legal';
import LegalDocument, { LegalSection } from './legal-document';

// Impressum / legal notice. Details come from lib/portal/legal.js, taken from
// the operator's UAE trade licence (LEGAL_COMPLIANCE_MIGRATION_PLAN.md,
// section 2). Whether § 5 DDG binds a provider based outside the EU is open
// (plan Q-DE-7); the page gives the § 5 details anyway, as recommended there.
// The note about the EU online dispute resolution platform stays out: the
// platform closed in 2025.

const TEXT = {
    de: {
        asOf: 'Anbieterkennzeichnung (§ 5 Digitale-Dienste-Gesetz)',
        provider: 'Anbieter',
        legalForm: 'Rechtsform',
        representedBy: 'Vertreten durch den Geschäftsführer (Manager)',
        contact: 'Kontakt',
        phone: 'Telefon',
        email: 'E-Mail',
        licence: 'Handelslizenz',
        licenceNumber: 'Lizenznummer',
        issuer: 'Ausstellende Behörde',
        freeZone: 'Freihandelszone',
        activity: 'Lizenzierte Tätigkeit',
        tax: 'Steuer-Registrierungsnummer (TRN, VAE)',
        content: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
        euRep: 'Vertreter in der EU (Art. 27 DSGVO)',
        euRepPending: '[EU-VERTRETER: Name und Anschrift, sobald benannt]',
        dpo: 'Datenschutzbeauftragter',
        disputesTitle: 'Verbraucherstreitbeilegung',
        disputes: 'Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
        liabilityTitle: 'Haftung für Inhalte und Links',
        liability: 'Wir sind für eigene Inhalte nach den allgemeinen Gesetzen verantwortlich. Kandidatenprofile werden von den Kandidatinnen und Kandidaten selbst in der App „I2Go Portal“ erstellt; Anfragen stammen von Arbeitgebern, die für deren Inhalt selbst verantwortlich sind. Bei Bekanntwerden von Rechtsverletzungen entfernen wir solche Inhalte umgehend. Für Inhalte verlinkter externer Seiten sind ausschließlich deren Betreiber verantwortlich.',
    },
    en: {
        asOf: 'Provider information (§ 5 German Digital Services Act, DDG)',
        provider: 'Provider',
        legalForm: 'Legal form',
        representedBy: 'Represented by the manager',
        contact: 'Contact',
        phone: 'Phone',
        email: 'Email',
        licence: 'Trade licence',
        licenceNumber: 'Licence number',
        issuer: 'Issuing authority',
        freeZone: 'Free zone',
        activity: 'Licensed activity',
        tax: 'Tax registration number (TRN, UAE)',
        content: 'Responsible for content (§ 18(2) MStV)',
        euRep: 'Representative in the EU (Art. 27 GDPR)',
        euRepPending: '[EU REPRESENTATIVE: name and address once appointed]',
        dpo: 'Data protection officer',
        disputesTitle: 'Consumer dispute resolution',
        disputes: 'We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.',
        liabilityTitle: 'Liability for content and links',
        liability: 'We are responsible for our own content under the general laws. Candidates write their own profiles in the I2Go Portal app; enquiries come from employers, who are responsible for what they write. If we become aware of unlawful content, we remove it promptly. The operators of linked external sites are solely responsible for their content.',
    },
};

/** An email address as a mailto link, or the placeholder as plain text. */
function Email({ value }) {
    return isPlaceholder(value) ? value : <a href={`mailto:${value}`}>{value}</a>;
}

/** Impressum / legal notice. */
export default function ImpressumView({ lang }) {
    const x = TEXT[lang] ?? TEXT.de;
    const l = lang === 'en' ? 'en' : 'de';
    return (
        <LegalDocument lang={lang} notice={getDictionary(lang).legal.germanPrevails} title="Impressum" asOf={x.asOf}>
            <LegalSection id="provider" title={x.provider}>
                <address>
                    {COMPANY.name}<br />
                    <span lang="ar" dir="rtl">{COMPANY.nameAr}</span><br />
                    {COMPANY.addressLines[l].map((line, i, all) => <span key={line}>{line}{i < all.length - 1 && <br />}</span>)}
                </address>
                <p>
                    {x.legalForm}: {COMPANY.legalForm[l]}<br />
                    {x.representedBy}: {COMPANY.manager}
                </p>
            </LegalSection>

            <LegalSection id="contact" title={x.contact}>
                <p>
                    {x.phone}: {COMPANY.phone}<br />
                    {x.email}: <Email value={COMPANY.email} />
                </p>
            </LegalSection>

            <LegalSection id="licence" title={x.licence}>
                <p>
                    {x.licenceNumber}: {COMPANY.licence.number}<br />
                    {x.issuer}: {COMPANY.licence.issuer[l]}<br />
                    {x.freeZone}: {COMPANY.licence.freeZone}<br />
                    {x.activity}: {COMPANY.licence.activity[l]}
                    {COMPANY.trn && <><br />{x.tax}: {COMPANY.trn}</>}
                </p>
            </LegalSection>

            <LegalSection id="eu-representative" title={x.euRep}>
                <p>{COMPANY.euRepresentative ?? x.euRepPending}</p>
            </LegalSection>

            <LegalSection id="content" title={x.content}>
                <address>
                    {COMPANY.contentResponsible}<br />
                    {COMPANY.addressLines[l].map((line, i, all) => <span key={line}>{line}{i < all.length - 1 && <br />}</span>)}
                </address>
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
