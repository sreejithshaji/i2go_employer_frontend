import NextLink from 'next/link';
import { COMPANY } from '@/lib/portal/legal';
import { LegalSection } from './legal-document';

// Employer terms of use, version 2 (PLAN.md 10.7, 10.17). Based on
// documents/4 Nutzungsbedingungen Arbeitgeber.docx. Where the document
// describes something the portal doesn't do, the text follows the portal and
// the difference is listed in legal/LAWYER_BRIEF.md:
//   §2(1)  the document unlocks access only after a company check; the portal
//          has no check (decision 10.6), so i2go keeps the right to ask for one;
//   §3     the document shows employers only anonymous profiles; the portal
//          shows signed-in employers name, photo and video (10.2);
//   §7     the document covers job ads; the portal has enquiries instead;
//   §5, §10 the portal's own rules (limits, logging, new versions) are added.
// The German text is binding (TermsDe); TermsEn is a translation.

export const TERMS_INTRO = {
    de: 'Nutzungsbedingungen für Arbeitgeber – i2go Jobportal',
    en: 'Terms of use for employers – i2go job portal',
};

export function TermsDe({ lang }) {
    return (
        <>
            <LegalSection id="scope" title="§ 1 Geltungsbereich">
                <p>
                    (1) Diese Bedingungen gelten für die Nutzung des Jobportals auf {COMPANY.website} („Portal“) durch Unternehmen
                    („Arbeitgeber“) gegenüber {COMPANY.name}, {COMPANY.street}, {COMPANY.city}, vertreten durch den Geschäftsführer
                    {' '}{COMPANY.managingDirectors} („i2go“).
                </p>
                <p>(2) Das Portal richtet sich ausschließlich an Unternehmer im Sinne des § 14 BGB.</p>
                <p>(3) Für die Vermittlungsleistung und deren Vergütung gilt der gesonderte Vermittlungsvertrag zwischen i2go und dem Arbeitgeber.</p>
            </LegalSection>

            <LegalSection id="account" title="§ 2 Registrierung und Prüfung">
                <p>
                    (1) i2go kann das Unternehmen jederzeit prüfen und dazu einen Handelsregisterauszug, eine Gewerbeanmeldung und die
                    Benennung eines verantwortlichen Ansprechpartners verlangen. Bis die Unterlagen vorliegen, kann i2go den Zugang auf
                    gekürzte Profile beschränken.
                </p>
                <p>
                    (2) Zugangsdaten sind vertraulich zu behandeln und dürfen nur Mitarbeitern zugänglich gemacht werden, die an der
                    Personalauswahl beteiligt sind. Ein Missbrauch ist i2go unverzüglich unter {COMPANY.email} mitzuteilen.
                </p>
            </LegalSection>

            <LegalSection id="candidate-data" title="§ 3 Zugang zu Bewerberdaten">
                <p>
                    (1) Ohne Anmeldung zeigt das Portal gekürzte Profile: Vorname und Initial des Nachnamens, Berufserfahrung, Kurzbeschreibung,
                    Berufe, Kenntnisse, Sprachen sowie Positionen und Zeiträume der Berufserfahrung, ohne Namen von Arbeitgebern und Schulen.
                </p>
                <p>
                    (2) Angemeldete Arbeitgeber, die diese Bedingungen akzeptiert haben, sehen zusätzlich den vollständigen Namen, das Foto,
                    das Vorstellungsvideo, eine Altersgruppe (z. B. 25–34) sowie frühere Arbeitgeber und Ausbildungsstätten. Kontaktdaten,
                    Geburtsdatum, Geschlecht und Passdaten zeigt das Portal nie.
                </p>
                <p>
                    (3) Kontaktdaten und vollständige Bewerbungsunterlagen erhält der Arbeitgeber nur über i2go und nur für einen konkreten
                    Bewerber, nachdem dieser der Weitergabe zugestimmt hat.
                </p>
            </LegalSection>

            <LegalSection id="data-protection" title="§ 4 Datenschutz – eigene Verantwortlichkeit">
                <p>(1) Mit Erhalt der Bewerberdaten ist der Arbeitgeber für deren weitere Verarbeitung eigenständig Verantwortlicher im Sinne von Art. 4 Nr. 7 DSGVO.</p>
                <p>(2) Der Arbeitgeber verpflichtet sich,</p>
                <ul>
                    <li>die Daten ausschließlich für das Bewerbungs- und Einstellungsverfahren des betreffenden Bewerbers zu verwenden (§ 26 BDSG, Art. 6 Abs. 1 lit. b DSGVO);</li>
                    <li>die Daten nicht an Dritte weiterzugeben, insbesondere nicht an andere Personaldienstleister oder Verleiher;</li>
                    <li>Bewerber nicht unter Umgehung von i2go für andere Zwecke zu kontaktieren;</li>
                    <li>Profile, Fotos und Videos nicht außerhalb des Portals zu kopieren, herunterzuladen oder zu speichern, außer kurzen Notizen für eine konkrete Stelle;</li>
                    <li>das Portal nicht mit Skripten, Bots, Scrapern oder anderen automatisierten Werkzeugen abzurufen und die Begrenzungen nach § 5 nicht zu umgehen;</li>
                    <li>angemessene technische und organisatorische Maßnahmen zum Schutz der Daten zu treffen (Art. 32 DSGVO);</li>
                    <li>die Daten spätestens 6 Monate nach Abschluss des Bewerbungsverfahrens zu löschen, sofern kein Arbeitsverhältnis begründet wird oder der Bewerber einer längeren Speicherung nicht zugestimmt hat;</li>
                    <li>Datenschutzverletzungen, die Bewerberdaten aus dem Portal betreffen, i2go unverzüglich mitzuteilen.</li>
                </ul>
                <p>(3) Die Pflichten nach Absatz 2 gelten auch nach Beendigung der Nutzung fort.</p>
            </LegalSection>

            <LegalSection id="monitoring" title="§ 5 Begrenzungen und Protokollierung">
                <p>
                    Zum Schutz der Bewerber ist die Zahl der Profile, die ein Arbeitgeberkonto abrufen kann, begrenzt. Jeder Abruf
                    vollständiger Profile wird mit dem Konto und der Uhrzeit protokolliert. i2go bewahrt dieses Protokoll 30 Tage auf und
                    nutzt es nur, um Missbrauch zu erkennen (siehe <NextLink href={`/${lang}/privacy#employers`}>Datenschutzerklärung</NextLink>).
                </p>
            </LegalSection>

            <LegalSection id="equal-treatment" title="§ 6 Gleichbehandlung">
                <p>
                    Der Arbeitgeber verpflichtet sich, bei der Auswahl die Vorgaben des Allgemeinen Gleichbehandlungsgesetzes (AGG)
                    einzuhalten. Anfragen und Stellenbeschreibungen dürfen keine Anforderungen nach Herkunft, Religion, Geschlecht, Alter,
                    Behinderung oder sexueller Identität enthalten, soweit diese nicht nach §§ 8–10 AGG zulässig sind. Das Portal zeigt
                    deshalb weder Geschlecht noch genaues Alter und bietet dafür keine Filter.
                </p>
            </LegalSection>

            <LegalSection id="employment" title="§ 7 Arbeitsbedingungen">
                <p>(1) Der Arbeitgeber stellt den vermittelten Bewerber unmittelbar selbst ein. Eine Überlassung an Dritte (Arbeitnehmerüberlassung) ist ausgeschlossen.</p>
                <p>
                    (2) Der Arbeitgeber sichert zu, Bewerber zu den Bedingungen zu beschäftigen, die für die Zustimmung der Bundesagentur für
                    Arbeit erforderlich sind, insbesondere nicht zu ungünstigeren Arbeitsbedingungen als vergleichbare inländische
                    Arbeitnehmer (§ 39 AufenthG), und mindestens zum gesetzlichen Mindestlohn bzw. Tariflohn.
                </p>
            </LegalSection>

            <LegalSection id="enquiries" title="§ 8 Anfragen">
                <p>
                    Der Arbeitgeber ist für die Richtigkeit und Rechtmäßigkeit seiner Anfragen verantwortlich (Stellenbezeichnung,
                    Einsatzort, Nachricht). i2go kann rechtswidrige oder irreführende Anfragen ohne Vorankündigung ablehnen oder löschen.
                </p>
            </LegalSection>

            <LegalSection id="termination" title="§ 9 Sperrung und Kündigung">
                <p>(1) Beide Parteien können die Nutzung mit einer Frist von 14 Tagen zum Monatsende kündigen. Der Arbeitgeber kann dazu eine E-Mail an {COMPANY.email} senden.</p>
                <p>(2) Bei Verstoß gegen §§ 4–7 kann i2go den Zugang sofort sperren und den Vertrag fristlos kündigen.</p>
            </LegalSection>

            <LegalSection id="liability" title="§ 10 Haftung">
                <p>(1) i2go haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für Schäden aus der Verletzung von Leben, Körper oder Gesundheit.</p>
                <p>(2) Bei leichter Fahrlässigkeit haftet i2go nur bei Verletzung wesentlicher Vertragspflichten und begrenzt auf den vorhersehbaren, vertragstypischen Schaden.</p>
                <p>(3) i2go übernimmt keine Gewähr für die Erteilung von Visa oder Aufenthaltstiteln durch die Behörden.</p>
                <p>
                    (4) Bewerber erstellen ihre Profile selbst. Das Kennzeichen „Geprüft“ bedeutet, dass i2go das Profil geprüft hat
                    [I2GO: was die Prüfung umfasst, z. B. Identität und Unterlagen]; es ist keine Zusicherung von Qualifikation oder Eignung.
                </p>
                <p>(5) Der Arbeitgeber stellt i2go von Ansprüchen Dritter frei, die auf einem Verstoß des Arbeitgebers gegen § 4 oder § 6 beruhen.</p>
            </LegalSection>

            <LegalSection id="changes" title="§ 11 Änderungen dieser Bedingungen">
                <p>
                    Ändert i2go diese Bedingungen, wird die neue Fassung hier veröffentlicht. Der Arbeitgeber wird bei der nächsten
                    Anmeldung gebeten, sie zu akzeptieren; bis dahin sieht er nur gekürzte Profile.
                </p>
            </LegalSection>

            <LegalSection id="law" title="§ 12 Schlussbestimmungen">
                <p>(1) Es gilt das Recht der Bundesrepublik Deutschland.</p>
                <p>(2) Gerichtsstand ist {COMPANY.jurisdiction}.</p>
                <p>(3) Sollte eine Bestimmung unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
            </LegalSection>
        </>
    );
}

