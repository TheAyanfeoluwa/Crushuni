
import React from 'react';
import { BrainCircuit } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'var(--color-bg-surface)', padding: '4rem 0 2rem 0', marginTop: 'auto' }}>
            <div className="container">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.5rem', color: 'var(--color-text-main)' }}>
                        <img src="/logo.png" alt="CrushUni Logo" style={{ height: '32px', width: 'auto' }} />
                        <span>CrushUni</span>
                    </div>
                    <p style={{ maxWidth: '400px', color: 'var(--color-text-muted)' }}>
                        Empowering students with AI-driven tools to master their coursework efficiently.
                    </p>
                </div>

                <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--color-border)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    &copy; {new Date().getFullYear()} CrushUni. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
