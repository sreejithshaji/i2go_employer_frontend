'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Box, ButtonBase, Drawer, Grow, IconButton, InputBase, Modal, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { FiMessageCircle, FiSend, FiX } from 'react-icons/fi';
import { useI18n } from '@/features/i18n';
import { brand as b } from '@/app/theme';
import { askHelp, getHelpTopics, logHelpFeedback } from './actions';
import { AnswerBody, BotText, Bubble, ChipLabel, ErrorText, NoMatchText, TopicChips, UserText, visuallyHidden } from './help-messages';

// Help chat (help-bot-plan.md, Task 5). A button bottom right on every layout
// opens a panel: a bottom drawer on phones, a floating card from 600px. Both
// are MUI modals, so focus stays inside, Escape closes, and focus returns to
// the button. Answers come from the help_articles table through ./actions; the
// quick topics are loaded once, the first time the panel opens. The chat stays
// while the visitor moves between pages in one language. Votes and unanswered
// questions are logged anonymously (H4, Task 6; privacy policy §§ 11, 15).

const MAX_LENGTH = 200; // same cap as the service and the database

export default function HelpBot() {
    const { lang, t } = useI18n();
    const h = t.helpBot;
    const theme = useTheme();
    const phone = useMediaQuery(theme.breakpoints.down('sm'));

    const [open, setOpen] = useState(false);
    const [topics, setTopics] = useState(null); // null: loading or not loaded yet
    const [topicsFailed, setTopicsFailed] = useState(false);
    const [messages, setMessages] = useState([]);
    const [draft, setDraft] = useState('');
    const [pending, setPending] = useState(false);
    const nextKey = useRef(0);
    const loadingTopics = useRef(false);

    const add = useCallback((...items) => {
        setMessages((list) => [...list, ...items.map((item) => ({ ...item, key: nextKey.current++ }))]);
    }, []);

    const loadTopics = useCallback(async () => {
        if (loadingTopics.current) return;
        loadingTopics.current = true;
        setTopicsFailed(false);
        const res = await getHelpTopics(lang);
        loadingTopics.current = false;
        if (res.success) setTopics(res.topics);
        else setTopicsFailed(true);
    }, [lang]);

    const openPanel = () => {
        setOpen(true);
        if (topics === null) loadTopics();
    };
    const close = () => setOpen(false);

    // A chip already carries its answer, so it needs no round trip.
    const pick = (entry) => add({ from: 'user', text: entry.question }, { from: 'bot', kind: 'answer', answer: entry, others: [] });

    // `again`: a retry, whose question is already in the log.
    const ask = async (question, again = false) => {
        const text = question.replace(/\s+/g, ' ').trim().slice(0, MAX_LENGTH);
        if (!text || pending) return;
        setPending(true);
        if (!again) add({ from: 'user', text });
        const res = await askHelp(lang, text);
        setPending(false);
        if (!res.success) add({ from: 'bot', kind: 'error', query: text });
        else if (!res.best) {
            add({ from: 'bot', kind: 'noMatch', query: text });
            // Unanswered questions show us which entries are missing (H4).
            logHelpFeedback(lang, { kind: 'no_match', query: text }).catch(() => {});
        } else add({ from: 'bot', kind: 'answer', answer: res.best, others: res.others, similar: res.matchedBy === 'similar' });
    };

    // One anonymous vote per answer; the thank-you shows at once, whatever the result.
    const vote = (message, kind) => {
        if (message.vote) return;
        setMessages((list) => list.map((m) => (m.key === message.key ? { ...m, vote: kind } : m)));
        logHelpFeedback(lang, { kind, articleId: message.answer.id }).catch(() => {});
    };

    const retry = (message) => {
        if (pending) return;
        setMessages((list) => list.filter((m) => m.key !== message.key));
        ask(message.query, true);
    };

    const panel = (
        <ChatPanel
            phone={phone}
            topics={topics}
            topicsFailed={topicsFailed}
            onRetryTopics={loadTopics}
            messages={messages}
            pending={pending}
            draft={draft}
            onDraft={setDraft}
            onAsk={(text) => { setDraft(''); ask(text); }}
            onPick={pick}
            onVote={vote}
            onRetry={retry}
            onClose={close}
        />
    );

    return (
        <>
            <ButtonBase
                onClick={openPanel}
                aria-haspopup="dialog"
                aria-expanded={open}
                sx={{
                    position: 'fixed', zIndex: 20,
                    right: { xs: 16, md: 28 },
                    bottom: { xs: 'calc(20px + env(safe-area-inset-bottom, 0px))', sm: 28 },
                    // Above the candidate profile's phone action bar.
                    'body:has([data-bottom-bar]) &': { bottom: { xs: 'calc(88px + env(safe-area-inset-bottom, 0px))', sm: 28 } },
                    height: 48, pl: 1.75, pr: 2.25, gap: 1, borderRadius: 999,
                    bgcolor: b.graphite, color: '#fff',
                    fontFamily: b.fontFamily, fontSize: 14, fontWeight: 800, letterSpacing: '-0.2px',
                    boxShadow: '0 8px 22px rgba(10,15,22,0.22)',
                    transition: `transform 280ms ${b.ease}, box-shadow 280ms ${b.ease}`,
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 28px rgba(10,15,22,0.26)' },
                    '&:focus-visible': b.focusRing,
                    '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&:hover': { transform: 'none' } },
                    '@media print': { display: 'none' },
                }}
            >
                <Box component="span" sx={{ display: 'inline-flex', color: b.cyan }}><FiMessageCircle size={20} aria-hidden /></Box>
                {h.open}
            </ButtonBase>

            {phone ? (
                <Drawer
                    anchor="bottom"
                    open={open}
                    onClose={close}
                    slotProps={{
                        paper: {
                            sx: { height: '88dvh', maxHeight: '88dvh', borderTopLeftRadius: b.radiusLg, borderTopRightRadius: b.radiusLg, bgcolor: b.bg1 },
                        },
                        backdrop: { sx: { bgcolor: 'rgba(3,7,12,0.48)' } },
                    }}
                >
                    {panel}
                </Drawer>
            ) : (
                <Modal open={open} onClose={close} closeAfterTransition slotProps={{ backdrop: { invisible: true } }}>
                    <Grow in={open} style={{ transformOrigin: 'bottom right' }}>
                        <Box
                            sx={{
                                position: 'fixed', right: { sm: 16, md: 28 }, bottom: 28,
                                width: 400, maxWidth: 'calc(100vw - 32px)',
                                height: 'min(640px, calc(100dvh - 56px))',
                                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                                bgcolor: b.bg1, border: `1px solid ${b.line}`, borderRadius: `${b.radiusLg}px`, boxShadow: b.shadow3,
                                outline: 'none',
                            }}
                        >
                            {panel}
                        </Box>
                    </Grow>
                </Modal>
            )}
        </>
    );
}

