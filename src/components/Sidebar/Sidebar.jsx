import React from "react";
import { FiHome, FiUsers, FiBarChart2, FiCalendar, FiBriefcase, FiSettings } from "react-icons/fi";
import "../../App.css";

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="logo">Emplo<span className="blue">Yee</span></div>
            <nav>
                <ul>
                    <li><FiHome className="menu-icon" /> Dashboard</li>
                    <li className="active"><FiUsers className="menu-icon" /> People</li>
                    <li><FiBarChart2 className="menu-icon" /> Statistic</li>
                    <li><FiCalendar className="menu-icon" /> Schedule</li>
                    <li><FiBriefcase className="menu-icon" /> Company</li>
                    <li><FiSettings className="menu-icon" /> Settings</li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
