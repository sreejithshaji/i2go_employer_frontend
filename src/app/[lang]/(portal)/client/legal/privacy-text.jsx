import NextLink from 'next/link';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { COMPANY, PROCESSORS } from '@/lib/portal/legal';
import { tokens } from '@/app/theme';
import { LegalSection } from './legal-document';

// Privacy policy for the whole service: the portal (visitors, employers) and
// the I2Go Portal app (candidates). Based on documents/1 Datenschutzerklärung
// (German, binding) and documents/2 Privacy Policy (EN), corrected to what the
// app and portal actually do; the differences are listed in
// legal/LAWYER_BRIEF.md. mobile_app/PRIVACY_POLICY.md points here, and the
// app links to /en/privacy once AppLinks.privacyPolicyUrl is set.
//
// Keep the browser storage table in step with the code: features/auth
// (Supabase session cookies) and
// app/(portal)/client/candidate-profile/enquiry-storage.js (PLAN.md 10.11).

const STORAGE = {
    de: {
        head: ['Name', 'Inhalt', 'Wann', 'Dauer', 'Grund'],
        rows: [
            ['sb-…-auth-token (Cookie, ggf. geteilt in .0, .1)', 'Ihre Anmeldung: Zugangs- und Aktualisierungs-Token.', 'Nur nach der Anmeldung.', 'Bis zur Abmeldung oder bis die Sitzung abläuft.', 'Unbedingt erforderlich, um Sie angemeldet zu halten (§ 25 Abs. 2 Nr. 2 TDDDG).'],
            ['i2go.enquiriesSent (Local Storage)', 'Die Kandidaten, zu denen Sie aus diesem Browser eine Anfrage gesendet haben, mit Uhrzeit.', 'Nach dem Senden einer Anfrage.', '24 Stunden je Eintrag.', 'Unbedingt erforderlich, damit dieselbe Anfrage nicht doppelt gesendet wird (§ 25 Abs. 2 Nr. 2 TDDDG).'],
        ],
    },
    en: {
        head: ['Name', 'What it holds', 'When', 'Kept', 'Why'],
        rows: [
            ['sb-…-auth-token (cookie, may be split into .0, .1)', 'Your sign-in session: access and refresh token.', 'Only after you sign in.', 'Until you sign out or the session expires.', 'Strictly necessary to keep you signed in (§ 25(2) no. 2 TDDDG).'],
            ['i2go.enquiriesSent (local storage)', 'The candidates you sent an enquiry about from this browser, with the time.', 'After you send an enquiry.', '24 hours per entry.', 'Strictly necessary to stop the same enquiry being sent twice (§ 25(2) no. 2 TDDDG).'],
        ],
    },
};

