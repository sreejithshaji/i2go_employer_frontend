import { Box, Typography } from '@mui/material';
import { brand as b } from '@/app/theme';
import Reveal, { STAGGER } from './reveal';

/**
 * One step of a story (plan §4.2), on the light employer section: big tracked number and a hairline across
 * the column, title, text (max 560px), then the step's visual (`children`).
 * The rail's active step comes from `useActiveStep` on the chapters' ids.
 * `scrollMargin` keeps the number clear of the sticky bars when a rail link
 * jumps here. Its parts come in one after another (plan §10); the article
 * itself doesn't move, so anchors and the active step keep their positions.
 */
export default function StepChapter({ id, index, title, text, scrollMargin, children }) {
    return (
        <Box component="article" id={id} aria-labelledby={`${id}-title`} sx={{ scrollMarginTop: scrollMargin }}>
            <Reveal sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography component="span" sx={{ fontSize: 13, lineHeight: 1, fontWeight: 800, letterSpacing: '0.17em', color: b.accentText }}>
                    {String(index + 1).padStart(2, '0')}
                </Typography>
                <Box aria-hidden sx={{ flex: 1, height: '1px', bgcolor: b.line2 }} />
            </Reveal>
            <Reveal delay={STAGGER}>
                <Typography
                    id={`${id}-title`}
                    component="h3"
                    sx={{ m: 0, mt: 2, fontSize: { xs: 22, md: 28 }, lineHeight: 1.2, fontWeight: 800, letterSpacing: '-0.8px', color: b.ink }}
                >
                    {title}
                </Typography>
                <Typography component="p" sx={{ m: 0, mt: 1.5, maxWidth: 560, fontSize: 16.5, lineHeight: 1.65, fontWeight: 500, color: b.mutedOnTint }}>
                    {text}
                </Typography>
            </Reveal>
            {children && <Reveal delay={2 * STAGGER} sx={{ mt: { xs: 2.5, md: 3 } }}>{children}</Reveal>}
        </Box>
    );
}
