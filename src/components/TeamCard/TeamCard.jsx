import React, { useState } from "react";
import "../../App.css";

function TeamCard({
    // Team member fields
    avatar, name, role, projects, done, progress, productivity,
    // Candidate fields
    full_name, email_id, register_number, profile_picture_url, department, status, performance, // eslint-disable-line no-unused-vars
    job_category, has_work_experience, education_tags = [], skill_tags = [],
    onClick
}) {
    // Determine if this is a candidate or team member
    const isCandidate = full_name !== undefined;
    const displayName = isCandidate ? full_name : name;
    const displayAvatar = isCandidate ? profile_picture_url : avatar;
    const displayCategory = isCandidate ? job_category : role;
    const [showCategoryFull, setShowCategoryFull] = useState(false);

    // State for tag carousels
    const [educationIndex, setEducationIndex] = useState(0);
    const [skillsIndex, setSkillsIndex] = useState(0);
    const [showEducationPopup, setShowEducationPopup] = useState(false);
    const [showSkillsPopup, setShowSkillsPopup] = useState(false);

    // Navigation functions for carousels
    const navigateEducation = (direction) => {
        if (direction === 'next' && educationIndex < education_tags.length - 1) {
            setEducationIndex(educationIndex + 1);
        } else if (direction === 'prev' && educationIndex > 0) {
            setEducationIndex(educationIndex - 1);
        }
    };

    const navigateSkills = (direction) => {
        if (direction === 'next' && skillsIndex < skill_tags.length - 1) {
            setSkillsIndex(skillsIndex + 1);
        } else if (direction === 'prev' && skillsIndex > 0) {
            setSkillsIndex(skillsIndex - 1);
        }
    };



    // Unified tags - show relevant tags for both types
    const getUnifiedTags = () => {
        if (isCandidate) {
            return [
                { label: "Education", tags: education_tags, type: "education" },
                // { label: "Skills", tags: skill_tags, type: "skill" }
            ];
        } else {
            // For team members, show empty sections
            return [
                { label: "Education", tags: [], type: "education" },
                // { label: "Skills", tags: [], type: "skill" }
            ];
        }
    };

    const tagGroups = getUnifiedTags();

    return (
        <div className="team-card">
            <img src={displayAvatar || "https://via.placeholder.com/56x56?text=No+Image"} alt={displayName} className="card-avatar" />
            <div className="card-name">{displayName}</div>
            <div
                className="card-role"
                onMouseEnter={() => setShowCategoryFull(true)}
                onMouseLeave={() => setShowCategoryFull(false)}
                style={{
                    position: 'relative',
                    maxWidth: 180,
                    whiteSpace: showCategoryFull ? 'normal' : 'nowrap',
                    overflow: showCategoryFull ? 'visible' : 'hidden',
                    textOverflow: showCategoryFull ? 'clip' : 'ellipsis',
                    cursor: displayCategory && displayCategory.length > 15 ? 'pointer' : 'default',
                    zIndex: showCategoryFull ? 10 : undefined,
                    background: showCategoryFull ? '#fff' : undefined,
                    border: showCategoryFull ? '1px solid #bbb' : undefined,
                    borderRadius: showCategoryFull ? 6 : undefined,
                    padding: showCategoryFull ? '6px 12px' : undefined,
                    boxShadow: showCategoryFull ? '0 2px 8px rgba(0,0,0,0.08)' : undefined,
                }}
            >
                {displayCategory && displayCategory.length > 15 && !showCategoryFull
                    ? displayCategory.substring(0, 15) + '...'
                    : displayCategory}
                {displayCategory && displayCategory.length > 15 && showCategoryFull && displayCategory}
            </div>

            {/* Unified Tags Section - Carousel style */}
            {tagGroups.map((tagGroup, groupIndex) => (
                <div key={groupIndex} className="card-tags-section">
                    <div className="tag-label">{tagGroup.label}</div>
                    {tagGroup.tags.length > 0 ? (
                        <div className="tag-carousel">
                            <button
                                className="carousel-nav carousel-prev"
                                onClick={() => tagGroup.type === 'education' ? navigateEducation('prev') : navigateSkills('prev')}
                                disabled={tagGroup.type === 'education' ? educationIndex === 0 : skillsIndex === 0}
                            >
                            </button>
                            <div className="tag-display">
                                <span
                                    className={`tag ${tagGroup.type}-tag`}
                                    onMouseEnter={() => tagGroup.type === 'education' ? setShowEducationPopup(true) : setShowSkillsPopup(true)}
                                    onMouseLeave={() => tagGroup.type === 'education' ? setShowEducationPopup(false) : setShowSkillsPopup(false)}
                                >
                                    {tagGroup.tags[tagGroup.type === 'education' ? educationIndex : skillsIndex].length > 18
                                        ? tagGroup.tags[tagGroup.type === 'education' ? educationIndex : skillsIndex].substring(0, 18) + '...'
                                        : tagGroup.tags[tagGroup.type === 'education' ? educationIndex : skillsIndex]}
                                </span>
                                {(tagGroup.type === 'education' ? showEducationPopup : showSkillsPopup) && tagGroup.tags.length > 0 && isCandidate && (
                                    <div
                                        className="tag-popup"
                                        onMouseEnter={() => tagGroup.type === 'education' ? setShowEducationPopup(true) : setShowSkillsPopup(true)}
                                        onMouseLeave={() => tagGroup.type === 'education' ? setShowEducationPopup(false) : setShowSkillsPopup(false)}
                                    >
                                        <div className="tag-popup-header">{tagGroup.label}</div>
                                        <div className="tag-popup-list">
                                            {tagGroup.tags.map((tag, index) => (
                                                <span key={index} className={`tag-popup-item ${tagGroup.type}-tag`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                className="carousel-nav carousel-next"
                                onClick={() => tagGroup.type === 'education' ? navigateEducation('next') : navigateSkills('next')}
                                disabled={tagGroup.type === 'education' ? educationIndex === education_tags.length - 1 : skillsIndex === skill_tags.length - 1}
                            >
                                ›
                            </button>
                        </div>
                    ) : (
                        <div className="tag-display">
                            <span className="no-data-text">nothing</span>
                        </div>
                    )}
                </div>
            ))}

            {/* Productivity for team members */}
            {!isCandidate && productivity && (
                <div className="card-productivity">
                    Productivity <span className="prod-blue">{productivity}%</span>
                </div>
            )}

            {/* Open and Schedule buttons for candidates */}
            {isCandidate && (
                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                    <button
                        className="open-profile-btn"
                        onClick={onClick}
                        style={{ padding: '6px 18px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 500, cursor: 'pointer' }}
                    >
                        Open
                    </button>
                    <button
                        className="schedule-profile-btn"
                        // TODO: Add onClick handler for scheduling
                        style={{ padding: '6px 5px', borderRadius: 6, background: '#43a047', color: '#fff', border: 'none', fontWeight: 500, cursor: 'pointer' }}
                    >
                        Schedule
                    </button>
                </div>
            )}
        </div>
    );
}

export default TeamCard;
