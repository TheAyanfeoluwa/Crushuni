
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '../context/LayoutContext';

const Header = () => {
    const { isHeaderVisible } = useLayout();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <React.Fragment>
            {/* 
              This is a floating header that transforms into a pill. 
              We use valid CSS properties and inline logic for the simplicity of this file.
            */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    paddingTop: scrolled ? '1.5rem' : '2rem',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    justifyContent: 'center',
                    pointerEvents: 'none', /* Passthrough clicks around the pill */
                    opacity: isHeaderVisible ? 1 : 0,
                    transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
                }}
            >
                <div
                    style={{
                        pointerEvents: isHeaderVisible ? 'auto' : 'none',
                        width: scrolled ? '90%' : '100%',
                        maxWidth: scrolled ? '800px' : '1280px',
                        padding: scrolled ? '0.75rem 1.5rem' : '0 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
                        backdropFilter: scrolled ? 'blur(16px)' : 'none',
                        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
                        borderRadius: scrolled ? '999px' : '0',
                        border: scrolled ? '1px solid rgba(255,255,255,0.6)' : '1px solid transparent',
                        boxShadow: scrolled ? '0 10px 40px -10px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <img src="/logo.png" alt="CrushUni Logo" style={{ height: '32px', width: 'auto' }} />
                        <span style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            letterSpacing: '-0.02em',
                            color: 'var(--color-text-main)',
                            opacity: scrolled ? 1 : 1
                        }}>
                            CrushUni
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <Link to="/pricing" style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>Pricing</Link>
                        <Link to="/faq" style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>FAQ</Link>
                    </nav>

                    {/* Action */}
                    <Link to="/app/overview">
                        <button style={{
                            background: 'var(--color-text-main)', // Black button
                            color: 'white',
                            padding: '0.6rem 1.25rem',
                            fontSize: '0.9rem',
                            borderRadius: '999px',
                            fontWeight: '600',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}>
                            Get Started
                        </button>
                    </Link>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Header;
