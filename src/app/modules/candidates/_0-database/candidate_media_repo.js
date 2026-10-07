import 'server-only';
import { createServerSupabase } from '@/lib/supabase/server';

// Photos and videos are private storage paths. Storage policies only let
// employers sign them, and only for live candidates (migration 0014).

const PHOTO_BUCKET = 'candidate_documents';
const VIDEO_BUCKET = 'candidate_videos';

/**
 * Path of a photo's 256px thumbnail, uploaded next to it by the app:
 * `<uid>/photo_1.jpg` → `<uid>/photo_1_thumb.jpg`. Same rule as the app
 * (CandidateProfileRepository.photoThumbPath) and the storage policy (0020).
 */
export const photoThumbPath = (photoPath) => `${photoPath.replace(/\.[^./]*$/, '')}_thumb.jpg`;

async function signPhotos(paths, expiresInSeconds) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.storage
        .from(PHOTO_BUCKET)
        .createSignedUrls(paths, expiresInSeconds);
    if (error) throw error;
    return data || [];
}

/**
 * Signed URLs for photo paths: [{ path, signedUrl }], keyed by the photo path.
 * Signs the thumbnail; photos uploaded before thumbnails existed have none
 * (or it can't be signed), and those get the full photo instead.
 */
export async function createSignedPhotoUrls(paths, expiresInSeconds) {
    const urls = new Map();
    for (const item of await signPhotos(paths.map(photoThumbPath), expiresInSeconds)) {
        if (item.signedUrl) urls.set(item.path, item.signedUrl);
    }
    const missing = paths.filter((path) => !urls.has(photoThumbPath(path)));
    const originals = new Map();
    if (missing.length > 0) {
        for (const item of await signPhotos(missing, expiresInSeconds)) {
            if (item.signedUrl) originals.set(item.path, item.signedUrl);
        }
    }
    return paths.map((path) => ({ path, signedUrl: urls.get(photoThumbPath(path)) ?? originals.get(path) ?? null }));
}

/** Signed URL for an intro video path, or null. */
export async function createSignedVideoUrl(path, expiresInSeconds) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.storage
        .from(VIDEO_BUCKET)
        .createSignedUrl(path, expiresInSeconds);
    if (error) throw error;
    return data?.signedUrl ?? null;
}
