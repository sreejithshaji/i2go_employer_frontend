import React, { useEffect, useState, useCallback, useRef } from "react";
import TeamCard from "../../components/TeamCard/TeamCard";
import TeamCardSkeleton from "../../components/TeamCardSkeleton/TeamCardSkeleton";
import { candidatesService } from "../../services/candidates";
import '../../components/TeamCardSkeleton/TeamCardSkeleton.css';

const People = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subCategories, setSubCategories] = useState([]);

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Refs for scroll detection
    const gridRef = useRef(null);
    const loadingRef = useRef(false);

    const pageSize = 12;

    // Debounced search
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch subcategories on mount
    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const data = await candidatesService.getSubCategories();
                setSubCategories(data);
            } catch (err) {
                console.error('Error fetching subcategories:', err);
            }
        };
        fetchSubCategories();
    }, []);

    // Fetch candidates when filters change
    const fetchCandidates = useCallback(async (page = 1, append = false) => {
        try {
            if (!append) {
                setLoading(true);
            } else {
                setIsLoadingMore(true);
            }

            const options = {
                page: page,
                limit: pageSize,
                searchQuery: debouncedSearchQuery,
                subCategoryId: selectedSubCategory || null
            };

            const result = await candidatesService.getCandidates(options);

            if (append) {
                setCandidates(prev => [...prev, ...result.data]);
            } else {
                setCandidates(result.data);
            }

            setHasMore(result.hasMore);
            setCurrentPage(page);
            setError(null);
        } catch (err) {
            setError(err.message);
            if (!append) {
                setCandidates([]);
            }
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    }, [debouncedSearchQuery, selectedSubCategory]);

    // Initial load and when filters change
    useEffect(() => {
        fetchCandidates(1, false);
    }, [fetchCandidates]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle subcategory filter change
    const handleSubCategoryChange = (e) => {
        setSelectedSubCategory(e.target.value);
    };

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
        setCandidates([]);
    }, [debouncedSearchQuery, selectedSubCategory]);

    // Infinite scroll handler
    const handleScroll = useCallback(() => {
        if (loadingRef.current || !hasMore || isLoadingMore) return;

        const grid = gridRef.current;
        if (!grid) return;

        const { scrollTop, scrollHeight, clientHeight } = grid;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px threshold

        if (isNearBottom) {
            loadingRef.current = true;
            fetchCandidates(currentPage + 1, true).finally(() => {
                loadingRef.current = false;
            });
        }
    }, [hasMore, isLoadingMore, currentPage, fetchCandidates]);

    // Add scroll listener
    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        grid.addEventListener('scroll', handleScroll);
        return () => grid.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);


    return (
        <main className="main-content">
            <div className="design-team-header">
                <h2>Candidates</h2>
                <div className="search-filter">
                    <input
                        type="text"
                        placeholder="Search by name or register number"
                        className="search-input"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <select
                        className="subcategory-select"
                        value={selectedSubCategory}
                        onChange={handleSubCategoryChange}
                    >
                        <option value="">All Categories</option>
                        {subCategories.map(subCategory => (
                            <option key={subCategory.id} value={subCategory.id}>
                                {subCategory.name}
                            </option>
                        ))}
                    </select>
                    <button className="filter-btn">☰</button>
                </div>
            </div>
            <div className="content-row">
                <div className="team-grid" ref={gridRef}>
                    {loading && !candidates.length && (
                        <>
                            {Array.from({ length: 6 }, (_, index) => (
                                <TeamCardSkeleton key={`skeleton-${index}`} />
                            ))}
                        </>
                    )}
                    {error && candidates.length === 0 && (
                        <div style={{ color: 'red', padding: '20px', gridColumn: '1 / -1' }}>
                            Error: {error}
                        </div>
                    )}
                    {!loading && !error && candidates.length === 0 && (
                        <div className="no-results" style={{ gridColumn: '1 / -1' }}>
                            No candidates found matching your criteria.
                        </div>
                    )}
                    {!loading && !error && candidates.map((candidate, idx) => (
                        <TeamCard key={`${candidate.id}-${currentPage}-${idx}`} {...candidate} />
                    ))}
                    {isLoadingMore && (
                        <>
                            {Array.from({ length: 3 }, (_, index) => (
                                <TeamCardSkeleton key={`loading-${index}`} />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};

export default People;