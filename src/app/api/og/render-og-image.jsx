import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

// Generated Open Graph images (PLAN.md 11.9.2): brand colours and text only,
// never candidate photos.
// Used by app/api/og/route.jsx.

export const OG_SIZE = { width: 1200, height: 630 };

// The logo from public/, read once per server process.
let logo;
const loadLogo = () => (logo ??= readFile(join(process.cwd(), 'public/images/i2go_mark.png'), 'base64').then((data) => `data:image/png;base64,${data}`));

export async function renderOgImage({ eyebrow, title, footer }) {
    const logoSrc = await loadLogo().catch(() => null);
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    padding: '72px 80px', background: '#2563EB', color: '#fff', fontFamily: 'sans-serif',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- rendered to a PNG by ImageResponse, not a page */}
                        {logoSrc && <img src={logoSrc} width={62} height={36} alt="" />}
                    </div>
                    <div style={{ fontSize: 36, fontWeight: 700 }}>I2Go</div>
                    <div style={{ fontSize: 28, opacity: 0.85 }}>{eyebrow}</div>
                </div>
                <div style={{ display: 'flex', fontSize: title.length > 40 ? 64 : 80, fontWeight: 700, lineHeight: 1.1, maxWidth: 1000 }}>{title}</div>
                <div style={{ display: 'flex', fontSize: 28, opacity: 0.85 }}>{footer}</div>
            </div>
        ),
        OG_SIZE,
    );
}
