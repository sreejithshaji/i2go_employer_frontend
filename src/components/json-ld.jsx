/**
 * Renders structured data as a JSON-LD script tag (server component). "<" is
 * escaped so text from the database can't close the tag.
 */
export default function JsonLd({ data }) {
    const items = (Array.isArray(data) ? data : [data]).filter(Boolean);
    return items.map((item, i) => (
        <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, '\\u003c') }}
        />
    ));
}
