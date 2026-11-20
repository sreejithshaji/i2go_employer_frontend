'use client';

// Last resort when the language layout itself fails: no theme, fonts or
// dictionary, so plain markup in both languages.
export default function GlobalError({ retry }) {
    return (
        <html lang="de">
            <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#FFFFFF', color: '#0D2A42' }}>
                <title>Fehler · Error · I2Go</title>
                <main style={{ maxWidth: 520, margin: '0 auto', padding: '96px 16px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 24, margin: '0 0 8px' }}>Etwas ist schiefgelaufen</h1>
                    <p style={{ margin: '0 0 24px', color: '#5B6B7A' }}>Something went wrong. Bitte versuchen Sie es erneut. Please try again.</p>
                    <button type="button" onClick={() => retry()} style={{ padding: '10px 20px', borderRadius: 999, border: 0, background: '#0D2A42', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>
                        Erneut versuchen · Retry
                    </button>
                </main>
            </body>
        </html>
    );
}
