import NotFound from '@/components/not-found-view';

// Rendered inside the shell (this route group's layout) for notFound() and for
// unknown paths (the [...missing] catch-all), with a real 404 status.
export default function NotFoundPage() {
    return <NotFound />;
}
