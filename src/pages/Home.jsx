/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, BrainCircuit, Smartphone, ChevronRight, Check, Star, Shield, Layers, FileText, MessageSquare, GraduationCap, Upload, Cpu, Search, Activity, Network } from 'lucide-react';
import { useLayout } from '../context/LayoutContext';

/* --- UI Components --- */

const Badge = ({ children }) => (
    <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.375rem 0.75rem',
        borderRadius: '999px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        fontSize: '0.8rem',
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: '1.5rem',
        backdropFilter: 'blur(8px)'
    }}>
        {children}
    </div>
);

const BentoCard = ({ children, className = "", style = {}, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay }}
        className={`hover-lift ${className}`}
        style={{
            background: 'white',
            borderRadius: '1.5rem',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            ...style
        }}
    >
        {children}
    </motion.div>
);

/* --- Hero Section --- */

const HeroSection = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);

    return (
        <section style={{
            paddingTop: '9rem',
            paddingBottom: '4rem',
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(120, 119, 198, 0.1), transparent 50%)'
        }}>
            <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                        <span>v2.0 is now live</span>
                    </Badge>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    style={{
                        fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                        fontWeight: '800',
                        lineHeight: 1.05,
                        letterSpacing: '-0.03em',
                        marginBottom: '1.5rem',
                        color: '#0F172A'
                    }}
                >
                    Master your coursework <br />
                    <span className="text-gradient">in record time.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{
                        fontSize: '1.25rem',
                        color: '#64748B',
                        maxWidth: '600px',
                        margin: '0 auto 2.5rem',
                        lineHeight: 1.6
                    }}
                >
                    The all-in-one AI study assistant. Generate flashcards, extract concepts, and chat with your notes. 100% Free for students.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{ marginBottom: '4rem' }}
                >
                    <Link to="/signup">
                        <button className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '999px' }}>
                            Start Studying Free
                        </button>
                    </Link>
                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#94A3B8' }}>
                        <div style={{ display: 'flex' }}>{[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="#FCD34D" color="#FCD34D" />)}</div>
                        <span>Loved by 100+ students</span>
                    </div>
                </motion.div>

                {/* Hero App Window Visualization */}
                <motion.div
                    style={{ y }}
                    className="container"
                >
                    <div style={{
                        background: 'white',
                        borderRadius: '1.5rem',
                        boxShadow: '0 50px 100px -20px rgba(50, 50, 93, 0.15), 0 30px 60px -30px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(0,0,0,0.05)',
                        padding: '1rem',
                        position: 'relative'
                    }}>
                        {/* Browser Chrome */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', paddingLeft: '0.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                            <div style={{ marginLeft: '1rem', flex: 1, height: '10px', background: '#F8FAFC', borderRadius: '99px', maxWidth: '300px' }} />
                        </div>

                        {/* Main App Canvas */}
                        <div style={{
                            background: '#F8FAFC',
                            borderRadius: '1rem',
                            minHeight: '550px',
                            width: '100%',
                            display: 'flex',
                            overflow: 'hidden',
                            border: '1px solid #E2E8F0',
                            position: 'relative'
                        }}>
                            {/* Sidebar */}
                            <div style={{ width: '240px', borderRight: '1px solid #E2E8F0', background: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ width: '100%', height: '32px', background: '#EFF6FF', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '0 0.5rem' }}>
                                    <div style={{ width: '16px', height: '16px', background: '#3B82F6', borderRadius: '4px' }} />
                                    <div style={{ width: '60px', height: '8px', background: '#DBEAFE', borderRadius: '4px', marginLeft: '0.5rem' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.05em' }}>LIBRARY</div>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: '6px', background: i === 1 ? '#F1F5F9' : 'transparent' }}>
                                            <div style={{ width: '16px', height: '16px', background: '#CBD5E1', borderRadius: '4px' }} />
                                            <div style={{ width: '70%', height: '8px', background: '#E2E8F0', borderRadius: '4px' }} />
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: 'auto', padding: '1rem', background: '#F8FAFC', borderRadius: '12px' }}>
                                    <div style={{ width: '32px', height: '32px', background: '#E2E8F0', borderRadius: '50%', marginBottom: '0.5rem' }} />
                                    <div style={{ width: '80%', height: '8px', background: '#CBD5E1', borderRadius: '4px' }} />
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div style={{ flex: 1, padding: '2.5rem', overflow: 'hidden' }}>
                                {/* Header Area */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                                    <div>
                                        <div style={{ width: '150px', height: '10px', background: '#94A3B8', borderRadius: '4px', marginBottom: '0.75rem', opacity: 0.5 }} />
                                        <div style={{ width: '250px', height: '28px', background: '#1E293B', borderRadius: '6px' }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E2E8F0' }} />
                                        <div style={{ width: '120px', height: '40px', background: '#4F46E5', borderRadius: '8px' }} />
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                    {['Total Cards', 'Concept Maps', 'Study Streak'].map((label, i) => (
                                        <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: '600', marginBottom: '0.5rem' }}>{label.toUpperCase()}</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {i === 0 ? '1,240' : i === 1 ? '48' : '12 Days'}
                                                {i === 2 && <span style={{ fontSize: '1rem', color: '#F59E0B' }}>🔥</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Recent Activity Grid - "The Density" */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#64748B' }}>RECENT STUDY DECKS</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <div style={{ width: '48px', height: '48px', background: i % 2 === 0 ? '#EFF6FF' : '#F5F3FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: i % 2 === 0 ? '#BFDBFE' : '#DDD6FE' }} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ width: '80%', height: '10px', background: '#334155', borderRadius: '4px', marginBottom: '0.5rem' }} />
                                                    <div style={{ width: '40%', height: '8px', background: '#94A3B8', borderRadius: '4px', opacity: 0.6 }} />
                                                </div>
                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #E2E8F0' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

/* --- Interactive Components --- */

const FlipFlashcard = () => {
    const [flipped, setFlipped] = useState(false);

    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px', padding: '2rem 0' }}>
            <motion.div
                onClick={() => setFlipped(!flipped)}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
                style={{
                    width: '260px',
                    height: '160px',
                    position: 'relative',
                    cursor: 'pointer',
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Front */}
                <div style={{
                    position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                    background: 'white', border: '1px solid #E2E8F0', borderRadius: '16px',
                    boxShadow: '0 20px 40px -5px rgba(0,0,0,0.1)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '1.5rem', textAlign: 'center'
                }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#6366F1', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Question</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1E293B', lineHeight: 1.4 }}>When was the Battle of Hastings?</span>
                    <span style={{ position: 'absolute', bottom: '1rem', fontSize: '0.75rem', color: '#94A3B8' }}>Click to flip</span>
                </div>

                {/* Back */}
                <div style={{
                    position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                    background: '#6366F1', borderRadius: '16px', transform: 'rotateY(180deg)',
                    boxShadow: '0 20px 40px -5px rgba(99, 102, 241, 0.4)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '1.5rem', textAlign: 'center', color: 'white'
                }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Answer</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>1066</span>
                </div>
            </motion.div>
        </div>
    );
};

/* --- Bento Grid Section --- */

const FeaturesSection = () => {
    return (
        <section style={{ padding: '6rem 0', background: '#FFFFFF' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Everything you need to study smart.</h2>
                    <p style={{ color: '#64748B', fontSize: '1.2rem' }}>Powerful features packed into one simple platform.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1.5rem',
                    autoRows: 'minmax(300px, auto)'
                }}>
                    {/* Card 1: AI Tutor */}
                    <BentoCard style={{ gridColumn: 'span 2', background: 'linear-gradient(145deg, #EFF6FF, #FFFFFF)' }}>
                        <div style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ width: '3rem', height: '3rem', background: '#DBEAFE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#1D4ED8' }}>
                                    <MessageSquare size={24} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>AI Context Tutor</h3>
                                <p style={{ color: '#64748B' }}>Chat with your documents. Ask questions, clarify relationships, and get instant answers.</p>
                            </div>
                            <div style={{ flex: 1, background: 'white', borderRadius: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '1.5rem', position: 'relative' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ alignSelf: 'flex-end', display: 'flex', gap: '0.5rem', maxWidth: '85%' }}>
                                        <div style={{ background: '#2563EB', color: 'white', padding: '0.75rem 1rem', borderRadius: '12px 12px 0 12px', fontSize: '0.9rem' }}>
                                            Explain Quantum Entanglement simply.
                                        </div>
                                    </div>
                                    <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.5rem', maxWidth: '85%' }}>
                                        <div style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', background: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <BrainCircuit size={14} color="#4F46E5" />
                                        </div>
                                        <div style={{ background: '#F1F5F9', color: '#1E293B', padding: '0.75rem 1rem', borderRadius: '12px 12px 12px 0', fontSize: '0.9rem' }}>
                                            Imagine two paired dice. If you roll a 6 on one, the other shows a 6 instantly!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BentoCard>


                    {/* Card 3: Interactive Flashcards (Fits in remaining 1 col) */}
                    <BentoCard delay={0.2} style={{ gridColumn: 'span 1' }}>
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ width: '3rem', height: '3rem', background: '#FEF3C7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: '#D97706' }}>
                                <Zap size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>Instant Flashcards</h3>
                            <p style={{ color: '#64748B' }}>Turn any text into a study deck in seconds.</p>
                        </div>
                        <FlipFlashcard />
                    </BentoCard>

                    {/* Card 4: Redesigned Free Badge (FULL WIDTH) - High Contrast Version */}
                    <BentoCard delay={0.3} style={{ gridColumn: 'span 3', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            background: 'linear-gradient(135deg, #172554 0%, #1E40AF 100%)', // Deep Blue to Blue-700
                            color: 'white',
                            padding: '3rem',
                            position: 'relative',
                            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3)'
                        }}>
                            <div style={{ position: 'relative', zIndex: 10, maxWidth: '60%' }}>
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.15)', color: '#BFDBFE', // Light Blue text
                                    padding: '0.5rem 1rem', borderRadius: '99px',
                                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                    marginBottom: '1.5rem', fontWeight: '600',
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}>
                                    <Shield size={16} />
                                    <span>Student Safety Pledge</span>
                                </div>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', lineHeight: 1.1, color: 'white' }}>
                                    Forever Free. <br />
                                    <span style={{ color: '#60A5FA' }}>No Credit Card.</span>
                                </h3>
                                <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '500px', lineHeight: 1.6, color: '#DBEAFE' }}>
                                    We believe education is a right. CrushUni is supported by optional institutional partnerships, never by students.
                                </p>
                            </div>

                            {/* Heroic Free Visual - Blue/White Theme */}
                            <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ position: 'absolute', inset: 0, border: '2px dashed rgba(96, 165, 250, 0.3)', borderRadius: '50%', animation: 'spin 10s linear infinite' }} />
                                <div style={{ position: 'absolute', inset: '20px', border: '2px solid rgba(96, 165, 250, 0.5)', borderRadius: '50%' }} />
                                <div style={{ fontSize: '4rem', fontWeight: '800', textShadow: '0 0 40px rgba(96, 165, 250, 0.5)', color: '#60A5FA' }}>$0</div>
                            </div>

                            <style dangerouslySetInnerHTML={{
                                __html: `
                                @keyframes spin { 100% { transform: rotate(360deg); } }
                             `}} />
                        </div>
                    </BentoCard>

                </div>
            </div>
        </section>
    );
};

