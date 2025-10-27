import React from "react";
import { FiHome, FiUsers, FiBarChart2, FiCalendar, FiBriefcase, FiSettings } from "react-icons/fi";
import logo from '../../assets/logo/i2go_logo.png';
import "../../App.css";

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <img src={logo} alt="i2Go Logo" className="logo-image" />
                </div>
            </div>
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
