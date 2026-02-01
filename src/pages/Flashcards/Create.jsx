
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, FileText, Loader2, Plus, X, Sparkles } from 'lucide-react';
import api from '../../lib/axios';

const CreateFlashcardDeck = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [textInput, setTextInput] = useState("");
    const [numCards, setNumCards] = useState(10);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("file"); // 'file' or 'text'
    const [isNewCategory, setIsNewCategory] = useState(false);

    const categories = ["Biology", "History", "Computer Science", "Economics", "Law", "Medicine"];

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (activeTab === 'file' && !file) {
            setError("Please upload a file.");
            return;
        }
        if (activeTab === 'text' && !textInput) {
            setError("Please enter some text.");
            return;
        }
        if (!title) {
            setError("Please enter a title.");
            return;
        }
        if (!category) {
            setError("Please select or enter a category.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        if (activeTab === 'file') {
            formData.append("file", file);
        } else {
            formData.append("text_input", textInput);
        }
        formData.append("num_cards", numCards);
        formData.append("title", title);
        formData.append("category", category);

        try {
            await api.post("/flashcards/generate", formData);
            navigate("/app/flashcards");
        } catch (err) {
            console.error("Error:", err);
            setError("Failed to generate flashcards. Make sure Backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    // Loading Overlay Component
    const LoadingOverlay = () => (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
            {/* Animated Cards Container */}
            <div style={{
                position: 'relative',
                width: '200px',
                height: '150px',
                marginBottom: '2rem'
            }}>
                {/* Card 1 - Back */}
                <div className="loading-card card-1" style={{
                    position: 'absolute',
                    width: '120px',
                    height: '80px',
                    backgroundColor: 'var(--color-primary-light)',
                    borderRadius: '12px',
                    left: '20px',
                    top: '20px',
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
                }} />

                {/* Card 2 - Middle */}
                <div className="loading-card card-2" style={{
                    position: 'absolute',
                    width: '120px',
                    height: '80px',
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: '12px',
                    left: '40px',
                    top: '35px',
                    boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)'
                }} />

                {/* Card 3 - Front (Flipping) */}
                <div className="loading-card card-3" style={{
                    position: 'absolute',
                    width: '120px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                    borderRadius: '12px',
                    left: '60px',
                    top: '50px',
                    boxShadow: '0 12px 40px rgba(99, 102, 241, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Sparkles size={28} color="white" className="sparkle-icon" />
                </div>

                {/* Floating sparkles */}
                <div className="sparkle sparkle-1" style={{ position: 'absolute', top: '0', right: '30px' }}>
                    <Sparkles size={16} color="var(--color-primary)" />
                </div>
                <div className="sparkle sparkle-2" style={{ position: 'absolute', bottom: '10px', left: '0' }}>
                    <Sparkles size={12} color="var(--color-primary-light)" />
                </div>
                <div className="sparkle sparkle-3" style={{ position: 'absolute', top: '30px', right: '0' }}>
                    <Sparkles size={14} color="#8B5CF6" />
                </div>
            </div>

            {/* Loading Text */}
            <h2 style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '0.75rem'
            }}>
                Creating Your Flashcards
            </h2>

            <p style={{
                color: 'var(--color-text-muted)',
                fontSize: '1rem',
                marginBottom: '2rem',
                textAlign: 'center',
                maxWidth: '300px'
            }}>
                AI is generating {numCards} personalized flashcards for <strong>"{title}"</strong>
            </p>

            {/* Animated Progress Dots */}
            <div style={{ display: 'flex', gap: '8px' }}>
                <div className="progress-dot dot-1" />
                <div className="progress-dot dot-2" />
                <div className="progress-dot dot-3" />
            </div>

            <style>{`
                /* Card animations */
                .loading-card {
                    animation: cardFloat 2s ease-in-out infinite;
                }
                .card-1 { animation-delay: 0s; }
                .card-2 { animation-delay: 0.2s; }
                .card-3 { animation: cardFlip 1.5s ease-in-out infinite; }
                
                @keyframes cardFloat {
                    0%, 100% { transform: translateY(0) rotate(-2deg); }
                    50% { transform: translateY(-8px) rotate(2deg); }
                }
                
                @keyframes cardFlip {
                    0%, 100% { transform: rotateY(0deg) translateY(0); }
                    25% { transform: rotateY(90deg) translateY(-5px); }
                    50% { transform: rotateY(180deg) translateY(0); }
                    75% { transform: rotateY(270deg) translateY(-5px); }
                }
                
                /* Sparkle animations */
                .sparkle {
                    animation: sparkleFloat 2s ease-in-out infinite;
                }
                .sparkle-1 { animation-delay: 0s; }
                .sparkle-2 { animation-delay: 0.5s; }
                .sparkle-3 { animation-delay: 1s; }
                
                .sparkle-icon {
                    animation: sparkleRotate 2s linear infinite;
                }
                
                @keyframes sparkleFloat {
                    0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
                    50% { transform: translateY(-15px) scale(1.2); opacity: 1; }
                }
                
                @keyframes sparkleRotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                /* Progress dots */
                .progress-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: var(--color-primary);
                    animation: dotPulse 1.4s ease-in-out infinite;
                }
                .dot-1 { animation-delay: 0s; }
                .dot-2 { animation-delay: 0.2s; }
                .dot-3 { animation-delay: 0.4s; }
                
                @keyframes dotPulse {
                    0%, 100% { transform: scale(0.6); opacity: 0.4; }
                    50% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );

    return (
        <>
            {isLoading && <LoadingOverlay />}
            <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '2rem' }}>
                <Link to="/app/flashcards" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    <ArrowLeft size={18} /> Back to Library
                </Link>

                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>Create New Deck</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                        Upload your study materials or paste your notes to generate AI-powered flashcards.
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>

                    {/* Title & Category Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        {/* Title Input */}
                        <div>
                            <label style={{ display: 'block', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                                Title *
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Constitutional Law 101"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: 'none',
                                    borderBottom: '2px solid var(--color-border)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                            />
                        </div>

                        {/* Category Input */}
                        <div>
                            <label style={{ textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Category *</span>
                                {!isNewCategory && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); setIsNewCategory(true); }}
                                        style={{ color: 'var(--color-primary)', fontSize: '0.8rem', textTransform: 'none', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        New Category
                                    </button>
                                )}
                                {isNewCategory && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); setIsNewCategory(false); }}
                                        style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'none', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </label>
                            {isNewCategory ? (
                                <input
                                    type="text"
                                    placeholder="Enter category name"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    autoFocus
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: 'none',
                                        borderBottom: '2px solid var(--color-border)',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                                />
                            ) : (
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: 'none',
                                        borderBottom: '2px solid var(--color-border)',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        backgroundColor: 'white'
                                    }}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Source Toggle */}
                    <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
                        <button
                            onClick={() => setActiveTab('file')}
                            style={{
                                padding: '1rem 2rem',
                                borderBottom: activeTab === 'file' ? '2px solid var(--color-primary)' : '2px solid transparent',
                                color: activeTab === 'file' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <UploadCloud size={18} /> Upload File
                        </button>
                        <button
                            onClick={() => setActiveTab('text')}
                            style={{
                                padding: '1rem 2rem',
                                borderBottom: activeTab === 'text' ? '2px solid var(--color-primary)' : '2px solid transparent',
                                color: activeTab === 'text' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <FileText size={18} /> Paste Text
                        </button>
                    </div>

                    {/* Upload Area */}
                    {activeTab === 'file' && (
                        <div
                            style={{
                                padding: '3rem',
                                border: '2px dashed var(--color-primary-light)',
                                borderRadius: 'var(--radius-lg)',
                                backgroundColor: 'var(--color-primary-subtle)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                cursor: 'pointer',
                                marginBottom: '2rem',
                                position: 'relative',
                                transition: 'background-color 0.2s'
                            }}
                            onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.backgroundColor = '#EDE9FE'; }}
                            onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.backgroundColor = 'var(--color-primary-subtle)'; }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.style.backgroundColor = 'var(--color-primary-subtle)';
                                if (e.dataTransfer.files) setFile(e.dataTransfer.files[0]);
                            }}
                        >
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.docx,.txt"
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            />

                            {file ? (
                                <div style={{ color: 'var(--color-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <FileText size={48} style={{ marginBottom: '1rem' }} />
                                    <span style={{ fontWeight: '600', fontSize: '1.2rem' }}>{file.name}</span>
                                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Click to replace</span>
                                </div>
                            ) : (
                                <>
                                    <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '50%', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                                        <UploadCloud size={32} />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>Click or Drag file to upload</h3>
                                    <p style={{ color: 'var(--color-text-muted)', maxWidth: '300px' }}>
                                        Support for PDF, DOCX, and TXT files.
                                    </p>
                                </>
                            )}
                        </div>
                    )}

                    {/* Text Area */}
                    {activeTab === 'text' && (
                        <div style={{ marginBottom: '2rem' }}>
                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Paste your lecture notes, article text, or any content here..."
                                style={{
                                    width: '100%',
                                    minHeight: '200px',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    fontFamily: 'inherit',
                                    lineHeight: '1.6',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                    )}

                    {/* Number of Cards */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', padding: '1.5rem', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)' }}>
                        <div>
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>Number of Questions</label>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>How many flashcards do you want generated?</p>
                        </div>
                        <input
                            type="number"
                            value={numCards}
                            onChange={(e) => setNumCards(e.target.value)}
                            min="1"
                            max="50"
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                width: '80px',
                                fontWeight: '600',
                                textAlign: 'center'
                            }}
                        />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                        {error && <span style={{ color: '#DC2626', fontSize: '0.9rem' }}>{error}</span>}
                        <button
                            className="btn btn-primary"
                            onClick={handleUpload}
                            disabled={isLoading}
                            style={{ padding: '0.875rem 2.5rem', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" style={{ marginRight: '0.5rem' }} /> Generating...
                                </>
                            ) : (
                                "Generate Deck"
                            )}
                        </button>
                        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
                    </div>

                </div>
            </div>
        </>
    );
};

export default CreateFlashcardDeck;
