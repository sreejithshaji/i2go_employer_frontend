import { Plus_Jakarta_Sans, Poppins } from 'next/font/google';

// Downloaded at build time and served from this site, so visitors' browsers
// never contact Google (see PLAN.md section 6, Google Fonts).
// `subsets` only picks what is preloaded: the CSS still has every subset with
// its unicode-range, so names like "Łukasz" fetch latin-ext when they appear.
// German needs only latin (ä, ö, ü, ß); preloading less helps LCP (11.14).
// Marketing pages only (the homepage, homepage-redesign-plan.md §8). A
// variable font, so 500–800 come from one file. Applied on the marketing
// layout's root element, not on <html>, so portal pages don't preload it.
export const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jakarta',
});

export const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-poppins',
});
