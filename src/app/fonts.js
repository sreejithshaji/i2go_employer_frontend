import { Poppins } from 'next/font/google';

// Downloaded at build time and served from this site, so visitors' browsers
// never contact Google (see PLAN.md section 6, Google Fonts).
// `subsets` only picks what is preloaded: the CSS still has every subset with
// its unicode-range, so names like "Łukasz" fetch latin-ext when they appear.
// German needs only latin (ä, ö, ü, ß); preloading less helps LCP (11.14).
export const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-poppins',
});
