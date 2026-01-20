
/* eslint-disable no-unused-vars */
import React from 'react';
import { FileText, MessageSquare, Laptop } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <div style={{
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'white',
        border: '1px solid var(--color-border)',
        transition: 'transform 0.2s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '1rem'
    }}>
        <div style={{
            width: '3rem',
            height: '3rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
        }}>
            <Icon size={24} />
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{description}</p>
    </div>
);

const Features = () => {
    return (
        <section id="features" style={{ padding: '5rem 0', backgroundColor: 'var(--color-bg-main)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto 4rem auto' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Complete Suite of Study Tools</h2>
                    <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)' }}>
                        Stop spending hours preparing to study. Let CrushUni handle the manual labor so you can focus on learning.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    <FeatureCard
                        icon={FileText}
                        title="AI Flashcard Generator"
                        description="Upload PDF or DOCX files. Our NLP engine identifies key terms and definitions to automatically generate high-quality flashcards."
                        color="#ec4899"
                    />
                    <FeatureCard
                        icon={MessageSquare}
                        title="Custom AI Chatbot"
                        description="A context-aware tutor that answers questions based strictly on your uploaded material. Perfect for curriculum-specific Q&A."
                        color="#8b5cf6"
                    />
                    <FeatureCard
                        icon={Laptop}
                        title="Core Concept Extractor"
                        description="Identify high-yield topics from large volumes of notes. Prioritize information density for last-minute exam prep."
                        color="#3b82f6"
                    />
                </div>
            </div>
        </section>
    );
};

export default Features;
