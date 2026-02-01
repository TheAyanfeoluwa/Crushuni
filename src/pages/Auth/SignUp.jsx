
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const SignUp = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await register(firstName, lastName, email, password);

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
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create Account</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Join CrushUni today</p>
                </div>

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {error && <div style={{ color: '#DC2626', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>First Name</label>
                            <input
                                type="text"
                                placeholder="John"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Last Name</label>
                            <input
                                type="text"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign Up"}
                    </button>
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;

