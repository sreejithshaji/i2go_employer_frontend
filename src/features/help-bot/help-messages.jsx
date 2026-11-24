'use client';

import NextLink from 'next/link';
import { Box, Button, ButtonBase, IconButton, Skeleton, Tooltip, Typography } from '@mui/material';
import { FiArrowRight, FiThumbsDown, FiThumbsUp } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { COMPANY } from '@/lib/portal/legal';
import { format } from '@/lib/i18n/config';
import { brand as b } from '@/app/theme';

// The pieces of the help chat log (help-bot-plan.md, Task 5): the visitor's
// bubble, the bot's bubble, an answer with its "Read more" link, 👍 / 👎
// (Task 6) and related questions, the no-match text, and the quick-topic chips.

export const visuallyHidden = {
    position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden',
    clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
};

const bodyText = { fontSize: 14.5, lineHeight: 1.6, fontWeight: 500, color: b.ink2, whiteSpace: 'pre-line' };

/** One row of the log. `who` is read out first, so screen readers know who speaks. */
export function Bubble({ from, who, children }) {
    const mine = from === 'user';
    return (
        <Box component="li" sx={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
            <Box
                sx={{
                    maxWidth: mine ? '85%' : '100%',
                    px: 2, py: 1.5,
                    borderRadius: `${b.radiusMd}px`,
                    ...(mine
                        ? { bgcolor: b.graphite, color: '#fff', borderBottomRightRadius: 6 }
                        : { bgcolor: b.surface, border: `1px solid ${b.line}`, borderBottomLeftRadius: 6, boxShadow: b.shadow1 }),
                }}
            >
                <Box component="span" sx={visuallyHidden}>{`${who}: `}</Box>
                {children}
            </Box>
        </Box>
    );
}

/** The visitor's question. */
export function UserText({ text }) {
    return <Typography sx={{ ...bodyText, color: 'inherit', wordBreak: 'break-word' }}>{text}</Typography>;
}

/** Plain bot text (greeting, searching, error). */
export function BotText({ children, muted = false }) {
    return <Typography component="div" sx={{ ...bodyText, color: muted ? b.muted : b.ink2 }}>{children}</Typography>;
}

/**
 * One help entry: { question, answer, href }. `similar` adds "Did you mean…?"
 * (found by spelling, not by the words). `others` are related entries the
 * visitor can open with one tap.
 */
export function AnswerBody({ answer, similar, others = [], vote, onVote, onPick, onNavigate }) {
    const { t } = useI18n();
    const h = t.helpBot;
    return (
        <Box>
            {similar && (
                <Typography sx={{ fontSize: 13, lineHeight: 1.55, fontWeight: 600, color: b.muted, mb: 0.75 }}>
                    {format(h.didYouMean, { question: answer.question })}
                </Typography>
            )}
            <Typography component="p" sx={{ fontSize: 14.5, lineHeight: 1.45, fontWeight: 800, color: b.ink, letterSpacing: '-0.2px', mb: 0.75 }}>
                {answer.question}
            </Typography>
            <Typography sx={bodyText}>{answer.answer}</Typography>
            {answer.href && (
                <Box
                    component={NextLink}
                    href={answer.href}
                    onClick={onNavigate}
                    sx={{
                        mt: 1.25, display: 'inline-flex', alignItems: 'center', gap: 0.75, minHeight: 32,
                        fontSize: 14, fontWeight: 700, color: b.accentText, textDecoration: 'none', borderRadius: 1,
                        '&:hover': { textDecoration: 'underline' },
                        '&:focus-visible': b.focusRing,
                    }}
                >
                    {h.readMore}
                    <FiArrowRight size={14} aria-hidden />
                </Box>
            )}
            <Box sx={{ mt: 1.5, pt: 1.25, borderTop: `1px solid ${b.line}` }}>
                <Votes vote={vote} onVote={onVote} />
            </Box>
            {others.length > 0 && (
                <Box sx={{ mt: 1.75, pt: 1.5, borderTop: `1px solid ${b.line}` }}>
                    <ChipLabel>{h.related}</ChipLabel>
                    <TopicChips topics={others} onPick={onPick} />
                </Box>
            )}
        </Box>
    );
}

/** A text whose {email} becomes the contact address as a mailto link. */
function EmailText({ template, muted = false }) {
    const [before, after = ''] = template.split('{email}');
    return (
        <BotText muted={muted}>
            {before}
            <Box
                component="a"
                href={`mailto:${COMPANY.email}`}
                sx={{ color: b.accentText, fontWeight: 700, textDecoration: 'none', borderRadius: 0.5, '&:hover': { textDecoration: 'underline' }, '&:focus-visible': b.focusRing }}
            >
                {COMPANY.email}
            </Box>
            {after}
        </BotText>
    );
}

/** "Sorry, no answer yet…" with the contact address. */
export function NoMatchText() {
    const { t } = useI18n();
    return <EmailText template={t.helpBot.noMatch} />;
}

/**
 * "Was this helpful?" with 👍 / 👎 (Feather thumbs). One vote per answer; after
 * it the buttons give way to a thank-you, which the log announces.
 */
function Votes({ vote, onVote }) {
    const { t } = useI18n();
    const h = t.helpBot;
    if (vote) {
        return vote === 'helpful'
            ? <BotText muted>{h.thanks}</BotText>
            : <EmailText template={h.thanksNotHelpful} muted />;
    }
    const button = (kind, label, Icon) => (
        <Tooltip title={label}>
            <IconButton
                onClick={() => onVote(kind)}
                aria-label={label}
                sx={{ width: 40, height: 40, color: b.ink2, border: `1px solid ${b.line2}`, bgcolor: b.surface3, '&:hover': { bgcolor: b.surface, borderColor: b.lineHover }, '&:focus-visible': b.focusRing }}
            >
                <Icon size={16} />
            </IconButton>
        </Tooltip>
    );
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ flex: 1, fontSize: 13, lineHeight: 1.55, fontWeight: 600, color: b.muted }}>{h.wasHelpful}</Typography>
            {button('helpful', h.helpful, FiThumbsUp)}
            {button('not_helpful', h.notHelpful, FiThumbsDown)}
        </Box>
    );
}

