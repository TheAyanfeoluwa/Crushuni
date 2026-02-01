
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
    const [studyComplete, setStudyComplete] = useState(false);
    const [buttonAnimation, setButtonAnimation] = useState(null); // 'easy' or 'hard'

    // Statistics tracking
    const [stats, setStats] = useState({
        easy: 0,
        hard: 0,
        mastered: new Set(),
        reviewQueue: []
    });

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

    // Log study activity to backend for streak tracking
    const logStudyActivity = async (easyCount, hardCount) => {
        try {
            await api.post('/study/log', {
                deck_id: parseInt(id),
                cards_reviewed: easyCount + hardCount,
                easy_count: easyCount,
                hard_count: hardCount
            });
        } catch (error) {
            console.error('Failed to log study activity:', error);
        }
    };

    const handleNext = () => {
        setIsFlipped(false);
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else if (stats.reviewQueue.length > 0) {
            // Move to review queue
            const nextCard = stats.reviewQueue[0];
            const cardIndex = cards.findIndex(c => c.id === nextCard.id);
            setStats(prev => ({
                ...prev,
                reviewQueue: prev.reviewQueue.slice(1)
            }));
            if (cardIndex !== -1) {
                setCurrentIndex(cardIndex);
            }
        } else {
            // Study session complete - log the activity
            logStudyActivity(stats.easy, stats.hard);
            setStudyComplete(true);
        }
    };

    const handlePrev = () => {
        setIsFlipped(false);
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleEasy = () => {
        setButtonAnimation('easy');
        const currentCard = cards[currentIndex];
        setStats(prev => {
            const newMastered = new Set(prev.mastered);
            newMastered.add(currentCard.id);
            return {
                ...prev,
                easy: prev.easy + 1,
                mastered: newMastered,
                // Remove from review queue if present
                reviewQueue: prev.reviewQueue.filter(c => c.id !== currentCard.id)
            };
        });
        setTimeout(() => {
            setButtonAnimation(null);
            handleNext();
        }, 400);
    };

    const handleHard = () => {
        setButtonAnimation('hard');
        const currentCard = cards[currentIndex];
        setStats(prev => {
            // Add to review queue if not already there
            const isInQueue = prev.reviewQueue.some(c => c.id === currentCard.id);
            return {
                ...prev,
                hard: prev.hard + 1,
                reviewQueue: isInQueue ? prev.reviewQueue : [...prev.reviewQueue, currentCard]
            };
        });
        setTimeout(() => {
            setButtonAnimation(null);
            handleNext();
        }, 400);
    };

    const resetStudy = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setStudyComplete(false);
        setStats({
            easy: 0,
            hard: 0,
            mastered: new Set(),
            reviewQueue: []
        });
    };

    const toggleFlip = () => setIsFlipped(!isFlipped);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}><Loader2 className="animate-spin" /></div>;
    if (error) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'red' }}>{error}</div>;
    if (cards.length === 0) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>No cards in this deck.</div>;

    // Study Complete Screen
    if (studyComplete) {
        const totalAnswers = stats.easy + stats.hard;
        const accuracy = totalAnswers > 0 ? Math.round((stats.easy / totalAnswers) * 100) : 0;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    boxShadow: '0 10px 40px rgba(16, 185, 129, 0.4)'
                }}>
                    <CheckCircle size={48} color="white" />
                </div>

                <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>Session Complete!</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>Great job studying <strong>{deck?.title}</strong></p>

                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                    <div style={{ textAlign: 'center', padding: '1rem 2rem', backgroundColor: '#DCFCE7', borderRadius: 'var(--radius-lg)' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '700', color: '#15803D' }}>{stats.easy}</p>
                        <p style={{ fontSize: '0.875rem', color: '#166534' }}>Easy</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem 2rem', backgroundColor: '#FEE2E2', borderRadius: 'var(--radius-lg)' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '700', color: '#B91C1C' }}>{stats.hard}</p>
                        <p style={{ fontSize: '0.875rem', color: '#991B1B' }}>Hard</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem 2rem', backgroundColor: 'var(--color-primary-subtle)', borderRadius: 'var(--radius-lg)' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-primary)' }}>{accuracy}%</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-primary)' }}>Accuracy</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={resetStudy} style={{ padding: '0.875rem 2rem' }}>Study Again</button>
                    <Link to="/app/flashcards" className="btn btn-secondary" style={{ padding: '0.875rem 2rem' }}>Back to Library</Link>
                </div>
            </div>
        );
    }

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
                            {stats.reviewQueue.length > 0 && (
                                <span style={{ marginLeft: '0.5rem', color: '#B91C1C' }}>• {stats.reviewQueue.length} to review</span>
                            )}
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
                    <button
                        className={`btn ${buttonAnimation === 'hard' ? 'hard-animation' : ''}`}
                        onClick={handleHard}
                        disabled={buttonAnimation !== null}
                        style={{
                            backgroundColor: buttonAnimation === 'hard' ? '#DC2626' : '#FEE2E2',
                            color: buttonAnimation === 'hard' ? 'white' : '#B91C1C',
                            padding: '0.75rem 1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            transition: 'all 0.2s',
                            cursor: buttonAnimation ? 'default' : 'pointer',
                            transform: buttonAnimation === 'hard' ? 'scale(1.1)' : 'scale(1)',
                            boxShadow: buttonAnimation === 'hard' ? '0 0 20px rgba(220, 38, 38, 0.6)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (!buttonAnimation) {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(185, 28, 28, 0.3)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!buttonAnimation) {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }
                        }}
                    >
                        <XCircle size={24} className={buttonAnimation === 'hard' ? 'shake-icon' : ''} />
                        <span style={{ fontSize: '0.75rem' }}>Hard</span>
                    </button>
                    <button
                        className={`btn ${buttonAnimation === 'easy' ? 'easy-animation' : ''}`}
                        onClick={handleEasy}
                        disabled={buttonAnimation !== null}
                        style={{
                            backgroundColor: buttonAnimation === 'easy' ? '#16A34A' : '#DCFCE7',
                            color: buttonAnimation === 'easy' ? 'white' : '#15803D',
                            padding: '0.75rem 1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            transition: 'all 0.2s',
                            cursor: buttonAnimation ? 'default' : 'pointer',
                            transform: buttonAnimation === 'easy' ? 'scale(1.1)' : 'scale(1)',
                            boxShadow: buttonAnimation === 'easy' ? '0 0 20px rgba(22, 163, 74, 0.6)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (!buttonAnimation) {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(21, 128, 61, 0.3)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!buttonAnimation) {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }
                        }}
                    >
                        <CheckCircle size={24} className={buttonAnimation === 'easy' ? 'pulse-icon' : ''} />
                        <span style={{ fontSize: '0.75rem' }}>Easy</span>
                    </button>
                </div>

                <button className="btn btn-secondary" onClick={handleNext} disabled={currentIndex === cards.length - 1} style={{ opacity: currentIndex === cards.length - 1 ? 0.5 : 1 }}>
                    <ChevronRight size={24} />
                </button>
            </div>
            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } } 
                .animate-spin { animation: spin 1s linear infinite; }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-4px) rotate(-5deg); }
                    40% { transform: translateX(4px) rotate(5deg); }
                    60% { transform: translateX(-4px) rotate(-5deg); }
                    80% { transform: translateX(4px) rotate(5deg); }
                }
                .shake-icon { animation: shake 0.4s ease-in-out; }
                
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }
                .pulse-icon { animation: pulse 0.4s ease-in-out; }
                
                @keyframes glow-green {
                    0% { box-shadow: 0 0 5px rgba(22, 163, 74, 0.4); }
                    50% { box-shadow: 0 0 25px rgba(22, 163, 74, 0.8); }
                    100% { box-shadow: 0 0 5px rgba(22, 163, 74, 0.4); }
                }
                .easy-animation { animation: glow-green 0.4s ease-in-out; }
                
                @keyframes glow-red {
                    0% { box-shadow: 0 0 5px rgba(220, 38, 38, 0.4); }
                    50% { box-shadow: 0 0 25px rgba(220, 38, 38, 0.8); }
                    100% { box-shadow: 0 0 5px rgba(220, 38, 38, 0.4); }
                }
                .hard-animation { animation: glow-red 0.4s ease-in-out; }
            `}</style>
        </div>
    );
};

export default FlashcardStudy;
