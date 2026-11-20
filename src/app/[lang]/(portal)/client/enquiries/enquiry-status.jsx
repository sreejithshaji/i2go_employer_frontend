import { Box, Typography } from '@mui/material';
import { brand as b } from '@/app/theme';

// The three statuses my_enquiries() returns, in order. Labels in t.enquiries.status.
export const ENQUIRY_STEPS = ['received', 'forwarded', 'closed'];

const NODE = 15;

/** Normalises an unknown status to 'received', like the server's default. */
export function enquiryStep(status) {
    return ENQUIRY_STEPS.includes(status) ? status : 'received';
}

/**
 * Neutral status pill (plan §14.4): light surface, hairline, ink text and a
 * small dot (accent while the enquiry is open, faint once it's closed).
 */
export function StatusPill({ status, children, sx }) {
    const open = status !== 'closed';
    return (
        <Box
            component="span"
            sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.75, height: 26, px: 1.25,
                borderRadius: 999, bgcolor: b.surface3, border: `1px solid ${b.line}`, color: b.ink2,
                fontSize: 12, fontWeight: 700, lineHeight: '16px', whiteSpace: 'nowrap', ...sx,
            }}
        >
            <Box aria-hidden component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: open ? b.accent : b.faint }} />
            {children}
        </Box>
    );
}

/**
 * Enquiry progress as ring nodes on a light surface: Received → Forwarded → Closed.
 * The step rail's language (15px rings joined by a 1px line), with accent instead of cyan.
 * Reached steps get an accent ring and the line up to them fills; the current node is solid.
 * `my_enquiries()` doesn't say whether a closed enquiry was ever forwarded (spam and a plain
 * close both show as 'closed'), so for 'closed' the middle node stays hollow and the end node
 * is solid ink: a neutral end, not a success.
 *
 * labels: { received, forwarded, closed } (short labels), label: list name for screen readers.
 */
export function StatusProgress({ status, labels, label, sx }) {
    const current = enquiryStep(status);
    const closed = current === 'closed';
    const index = ENQUIRY_STEPS.indexOf(current);

    const stateOf = (i) => {
        if (i === index) return 'current';
        if (closed) return i === 0 ? 'done' : 'skipped';
        return i < index ? 'done' : 'todo';
    };

    return (
        <Box component="ol" aria-label={label} sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', ...sx }}>
            {ENQUIRY_STEPS.map((step, i) => {
                const state = stateOf(i);
                const last = i === ENQUIRY_STEPS.length - 1;
                // The segment after node i is filled when the next node was reached on the open path.
                const segmentFilled = !closed && i < index;
                return (
                    <Box component="li" key={step} aria-current={state === 'current' ? 'step' : undefined} sx={{ position: 'relative', minWidth: 0, pr: 1 }}>
                        {!last && (
                            <Box
                                aria-hidden
                                sx={{
                                    position: 'absolute', top: (NODE - 1) / 2, left: NODE + 6, right: 6, height: '1px',
                                    bgcolor: segmentFilled ? b.accent : b.line2,
                                }}
                            />
                        )}
                        <Node state={state} closed={closed} />
                        <Typography
                            component="span"
                            sx={{
                                display: 'block', mt: 1, fontSize: 12, lineHeight: 1.35,
                                fontWeight: state === 'current' ? 700 : 600,
                                color: state === 'current' ? b.ink : b.muted,
                                overflowWrap: 'break-word', hyphens: 'auto',
                            }}
                        >
                            {labels[step]}
                        </Typography>
                    </Box>
                );
            })}
        </Box>
    );
}

function Node({ state, closed }) {
    const current = state === 'current';
    const end = current && closed;
    const ring = state === 'done' || (current && !closed) ? b.accent : end ? b.ink2 : b.line2;
    return (
        <Box
            aria-hidden
            sx={{
                width: NODE, height: NODE, borderRadius: '50%', boxSizing: 'border-box',
                bgcolor: current ? (end ? b.ink2 : b.accent) : b.surface,
                border: `1.5px solid ${ring}`,
                boxShadow: current && !closed ? `0 0 0 4px ${b.accentLine}` : 'none',
            }}
        />
    );
}
