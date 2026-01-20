
import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCw, CheckCircle, XCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import api from '../../lib/axios';

const FlashcardStudy = () => {
    const { id } = useParams();
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        // Fetch specific deck details (assuming backend includes cards in relation or strict fetch is needed)
        // Note: Our current simple backend might rely on client-side fetch of cards separately 
        // OR standard SQLAlchemy relationship loading.
        // Let's assume /api/decks/{id} returns the deck object WITH a 'cards' array nested.

        api.get(`/decks/${id}`)
            .then(res => {
                setDeck(res.data);
                if (res.data.cards) {
                    setCards(res.data.cards);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to load deck.");
                setLoading(false);
            });
    }, [id]);

    const handleNext = () => {
        setIsFlipped(false);
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            alert("Deck Completed!");
        }
    };

    const handlePrev = () => {
        setIsFlipped(false);
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const toggleFlip = () => setIsFlipped(!isFlipped);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}><Loader2 className="animate-spin" /></div>;
    if (error) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'red' }}>{error}</div>;
    if (cards.length === 0) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>No cards in this deck.</div>;

    const currentCard = cards[currentIndex];
    const progress = ((currentIndex + 1) / cards.length) * 100;

    return (
        <div style={{ height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }}>
            {/* Header / Nav */}
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/app/flashcards" className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', lineHeight: '1' }}>{deck?.title || 'Study Session'}</h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                            Card {currentIndex + 1} of {cards.length}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '200px', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--color-primary)', transition: 'width 0.3s ease' }}></div>
                </div>
            </div>

            {/* Main Study Area */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px', marginBottom: '2rem' }}>
                <div
                    onClick={toggleFlip}
                    style={{
                        width: '100%',
                        maxWidth: '600px',
                        aspectRatio: '16/10',
                        position: 'relative',
                        transition: 'transform 0.6s',
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                        cursor: 'pointer'
                    }}>

                    {/* Front */}
                    <div className="glass-panel" style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        textAlign: 'center',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'white'
                    }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Question</p>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '500' }}>{currentCard.front}</h3>

                        <p style={{ position: 'absolute', bottom: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <RotateCw size={14} /> Click to flip
                        </p>
                    </div>

                    {/* Back */}
                    <div className="glass-panel" style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        borderRadius: 'var(--radius-lg)',
                        transform: 'rotateY(180deg)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        textAlign: 'center',
                        border: '1px solid var(--color-primary-light)',
                        backgroundColor: 'var(--color-bg-surface)'
                    }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Answer</p>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '500' }}>{currentCard.back}</h3>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                <button className="btn btn-secondary" onClick={handlePrev} disabled={currentIndex === 0} style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}>
                    <ChevronLeft size={24} />
                </button>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '0.75rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                        <XCircle size={24} />
                        <span style={{ fontSize: '0.75rem' }}>Hard</span>
                    </button>
                    <button className="btn" style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.75rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle size={24} />
                        <span style={{ fontSize: '0.75rem' }}>Easy</span>
                    </button>
                </div>

                <button className="btn btn-secondary" onClick={handleNext} disabled={currentIndex === cards.length - 1} style={{ opacity: currentIndex === cards.length - 1 ? 0.5 : 1 }}>
                    <ChevronRight size={24} />
                </button>
            </div>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
        </div>
    );
};

export default FlashcardStudy;