export function ChipLabel({ children }) {
    return (
        <Typography sx={{ fontSize: 11, lineHeight: 1.4, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: b.accentText, mb: 1 }}>
            {children}
        </Typography>
    );
}

/**
 * The quick topics or related questions as chips. `topics` is null while
 * loading (skeleton chips) and [] when there is nothing to show.
 */
export function TopicChips({ topics, onPick }) {
    if (topics === null) {
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }} aria-hidden>
                {[150, 120, 170].map((w) => <Skeleton key={w} variant="rounded" width={w} height={40} sx={{ borderRadius: 999, bgcolor: b.surface3 }} />)}
            </Box>
        );
    }
    if (!topics.length) return null;
    return (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {topics.map((topic) => (
                <li key={topic.id}>
                    <ButtonBase
                        onClick={() => onPick(topic)}
                        sx={{
                            minHeight: { xs: 44, sm: 40 }, px: 1.75, py: 0.75,
                            borderRadius: 999, bgcolor: b.surface3, border: `1px solid ${b.line2}`,
                            fontFamily: b.fontFamily, fontSize: 13.5, lineHeight: 1.35, fontWeight: 700, color: b.ink2, textAlign: 'left',
                            transition: `transform 280ms ${b.ease}, border-color 280ms ${b.ease}, box-shadow 280ms ${b.ease}`,
                            '&:hover': { transform: 'translateY(-1px)', borderColor: b.lineHover, boxShadow: b.shadow2 },
                            '&:focus-visible': b.focusRing,
                            '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
                        }}
                    >
                        {topic.question}
                    </ButtonBase>
                </li>
            ))}
        </Box>
    );
}

/** The error line with Retry. */
export function ErrorText({ onRetry }) {
    const { t } = useI18n();
    return (
        <Box>
            <BotText>{t.helpBot.error}</BotText>
            <Button variant="soft" size="small" onClick={onRetry} sx={{ mt: 1.25 }}>{t.common.retry}</Button>
        </Box>
    );
}
