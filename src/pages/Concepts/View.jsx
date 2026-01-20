
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Share2, Download, Loader2 } from 'lucide-react';
import api from '../../lib/axios';

const ConceptView = () => {
    const { id } = useParams();
    const [concept, setConcept] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/concepts/${id}`)
            .then(res => {
                setConcept(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}><Loader2 className="animate-spin" /></div>;
    if (!concept) return <div style={{ padding: '4rem', textAlign: 'center' }}>Concept not found</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <Link to="/app/extractor" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                    <ArrowLeft size={18} /> Back
                </Link>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.5rem' }}><Share2 size={18} /></button>
                    <button className="btn btn-secondary" style={{ padding: '0.5rem' }}><Download size={18} /></button>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'white' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
                    {concept.title}
                </h1>

                <div style={{ lineHeight: '1.8', fontSize: '1.125rem', color: 'var(--color-text-main)', whiteSpace: 'pre-wrap', fontFamily: 'sans-serif' }}>
                    {concept.summary}
                </div>
            </div>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
        </div>
    );
};

export default ConceptView;