function StorageTable({ lang }) {
    const { head, rows } = STORAGE[lang] ?? STORAGE.de;
    return (
        <TableContainer sx={{ mb: 2, border: `1px solid ${tokens.border}`, borderRadius: `${tokens.radiusMd}px` }}>
            <Table size="small">
                <TableHead>
                    <TableRow>{head.map((h) => <TableCell key={h}>{h}</TableCell>)}</TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(([name, ...cells]) => (
                        <TableRow key={name} sx={{ verticalAlign: 'top' }}>
                            <TableCell sx={{ fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-word' }}>{name}</TableCell>
                            {cells.map((c) => <TableCell key={c}>{c}</TableCell>)}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function Mail() {
    return <a href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a>;
}

function Controller({ lang }) {
    return (
        <address>
            {COMPANY.name}<br />
            {COMPANY.street}<br />
            {COMPANY.city}, {COMPANY.country[lang] ?? COMPANY.country.de}<br />
            {lang === 'en' ? 'Managing director' : 'Geschäftsführer'}: {COMPANY.managingDirectors}<br />
            {lang === 'en' ? 'Email' : 'E-Mail'}: <Mail /><br />
            {lang === 'en' ? 'Phone' : 'Telefon'}: {COMPANY.phone}
        </address>
    );
}

export function PrivacyDe({ lang }) {
    const authority = COMPANY.supervisoryAuthority;
    return (
        <>
            <LegalSection id="controller" title="1. Verantwortlicher">
                <Controller lang={lang} />
            </LegalSection>

            <LegalSection id="dpo" title="2. Datenschutzbeauftragter">
                {COMPANY.dpo
                    ? <p>{COMPANY.dpo}</p>
                    : <p>[DSB: Kontaktdaten des Datenschutzbeauftragten eintragen, sobald einer benannt ist; ist keiner erforderlich, entfällt dieser Abschnitt (PLAN.md 10.12.3). Der Geschäftsführer kann diese Aufgabe nicht übernehmen.]</p>}
            </LegalSection>

            <LegalSection id="overview" title="3. Überblick">
                <p>
                    Über die App „I2Go Portal“ können sich Arbeitsuchende, insbesondere aus Indien, registrieren und ein Bewerberprofil
                    anlegen („Kandidaten“). Mit ihrer Einwilligung erscheint das Profil im Arbeitgeberportal auf {COMPANY.website}
                    („Portal“). Arbeitgeber in Deutschland können dort Profile ansehen und i2go eine Anfrage senden. Wir vermitteln
                    geeignete Bewerber an Arbeitgeber und unterstützen bei Visum, Aufenthaltstitel und Anerkennung von Qualifikationen.
                    Diese Erklärung informiert gemäß Art. 13 und 14 DSGVO darüber, welche Daten wir verarbeiten.
                </p>
            </LegalSection>

            <LegalSection id="visiting" title="4. Aufruf der Website und Server-Logfiles">
                <p>
                    Beim Besuch des Portals verarbeitet unser Hosting-Anbieter automatisch IP-Adresse, Datum und Uhrzeit, aufgerufene
                    Seite, Browser und Betriebssystem. Zweck ist die sichere und stabile Bereitstellung der Website. Rechtsgrundlage ist
                    Art. 6 Abs. 1 lit. f DSGVO. Die Logfiles werden nach spätestens 7 Tagen gelöscht. [HOST: Frist beim Anbieter bestätigen.]
                </p>
                <p>
                    Hosting-Anbieter: {PROCESSORS.host}. Mit dem Anbieter besteht ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO.
                    Schriftarten werden vom Portal selbst ausgeliefert; es werden keine Inhalte von Google geladen. Wir setzen keine
                    Analyse- oder Werbewerkzeuge ein.
                </p>
            </LegalSection>

            <LegalSection id="candidates" title="5. Registrierung und Bewerberprofil (App)">
                <p>Die App richtet sich an Personen ab 18 Jahren.</p>
                <p>
                    <strong>Verarbeitete Daten:</strong> E-Mail-Adresse, Passwort (nur als sicherer Hash gespeichert), Name, Geburtsdatum,
                    Geschlecht, Telefonnummer, Reisepassnummer (freiwillig), Berufserfahrung und Kurzbeschreibung, gewünschte Berufe,
                    Kenntnisse, Ausbildung, beruflicher Werdegang, Sprachkenntnisse (z. B. Deutsch B1), Lichtbild und Vorstellungsvideo
                    (freiwillig; Bild und Stimme). i2go ergänzt den Prüfstatus, eine Registernummer, ein Startdatum und interne Notizen.
                    Im weiteren Vermittlungsverfahren können wir weitere Unterlagen anfordern, z. B. Lebenslauf, Zeugnisse und Abschlüsse,
                    Führerscheine und Zertifikate, Anschrift, Staatsangehörigkeit, gewünschten Einsatzort und Verfügbarkeit.
                </p>
                <p>
                    <strong>Zwecke:</strong> Erstellung des Profils, Suche nach passenden Stellen, Vermittlung an Arbeitgeber,
                    Vorbereitung von Visum und Arbeitserlaubnis.
                </p>
                <p>
                    <strong>Rechtsgrundlagen:</strong> Art. 6 Abs. 1 lit. b DSGVO (Durchführung des Vermittlungsvertrags bzw.
                    vorvertragliche Maßnahmen auf Ihre Anfrage) und Art. 6 Abs. 1 lit. a DSGVO (Ihre Einwilligung, insbesondere für die
                    Veröffentlichung im Portal und die Weitergabe an Arbeitgeber).
                </p>
                <p>
                    <strong>Besondere Kategorien:</strong> Bitte machen Sie keine Angaben zu Religion, Kaste, Gesundheit, politischer
                    Meinung oder Familienstand, auch nicht in Ihrer Kurzbeschreibung. Diese Angaben sind für die Vermittlung nicht
                    erforderlich. Sollten sie dennoch in Unterlagen enthalten sein, verarbeiten wir sie nur auf Grundlage Ihrer
                    ausdrücklichen Einwilligung (Art. 9 Abs. 2 lit. a DSGVO) und geben sie nicht an Arbeitgeber weiter.
                </p>
                <p>
                    <strong>Einwilligungsnachweis:</strong> Für jede Einwilligung speichern wir Ihr Konto, die Art der Einwilligung, die
                    Version des Einwilligungstexts, Datum und Uhrzeit sowie, soweit übermittelt, die IP-Adresse (Art. 6 Abs. 1 lit. c
                    i. V. m. Art. 7 Abs. 1 DSGVO).
                </p>
                <p>
                    <strong>Berechtigungen der App:</strong> Kamera und Mikrofon nur, wenn Sie ein Foto aufnehmen oder ein Video
                    aufzeichnen; Fotos und Medien nur, wenn Sie eine Datei auswählen. Die App nutzt keine Analyse-, Werbe- oder
                    Ortungsdienste.
                </p>
            </LegalSection>

            <LegalSection id="publication" title="6. Veröffentlichung im Portal und Weitergabe an Arbeitgeber">
                <p>
                    Ihr Profil erscheint im Portal nur, wenn es vollständig ist, Sie der Veröffentlichung in der App zugestimmt haben und
                    i2go es nicht abgelehnt hat. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
                </p>
                <ul>
                    <li><strong>Alle Besucher</strong> sehen ein gekürztes Profil: Vorname und Initial des Nachnamens, Berufserfahrung, Kurzbeschreibung, Berufe, Kenntnisse, Sprachen, Positionen und Zeiträume der Berufserfahrung (ohne Arbeitgeber) und Abschlüsse (ohne Schule oder Hochschule), sowie ob i2go das Profil geprüft hat.</li>
                    <li><strong>Angemeldete Arbeitgeber, die unsere Nutzungsbedingungen akzeptiert haben,</strong> sehen zusätzlich den vollständigen Namen, eine Altersgruppe (z. B. 25–34), Foto, Vorstellungsvideo sowie frühere Arbeitgeber und Ausbildungsstätten.</li>
                    <li><strong>Nie im Portal:</strong> E-Mail-Adresse, Telefonnummer, Reisepassnummer, Geburtsdatum, Geschlecht, Registernummer und interne Notizen. Profilseiten werden nicht in Suchmaschinen aufgenommen.</li>
                </ul>
                <p>
                    Sie können die Veröffentlichung jederzeit in der App beenden („Profil für Arbeitgeber anzeigen“ ausschalten); das
                    Profil verschwindet sofort aus dem Portal. Ändern wir, was das Portal zeigt, fragt die App erneut nach Ihrer Einwilligung.
                </p>
                <p>
                    Ihren vollständigen Lebenslauf und Ihre Kontaktdaten übermitteln wir erst an einen konkreten Arbeitgeber, nachdem Sie
                    dieser Weitergabe zugestimmt haben. Der Arbeitgeber ist für die weitere Verarbeitung selbst verantwortlich und ist
                    vertraglich verpflichtet, Ihre Daten nur für das Bewerbungsverfahren zu nutzen. Über Anfragen von Arbeitgebern
                    informieren wir Sie in der App; dort sehen Sie die Stellenbezeichnung und eine Nachricht von i2go, nicht aber den
                    Arbeitgeber.
                </p>
            </LegalSection>

            <LegalSection id="passport" title="7. Reisepass- und Ausweisdaten">
                <p>
                    Ihre Reisepassnummer und, im Visumverfahren, eine Reisepasskopie verarbeiten wir ausschließlich zur Vorbereitung von
                    Visum, Aufenthaltstitel und Arbeitsvertrag. Sie sind nur für berechtigte Mitarbeiter von i2go sichtbar und werden nicht
                    im Portal veröffentlicht. An Arbeitgeber geben wir Passdaten nur weiter, wenn dies für den Arbeitsvertrag oder das
                    Visumverfahren erforderlich ist und Sie zugestimmt haben. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b und lit. a DSGVO.
                </p>
            </LegalSection>

            <LegalSection id="authorities" title="8. Weitergabe an Behörden und weitere Empfänger">
                <p>
                    Soweit für Ihre Einreise und Beschäftigung erforderlich, übermitteln wir Daten an: die deutsche Auslandsvertretung
                    (Botschaft/Konsulat), die zuständige Ausländerbehörde, die Bundesagentur für Arbeit, Anerkennungsstellen für
                    ausländische Abschlüsse sowie Sprach- und Prüfungsinstitute. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b und c DSGVO.
                </p>
            </LegalSection>

            <LegalSection id="employers" title="9. Arbeitgeberkonten">
                <p>
                    Für Arbeitgeber verarbeiten wir Name, geschäftliche E-Mail-Adresse, Passwort (nur als sicherer Hash), die akzeptierte
                    Fassung der Nutzungsbedingungen mit Zeitpunkt, die Merkliste und die gesendeten Anfragen, zur Bereitstellung des Kontos
                    und zur Vertragsabwicklung (Art. 6 Abs. 1 lit. b DSGVO). Zur Prüfung des Unternehmens können wir Firmenname, Anschrift,
                    Ansprechpartner und einen Registerauszug anfordern (Art. 6 Abs. 1 lit. f DSGVO).
                </p>
                <p>
                    <strong>Zugriffsprotokoll:</strong> Zum Schutz der Bewerber vor massenhaftem Kopieren protokollieren wir jeden Abruf
                    vollständiger Profile mit Konto, Uhrzeit und Anzahl der Profile. Das Protokoll wird nach 30 Tagen gelöscht
                    (Art. 6 Abs. 1 lit. f DSGVO; unser Interesse ist der Schutz der Bewerberdaten).
                </p>
            </LegalSection>

            <LegalSection id="enquiries" title="10. Anfragen von Arbeitgebern">
                <p>
                    Mit einer Anfrage verarbeiten wir Name, Unternehmen, E-Mail, Telefon, Stellenbezeichnung, Einsatzort und Nachricht,
                    den betreffenden Kandidaten und den Zeitpunkt, damit i2go die Anfrage prüfen und den Kontakt herstellen kann
                    (Art. 6 Abs. 1 lit. b DSGVO). Zum Schutz vor Missbrauch speichern wir einen Einweg-Hash Ihrer IP-Adresse, nie die
                    Adresse selbst (Art. 6 Abs. 1 lit. f DSGVO). Der Kandidat sieht weder Ihren Namen noch Ihr Unternehmen oder Ihre
                    Kontaktdaten.
                </p>
            </LegalSection>

            <LegalSection id="contact" title="11. Kontakt per E-Mail oder Formular">
                <p>
                    Wenn Sie uns kontaktieren, verarbeiten wir Ihre Angaben zur Bearbeitung der Anfrage (Art. 6 Abs. 1 lit. b oder f
                    DSGVO). Die Daten werden gelöscht, sobald die Anfrage erledigt ist und keine Aufbewahrungspflichten bestehen.
                </p>
            </LegalSection>

            <LegalSection id="storage" title="12. Cookies und Speicher im Browser">
                <p>
                    Das Portal speichert nur, was für den von Ihnen gewünschten Dienst unbedingt erforderlich ist (§ 25 Abs. 2 TDDDG).
                    Weitere Cookies, z. B. für Statistik, setzen wir nicht ein; deshalb gibt es kein Cookie-Banner.
                </p>
                <StorageTable lang={lang} />
            </LegalSection>

            <LegalSection id="processors" title="13. Technische Dienstleister">
                <ul>
                    <li><strong>Supabase</strong> (Supabase Inc.): Datenbank, Anmeldung und Dateispeicher für App und Portal. {PROCESSORS.supabaseRegion}.</li>
                    <li><strong>Hosting des Portals</strong>: {PROCESSORS.host}.</li>
                    <li>[E-MAIL: Anbieter für Anmelde- und Passwort-E-Mails, sobald eingerichtet.]</li>
                </ul>
                <p>Diese Dienstleister verarbeiten Daten in unserem Auftrag nach Art. 28 DSGVO.</p>
            </LegalSection>

            <LegalSection id="transfers" title="14. Übermittlung in Drittländer">
                <p>
                    Zur Betreuung von Bewerbern in Indien hat {PROCESSORS.indiaPartner} Zugriff auf Bewerberdaten. Für Indien besteht
                    kein Angemessenheitsbeschluss der EU-Kommission. Die Übermittlung erfolgt auf Grundlage von EU-Standardvertragsklauseln
                    (Art. 46 Abs. 2 lit. c DSGVO). Eine Kopie können Sie unter <Mail /> anfordern.
                </p>
                <p>
                    Soweit Dienstleister nach Abschnitt 13 ihren Sitz in den USA haben, stützt sich die Übermittlung auf
                    [ANWALT: EU-US Data Privacy Framework oder Standardvertragsklauseln].
                </p>
            </LegalSection>

            <LegalSection id="retention" title="15. Speicherdauer">
                <ul>
                    <li>Bewerberprofil: bis zum Abschluss des Vermittlungsverfahrens, danach 6 Monate zur Abwehr möglicher Ansprüche (§ 15 Abs. 4 AGG). Sie können Ihr Konto jederzeit in der App löschen; Profil, Fotos und Videos werden dann sofort gelöscht.</li>
                    <li>Talentpool: 24 Monate nach Ihrer letzten Aktivität, nur mit Ihrer Einwilligung.</li>
                    <li>Reisepassdaten: Löschung spätestens 6 Monate nach Abschluss oder Abbruch des Visumverfahrens.</li>
                    <li>Anfragen von Arbeitgebern: 24 Monate nach der letzten Änderung. Nach Löschung eines Kandidatenkontos bleiben sie ohne Bezug zur Person erhalten.</li>
                    <li>Arbeitgeberkonto: 12 Monate nach der letzten Aktivität oder nach Kündigung.</li>
                    <li>Zugriffsprotokoll der Arbeitgeber: 30 Tage.</li>
                    <li>Einwilligungsnachweise: 3 Jahre nach Ende der Einwilligung (§ 195 BGB).</li>
                    <li>Server-Logfiles: 7 Tage.</li>
                    <li>Rechnungs- und Vertragsunterlagen: 6 bzw. 10 Jahre (§ 257 HGB, § 147 AO).</li>
                </ul>
            </LegalSection>

            <LegalSection id="rights" title="16. Ihre Rechte">
                <p>
                    Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der
                    Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21 DSGVO). Eine erteilte Einwilligung
                    können Sie jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO), z. B. per E-Mail an <Mail /> oder
                    in Ihrem Konto. Ihr Profil können Sie in der App selbst bearbeiten und Ihr Konto unter Einstellungen → Konto löschen
                    selbst löschen.
                </p>
            </LegalSection>

            <LegalSection id="complaints" title="17. Beschwerderecht">
                <p>
                    Sie können sich bei einer Datenschutz-Aufsichtsbehörde beschweren. Für uns zuständig ist: {authority.name},
                    {' '}{authority.address}, <a href={authority.url}>{authority.url.replace('https://', '')}</a>.
                </p>
            </LegalSection>

            <LegalSection id="required" title="18. Pflicht zur Bereitstellung">
                <p>
                    Die Bereitstellung Ihrer Daten ist freiwillig. Ohne Profil und Kontaktdaten können wir Sie jedoch nicht vermitteln.
                    Ohne Reisepassdaten ist kein Visumverfahren möglich. Wir verlangen von Arbeitsuchenden keine Vermittlungsgebühr.
                    [I2GO: bestätigen.]
                </p>
            </LegalSection>

            <LegalSection id="automated" title="19. Keine automatisierte Entscheidung">
                <p>
                    Wir treffen keine ausschließlich automatisierten Entscheidungen im Sinne von Art. 22 DSGVO. Die Auswahl geeigneter
                    Bewerber erfolgt durch unsere Mitarbeiter.
                </p>
            </LegalSection>

            <LegalSection id="changes" title="20. Änderungen">
                <p>
                    Wir passen diese Erklärung an, wenn sich Portal, App oder Rechtslage ändern. Es gilt die jeweils auf der Website
                    veröffentlichte Fassung. Siehe auch die <NextLink href={`/${lang}/terms`}>Nutzungsbedingungen für Arbeitgeber</NextLink>
                    {' '}und das <NextLink href={`/${lang}/impressum`}>Impressum</NextLink>.
                </p>
            </LegalSection>
        </>
    );
}

export function PrivacyEn({ lang }) {
    const authority = COMPANY.supervisoryAuthority;
    return (
        <>
            <LegalSection id="controller" title="1. Who is responsible">
                <Controller lang={lang} />
            </LegalSection>

            <LegalSection id="dpo" title="2. Data protection officer">
                {COMPANY.dpo
                    ? <p>{COMPANY.dpo}</p>
                    : <p>[DPO: add the data protection officer’s contact details once appointed; if none is required, this section goes (PLAN.md 10.12.3). The managing director can’t take this role.]</p>}
            </LegalSection>

            <LegalSection id="overview" title="3. What this service does">
                <p>
                    Job seekers, mainly from India, create a profile in the I2Go Portal app (“candidates”). With their consent, the profile
                    appears on the employer portal at {COMPANY.website} (“portal”), where employers in Germany can view profiles and send
                    i2go an enquiry. We match suitable candidates with employers and help with visa, residence permit and recognition of
                    qualifications. This policy explains what data we process (Art. 13 and 14 GDPR).
                </p>
            </LegalSection>

            <LegalSection id="visiting" title="4. Visiting the website and server logs">
                <p>
                    When you visit the portal, our hosting provider automatically processes your IP address, date and time, the page
                    requested, your browser and operating system, to deliver the website securely and reliably (Art. 6(1)(f) GDPR). Logs
                    are deleted after 7 days at the latest. [HOST: confirm the period with the provider.]
                </p>
                <p>
                    Hosting provider: {PROCESSORS.host}, under a data processing agreement (Art. 28 GDPR). Fonts are served from the portal
                    itself; nothing is loaded from Google. We don’t use analytics or advertising tools.
                </p>
            </LegalSection>

            <LegalSection id="candidates" title="5. Registration and candidate profile (app)">
                <p>The app is for people aged 18 or over.</p>
                <p>
                    <strong>Data:</strong> email address, password (stored only as a secure hash), name, date of birth, gender, phone
                    number, passport number (optional), years of experience and a short bio, preferred occupations, skills, education, work
                    history, language skills (e.g. German B1), photo and intro video (optional; face and voice). i2go adds the review
                    status, a registration number, a start date and internal notes. Later in the placement process we may ask for more
                    documents, such as your CV, certificates and degrees, driving licences, address, nationality, preferred work location
                    and availability.
                </p>
                <p>
                    <strong>Why:</strong> to create your profile, find suitable jobs, introduce you to employers and prepare your visa and
                    work permit.
                </p>
                <p>
                    <strong>Legal basis:</strong> Art. 6(1)(b) GDPR (the placement contract, or steps at your request before it) and
                    Art. 6(1)(a) GDPR (your consent, in particular to publication on the portal and sharing with employers).
                </p>
                <p>
                    <strong>Sensitive data:</strong> please don’t give information about religion, caste, health, political views or
                    marital status, including in your bio. Employers don’t need it. If documents still contain it, we process it only with
                    your explicit consent (Art. 9(2)(a) GDPR) and never share it with employers.
                </p>
                <p>
                    <strong>Consent records:</strong> for each consent we store your account, the type of consent, the version of the text,
                    the date and time and, where transmitted, the IP address (Art. 6(1)(c) with Art. 7(1) GDPR).
                </p>
                <p>
                    <strong>App permissions:</strong> camera and microphone only when you take a photo or record a video; photos and media
                    only when you pick a file. The app uses no analytics, advertising or location services.
                </p>
            </LegalSection>

            <LegalSection id="publication" title="6. Publication on the portal and sharing with employers">
                <p>
                    Your profile appears on the portal only when it is complete, you have agreed to publication in the app, and i2go has
                    not rejected it. The legal basis is your consent (Art. 6(1)(a) GDPR).
                </p>
                <ul>
                    <li><strong>All visitors</strong> see a short version: first name and last-name initial, years of experience, bio, occupations, skills, languages, job titles and dates (without employers) and qualifications (without school or university), and whether i2go has reviewed the profile.</li>
                    <li><strong>Signed-in employers who accepted our terms of use</strong> also see your full name, an age range (e.g. 25–34), photo, intro video, and past employers and places of education.</li>
                    <li><strong>Never on the portal:</strong> email, phone number, passport number, date of birth, gender, registration number and internal notes. Profile pages are not listed in search engines.</li>
                </ul>
                <p>
                    You can stop publication at any time in the app (turn off “Show my profile to employers”); your profile leaves the
                    portal straight away. If we change what the portal shows, the app asks for your consent again.
                </p>
                <p>
                    We send your full CV and contact details to a specific employer only after you agree to it. The employer is then
                    responsible for that data and is contractually bound to use it only for the application. When an employer is
                    interested, the app shows you the job title and a note from i2go, but not the employer.
                </p>
            </LegalSection>

            <LegalSection id="passport" title="7. Passport data">
                <p>
                    Your passport number and, in the visa process, a passport copy are used only to prepare your visa, residence permit
                    and employment contract. Only authorised i2go staff can see them; they are never published on the portal. We pass
                    passport data to an employer only when the employment contract or visa process needs it and you have agreed
                    (Art. 6(1)(b) and (a) GDPR).
                </p>
            </LegalSection>

            <LegalSection id="authorities" title="8. Authorities and other recipients">
                <p>
                    Where needed for your entry and employment, we send data to the German embassy or consulate, the foreigners’ office
                    (Ausländerbehörde), the Federal Employment Agency (Bundesagentur für Arbeit), recognition offices for foreign
                    qualifications, and language and exam institutes (Art. 6(1)(b) and (c) GDPR).
                </p>
            </LegalSection>

            <LegalSection id="employers" title="9. Employer accounts">
                <p>
                    For employers we process name, business email, password (only as a secure hash), the version of the terms accepted and
                    when, the wishlist and the enquiries sent, to provide the account and the contract (Art. 6(1)(b) GDPR). To check the
                    company we may ask for its name, address, a contact person and a register extract (Art. 6(1)(f) GDPR).
                </p>
                <p>
                    <strong>Access log:</strong> to protect candidates from mass copying, each request for full profiles is logged with the
                    account, the time and the number of profiles. The log is deleted after 30 days (Art. 6(1)(f) GDPR; our interest is
                    protecting candidate data).
                </p>
            </LegalSection>

            <LegalSection id="enquiries" title="10. Enquiries from employers">
                <p>
                    For an enquiry we process name, company, email, phone, job title, place of work and message, the candidate concerned
                    and the time, so i2go can review it and arrange contact (Art. 6(1)(b) GDPR). To limit abuse we store a one-way hash of
                    your IP address, never the address itself (Art. 6(1)(f) GDPR). The candidate never sees your name, company or contact
                    details.
                </p>
            </LegalSection>

            <LegalSection id="contact" title="11. Contacting us">
                <p>
                    If you contact us, we use your details to handle your request (Art. 6(1)(b) or (f) GDPR) and delete them once it is
                    dealt with, unless we must keep them by law.
                </p>
            </LegalSection>

            <LegalSection id="storage" title="12. Cookies and browser storage">
                <p>
                    The portal stores only what is strictly necessary for the service you asked for (§ 25(2) TDDDG). We don’t use other
                    cookies, such as for statistics, so there is no cookie banner.
                </p>
                <StorageTable lang={lang} />
            </LegalSection>

            <LegalSection id="processors" title="13. Service providers">
                <ul>
                    <li><strong>Supabase</strong> (Supabase Inc.): database, sign-in and file storage for the app and the portal. {PROCESSORS.supabaseRegion}.</li>
                    <li><strong>Portal hosting</strong>: {PROCESSORS.host}.</li>
                    <li>[EMAIL: provider for sign-in and password emails, once set up.]</li>
                </ul>
                <p>These providers process data on our behalf under Art. 28 GDPR.</p>
            </LegalSection>

            <LegalSection id="transfers" title="14. Transfers outside the EU">
                <p>
                    {PROCESSORS.indiaPartner} has access to candidate data to support candidates in India. India has no EU adequacy
                    decision; the transfer is based on EU Standard Contractual Clauses (Art. 46(2)(c) GDPR). You can request a copy at <Mail />.
                </p>
                <p>
                    Where a provider in section 13 is based in the US, the transfer relies on [LAWYER: EU–US Data Privacy Framework or
                    Standard Contractual Clauses].
                </p>
            </LegalSection>

            <LegalSection id="retention" title="15. How long we keep data">
                <ul>
                    <li>Candidate profile: until the placement process ends, then 6 more months to defend possible claims (§ 15(4) AGG). You can delete your account in the app at any time; your profile, photo and video are then deleted at once.</li>
                    <li>Talent pool: 24 months after your last activity, only with your consent.</li>
                    <li>Passport data: deleted at the latest 6 months after the visa process ends or stops.</li>
                    <li>Employer enquiries: 24 months after the last update. After a candidate account is deleted they are no longer linked to the person.</li>
                    <li>Employer account: 12 months after the last activity or after termination.</li>
                    <li>Employer access log: 30 days.</li>
                    <li>Consent records: 3 years after the consent ends (§ 195 BGB).</li>
                    <li>Server logs: 7 days.</li>
                    <li>Contracts and invoices: 6 or 10 years (§ 257 HGB, § 147 AO).</li>
                </ul>
            </LegalSection>

            <LegalSection id="rights" title="16. Your rights">
                <p>
                    You have the right to access your data, correct it, delete it, restrict its use, receive it in a portable format and
                    object to its use (Art. 15–21 GDPR). You can withdraw any consent at any time for the future (Art. 7(3) GDPR), in your
                    account or by email to <Mail />. You can edit your profile in the app and delete your account under Settings → Delete
                    account.
                </p>
            </LegalSection>

            <LegalSection id="complaints" title="17. Complaints">
                <p>
                    You can complain to a data protection authority. Ours is: {authority.name}, {authority.address}, Germany,
                    {' '}<a href={authority.url}>{authority.url.replace('https://', '')}</a>.
                </p>
            </LegalSection>

            <LegalSection id="required" title="18. Do you have to give us your data?">
                <p>
                    No, it is voluntary. But without a profile and contact details we can’t place you, and without passport data no visa
                    process is possible. We do not charge job seekers any fee for job placement. [I2GO: confirm.]
                </p>
            </LegalSection>

            <LegalSection id="automated" title="19. No automated decisions">
                <p>We don’t make decisions about you by computer alone (Art. 22 GDPR). Our staff select candidates.</p>
            </LegalSection>

            <LegalSection id="changes" title="20. Changes">
                <p>
                    We update this policy when the portal, the app or the law changes. The version published on the website applies. See
                    also the <NextLink href={`/${lang}/terms`}>terms of use for employers</NextLink> and the{' '}
                    <NextLink href={`/${lang}/impressum`}>Impressum</NextLink>.
                </p>
            </LegalSection>
        </>
    );
}
