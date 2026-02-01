
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, FileText, Sparkles, MoreHorizontal, Maximize2, UploadCloud, ZoomIn, ZoomOut, RotateCw, Download, X } from 'lucide-react';
import api from '../lib/axios';
import MarkdownRenderer from '../components/MarkdownRenderer';

const Chatbot = () => {
    // Unique Design Idea: "Split Context"
    // Left side: The Source Material (PDF/Notes) visualizer
    // Right side: The Active Intelligence (Chat/Graph)

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'system', content: "Hello! I'm synchronized with your notes. Upload a document to get started, or just ask me anything." }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // File Context State
    const [contextFile, setContextFile] = useState(null);
    const [contextText, setContextText] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [pdfZoom, setPdfZoom] = useState(100);

    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive (only within chat container)
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Cleanup blob URL on unmount or file change
    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setContextFile(file);

        // Clean up previous PDF URL
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
            setPdfUrl(null);
        }

        // Create blob URL for PDF files
        if (file.type === 'application/pdf') {
            const blobUrl = URL.createObjectURL(file);
            setPdfUrl(blobUrl);
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post("/extract", formData);
            setContextText(response.data.text);
            setMessages(prev => [...prev, {
                role: 'system',
                content: `I've analyzed **"${file.name}"**. I'm now ready to answer questions based on this document. Feel free to ask me anything!`
            }]);

        } catch (error) {
            console.error(error);
            setContextFile(null);
            setPdfUrl(null);
            alert("Failed to analyze file.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveFile = () => {
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }
        setContextFile(null);
        setContextText("");
        setPdfUrl(null);
        setPdfZoom(100);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post("/chat", {
                message: input,
                context: contextText || "No context provided."
            });

            const botMessage = { role: 'system', content: response.data.response };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'system', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const isPdf = contextFile?.type === 'application/pdf' || contextFile?.name?.toLowerCase().endsWith('.pdf');

    return (
        <div style={{ height: 'calc(100vh - 4rem)', display: 'flex', gap: '1rem', paddingBottom: '1rem' }}>

            {/* Left Panel: Content Context (The "Brain") */}
            <div style={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-primary-30)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <div style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'var(--color-bg-surface)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={18} color="var(--color-primary)" />
                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                            {contextFile ? contextFile.name : "No Document Selected"}
                        </span>
                    </div>
                    {contextFile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {isPdf && (
                                <>
                                    <button
                                        onClick={() => setPdfZoom(z => Math.max(50, z - 25))}
                                        style={{ padding: '0.25rem', borderRadius: '4px', color: 'var(--color-text-muted)' }}
                                        title="Zoom Out"
                                    >
                                        <ZoomOut size={16} />
                                    </button>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', minWidth: '40px', textAlign: 'center' }}>
                                        {pdfZoom}%
                                    </span>
                                    <button
                                        onClick={() => setPdfZoom(z => Math.min(200, z + 25))}
                                        style={{ padding: '0.25rem', borderRadius: '4px', color: 'var(--color-text-muted)' }}
                                        title="Zoom In"
                                    >
                                        <ZoomIn size={16} />
                                    </button>
                                    <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--color-border)', margin: '0 0.25rem' }} />
                                </>
                            )}
                            <button
                                onClick={handleRemoveFile}
                                style={{ padding: '0.25rem', borderRadius: '4px', color: '#DC2626' }}
                                title="Remove File"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>

                <div style={{
                    flex: 1,
                    backgroundColor: isPdf && pdfUrl ? '#525659' : '#F9FAFB',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: contextFile ? 'flex-start' : 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {!contextFile ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{
                                width: '100%',
                                padding: '2rem',
                                border: '2px dashed var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.2s',
                                backgroundColor: 'white'
                            }}>
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    accept=".pdf,.docx,.txt"
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                />
                                {isUploading ? (
                                    <div className="animate-pulse" style={{ color: 'var(--color-primary)' }}>
                                        <RotateCw size={32} className="animate-spin" style={{ margin: '0 auto 0.5rem auto' }} />
                                        Analyzing Document...
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud size={32} style={{ margin: '0 auto 0.5rem auto', color: 'var(--color-primary)' }} />
                                        <p style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>Click to Upload Context</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>PDF, DOCX, TXT</p>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : isPdf && pdfUrl ? (
                        // Embedded PDF Viewer - hide browser toolbar, use CSS transform for zoom
                        <div style={{
                            width: '100%',
                            height: '100%',
                            overflow: 'auto',
                            backgroundColor: '#525659'
                        }}>
                            <div style={{
                                width: pdfZoom >= 100 ? `${pdfZoom}%` : '100%',
                                height: pdfZoom >= 100 ? `${pdfZoom}%` : '100%',
                                minWidth: '100%',
                                minHeight: '100%',
                                transform: pdfZoom < 100 ? `scale(${pdfZoom / 100})` : 'none',
                                transformOrigin: 'top left'
                            }}>
                                <iframe
                                    key={pdfUrl} // Stable key based on URL, not zoom
                                    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        border: 'none',
                                        backgroundColor: 'white'
                                    }}
                                    title="PDF Viewer"
                                />
                            </div>
                        </div>
                    ) : (
                        // Text/Other file viewer with Markdown support
                        <div style={{
                            width: '100%',
                            height: '100%',
                            overflowY: 'auto',
                            padding: '1.5rem',
                        }}>
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                padding: '1.5rem',
                                minHeight: '100%'
                            }}>
                                <MarkdownRenderer content={contextText} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Interaction Layer (The "Voice") */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'white',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <div style={{
                    padding: '1rem',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <Sparkles size={14} />
                    </div>
                    <span style={{ fontWeight: '700' }}>Context Tutor</span>
                    <div style={{ marginLeft: 'auto' }}>
                        <button><MoreHorizontal size={20} color="var(--color-text-muted)" /></button>
                    </div>
                </div>


                <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%'
                        }}>
                            <div style={{
                                padding: '1rem 1.25rem',
                                borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                                color: msg.role === 'user' ? 'white' : 'var(--color-text-main)',
                                boxShadow: 'var(--shadow-sm)',
                                lineHeight: '1.5'
                            }}>
                                {msg.role === 'user' ? (
                                    msg.content
                                ) : (
                                    <MarkdownRenderer
                                        content={msg.content}
                                        style={{
                                            fontSize: '0.95rem',
                                            color: 'inherit'
                                        }}
                                    />
                                )}
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-text-muted)',
                                marginTop: '0.5rem',
                                textAlign: msg.role === 'user' ? 'right' : 'left',
                                marginLeft: '0.5rem'
                            }}>
                                {msg.role === 'system' ? 'AI Partner' : 'You'}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginLeft: '1rem' }}>
                            <div className="typing-dots">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div style={{ padding: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
                    <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        backgroundColor: 'var(--color-bg-surface)',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid transparent',
                        transition: 'border-color 0.2s',
                    }} onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'} onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask a question about your notes..."
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                border: 'none',
                                background: 'transparent',
                                padding: '0.5rem 1rem',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.2s',
                                opacity: isLoading || !input.trim() ? 0.5 : 1
                            }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
                .animate-pulse { animation: pulse 2s ease-in-out infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                
                .typing-dots {
                    display: flex;
                    gap: 4px;
                }
                .typing-dots span {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: var(--color-primary);
                    animation: typing 1.4s infinite ease-in-out both;
                }
                .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
                .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
                .typing-dots span:nth-child(3) { animation-delay: 0s; }
                @keyframes typing {
                    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
                    40% { transform: scale(1); opacity: 1; }
                }
            `}</style>

        </div>
    );
};

export default Chatbot;