/* --- How It Works Section (Scroll Linked & Immersive) --- */

const StepItem = ({ number, title, desc, onInView }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-20% 0px -50% 0px" });

    useEffect(() => {
        if (isInView) onInView(number);
    }, [isInView, onInView, number]);

    return (
        <div ref={ref} style={{ display: 'flex', gap: '1.5rem', marginBottom: '12rem', opacity: isInView ? 1 : 0.4, transition: 'opacity 0.5s' }}>
            <div style={{
                width: '4rem', height: '4rem', borderRadius: '50%', background: isInView ? 'var(--color-primary)' : 'white', border: '2px solid var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.5rem', color: isInView ? 'white' : 'var(--color-primary)',
                flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', transition: 'all 0.5s'
            }}>
                {number}
            </div>
            <div style={{ paddingTop: '0.5rem' }}>
                <h4 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.75rem' }}>{title}</h4>
                <p style={{ color: '#64748B', lineHeight: 1.6, fontSize: '1.25rem' }}>{desc}</p>
            </div>
        </div>
    );
};

const WorkflowVisual = ({ step }) => {
    return (
        <div style={{
            background: 'white', borderRadius: '24px', padding: '3rem',
            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0',
            height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden'
        }}>
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ textAlign: 'center' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '32px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
                            <Upload size={64} color="#3B82F6" />
                        </div>
                        <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#1E293B' }}>Upload Documents</h3>
                        <p style={{ color: '#64748B', marginTop: '0.5rem', fontSize: '1.2rem' }}>PDF, Docx, or Images</p>
                    </motion.div>
                )}
                {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ textAlign: 'center' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '32px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}>
                                <Cpu size={64} color="#7C3AED" />
                            </motion.div>
                        </div>
                        <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#1E293B' }}>AI Processing</h3>
                        <p style={{ color: '#64748B', marginTop: '0.5rem', fontSize: '1.2rem' }}>Analyzing & Extracting Concepts...</p>
                    </motion.div>
                )}
                {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ textAlign: 'center' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '32px', background: '#ECFCCB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
                            <Check size={64} color="#65A30D" />
                        </div>
                        <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#1E293B' }}>Ready to Study</h3>
                        <p style={{ color: '#64748B', marginTop: '0.5rem', fontSize: '1.2rem' }}>Master your subject instantly.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const HowItWorks = () => {
    const [activeStep, setActiveStep] = useState(1);
    const { setIsHeaderVisible } = useLayout();
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { amount: 0.2 }); // Trigger when 20% visible

    // Toggle header visibility based on section view
    useEffect(() => {
        setIsHeaderVisible(!isInView);
        return () => setIsHeaderVisible(true); // Ensure header returns on unmount
    }, [isInView, setIsHeaderVisible]);

    return (
        <section
            ref={sectionRef}
            style={{
                padding: '0', // Zero padding for full hit area
                background: '#F8FAFC',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 50
            }}
        >
            <div className="container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }}>

                    {/* Steps Column */}
                    <div>
                        <span style={{ fontWeight: '700', color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Workflow</span>
                        <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '6rem', lineHeight: 1.1 }}>From messy notes to <br />perfect grades.</h2>

                        <StepItem
                            number={1}
                            title="Upload your material"
                            desc="Drag and drop your PDFs, Word docs, or paste your raw notes directly into the platform."
                            onInView={setActiveStep}
                        />
                        <StepItem
                            number={2}
                            title="AI analysis engine"
                            desc="Our advanced models scan your content, identifying key terms, definitions, and relationships."
                            onInView={setActiveStep}
                        />
                        <StepItem
                            number={3}
                            title="Start mastering"
                            desc="Instantly access generated flashcards, concept summaries, and your personal AI tutor."
                            onInView={setActiveStep}
                        />
                    </div>

                    {/* Sticky Visual Column */}
                    <div style={{ position: 'sticky', top: 'calc(50vh - 250px)', height: 'auto', alignSelf: 'start' }}>
                        <WorkflowVisual step={activeStep} />
                    </div>
                </div>
            </div>
        </section>
    );
};


/* --- Footer CTA (Optimized) --- */
const FinalCTA = () => (
    <section style={{ padding: '8rem 0', textAlign: 'center' }}>
        <div className="container">
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
                Ready to upgrade your brain?
            </h2>
            <Link to="/signup">
                <button className="btn btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.2rem', borderRadius: '999px' }}>
                    Get Started Now
                </button>
            </Link>
        </div>
    </section>
);

const Home = () => {
    return (
        <main>
            <HeroSection />
            <FeaturesSection />
            <HowItWorks />
            <FinalCTA />
        </main>
    );
};

export default Home;
