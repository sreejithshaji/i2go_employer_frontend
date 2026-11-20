/** @type {import('next').NextConfig} */
const nextConfig = {
    // URLs without a language (/, /candidates, the old Vite-era /saved and
    // /people) are redirected in src/proxy.js, which picks the language.

    // Basic security headers (TOM annex, documents/6): not framed by other
    // sites (clickjacking on the sign-in and enquiry forms), no MIME sniffing,
    // and no full URLs leaked to other sites.
    async headers() {
        return [{
            source: '/:path*',
            headers: [
                { key: 'X-Frame-Options', value: 'DENY' },
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                // HTTPS only for two years, subdomains included (ignored on plain http://localhost).
                { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
                { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
            ],
        }];
    },
};

export default nextConfig;
