import React from "react";
import "./App.css";

function Header() {
    return (
        <div className="header">
            <div className="breadcrumbs">
                <span>People</span>
                <span className="chevron">→</span>
                <span>Design Team</span>
            </div>
            <div className="team-avatars">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="avatar" />
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" className="avatar" />
                <img src="https://randomuser.me/api/portraits/men/54.jpg" alt="avatar" className="avatar" />
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="avatar" className="avatar" />
                <span className="avatar-count">20</span>
            </div>
        </div>
    );
}

export default Header;
