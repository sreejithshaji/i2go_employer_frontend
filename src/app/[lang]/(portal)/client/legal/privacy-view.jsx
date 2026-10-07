import { Box } from '@mui/material';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { PRIVACY_DATE } from '@/lib/portal/legal';
import LegalDocument from './legal-document';
import { PrivacyDe, PrivacyEn } from './privacy-text';

/** Privacy policy for the portal and the app (PLAN.md 10.9, 10.17); the text is in privacy-text.jsx. */
export default function PrivacyView({ lang }) {
    const en = lang === 'en';
    const Body = en ? PrivacyEn : PrivacyDe;
    return (
        <LegalDocument
            lang={lang}
            notice={getDictionary(lang).legal.germanPrevails}
            title={en ? 'Privacy policy – i2go job portal' : 'Datenschutzerklärung – i2go Jobportal'}
            asOf={en ? `Last updated: ${PRIVACY_DATE.en}` : `Stand: ${PRIVACY_DATE.de}`}
        >
            <Body lang={lang} />
            <Box sx={{ height: 4 }} />
        </LegalDocument>
    );
}
