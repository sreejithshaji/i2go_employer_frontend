import 'server-only';
import { cache } from 'react';
import { isLocale } from '@/lib/i18n/config';
import { paths } from '@/lib/i18n/routes';
import { createHelpFeedback, findHelpMatches, findQuickTopics } from '../_0-database/help_repo';

// Help bot (help-bot-plan.md, Task 4): turns the visitor's question into
// answers in the page language, and validates feedback before it's stored.

/** Same cap as search_help() and help_feedback in the database. */
export const MAX_QUESTION_LENGTH = 200;

/** Suggestions under this share of the best match's score are dropped. */
const MIN_SHARE_OF_BEST = 0.5;

const FEEDBACK_KINDS = ['helpful', 'not_helpful', 'no_match'];

/** "Read more" targets an entry may use: the plain URLs of paths(lang). */
const LINK_KEYS = ['home', 'hub', 'guides', 'login', 'signup', 'forgotPassword', 'wishlist', 'recentlyViewed', 'enquiries', 'privacy', 'terms', 'impressum'];

function assertLang(lang) {
    if (!isLocale(lang)) throw new Error(`Unknown language: ${lang}`);
}

/** Trimmed, single-spaced and capped at MAX_QUESTION_LENGTH characters. */
export function normalizeQuestion(value) {
    return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_QUESTION_LENGTH).trim();
}

/** The page behind an entry's link_key in one language, or null. */
function linkHref(linkKey, lang) {
    return LINK_KEYS.includes(linkKey) ? paths(lang)[linkKey] : null;
}

/** One answer for the widget: { id, question, answer, href }. */
function toAnswer(row, lang) {
    return { id: row.id, question: row.question, answer: row.answer, href: linkHref(row.link_key, lang) };
}

/**
 * Answers to a question in one language:
 *   { query, best: answer | null, others: answer[] (0–2), matchedBy: 'text' | 'similar' | null }
 * `others` keeps only suggestions that score at least half as well as the best
 * match, so a clear answer isn't followed by unrelated ones. matchedBy 'similar'
 * means the words didn't match and the answer was found by spelling (typos);
 * the widget can phrase that as "Did you mean…?".
 */
export async function searchHelp(lang, question) {
    assertLang(lang);
    const query = normalizeQuestion(question);
    if (!query) return { query, best: null, others: [], matchedBy: null };

    const [first, ...rest] = await findHelpMatches(query, lang);
    if (!first) return { query, best: null, others: [], matchedBy: null };

    const others = rest.filter((row) => row.score >= first.score * MIN_SHARE_OF_BEST);
    return {
        query,
        best: toAnswer(first, lang),
        others: others.map((row) => toAnswer(row, lang)),
        matchedBy: first.matched_by,
    };
}

const getQuickTopicRows = cache(async () => findQuickTopics());

/** Quick topics in one language, in display order: answer[]. */
export async function getQuickTopics(lang) {
    assertLang(lang);
    return (await getQuickTopicRows()).map((row) => toAnswer({
        id: row.id,
        question: row[`question_${lang}`],
        answer: row[`answer_${lang}`],
        link_key: row.link_key,
    }, lang));
}

/**
 * Stores a vote ('helpful' / 'not_helpful' with an articleId) or a 'no_match'
 * with the typed question. Votes never carry text. Returns true when stored;
 * false for anything invalid, so the widget can send it and move on.
 */
export async function sendHelpFeedback({ kind, lang, articleId, query }) {
    if (!FEEDBACK_KINDS.includes(kind) || !isLocale(lang)) return false;
    if (kind === 'no_match') {
        const text = normalizeQuestion(query);
        return text ? createHelpFeedback({ kind, lang, query: text }) : false;
    }
    const id = Number(articleId);
    if (!Number.isSafeInteger(id) || id <= 0) return false;
    return createHelpFeedback({ kind, lang, articleId: id });
}
