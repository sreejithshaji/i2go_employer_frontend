import 'server-only';
import { cache } from 'react';
import { MIN_INDEXABLE_CANDIDATES } from '@/lib/seo/config';
import { findActiveCategories, findSlugRedirect } from '../_0-database/category_repo';
import { findLanguagesWithLevels } from '../_0-database/language_repo';
import { findListingStats } from '../_0-database/listing_stats_repo';
import { findSkills } from '../_0-database/skill_repo';

// Categories and skills for the filters and the SEO landing pages (PLAN.md 11).
// Each is read once per request (React cache).

/**
 * Active job categories: { id, name, name_de, slug_de, slug_en, description_de, description_en,
 * seo_title_de, seo_title_en, seo_description_de, seo_description_en } (seo_* null = automatic).
 */
export const getCategories = cache(async () => findActiveCategories());

/** Every skill: { id, name, name_de, slug_de, slug_en }. */
export const getSkills = cache(async () => findSkills());

/**
 * Languages for the language filters (migration 0024), German first:
 * { id, name, name_de, code, has_certificate, levels: [{ name, name_de, rank }] (lowest first) }.
 */
export const getLanguages = cache(async () => {
    const rows = await findLanguagesWithLevels();
    return rows
        .map((l) => ({
            id: l.id,
            name: l.language_name,
            name_de: l.name_de,
            code: l.code,
            has_certificate: l.has_certificate,
            levels: [...(l.language_levels || [])].sort((a, b) => a.rank - b.rank),
        }))
        .sort((a, b) => (b.code === 'de') - (a.code === 'de'));
});

/**
 * Live candidate counts. Returns
 *   categoryCount(categoryId), skillCount(categoryId, skillId),
 *   lastUpdated(categoryId[, skillId]) (Date or null) and the raw rows.
 */
export const getListingStats = cache(async () => {
    const rows = await findListingStats();
    const key = (categoryId, skillId) => `${categoryId}:${skillId ?? ''}`;
    const byKey = new Map(rows.map((r) => [key(r.category_id, r.skill_id), r]));
    return {
        rows,
        categoryCount: (categoryId) => Number(byKey.get(key(categoryId))?.live_count ?? 0),
        skillCount: (categoryId, skillId) => Number(byKey.get(key(categoryId, skillId))?.live_count ?? 0),
        lastUpdated: (categoryId, skillId) => {
            const value = byKey.get(key(categoryId, skillId))?.last_updated;
            return value ? new Date(value) : null;
        },
    };
});

/** Thin-page rule (11.6): enough live candidates to be indexed. */
export const isIndexableCount = (count) => count >= MIN_INDEXABLE_CANDIDATES;

/**
 * A category slug in one language. Returns { category } for a current slug,
 * { redirectTo: category } for an old one (slug_redirects), or null.
 */
export async function resolveCategorySlug(lang, slug) {
    const categories = await getCategories();
    const category = categories.find((c) => c[`slug_${lang}`] === slug);
    if (category) return { category };
    const redirect = await findSlugRedirect('category', lang, slug);
    const target = redirect && categories.find((c) => c.id === redirect.target_id);
    return target ? { redirectTo: target } : null;
}

/** Same for a skill slug: { skill }, { redirectTo: skill } or null. */
export async function resolveSkillSlug(lang, slug) {
    const skills = await getSkills();
    const skill = skills.find((s) => s[`slug_${lang}`] === slug);
    if (skill) return { skill };
    const redirect = await findSlugRedirect('skill', lang, slug);
    const target = redirect && skills.find((s) => s.id === redirect.target_id);
    return target ? { redirectTo: target } : null;
}

/**
 * Skills that have their own page under a category: at least one live
 * candidate in the category has them. `indexable` marks those that pass the
 * thin-page rule; only those are linked from the category page (11.5.2).
 */
export async function getCategorySkills(categoryId) {
    const [skills, stats] = await Promise.all([getSkills(), getListingStats()]);
    return skills
        .map((skill) => ({ ...skill, count: stats.skillCount(categoryId, skill.id) }))
        .filter((skill) => skill.count > 0)
        .map((skill) => ({ ...skill, indexable: isIndexableCount(skill.count) }));
}

/** Slug pairs for the language switcher: { categories: [{ de, en }], skills: [{ de, en }] }. */
export async function getSlugMaps() {
    const [categories, skills] = await Promise.all([getCategories(), getSkills()]);
    const pair = (item) => ({ de: item.slug_de, en: item.slug_en });
    return { categories: categories.map(pair), skills: skills.map(pair) };
}
