
import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-surface)' }}>
            <div style={{ textAlign: 'center' }}>
                <FileQuestion size={64} style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', opacity: 0.5 }} />
                <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>404</h1>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="btn btn-primary">
                    <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Go Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
