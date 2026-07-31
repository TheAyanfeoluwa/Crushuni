
import React from 'react';
import { BrainCircuit } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'var(--color-bg-surface)', padding: '4rem 0 2rem 0', marginTop: 'auto' }}>
            <div className="container">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', marginBottom: '3rem', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: 'var(--color-text-main)' }}>
                            <img src="/logo.png" alt="CrushUni Logo" style={{ height: '32px', width: 'auto' }} />
                            <span>CrushUni</span>
                        </div>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            Empowering students with AI-driven tools to master their coursework efficiently.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h4 style={{ fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Company</h4>
                        <a href="/pricing" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.95rem' }}>Pricing</a>
                        <a href="/faq" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.95rem' }}>FAQ</a>
                        <a href="/about" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.95rem' }}>About</a>
                    </div>
                </div>

                <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--color-border)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    &copy; {new Date().getFullYear()} CrushUni. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
