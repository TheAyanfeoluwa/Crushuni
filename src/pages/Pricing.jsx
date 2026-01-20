import React from 'react';
import { Check, Sparkles } from 'lucide-react';

const PricingCard = ({ title, price, features }) => (
    <div style={{
        padding: '3rem',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'white',
        border: '2px solid var(--color-primary)',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        maxWidth: '500px',
        margin: '0 auto',
        textAlign: 'center'
    }}>
        <div style={{
            position: 'absolute',
            top: '-1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            padding: '0.5rem 2rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.9rem',
            fontWeight: '800',
            letterSpacing: '0.05em',
            boxShadow: '0 10px 20px -5px rgba(124, 58, 237, 0.4)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} fill="white" />
                <span>COMPLETELY FREE</span>
            </div>
        </div>

        <div>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '800' }}>{title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '4rem', fontWeight: '900', color: 'var(--color-primary)', lineHeight: 1 }}>{price}</span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>No credit card required. Ever.</p>
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left', margin: '1rem 0' }}>
            {features.map((feature, i) => (
                <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '1.1rem' }}>
                    <div style={{ background: 'var(--color-primary-subtle)', borderRadius: '50%', padding: '0.25rem' }}>
                        <Check size={20} color="var(--color-primary)" strokeWidth={3} />
                    </div>
                    <span>{feature}</span>
                </li>
            ))}
        </ul>

        <button className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.2rem', borderRadius: 'var(--radius-full)' }}>
            Start Studying Now
        </button>
    </div>
);

const Pricing = () => {
    return (
        <main style={{ padding: '9rem 0 6rem 0', backgroundColor: '#F8FAFC', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '5rem', maxWidth: '700px', margin: '0 auto 5rem auto' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem', color: '#1E293B' }}>Education Should Be Free.</h1>
                    <p style={{ fontSize: '1.4rem', color: '#64748B', lineHeight: 1.6 }}>
                        We believe in democratizing access to advanced study tools. That's why <span style={{ color: 'var(--color-primary)', fontWeight: '700' }}>CrushUni</span> is 100% free for everyone.
                    </p>
                </div>

                <PricingCard
                    title="Student Access"
                    price="$0"
                    isPopular={true}
                    features={[
                        "Unlimited AI Flashcard Decks",
                        "Unlimited Document Uploads",
                        "Advanced Concept Extraction",
                        "AI Context Tutor Chat",
                        "Community Features (Coming Soon)"
                    ]}
                />
            </div>
        </main>
    );
};

export default Pricing;
