import React, { useState } from "react";
import "./TeamCard.css";
import { FiInstagram, FiX, FiGlobe } from "react-icons/fi";

function TeamCard({
    // Team member fields
    avatar, name, role, projects, done, progress, productivity,
    // Candidate fields
    full_name, email_id, register_number, profile_picture_url, department, status, performance, // eslint-disable-line no-unused-vars
    job_category, has_work_experience, education_tags = [], skill_tags = [],
    onClick,
    onSchedule
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

    // Stats: use props if available, else fallback
    const likes = (isCandidate && typeof status === 'number') ? status : 72900;
    const posts = (isCandidate && typeof performance === 'number') ? performance : 828;
    const views = (isCandidate && typeof productivity === 'number') ? productivity : 342900;

    return (
        <div className="team-card modern-profile-card">
            {/* Top right floating button */}

            {/* Avatar with gradient border */}
            <div className="card-avatar-gradient">
                <img src={displayAvatar || "https://via.placeholder.com/96x96?text=No+Image"} alt={displayName} className="card-avatar-img" />
            </div>
            {/* Follow button */}
            {/* <button className="card-follow-btn">Follow&nbsp; +</button> */}
            {/* Name and role */}
            <div className="card-name">{displayName}</div>
            <div className="card-role">{isCandidate ? (department || job_category || 'Candidate') : (role || 'Team Member')}</div>
            {/* Description */}
            {/* Education tag carousel with expand on hover and left/right swiper */}
            <div
                className="card-education-carousel"
                onMouseEnter={() => setShowEducationPopup(true)}
                onMouseLeave={() => setShowEducationPopup(false)}
            >
                <div className="carousel-label">Education</div>
                <div className="carousel-controls">
                    <button
                        className="carousel-arrow left"
                        onClick={() => navigateEducation('prev')}
                        disabled={educationIndex === 0}
                        tabIndex={-1}
                    >&#8592;</button>
                    <div className="carousel-tag">
                        {education_tags && education_tags.length > 0 ? (
                            <span>{education_tags[educationIndex]}</span>
                        ) : (
                            <span className="carousel-tag-empty">No education info</span>
                        )}
                    </div>
                    <button
                        className="carousel-arrow right"
                        onClick={() => navigateEducation('next')}
                        disabled={educationIndex === education_tags.length - 1 || education_tags.length === 0}
                        tabIndex={-1}
                    >&#8594;</button>
                </div>
                {/* Expand popup on hover */}
                {showEducationPopup && education_tags && education_tags.length > 0 && (
                    <div className="carousel-popup">
                        {education_tags.map((tag, idx) => (
                            <div
                                key={idx}
                                className={`carousel-popup-tag${idx === educationIndex ? ' active' : ''}`}
                                onMouseEnter={() => setEducationIndex(idx)}
                            >
                                {tag}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Social icons */}
            {/* <div className="card-socials">
                <a href="#" title="Instagram"><FiInstagram /></a>
                <a href="#" title="X"><FiX /></a>
                <a href="#" title="Website"><FiGlobe /></a>
            </div> */}
            {/* Action buttons for candidates */}
            {isCandidate && (
                <div className="card-actions-row">
                    <button
                        className="open-profile-btn"
                        onClick={onClick}
                    >
                        Open
                    </button>
                    <button
                        className="schedule-profile-btn"
                        onClick={onSchedule}
                    >
                        Schedule
                    </button>
                </div>
            )}
        </div>
    );
}

export default TeamCard;
