
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, ArrowRight } from 'lucide-react';

import api from '../../lib/axios';

const ConceptDashboard = () => {
    const [concepts, setConcepts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/concepts')
            .then(res => {
                setConcepts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch concepts", err);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Core Concepts</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>High-yield summaries for quick review.</p>
                </div>
                <Link to="/app/extractor/create" className="btn btn-primary">
                    <Plus size={18} style={{ marginRight: '0.5rem' }} /> New Extraction
                </Link>
            </header>

            {/* List */}
            <div style={{ display: 'grid', gap: '1rem' }}>
                {loading && <p>Loading...</p>}
                {!loading && concepts.length === 0 && <p>No concepts extracted yet.</p>}

                {concepts.map(concept => (
                    <div key={concept.id} className="glass-panel" style={{
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'white'
                    }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{
                                padding: '1rem',
                                backgroundColor: 'var(--color-primary-subtle)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                color: 'var(--color-primary)'
                            }}>
                                C
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{concept.title}</h3>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Clock size={14} /> Created {new Date(concept.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Link to={`/app/extractor/view/${concept.id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                            View Summary <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConceptDashboard;
