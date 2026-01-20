
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
    return (
        <section style={{
            position: 'relative',
            paddingTop: '8rem',
            paddingBottom: '5rem',
            overflow: 'hidden',
            background: 'linear-gradient(to bottom, var(--color-bg-surface) 0%, white 100%)'
        }}>
            {/* Abstract Background Element */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '50%',
                height: '50%',
                background: 'radial-gradient(circle, rgba(167, 139, 250, 0.2) 0%, rgba(255, 255, 255, 0) 70%)',
                filter: 'blur(40px)',
                zIndex: 0
            }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-primary-subtle)',
                    color: 'var(--color-primary-dark)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '1.5rem'
                }}>
                    <Sparkles size={16} />
                    <span>The Future of Studying is Here</span>
                </div>

                <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    marginBottom: '1.5rem',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.1'
                }}>
                    Your AI Study Partner for <span className="text-gradient">Ace Results</span>
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: '2.5rem',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    Transform static notes and documents into interactive study tools. Generate flashcards, quizzes, and summaries instantly.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/app/flashcards" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                        Start Studying Now <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                    </Link>
                    <button className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                        View Demo
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
