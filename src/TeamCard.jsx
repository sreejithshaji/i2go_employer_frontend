import React from "react";
import "./App.css";

function TeamCard({ avatar, name, role, projects, done, progress, productivity }) {
    return (
        <div className="team-card">
            <img src={avatar} alt={name} className="card-avatar" />
            <div className="card-name">{name}</div>
            <div className="card-role">{role}</div>
            <div className="card-stats">
                <span>Projects <b>{projects}</b></span>
                <span>Done <b>{done}</b></span>
                <span>Progress <b>{progress}</b></span>
            </div>
            <div className="card-productivity">
                Productivity <span className="prod-blue">{productivity}%</span>
            </div>
        </div>
    );
}

export default TeamCard;
