
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Loader2, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import api from '../../lib/axios';
import MarkdownRenderer from '../../components/MarkdownRenderer';

const ConceptView = () => {
    const { id } = useParams();
    const [concept, setConcept] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

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

    const handleDownload = () => {
        if (!concept) return;
        setDownloading(true);

        try {
            // Create PDF using jsPDF
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 20;
            const maxWidth = pageWidth - margin * 2;
            let yPosition = 20;

            // Title
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            const titleLines = doc.splitTextToSize(concept.title, maxWidth);
            doc.text(titleLines, margin, yPosition);
            yPosition += titleLines.length * 10 + 10;

            // Underline
            doc.setDrawColor(100, 100, 100);
            doc.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);
            yPosition += 5;

            // Content
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');

            // Strip markdown formatting for PDF (basic cleanup)
            const cleanContent = concept.summary
                .replace(/#{1,6}\s/g, '')  // Remove headers
                .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
                .replace(/\*(.*?)\*/g, '$1')  // Remove italic
                .replace(/`(.*?)`/g, '$1')  // Remove code
                .replace(/--NEXT--/g, '\n\n---\n\n');  // Replace separator

            const contentLines = doc.splitTextToSize(cleanContent, maxWidth);

            // Add content with page breaks
            for (const line of contentLines) {
                if (yPosition > 280) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(line, margin, yPosition);
                yPosition += 6;
            }

            // Save PDF
            const filename = `${concept.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
            doc.save(filename);
        } catch (error) {
            console.error('PDF generation failed:', error);
        }

        setDownloading(false);
    };

    if (loading) return <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}><Loader2 className="animate-spin" /></div>;
    if (!concept) return <div style={{ padding: '4rem', textAlign: 'center' }}>Concept not found</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <Link to="/app/extractor" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                    <ArrowLeft size={18} /> Back
                </Link>
                <button
                    className="btn btn-secondary"
                    onClick={handleDownload}
                    disabled={downloading}
                    style={{
                        padding: '0.5rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: downloading ? 'wait' : 'pointer'
                    }}
                >
                    {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    Download PDF
                </button>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-primary-light)', borderRadius: '8px' }}>
                        <FileText size={24} color="var(--color-primary)" />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>
                        {concept.title}
                    </h1>
                </div>

                <div style={{ lineHeight: '1.8', fontSize: '1.125rem', color: 'var(--color-text-main)' }}>
                    <MarkdownRenderer content={concept.summary} />
                </div>
            </div>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
        </div>
    );
};

export default ConceptView;

