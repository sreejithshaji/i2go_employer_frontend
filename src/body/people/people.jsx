import React, { useEffect, useState, useCallback, useRef } from "react";
import Select from 'react-select';
import TeamCard from "../../components/TeamCard/TeamCard";
import ProfilePopup from "../../components/ProfilePopup/ProfilePopup";
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
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);

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


    // Popup state
    const [popupOpen, setPopupOpen] = useState(false);
    const [currentProfileIndex, setCurrentProfileIndex] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState(null);

    // Handle card click to open popup and fetch profile
    const handleCardClick = async (candidateId) => {
        const idx = candidates.findIndex(c => c.id === candidateId);
        if (idx === -1) return;
        setCurrentProfileIndex(idx);
        setPopupOpen(true);
        setProfileLoading(true);
        setProfileError(null);
        setProfileData(null);
        try {
            const data = await candidatesService.getCandidateById(candidateId);
            setProfileData(data);
        } catch (err) {
            setProfileError(err.message || 'Failed to load profile');
        } finally {
            setProfileLoading(false);
        }
    };

    // Close popup
    const handleClosePopup = () => {
        setPopupOpen(false);
        setCurrentProfileIndex(null);
        setProfileData(null);
        setProfileError(null);
    };

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
                subCategoryIds: selectedSubCategories.length > 0 ? selectedSubCategories : null
            };

            const result = await candidatesService.getCandidates(options);
            console.log('Fetch candidates result:', result.data);
            var fulllData = [...candidates, ...result.data];
            console.log('Fetched candidates:', fulllData);
            if (append) {
                setCandidates(prev => [...prev, ...result.data]);
            } else {
                setCandidates(result.data);
            }
            // console.log('Fetched length, pageSize:', result.data.length, pageSize);
            setHasMore(result.data.length === pageSize);
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
    }, [debouncedSearchQuery, selectedSubCategories]);

    // Initial load and when filters change
    useEffect(() => {
        fetchCandidates(1, false);
    }, [fetchCandidates]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle subcategory filter change
    const handleSubCategoryChange = (selectedOptions) => {
        const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedSubCategories(selectedIds);
    };

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
        setCandidates([]);
    }, [debouncedSearchQuery, selectedSubCategories]);

    // Infinite scroll handler
    const handleScroll = useCallback(() => {
        console.log('Scroll detected ', loadingRef.current, hasMore, isLoadingMore);
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
                <div >
                    <div className="search-filter">
                        <input
                            type="text"
                            placeholder="Search by name or register number"
                            className="search-input"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <Select
                            isMulti
                            options={subCategories.map(subCategory => ({
                                value: subCategory.id,
                                label: subCategory.name
                            }))}
                            value={subCategories
                                .filter(subCategory => selectedSubCategories.includes(subCategory.id))
                                .map(subCategory => ({
                                    value: subCategory.id,
                                    label: subCategory.name
                                }))}
                            onChange={handleSubCategoryChange}
                            placeholder="Select categories..."
                            className="subcategory-select"
                            classNamePrefix="select"
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    minWidth: 200,
                                    fontSize: '14px'
                                }),
                                multiValue: (provided) => ({
                                    ...provided,
                                    backgroundColor: '#e3f2fd'
                                }),
                                multiValueLabel: (provided) => ({
                                    ...provided,
                                    color: '#1565c0'
                                }),
                                multiValueRemove: (provided) => ({
                                    ...provided,
                                    color: '#1565c0',
                                    ':hover': {
                                        backgroundColor: '#bbdefb',
                                        color: '#0d47a1'
                                    }
                                })
                            }}
                        />
                        <button className="filter-btn">☰</button>
                    </div>
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
                        <TeamCard
                            key={`${candidate.id}-${currentPage}-${idx}`}
                            {...candidate}
                            onClick={() => handleCardClick(candidate.id)}
                        />
                    ))}
                    {/* Profile Popup */}
                    <ProfilePopup
                        open={popupOpen}
                        onClose={handleClosePopup}
                        profileData={profileData}
                        loading={profileLoading}
                        error={profileError}
                        candidates={candidates}
                        currentIndex={currentProfileIndex}
                        setCurrentIndex={setCurrentProfileIndex}
                        setProfileData={setProfileData}
                        setProfileLoading={setProfileLoading}
                        setProfileError={setProfileError}
                        hasMore={hasMore}
                        fetchCandidates={() => {
                            loadingRef.current = true;
                            fetchCandidates(currentPage + 1, true).finally(() => {
                                loadingRef.current = false;
                            });
                        }}
                        currentPage={currentPage}
                    />
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