export function TermsEn({ lang }) {
    return (
        <>
            <LegalSection id="scope" title="§ 1 Scope">
                <p>
                    (1) These terms apply to the use of the job portal on {COMPANY.website} (“portal”) by companies (“employers”) towards
                    {' '}{COMPANY.name}, {COMPANY.street}, {COMPANY.city}, represented by its managing director {COMPANY.managingDirectors} (“i2go”).
                </p>
                <p>(2) The portal is only for businesses within the meaning of § 14 BGB (German Civil Code).</p>
                <p>(3) The placement service and its fee are governed by the separate placement agreement between i2go and the employer.</p>
            </LegalSection>

            <LegalSection id="account" title="§ 2 Registration and checks">
                <p>
                    (1) i2go may check the company at any time and ask for an extract from the commercial register, a business registration
                    and the name of a responsible contact person. Until these are provided, i2go may limit access to shortened profiles.
                </p>
                <p>
                    (2) Login details are confidential and may only be made available to staff involved in selecting personnel. Report any
                    misuse to i2go immediately at {COMPANY.email}.
                </p>
            </LegalSection>

            <LegalSection id="candidate-data" title="§ 3 Access to candidate data">
                <p>
                    (1) Without signing in, the portal shows shortened profiles: first name and the initial of the last name, years of
                    experience, short description, occupations, skills, languages, and job titles and dates from work history, without the
                    names of employers or schools.
                </p>
                <p>
                    (2) Signed-in employers who have accepted these terms also see the full name, photo, intro video, an age range (e.g.
                    25–34), and past employers and places of education. The portal never shows contact details, date of birth, gender or
                    passport data.
                </p>
                <p>
                    (3) The employer receives contact details and full application documents only through i2go, and only for a specific
                    candidate after that candidate has agreed to it.
                </p>
            </LegalSection>

            <LegalSection id="data-protection" title="§ 4 Data protection – the employer’s own responsibility">
                <p>(1) Once the employer receives candidate data, it is an independent controller for any further processing (Art. 4(7) GDPR).</p>
                <p>(2) The employer undertakes to:</p>
                <ul>
                    <li>use the data only for the application and hiring process of the candidate concerned (§ 26 BDSG, Art. 6(1)(b) GDPR);</li>
                    <li>not pass the data on to third parties, in particular to other recruitment agencies or temporary staffing agencies;</li>
                    <li>not contact candidates for other purposes, bypassing i2go;</li>
                    <li>not copy, download or store profiles, photos or videos outside the portal, other than brief notes for a specific vacancy;</li>
                    <li>not access the portal with scripts, bots, scrapers or other automated tools, and not get round the limits in § 5;</li>
                    <li>take appropriate technical and organisational measures to protect the data (Art. 32 GDPR);</li>
                    <li>delete the data no later than 6 months after the application process ends, unless an employment relationship is established or the candidate has agreed to longer storage;</li>
                    <li>report to i2go without delay any data breach affecting candidate data from the portal.</li>
                </ul>
                <p>(3) The obligations in paragraph 2 continue after the use of the portal ends.</p>
            </LegalSection>

            <LegalSection id="monitoring" title="§ 5 Limits and logging">
                <p>
                    To protect candidates, the number of profiles an employer account can view is limited. Each request for full profiles is
                    logged with the account and the time. i2go keeps this log for 30 days and uses it only to detect misuse (see the
                    {' '}<NextLink href={`/${lang}/privacy#employers`}>privacy policy</NextLink>).
                </p>
            </LegalSection>

            <LegalSection id="equal-treatment" title="§ 6 Equal treatment">
                <p>
                    The employer undertakes to comply with the General Equal Treatment Act (AGG) when selecting candidates. Enquiries and job
                    descriptions must not contain requirements based on origin, religion, gender, age, disability or sexual identity unless
                    permitted under §§ 8–10 AGG. This is why the portal shows neither gender nor exact age and has no filters for them.
                </p>
            </LegalSection>

            <LegalSection id="employment" title="§ 7 Working conditions">
                <p>(1) The employer hires the placed candidate directly. Lending the candidate to third parties (temporary agency work) is excluded.</p>
                <p>
                    (2) The employer assures that it will employ candidates on the terms required for the approval of the Federal Employment
                    Agency, in particular on terms no less favourable than those of comparable domestic employees (§ 39 AufenthG), and at
                    least at the statutory minimum wage or the collectively agreed wage.
                </p>
            </LegalSection>

            <LegalSection id="enquiries" title="§ 8 Enquiries">
                <p>
                    The employer is responsible for the accuracy and lawfulness of its enquiries (job title, place of work, message). i2go
                    may reject or delete unlawful or misleading enquiries without notice.
                </p>
            </LegalSection>

            <LegalSection id="termination" title="§ 9 Suspension and termination">
                <p>(1) Either party may terminate the use with 14 days’ notice to the end of a month. The employer can do so by emailing {COMPANY.email}.</p>
                <p>(2) If §§ 4–7 are breached, i2go may block access immediately and terminate without notice.</p>
            </LegalSection>

            <LegalSection id="liability" title="§ 10 Liability">
                <p>(1) i2go is liable without limit for intent and gross negligence and for injury to life, body or health.</p>
                <p>(2) For slight negligence, i2go is liable only for breach of essential contractual obligations, limited to the foreseeable damage typical for the contract.</p>
                <p>(3) i2go does not guarantee that authorities will grant visas or residence permits.</p>
                <p>
                    (4) Candidates write their own profiles. The “Verified” badge means that i2go has reviewed the profile [I2GO: what the
                    review covers, e.g. identity and documents]; it is not a guarantee of qualifications or suitability.
                </p>
                <p>(5) The employer indemnifies i2go against third-party claims based on the employer’s breach of § 4 or § 6.</p>
            </LegalSection>

            <LegalSection id="changes" title="§ 11 Changes to these terms">
                <p>
                    If i2go changes these terms, the new version is published here. The employer is asked to accept it at the next sign-in
                    and until then sees only shortened profiles.
                </p>
            </LegalSection>

            <LegalSection id="law" title="§ 12 Final provisions">
                <p>(1) The law of the Federal Republic of Germany applies.</p>
                <p>(2) The place of jurisdiction is {COMPANY.jurisdiction}.</p>
                <p>(3) If any provision is invalid, the validity of the remaining provisions is not affected.</p>
            </LegalSection>
        </>
    );
}
