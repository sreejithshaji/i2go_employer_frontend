// Web app manifest: name and icons when the portal is added to a home screen.
export default function manifest() {
    return {
        name: 'I2Go Arbeitgeberportal',
        short_name: 'I2Go',
        description: 'Fachkräfte aus Indien für Arbeitgeber in Europa.',
        start_url: '/',
        display: 'standalone',
        background_color: '#FFFFFF',
        theme_color: '#FFFFFF',
        icons: [
            { src: '/icon.png', type: 'image/png', sizes: '512x512' },
            { src: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
        ],
    };
}
