
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const SignIn = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await login(email, password);

        if (result.success) {
            navigate('/app/overview');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-surface)', padding: '2rem' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '2rem' }} className="glass-panel">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                        <img src="/logo.png" alt="CrushUni Logo" style={{ height: '48px', width: 'auto' }} />
                        <span style={{ color: 'var(--color-text-main)' }}>Crush<span style={{ color: 'var(--color-primary)' }}>Uni</span></span>
                    </Link>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Sign in to continue studying</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {error && <div style={{ color: '#DC2626', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <input type="checkbox" /> Remember me
                        </label>
                        <Link to="/reset-password" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>Forgot password?</Link>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
                    </button>
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
