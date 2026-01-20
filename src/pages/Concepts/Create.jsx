
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, FileText, Loader2, Sparkles } from 'lucide-react';
import api from '../../lib/axios';

const CreateConcept = () => {
    const navigate = useNavigate();
    const [textInput, setTextInput] = useState('');
    const [file, setFile] = useState(null);
    const [activeTab, setActiveTab] = useState("file"); // 'file' or 'text'
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleCreate = async () => {
        if (activeTab === 'file' && !file) {
            setError("Please upload a file.");
            return;
        }
        if (activeTab === 'text' && !textInput.trim()) {
            setError("Please enter some text.");
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const formData = new FormData();
            if (activeTab === 'file') {
                formData.append("file", file);
            } else {
                formData.append("text_input", textInput);
            }

            const response = await api.post("/concepts/generate", formData);

            navigate(`/app/extractor/view/${response.data.concept_id}`);

        } catch (error) {
            console.error(error);
            setError("Failed to generate concept summary.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '2rem' }}>
            <Link to="/app/extractor" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>Extract Concepts</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                    Upload your study materials or paste your notes to generate a structured AI summary.
                </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>

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
                                minHeight: '300px',
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

                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                    {error && <span style={{ color: '#DC2626', fontSize: '0.9rem' }}>{error}</span>}
                    <button
                        className="btn btn-primary"
                        onClick={handleCreate}
                        disabled={isProcessing}
                        style={{ padding: '0.875rem 2.5rem', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}
                    >
                        {isProcessing ? (
                            <><Loader2 size={20} className="animate-spin" style={{ marginRight: '0.5rem' }} /> Analyzing...</>
                        ) : (
                            <><Sparkles size={18} style={{ marginRight: '0.5rem' }} /> Generate Summary</>
                        )}
                    </button>
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
                </div>
            </div>
        </div>
    );
};

export default CreateConcept;
