import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

/**
 * MarkdownRenderer - Renders Markdown text with LaTeX math support
 * Supports:
 * - Standard Markdown (headers, bold, italic, lists, code blocks, etc.)
 * - Inline math with $...$ or \(...\)
 * - Block math with $$...$$ or \[...\]
 */
const MarkdownRenderer = ({ content, className = '', style = {} }) => {
    if (!content) return null;

    return (
        <div
            className={`markdown-content ${className}`}
            style={{
                lineHeight: '1.7',
                ...style
            }}
        >
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // Custom styling for different elements
                    h1: ({ node, ...props }) => <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem', marginTop: '1.5rem' }} {...props} />,
                    h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem', marginTop: '1.25rem' }} {...props} />,
                    h3: ({ node, ...props }) => <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }} {...props} />,
                    p: ({ node, ...props }) => <p style={{ marginBottom: '1rem' }} {...props} />,
                    ul: ({ node, ...props }) => <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem', listStyleType: 'disc' }} {...props} />,
                    ol: ({ node, ...props }) => <ol style={{ marginBottom: '1rem', paddingLeft: '1.5rem', listStyleType: 'decimal' }} {...props} />,
                    li: ({ node, ...props }) => <li style={{ marginBottom: '0.25rem' }} {...props} />,
                    code: ({ node, inline, ...props }) =>
                        inline ? (
                            <code style={{
                                backgroundColor: 'var(--color-bg-surface)',
                                padding: '0.125rem 0.375rem',
                                borderRadius: '4px',
                                fontSize: '0.9em',
                                fontFamily: 'monospace'
                            }} {...props} />
                        ) : (
                            <code style={{
                                display: 'block',
                                backgroundColor: '#1e1e1e',
                                color: '#d4d4d4',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.875rem',
                                fontFamily: 'monospace',
                                overflowX: 'auto',
                                marginBottom: '1rem'
                            }} {...props} />
                        ),
                    pre: ({ node, ...props }) => <pre style={{ marginBottom: '1rem' }} {...props} />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote style={{
                            borderLeft: '4px solid var(--color-primary)',
                            paddingLeft: '1rem',
                            marginLeft: '0',
                            marginBottom: '1rem',
                            color: 'var(--color-text-muted)',
                            fontStyle: 'italic'
                        }} {...props} />
                    ),
                    a: ({ node, ...props }) => (
                        <a style={{
                            color: 'var(--color-primary)',
                            textDecoration: 'underline'
                        }} target="_blank" rel="noopener noreferrer" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                        <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                border: '1px solid var(--color-border)'
                            }} {...props} />
                        </div>
                    ),
                    th: ({ node, ...props }) => (
                        <th style={{
                            padding: '0.75rem',
                            backgroundColor: 'var(--color-bg-surface)',
                            borderBottom: '2px solid var(--color-border)',
                            textAlign: 'left',
                            fontWeight: '600'
                        }} {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td style={{
                            padding: '0.75rem',
                            borderBottom: '1px solid var(--color-border)'
                        }} {...props} />
                    ),
                    hr: ({ node, ...props }) => (
                        <hr style={{
                            border: 'none',
                            borderTop: '1px solid var(--color-border)',
                            margin: '1.5rem 0'
                        }} {...props} />
                    ),
                    strong: ({ node, ...props }) => <strong style={{ fontWeight: '600' }} {...props} />,
                    em: ({ node, ...props }) => <em style={{ fontStyle: 'italic' }} {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
