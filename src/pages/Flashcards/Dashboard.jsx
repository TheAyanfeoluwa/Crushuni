
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Library, MoreVertical, Play, ArrowRight, Loader2 } from 'lucide-react';

import api from '../../lib/axios';

const FlashcardDashboard = () => {
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/decks')
            .then(res => {
                setDecks(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch decks", err);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Flashcards</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage your study decks and track progress.</p>
                </div>
                <Link to="/app/flashcards/create" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Create New Deck
                </Link>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <Loader2 className="animate-spin" size={32} color="var(--color-primary)" />
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
                </div>
            ) : decks.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: 'var(--radius-lg)' }}>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>You haven't created any decks yet.</p>
                    <Link to="/app/flashcards/create" className="btn btn-secondary">Get Started</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {decks.map(deck => (
                        <div key={deck.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-primary-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}>
                                    <Library size={24} />
                                </div>
                                <button style={{ color: 'var(--color-text-muted)' }}><MoreVertical size={18} /></button>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>{deck.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                    Created: {new Date(deck.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                                <Link to={`/app/flashcards/study/${deck.id}`} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                                    Study Now <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FlashcardDashboard;
