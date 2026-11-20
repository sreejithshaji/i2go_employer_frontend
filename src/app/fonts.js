import { Plus_Jakarta_Sans } from 'next/font/google';

// Downloaded at build time and served from this site, so visitors' browsers
// never contact Google (see PLAN.md section 6, Google Fonts).
// `subsets` only picks what is preloaded: the CSS still has every subset with
// its unicode-range, so names like "Łukasz" fetch latin-ext when they appear.
// German needs only latin (ä, ö, ü, ß); preloading less helps LCP (11.14).
// The font of the whole site since Task 14.2 (homepage-redesign-plan.md §8,
// replacing Poppins). A variable font, so 500–800 come from one file. Its
// variable is set on <html> in [lang]/layout.jsx.
export const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jakarta',
});
