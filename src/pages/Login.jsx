import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session && session.user) {
                navigate('/', { replace: true });
            }
        });
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            onLogin && onLogin(data);
            navigate('/', { replace: true });
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        setLoading(false);
        if (error) setError(error.message);
    };

    return (
        <div className="login-split-bg">
            <div className="login-split-left">
                <div className="login-card">
                    <img src="../assets/logo/i2go_logo.png" alt="Logo" className="login-logo-modern" />
                    <div className="login-title">Login</div>
                    <div className="login-desc">See your growth and get consulting support!</div>
                    {/* <button type="button" className="login-google-btn" onClick={handleGoogleSignIn}>
                        <span className="login-google-icon">{String.fromCodePoint(0x1F5A5)}</span> Sign in with Google
                    </button> */}
                    <form className="login-form-modern" onSubmit={handleSubmit}>
                        <label className="login-label">Email*

                        </label>
                        <input
                            type="email"
                            placeholder="mail@website.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="login-input"
                        />
                        <label className="login-label">Password*

                        </label>
                        <input
                            type="password"
                            placeholder="Min. 8 character"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="login-input"
                        />
                        <button type="submit" className="login-main-btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                        {error && <div className="login-error">{error}</div>}
                    </form>
                    {/* <div className="login-copyright">©2022 Erdem All rights reserved</div> */}
                </div>
            </div>
            <div className="login-split-right">
                <div className="login-image-bg">
                    <img
                        src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80"
                        alt="Office background"
                        className="login-main-img"
                    />
                    <div className="login-image-overlay" />
                </div>
            </div>
        </div>
    );
};

export default Login;
