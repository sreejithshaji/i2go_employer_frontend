'use server';

import { getQuickTopics, searchHelp, sendHelpFeedback } from '@/app/modules/help/_1-domain/help_service';

// Help bot (help-bot-plan.md, H2): the widget is on every layout and belongs to
// no single route, so its actions live in this feature folder. All are open to
// guests (H3); the service checks the language and caps the question. Errors
// become { success: false } so the panel can offer Retry.

/** The quick topics for the start of the chat: { success, topics: answer[] }. */
export async function getHelpTopics(lang) {
    try {
        return { success: true, topics: await getQuickTopics(lang) };
    } catch {
        return { success: false };
    }
}

/** Answers to a typed question: { success, best, others, matchedBy }. */
export async function askHelp(lang, question) {
    try {
        const { best, others, matchedBy } = await searchHelp(lang, question);
        return { success: true, best, others, matchedBy };
    } catch {
        return { success: false };
    }
}

/**
 * Anonymous feedback (H4): a vote ({ kind: 'helpful' | 'not_helpful', articleId })
 * or a question nothing matched ({ kind: 'no_match', query }). No user id or IP
 * is stored. The service drops anything invalid; the widget ignores the result.
 */
export async function logHelpFeedback(lang, { kind, articleId, query }) {
    try {
        return { success: await sendHelpFeedback({ kind, lang, articleId, query }) };
    } catch {
        return { success: false };
    }
}
