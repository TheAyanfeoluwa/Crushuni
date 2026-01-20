
import React, { useState } from 'react';
import { Send, Bot, FileText, Sparkles, MoreHorizontal, Maximize2, UploadCloud } from 'lucide-react';
import api from '../lib/axios';

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

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setContextFile(file);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post("/extract", formData);
            setContextText(response.data.text);
            setMessages(prev => [...prev, {
                role: 'system',
                content: `I've analyzed "${file.name}". I'm now ready to answer questions based on this document.`
            }]);

        } catch (error) {
            console.error(error);
            setContextFile(null);
            alert("Failed to analyze file.");
        } finally {
            setIsUploading(false);
        }
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
        if (e.key === 'Enter') handleSend();
    };

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
                    padding: '1rem',
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
                </div>

                <div style={{
                    flex: 1,
                    padding: '2rem',
                    backgroundColor: '#F9FAFB',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-muted)',
                    position: 'relative'
                }}>
                    {!contextText ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '100%',
                                padding: '2rem',
                                border: '2px dashed var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                position: 'relative'
                            }}>
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    accept=".pdf,.docx,.txt"
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                />
                                {isUploading ? (
                                    <div className="animate-pulse">Analyzing Document...</div>
                                ) : (
                                    <>
                                        <UploadCloud size={32} style={{ margin: '0 auto 0.5rem auto', color: 'var(--color-primary)' }} />
                                        <p style={{ fontWeight: '600' }}>Click to Upload Context</p>
                                        <p style={{ fontSize: '0.8rem' }}>PDF, DOCX, TXT</p>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            overflowY: 'auto',
                            textAlign: 'left',
                            fontSize: '0.85rem',
                            whiteSpace: 'pre-wrap',
                            padding: '1rem',
                            backgroundColor: 'white',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)'
                        }}>
                            {contextText}
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

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                                {msg.content}
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
                    {isLoading && <div style={{ alignSelf: 'flex-start', color: 'var(--color-text-muted)', fontStyle: 'italic', marginLeft: '1rem' }}>Typing...</div>}
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

        </div>
    );
};

export default Chatbot;
