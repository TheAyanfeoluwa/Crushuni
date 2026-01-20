
import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-surface)' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '2rem' }} className="glass-panel">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <img src="/logo.png" alt="CrushUni Logo" style={{ height: '64px', width: 'auto' }} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Reset Password</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Enter your email to receive a reset link</p>
                </div>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Email</label>
                        <input type="email" placeholder="you@example.com" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Send Reset Link</button>
                </form>

                <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>
                    <ArrowLeft size={16} /> Back to Login
                </Link>
            </div>
        </div>
    );
};

export default ResetPassword;
