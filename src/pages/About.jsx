import React, { useEffect } from 'react';
import { useLayout } from '../context/LayoutContext';
import { Code, Globe, Star, Award, Zap, BookOpen, Users } from 'lucide-react';

const About = () => {
    const { setIsHeaderVisible } = useLayout();

    useEffect(() => {
        setIsHeaderVisible(true);
        window.scrollTo(0, 0);
    }, [setIsHeaderVisible]);

    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '8rem',
            paddingBottom: '8rem',
            background: 'var(--color-bg-main)',
        }}>
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                
                {/* HERO SECTION */}
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <h1 style={{ 
                        fontSize: 'clamp(3rem, 6vw, 4.5rem)', 
                        fontWeight: 800, 
                        lineHeight: 1.1, 
                        letterSpacing: '-0.02em',
                        color: 'var(--color-text-main)',
                        marginBottom: '1.5rem'
                    }}>
                        CrushUni
                    </h1>
                    <p style={{ 
                        fontSize: '1.25rem', 
                        color: 'var(--color-text-muted)', 
                        maxWidth: '700px', 
                        margin: '0 auto',
                        lineHeight: 1.6
                    }}>
                        The ultimate AI study assistant designed to transform the way students learn, analyze documents, and prepare for exams. Built by students, for students.
                    </p>
                </div>

                {/* FOUNDER SECTION */}
                <div style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: '24px',
                    padding: '4rem',
                    background: 'var(--color-bg-surface)',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'center' }}>
                        
                        {/* Image */}
                        <div>
                            <img 
                                src="/ayanfeoluwa.png" 
                                alt="Ayanfeoluwa Peace Ayanlade" 
                                style={{
                                    width: '100%',
                                    borderRadius: '16px',
                                    border: '1px solid var(--color-border)',
                                    boxShadow: 'var(--shadow-md)',
                                    display: 'block'
                                }}
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <span style={{ 
                                display: 'inline-block', 
                                padding: '0.25rem 0.75rem', 
                                borderRadius: '999px', 
                                background: 'var(--color-primary-subtle)', 
                                color: 'var(--color-primary)',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '1rem'
                            }}>
                                Meet the Founder
                            </span>
                            
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
                                Ayanfeoluwa Peace Ayanlade
                            </h2>
                            <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--color-primary)', marginBottom: '2rem' }}>
                                CEO & Sole Developer
                            </p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--color-text-muted)' }}>
                                    Ayanfeoluwa is a Nigerian-born software developer and student at the African Leadership Academy (ALA) with a deep-seated passion for using technology to solve community-specific problems.
                                </p>
                                <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--color-text-muted)' }}>
                                    Raised in the university town of Ile-Ife, he witnessed the gap between high-level innovation and the daily needs of students. This inspired him to build CrushUni.com, an AI-powered educational platform designed to bridge the resource gap in constrained environments.
                                </p>
                                <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--color-text-muted)' }}>
                                    Ayanfeoluwa is an admitted student to Dartmouth College (Class of 2030), a Non-Trivial Fellow, and an alumnus of the Yale Young Global Scholars program. He single-handedly developed the entire CrushUni architecture to ensure it remains lightweight, fast, and completely free for students everywhere.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;
