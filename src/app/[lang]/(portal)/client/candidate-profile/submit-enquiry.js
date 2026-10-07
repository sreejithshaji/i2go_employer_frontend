import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/browser';

// Sent from the browser: the submit-enquiry edge function reads the employer's
// session token to link the enquiry to their account. Spam protection is our
// own (no third party): a signed form token fetched when the form opens, and
// a hidden honeypot field (see the function's header).

/** A signed "form opened at" token from submit-enquiry, or null if it couldn't be fetched. */
export async function getFormToken() {
    try {
        const { data, error } = await supabase.functions.invoke('submit-enquiry', { method: 'GET' });
        return error ? null : data?.form_token ?? null;
    } catch {
        return null;
    }
}

/**
 * Posts the enquiry form to the submit-enquiry edge function. A signed-in
 * employer's session token goes with it, so the enquiry is linked to them.
 * Throws an Error with a message to show the user: the function's own message
 * (English for now), or a fallback from the dictionary `t`.
 */
export async function submitEnquiry(t, enquiry) {
    const { error } = await supabase.functions.invoke('submit-enquiry', { body: enquiry });
    if (!error) return;

    if (error instanceof FunctionsHttpError) {
        let message = null;
        try {
            message = (await error.context.json())?.error;
        } catch {
            // Not JSON; use the fallback below.
        }
        const err = new Error(message || t.enquiry.sendFailed);
        err.status = error.context.status;
        throw err;
    }
    throw new Error(t.enquiry.offline);
}
