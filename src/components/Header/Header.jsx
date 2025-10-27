import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data?.user || null);
            setRole(data?.user?.user_metadata?.role || 'User');
        });
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login', { replace: true });
    };

    if (!user) return null;

    return (
        <div className="app-header-bar">
            <div className="header-left">
                <span className="header-greeting">Hi, <b>{user.user_metadata?.name || user.email}</b></span>
            </div>
            <div className="header-right-align">
                {/* <span className="header-user">{user.user_metadata?.name || user.email}</span>
                <span className="header-role">{role}</span> */}
                <button className="header-logout" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Header;
