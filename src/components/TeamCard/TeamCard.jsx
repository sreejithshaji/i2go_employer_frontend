import React from "react";
import "../../App.css";

function TeamCard({
    // Team member fields
    avatar, name, role, projects, done, progress, productivity,
    // Candidate fields
    full_name, email_id, register_number, profile_picture_url, department, status, performance,
    job_category, has_work_experience, education_tags = [], skill_tags = []
}) {
    // Determine if this is a candidate or team member
    const isCandidate = full_name !== undefined;
    const displayName = isCandidate ? full_name : name;
    const displayAvatar = isCandidate ? profile_picture_url : avatar;
    const displayRole = isCandidate ? job_category : role;

    return (
        <div className="team-card">
            <img src={displayAvatar || "https://via.placeholder.com/56x56?text=No+Image"} alt={displayName} className="card-avatar" />
            <div className="card-name">{displayName}</div>
            <div className="card-role">{displayRole}</div>

            {isCandidate ? (
                <>
                    {/* Candidate-specific fields */}
                    <div className="card-stats">
                        <span>Status <b>{status || 'pending'}</b></span>
                        {performance && <span>Performance <b>{performance}%</b></span>}
                        {has_work_experience && <span>Experience <b>Yes</b></span>}
                    </div>

                    {/* Education Tags */}
                    {education_tags.length > 0 && (
                        <div className="card-tags">
                            <div className="tag-label">Education:</div>
                            <div className="tags-container">
                                {education_tags.slice(0, 2).map((tag, index) => (
                                    <span key={index} className="tag education-tag">{tag}</span>
                                ))}
                                {education_tags.length > 2 && (
                                    <span className="tag more-tag">+{education_tags.length - 2} more</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Technical Skills Tags */}
                    {skill_tags.length > 0 && (
                        <div className="card-tags">
                            <div className="tag-label">Skills:</div>
                            <div className="tags-container">
                                {skill_tags.slice(0, 3).map((tag, index) => (
                                    <span key={index} className="tag skill-tag">{tag}</span>
                                ))}
                                {skill_tags.length > 3 && (
                                    <span className="tag more-tag">+{skill_tags.length - 3} more</span>
                                )}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {/* Team member fields */}
                    <div className="card-stats">
                        <span>Projects <b>{projects}</b></span>
                        <span>Done <b>{done}</b></span>
                        <span>Progress <b>{progress}</b></span>
                    </div>
                    <div className="card-productivity">
                        Productivity <span className="prod-blue">{productivity}%</span>
                    </div>
                </>
            )}
        </div>
    );
}

export default TeamCard;
