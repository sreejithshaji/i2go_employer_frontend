import 'server-only';
import { createPublicSupabase } from '@/lib/supabase/server';

// Help bot (help-bot-plan.md; migrations 0033–0037). The entries are the same
// for everyone, and feedback is anonymous by design (no user id), so every call
// goes without the visitor's session. RLS only returns published entries.

const QUICK_TOPIC_COLUMNS = 'id, position, question_de, question_en, answer_de, answer_en, link_key';

/**
 * Up to 3 published entries for a question, best first, in one language:
 * [{ id, question, answer, link_key, matched_by ('text' | 'similar'), score }].
 */
export async function findHelpMatches(question, lang) {
    const { data, error } = await createPublicSupabase().rpc('search_help', { q: question, lang });
    if (error) throw error;
    return data || [];
}

/** Published quick topics (the chips shown when the chat opens), in display order. */
export async function findQuickTopics() {
    const { data, error } = await createPublicSupabase()
        .from('help_articles')
        .select(QUICK_TOPIC_COLUMNS)
        .eq('is_published', true)
        .eq('is_quick_topic', true)
        .order('position')
        .order('id');
    if (error) throw error;
    return data || [];
}

/**
 * Stores one vote or "no match" through log_help_feedback(). Returns true when
 * stored, false when the database ignored it (invalid input or flood guard).
 */
export async function createHelpFeedback({ kind, lang, articleId = null, query = null }) {
    const { data, error } = await createPublicSupabase().rpc('log_help_feedback', {
        p_kind: kind,
        p_lang: lang,
        p_article_id: articleId,
        p_query: query,
    });
    if (error) throw error;
    return data === true;
}
