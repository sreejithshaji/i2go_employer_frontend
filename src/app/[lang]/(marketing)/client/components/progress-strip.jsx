import { Box } from '@mui/material';
import { brand as b } from '@/app/theme';

/** Height of the strip, for the chapters' scroll margin on phones. */
export const PROGRESS_STRIP_HEIGHT = 56;

/**
 * Phone version of the step rail (plan §6 row 5): 01 ─ 02 ─ … ─ 06 on a 3px
 * track whose fill reaches the active step. It sticks under the nav; put it
 * at the top of the column that holds the chapters, so it stays only while
 * the story is on screen. Drawn for the navy employer section. Hidden from 900px, where the rail takes over.
 */
export default function ProgressStrip({ count, active = 0, idPrefix, label }) {
    const fill = count > 1 ? active / (count - 1) : 1;
    return (
        <Box
            component="nav"
            aria-label={label}
            sx={{
                display: { xs: 'block', md: 'none' },
                position: 'sticky', top: b.navHeightMobile, zIndex: 5,
                mx: -2, px: 2, mb: 3, height: PROGRESS_STRIP_HEIGHT,
                bgcolor: 'rgba(3,7,12,0.86)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                borderBottom: `1px solid ${b.onDark.border}`,
            }}
        >
            <Box sx={{ position: 'relative', height: '100%' }}>
                <Box aria-hidden sx={{ position: 'absolute', left: 22, right: 22, top: '50%', height: 3, mt: '-1.5px', borderRadius: 3, bgcolor: b.onDark.border }}>
                    <Box
                        sx={{
                            height: '100%', borderRadius: 3, bgcolor: b.cyan, transformOrigin: 'left',
                            transform: `scaleX(${fill})`, transition: `transform 250ms ${b.ease}`,
                        }}
                    />
                </Box>
                <Box component="ol" sx={{ position: 'relative', listStyle: 'none', m: 0, p: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {Array.from({ length: count }, (_, i) => {
                        const n = String(i + 1).padStart(2, '0');
                        const current = i === active;
                        const reached = i <= active;
                        return (
                            <li key={n}>
                                <Box
                                    component="a"
                                    href={`#${idPrefix}-${i + 1}`}
                                    aria-current={current ? 'step' : undefined}
                                    sx={{
                                        width: 44, height: 44, display: 'grid', placeItems: 'center', textDecoration: 'none', borderRadius: '50%',
                                        '&:focus-visible': { outline: `2px solid ${b.cyan}`, outlineOffset: -2 },
                                    }}
                                >
                                    <Box
                                        component="span"
                                        sx={{
                                            minWidth: 30, height: 24, px: 0.75, borderRadius: 999, display: 'grid', placeItems: 'center',
                                            fontSize: 11, fontWeight: 800, letterSpacing: '0.08em',
                                            bgcolor: current ? b.cyan : b.graphite,
                                            color: current ? b.navy : reached ? b.cyan : b.onDark.subtle,
                                            border: `1px solid ${current ? b.cyan : reached ? 'rgba(31,200,255,0.35)' : b.onDark.border}`,
                                            transition: `background-color 250ms ${b.ease}, color 250ms ${b.ease}, border-color 250ms ${b.ease}`,
                                        }}
                                    >
                                        {n}
                                    </Box>
                                </Box>
                            </li>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
}
