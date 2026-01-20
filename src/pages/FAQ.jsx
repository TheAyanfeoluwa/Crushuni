
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{
            borderBottom: '1px solid var(--color-border)',
            padding: '1.5rem 0',
            cursor: 'pointer'
        }} onClick={() => setIsOpen(!isOpen)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-text-main)' }}>{question}</h3>
                {isOpen ? <ChevronUp size={20} color="var(--color-primary)" /> : <ChevronDown size={20} color="var(--color-text-muted)" />}
            </div>
            {isOpen && (
                <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                    {answer}
                </p>
            )}
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: "How does the AI Tutor work?",
            answer: "Our AI Tutor analyzes the documents you upload (PDF, DOCX, TXT) and creates a custom knowledge base. You can then chat with it like a professor, asking specific questions about your notes."
        },
        {
            question: "Is CrushUni free to use?",
            answer: "Yes! CrushUni is 100% free for students. We believe in democratizing access to education, so all features including AI flashcards and the tutor are available at no cost."
        },
        {
            question: "Can I share my decks with friends?",
            answer: "Currently, decks are private to your account. We are working on a collaborative study feature that will allow you to share decks and study groups in the near future."
        },
        {
            question: "What file formats are supported?",
            answer: "We currently support PDF, Microsoft Word (DOCX), and plain text (TXT) files. We are working on adding Image-to-Text support soon."
        },
        {
            question: "How accurate are the generated flashcards?",
            answer: "Our AI is highly accurate and designed to capture key concepts. However, we always recommend reviewing the cards to ensure they match your specific curriculum needs."
        }
    ];

    return (
        <main className="container" style={{ padding: '9rem 0 6rem 0', maxWidth: '800px', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>Frequently Asked Questions</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>Everything you need to know about CrushUni.</p>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </main>
    );
};

export default FAQ;
