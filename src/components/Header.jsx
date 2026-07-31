import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLayout } from '../context/LayoutContext';

const Header = () => {
    const { isHeaderVisible } = useLayout();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: scrolled ? 'var(--color-bg-main)' : 'transparent',
            borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
            transition: 'all 0.15s ease',
            opacity: isHeaderVisible ? 1 : 0,
            transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
            pointerEvents: isHeaderVisible ? 'auto' : 'none',
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem var(--spacing-xl)',
            }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                    <img src="/logo.png" alt="CrushUni Logo" style={{ height: '28px', width: 'auto' }} />
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: 'var(--color-text-main)',
                    }}>
                        CrushUni
                    </span>
                </Link>

                {/* Nav Links */}
                <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                    <Link to="/pricing" style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>Pricing</Link>
                    <Link to="/faq" style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>FAQ</Link>
                    <Link to="/about" style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>About</Link>
                </nav>

                {/* Action */}
                <Link to="/app/overview">
                    <button className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '4px' }}>
                        Get Started
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Header;