function ChatPanel({ phone, topics, topicsFailed, onRetryTopics, messages, pending, draft, onDraft, onAsk, onPick, onVote, onRetry, onClose }) {
    const { t } = useI18n();
    const h = t.helpBot;
    const titleId = useId();
    const hintId = useId();
    const logRef = useRef(null);
    const inputRef = useRef(null);

    // From 600px the input takes focus on open. The Modal's focus trap focuses
    // the panel in its own effect, which runs after this one, so wait a frame.
    // Phones skip it so the keyboard doesn't cover the topics.
    useEffect(() => {
        if (phone) return undefined;
        const frame = requestAnimationFrame(() => inputRef.current?.focus());
        return () => cancelAnimationFrame(frame);
    }, [phone]);

    // Keep the newest message in view.
    useEffect(() => {
        const log = logRef.current;
        if (log) log.scrollTop = log.scrollHeight;
    }, [messages.length, pending]);

    const submit = (event) => {
        event.preventDefault();
        onAsk(draft);
        inputRef.current?.focus();
    };

    const chipsOrError = topicsFailed ? <ErrorText onRetry={onRetryTopics} /> : <TopicChips topics={topics} onPick={onPick} />;

    return (
        <Box role="dialog" aria-modal="true" aria-labelledby={titleId} sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            {/* Header: eyebrow, title, close */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, px: { xs: 2, sm: 2.5 }, pt: 2, pb: 1.75, bgcolor: b.surface, borderBottom: `1px solid ${b.line}` }}>
                <Box aria-hidden sx={{ width: 40, height: 40, flexShrink: 0, borderRadius: `${b.radiusSm}px`, bgcolor: b.graphite, color: b.cyan, display: 'grid', placeItems: 'center' }}>
                    <FiMessageCircle size={20} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 11, lineHeight: 1.4, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: b.accentText }}>
                        {h.eyebrow}
                    </Typography>
                    <Typography id={titleId} component="h2" sx={{ fontSize: 19, lineHeight: 1.25, fontWeight: 800, letterSpacing: '-0.4px', color: b.ink }}>
                        {h.title}
                    </Typography>
                </Box>
                <Tooltip title={h.close}>
                    <IconButton onClick={onClose} aria-label={h.close} sx={{ width: 40, height: 40, color: b.ink2, '&:focus-visible': b.focusRing }}>
                        <FiX size={20} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* The conversation. New rows are announced politely. */}
            <Box
                ref={logRef}
                sx={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', px: { xs: 2, sm: 2.5 }, py: 2 }}
            >
                <Box component="ol" role="log" aria-live="polite" aria-relevant="additions" aria-label={h.title} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Bubble from="bot" who={h.bot}>
                        <BotText>{h.greeting}</BotText>
                        <Box sx={{ mt: 1.75 }}>
                            <ChipLabel>{h.topics}</ChipLabel>
                            {chipsOrError}
                        </Box>
                    </Bubble>

                    {messages.map((m) => (
                        <Bubble key={m.key} from={m.from} who={m.from === 'user' ? h.you : h.bot}>
                            {m.from === 'user' && <UserText text={m.text} />}
                            {m.kind === 'answer' && (
                                <AnswerBody
                                    answer={m.answer}
                                    similar={m.similar}
                                    others={m.others}
                                    vote={m.vote}
                                    onVote={(kind) => onVote(m, kind)}
                                    onPick={onPick}
                                    onNavigate={onClose}
                                />
                            )}
                            {m.kind === 'noMatch' && (
                                <>
                                    <NoMatchText />
                                    {!topicsFailed && topics?.length > 0 && (
                                        <Box sx={{ mt: 1.75 }}>
                                            <ChipLabel>{h.topics}</ChipLabel>
                                            <TopicChips topics={topics} onPick={onPick} />
                                        </Box>
                                    )}
                                </>
                            )}
                            {m.kind === 'error' && <ErrorText onRetry={() => onRetry(m)} />}
                        </Bubble>
                    ))}

                    {pending && (
                        <Bubble from="bot" who={h.bot}>
                            <BotText muted>{h.searching}</BotText>
                        </Bubble>
                    )}
                </Box>
            </Box>

            {/* Question field */}
            <Box
                component="form"
                onSubmit={submit}
                sx={{ px: { xs: 2, sm: 2.5 }, pt: 1.5, pb: phone ? 'calc(12px + env(safe-area-inset-bottom, 0px))' : 1.5, bgcolor: b.surface, borderTop: `1px solid ${b.line}` }}
            >
                <Box
                    sx={{
                        display: 'flex', alignItems: 'center', gap: 1, pl: 1.75, pr: 0.75, minHeight: 48,
                        bgcolor: b.surface, border: `1px solid ${b.line}`, borderRadius: `${b.radiusMd}px`,
                        transition: `border-color 200ms ${b.ease}, box-shadow 200ms ${b.ease}`,
                        '&:hover': { borderColor: b.line2 },
                        '&:focus-within': { borderColor: b.accent, boxShadow: '0 0 0 3px rgba(15,143,199,0.16)' },
                    }}
                >
                    <Box component="label" htmlFor={`${titleId}-input`} sx={visuallyHidden}>{h.inputLabel}</Box>
                    <InputBase
                        id={`${titleId}-input`}
                        inputRef={inputRef}
                        value={draft}
                        onChange={(e) => onDraft(e.target.value)}
                        placeholder={h.placeholder}
                        autoComplete="off"
                        inputProps={{ maxLength: MAX_LENGTH, enterKeyHint: 'send', 'aria-describedby': hintId }}
                        sx={{ flex: 1, fontSize: 15, fontWeight: 500, color: b.ink2, '& input::placeholder': { color: b.muted, opacity: 1 } }}
                    />
                    <Tooltip title={h.send}>
                        <span>
                            <IconButton
                                type="submit"
                                aria-label={h.send}
                                disabled={pending || !draft.trim()}
                                sx={{
                                    width: 40, height: 40, borderRadius: `${b.radiusSm}px`, color: '#fff', background: b.ctaGradient,
                                    '&:hover': { background: b.ctaGradient, opacity: 0.92 },
                                    '&.Mui-disabled': { color: '#fff', opacity: 0.45 },
                                    '&:focus-visible': b.focusRing,
                                }}
                            >
                                <FiSend size={16} />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
                <Typography id={hintId} sx={{ mt: 0.75, fontSize: 12.5, lineHeight: 1.55, fontWeight: 600, color: b.muted }}>
                    {h.privacyHint}
                </Typography>
            </Box>
        </Box>
    );
}
