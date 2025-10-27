import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import './Footer.css';

const Footer = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get current user
        const getCurrentUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getCurrentUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (!user) return null;

    return (
        <footer className="app-footer">
            <div className="footer-content">
                <div className="user-info">
                    <span className="username">
                        {user.email || 'User'}
                    </span>
                </div>
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                    title="Logout"
                >
                    Logout
                </button>
            </div>
        </footer>
    );
};

export default Footer;