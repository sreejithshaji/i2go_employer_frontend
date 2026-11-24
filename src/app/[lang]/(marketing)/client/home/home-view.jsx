import CandidateStory from './candidate-story';
import ContextSection from './context-section';
import EmployerStory from './employer-story';
import HeroSection from './hero-section';
import JourneyDoors from './journey-doors';
import LatestCandidates from './latest-candidates';
import SeoLinksSection from './seo-links-section';

/**
 * The homepage, from the server: `latest` (up to 12 newest candidates),
 * `total` (live profiles), `jobs` (live categories: { id, name, href, count }),
 * `categories` (every active category, same shape, for the category slider),
 * `guides` ({ slug, title, description }), and for the hero search
 * `heroFilters` ({ professions, germanLevels, germanCertificate }) and
 * `germanB1` (live candidates with German B1+).
 *
 * Order: hero (with search, stats and the category slider), latest
 * candidates, why it matters, then choose your journey. Nav and footer come from the
 * marketing layout.
 */
export default function HomeView({ latest = [], total = 0, jobs = [], categories = [], guides = [], heroFilters, germanB1 = 0 }) {
    return (
        <>
            <HeroSection total={total} jobs={jobs} categories={categories} latest={latest} filters={heroFilters} germanB1={germanB1} />
            <LatestCandidates latest={latest} total={total} />
            <ContextSection />
            <JourneyDoors />
            <EmployerStory total={total} jobs={jobs} />
            <CandidateStory />
            <SeoLinksSection guides={guides} />
        </>
    );
}
