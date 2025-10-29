import React, { useCallback } from "react";
import "./ProfilePopup.css";

const ProfilePopup = ({
    open,
    onClose,
    profileData,
    loading,
    error,
    candidates = [],
    currentIndex,
    setCurrentIndex,
    setProfileData,
    setProfileLoading,
    setProfileError,
    hasMore,
    fetchCandidates,
    currentPage
}) => {
    if (!open) return null;

    // Navigation handlers
    const handlePrev = useCallback(async () => {
        if (currentIndex > 0 && candidates.length > 0) {
            const prevIdx = currentIndex - 1;
            setCurrentIndex(prevIdx);
            setProfileLoading(true);
            setProfileError(null);
            setProfileData(null);
            try {
                const candidateId = candidates[prevIdx].id;
                const { candidatesService } = await import("../../services/candidates");
                const data = await candidatesService.getCandidateById(candidateId);
                setProfileData(data);
            } catch (err) {
                setProfileError(err.message || 'Failed to load profile');
            } finally {
                setProfileLoading(false);
            }
        }
    }, [currentIndex, candidates, setCurrentIndex, setProfileData, setProfileLoading, setProfileError]);

    const loadNextPage = (async () => {
        console.log('At end of candidates, hasMore:', hasMore);
        // At end, try to load next page
        setProfileLoading(true);
        setProfileError(null);
        setProfileData(null);
        try {
            await fetchCandidates(currentPage + 1, true);
            setCurrentIndex(candidates.length);
        } catch (err) {
            setProfileError('Failed to load more candidates');
        } finally {
            setProfileLoading(false);
        }
    });

    const handleNext = useCallback(async () => {
        // If not at end, just go to next
        console.log('handleNext called, currentIndex:', currentIndex, 'candidates length:', candidates.length, 'hasMore:', hasMore);
        console.log('fetchNext :', currentIndex + 2 >= candidates.length);
        if (!hasMore) return;
        if (hasMore && currentIndex + 2 >= candidates.length) {
            setProfileLoading(true);
            await loadNextPage();
        }
        if (currentIndex < candidates.length - 1 && candidates.length > 0) {
            const nextIdx = currentIndex + 1;
            setCurrentIndex(nextIdx);
            setProfileLoading(true);
            setProfileError(null);
            setProfileData(null);
            try {
                const candidateId = candidates[nextIdx].id;
                const { candidatesService } = await import("../../services/candidates");
                const data = await candidatesService.getCandidateById(candidateId);
                setProfileData(data);
            } catch (err) {
                setProfileError(err.message || 'Failed to load profile');

            } finally {
                setProfileLoading(false);

            }
            return;
        }


    }, [currentIndex, candidates, setCurrentIndex, setProfileData, setProfileLoading, setProfileError, hasMore, fetchCandidates, currentPage]);

    return (
        <div className="profile-popup-overlay" onClick={onClose}>
            <div className="profile-popup profile-popup-form" onClick={e => e.stopPropagation()}>
                <div className="profile-popup-header-row">
                    <button className="profile-popup-nav-btn" title="Previous" onClick={handlePrev} disabled={currentIndex === 0}>Prev</button>
                    <div className="profile-popup-title profile-popup-header-name center-name">{profileData?.full_name || ''}
                        <button className="profile-popup-nav-btn next-btn-inline" title="Next" onClick={handleNext}
                            disabled={!hasMore}
                        >Next</button>
                    </div>
                </div>
                <div className="profile-popup-divider" />
                {loading ? (
                    <div className="profile-popup-loading">
                        <div className="profile-linkedin-top">
                            <div className="profile-linkedin-avatar-col">
                                <div className="skeleton-avatar" style={{ width: 120, height: 120, borderRadius: '50%' }} />
                            </div>
                            <div className="profile-linkedin-main-col">
                                <div className="skeleton-name" style={{ width: 180, height: 28, marginBottom: 8 }} />
                                <div className="skeleton-role" style={{ width: 120, height: 18, marginBottom: 8 }} />
                                <div className="skeleton-role" style={{ width: 160, height: 16, marginBottom: 8 }} />
                                <div className="skeleton-role" style={{ width: 100, height: 16, marginBottom: 8 }} />
                            </div>
                        </div>
                        <div className="profile-linkedin-divider" />
                        {/* Section skeletons */}
                        <div className="profile-section">
                            <div className="skeleton-name" style={{ width: 120, height: 20, marginBottom: 12 }} />
                            <div className="profile-section-list">
                                {[1, 2, 3].map(i => (
                                    <div className="profile-section-item" key={i} style={{ minHeight: 48 }}>
                                        <div className="skeleton-role" style={{ width: 180, height: 16, marginBottom: 6 }} />
                                        <div className="skeleton-role" style={{ width: 120, height: 14 }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : error ? (
                    <div className="profile-popup-error">Error: {error}</div>
                ) : profileData ? (
                    <div>
                        <div className="profile-linkedin-top">
                            <div className="profile-linkedin-avatar-col">
                                <img src={profileData.profile_picture_url} alt={profileData.full_name} className="profile-linkedin-avatar" />
                            </div>
                            <div className="profile-linkedin-main-col">
                                <div className="profile-linkedin-name">{profileData.full_name}</div>
                                {/* <div className="profile-linkedin-title">{profileData.job_category || '-'}</div> */}
                                <div className="profile-linkedin-meta">
                                    {/* <span>{profileData.main_job_category || '-'}</span> */}
                                    <span>{profileData.sub_categories_view.name}</span>
                                    {/* {profileData.department && <span>
                                        |
                                        {profileData.department}</span>} */}
                                </div>
                                <div className="profile-linkedin-contact">
                                    <span>{profileData.email_id}</span>
                                    {profileData.candidate_addresses?.[0]?.phone_number && <span> | {profileData.candidate_addresses[0].phone_number}</span>}
                                </div>
                                <div className="profile-linkedin-meta">
                                    <span>{profileData.gender || '-'}</span>
                                    {profileData.age && <span> | {profileData.age} years</span>}
                                    {profileData.register_number && <span> | ID: {profileData.register_number}</span>}
                                </div>
                                {profileData.candidate_addresses?.[0]?.address && (
                                    <div className="profile-linkedin-address">{profileData.candidate_addresses[0].address}</div>
                                )}
                                {/* <div className="profile-linkedin-date">
                                    <span className="icon-calendar" />
                                    <span>{profileData.created_at ? new Date(profileData.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}</span>
                                </div> */}
                            </div>
                        </div>
                        <div className="profile-linkedin-divider" />
                        {/* --- Additional Sections --- */}
                        {/* Skills Section */}
                        {profileData.candidate_technical_skills?.length > 0 && (
                            <div className="profile-section">
                                <div className="profile-section-title">Skills</div>
                                <div className="profile-section-list">
                                    {profileData.candidate_technical_skills.map((skill, i) => (
                                        <div className="profile-section-item" key={i}>
                                            <b>{skill.technical_skills?.skill_name || '-'}</b>
                                            {skill.technical_skills?.skill_category && (
                                                <span className="profile-section-sub">({skill.technical_skills.skill_category})</span>
                                            )}
                                            <span className="profile-section-detail">{skill.proficiency_level} | {skill.years_of_experience} yrs</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Education Section */}
                        {profileData.candidate_education?.length > 0 && (
                            <div className="profile-section">
                                <div className="profile-section-title">Education</div>
                                <div className="profile-section-list">
                                    {profileData.candidate_education.map((edu, i) => (
                                        <div className="profile-section-item" key={i}>
                                            <b>{edu.degree_type} {edu.course_name}</b>
                                            {edu.specialization && <span className="profile-section-sub">({edu.specialization})</span>}
                                            <span className="profile-section-detail">{edu.institution_name}{edu.university_name ? `, ${edu.university_name}` : ''} | {edu.year_of_passing}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Work Experience Section */}
                        {profileData.candidate_work_experience?.length > 0 && (
                            <div className="profile-section">
                                <div className="profile-section-title">Work Experience</div>
                                <div className="profile-section-list">
                                    {profileData.candidate_work_experience.map((exp, i) => (
                                        <div className="profile-section-item" key={i}>
                                            <b>{exp.position}</b> <span className="profile-section-sub">@ {exp.company_name}</span>
                                            <span className="profile-section-detail">{exp.start_date} - {exp.end_date || 'Present'}</span>
                                            {exp.location && <span className="profile-section-detail">{exp.location}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Languages Section */}
                        {profileData.candidate_languages?.length > 0 && (
                            <div className="profile-section">
                                <div className="profile-section-title">Languages</div>
                                <div className="profile-section-list">
                                    {profileData.candidate_languages.map((lang, i) => (
                                        <div className="profile-section-item" key={i}>
                                            <b>{lang.languages?.language_name || '-'}</b>
                                            <span className="profile-section-detail">Speaking: {lang.speaking_level}, Reading: {lang.reading_level}, Writing: {lang.writing_level}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Documents Section */}
                        {profileData.candidate_documents?.length > 0 && (
                            <div className="profile-section">
                                <div className="profile-section-title">Documents</div>
                                <div className="profile-section-list">
                                    {profileData.candidate_documents.map((doc, i) => (
                                        <div className="profile-section-item" key={i}>
                                            <b>{doc.document_type}</b>: {doc.document_name}
                                            {doc.file_url && (
                                                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="profile-section-link">View</a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="profile-popup-actions">
                            <button type="button" className="profile-popup-cancel-btn" onClick={onClose}>Close</button>
                        </div>
                    </div>
                ) : null}
                <button className="close-btn" onClick={onClose}>&times;</button>
            </div>
        </div >
    );
};

export default ProfilePopup;
