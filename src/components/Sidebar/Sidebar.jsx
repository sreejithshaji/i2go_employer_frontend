import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiUsers, FiBarChart2, FiCalendar, FiBriefcase, FiSettings } from "react-icons/fi";
import logo from '../../assets/logo/i2go_logo.png';
import "../../App.css";

const menuItems = [
    // { label: "Dashboard", icon: <FiHome className="menu-icon" />, path: "/" },
    { label: "People", icon: <FiUsers className="menu-icon" />, path: "/people" },
    // { label: "Statistic", icon: <FiBarChart2 className="menu-icon" />, path: "/statistic" },
    // { label: "Schedule", icon: <FiCalendar className="menu-icon" />, path: "/schedule" },
    { label: "Meetings", icon: <FiCalendar className="menu-icon" />, path: "/meetings" },
    // { label: "Company", icon: <FiBriefcase className="menu-icon" />, path: "/company" },
    // { label: "Settings", icon: <FiSettings className="menu-icon" />, path: "/settings" },
];

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <img src={logo} alt="i2Go Logo" className="logo-image" />
                </div>
            </div>
            <nav>
                <ul>
                    {menuItems.map(item => (
                        <li
                            key={item.label}
                            className={location.pathname.startsWith(item.path) && item.path !== "/" ? "active" : ""}
                            onClick={() => navigate(item.path)}
                            style={{ cursor: "pointer" }}
                        >
                            {item.icon} {item.label}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
