import React from 'react';
import './TeamCardSkeleton.css';

const TeamCardSkeleton = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-name"></div>
            <div className="skeleton-role"></div>
            <div className="skeleton-stats">
                <div className="skeleton-stat"></div>
                <div className="skeleton-stat"></div>
            </div>
            <div className="skeleton-tags">
                <div className="skeleton-tag"></div>
                <div className="skeleton-tag"></div>
            </div>
        </div>
    );
};

export default TeamCardSkeleton;