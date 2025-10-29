import React from "react";
import { FiCalendar } from "react-icons/fi";
import "./MeetingsSidebar.css";

const MeetingsSidebar = ({ onSelect }) => (
    <aside className="meetings-sidebar">
        <ul>
            <li className="sidebar-title">Menu</li>
            <li className="sidebar-item" onClick={() => onSelect && onSelect("meetings")}> <FiCalendar className="menu-icon" /> Meetings</li>
        </ul>
    </aside>
);

export default MeetingsSidebar;
