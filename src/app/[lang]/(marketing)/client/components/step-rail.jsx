import { Box, Typography } from '@mui/material';
import { brand as b } from '@/app/theme';

const NODE = 15;

/**
 * Vertical step rail (the reference's left rail, plan §4.2), drawn on the
 * navy employer section: 15px ring nodes joined by a 1px line, a tracked number, the title and
 * a short subtitle. Each step links to its chapter (`#${idPrefix}-${n}`).
 * Steps before `active` and the line leading to it are filled with cyan; the active node is solid. Without JS `active` stays 0.
 *
 * steps: [{ title, short }]
 */
export default function StepRail({ steps, active = 0, idPrefix, label, sx }) {
    return (
        <Box component="nav" aria-label={label} sx={sx}>
            <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                {steps.map((step, i) => {
                    const state = i < active ? 'done' : i === active ? 'active' : 'todo';
                    const last = i === steps.length - 1;
                    return (
                        <Box component="li" key={step.title} sx={{ position: 'relative', pb: last ? 0 : 2.25 }}>
                            {!last && (
                                <Box
                                    aria-hidden
                                    sx={{
                                        position: 'absolute', left: (NODE - 1) / 2, top: NODE + 10, bottom: 2, width: '1px',
                                        bgcolor: i < active ? b.cyan : b.onDark.border,
                                        transition: `background-color 250ms ${b.ease}`,
                                    }}
                                />
                            )}
                            <Box
                                component="a"
                                href={`#${idPrefix}-${i + 1}`}
                                aria-current={state === 'active' ? 'step' : undefined}
                                sx={{
                                    display: 'grid', gridTemplateColumns: `${NODE}px 1fr`, columnGap: 1.75, alignItems: 'start',
                                    textDecoration: 'none', borderRadius: '8px', pt: '4px',
                                    '&:hover .rail-title': { color: b.onDark.text },
                                    '&:focus-visible': { outline: `2px solid ${b.cyan}`, outlineOffset: 3 },
                                }}
                            >
                                <Node state={state} />
                                <Box sx={{ minWidth: 0, mt: '-3px' }}>
                                    <Typography component="span" sx={{ display: 'block', fontSize: 10.5, lineHeight: 1.4, fontWeight: 800, letterSpacing: '0.17em', color: state === 'todo' ? b.onDark.subtle : b.cyan }}>
                                        {String(i + 1).padStart(2, '0')}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        className="rail-title"
                                        sx={{
                                            display: 'block', mt: 0.25, fontSize: 14, lineHeight: 1.35, fontWeight: 700,
                                            color: state === 'active' ? b.onDark.text : b.onDark.body, transition: `color 250ms ${b.ease}`,
                                        }}
                                    >
                                        {step.title}
                                    </Typography>
                                    <Typography component="span" sx={{ display: 'block', mt: 0.25, fontSize: 12.5, lineHeight: 1.5, fontWeight: 500, color: b.onDark.subtle }}>
                                        {step.short}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

function Node({ state }) {
    const filled = state === 'active';
    return (
        <Box
            aria-hidden
            sx={{
                width: NODE, height: NODE, borderRadius: '50%', boxSizing: 'border-box', bgcolor: filled ? b.cyan : b.graphite,
                border: `1.5px solid ${state === 'todo' ? b.onDark.ring : b.cyan}`,
                boxShadow: filled ? '0 0 0 4px rgba(31,200,255,0.14)' : 'none',
                transition: `background-color 250ms ${b.ease}, border-color 250ms ${b.ease}, box-shadow 250ms ${b.ease}`,
            }}
        />
    );
}
