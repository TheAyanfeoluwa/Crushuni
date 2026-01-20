

/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { motion } from 'framer-motion';
import { Activity, BookOpen, BrainCircuit, Calendar, Layers, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ label, value, icon: Icon, color, trend }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: '600' }}>{label}</p>
                <h3 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-text-main)', marginTop: '0.25rem' }}>{value}</h3>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: `${color}20`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} />
            </div>
        </div>
        {trend && (
            <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Activity size={14} />
                <span>{trend} vs last week</span>
            </div>
        )}
    </motion.div>
);

const ActivityItem = ({ icon: Icon, title, time, type }) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
            <Icon size={20} />
        </div>
        <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-main)' }}>{title}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{type} • {time}</p>
        </div>
        <button style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'white', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
            Review
        </button>
    </div>
);

const DashboardOverview = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard');
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                // Fallback valid structure
                setData({
                    stats: { total_decks: 0, total_flashcards: 0, total_concepts: 0, study_streak: 0 },
                    recent_activity: { decks: [], concepts: [] }
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleQuickStudy = () => {
        if (data?.recent_activity?.decks?.length > 0) {
            // Study the most recent deck
            const latestDeckId = data.recent_activity.decks[0].id;
            navigate(`/app/flashcards/study/${latestDeckId}`);
        } else {
            // No decks, go to create
            navigate('/app/flashcards/create');
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard...</div>;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-text-main)' }}>Welcome back, {user?.full_name || 'Student'}! 👋</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Here's what's happening with your learning today.</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatCard label="Total Decks" value={data?.stats?.total_decks || 0} icon={Layers} color="#3B82F6" trend="+2" />
                <StatCard label="Flashcards Created" value={data?.stats?.total_flashcards || 0} icon={Zap} color="#F59E0B" trend="+24" />
                <StatCard label="Active Concepts" value={data?.stats?.total_concepts || 0} icon={BrainCircuit} color="#8B5CF6" />
                <StatCard label="Study Streak" value={`${data?.stats?.study_streak || 0} Days`} icon={Calendar} color="#EF4444" />
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Recent Activity */}
                <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Recent Activity</h3>
                        <Link to="/app/flashcards" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: '600' }}>View All</Link>
                    </div>
                    <div>
                        {data?.recent_activity?.decks?.length > 0 ? (
                            data.recent_activity.decks.map(deck => (
                                <ActivityItem key={deck.id} icon={BookOpen} title={deck.title} type="Flashcard Deck" time={new Date(deck.created_at).toLocaleDateString()} />
                            ))
                        ) : (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No recent activity found. Start studying!</div>
                        )}
                        {data?.recent_activity?.concepts?.map(concept => (
                            <ActivityItem key={concept.id} icon={BrainCircuit} title={concept.title} type="Concept Extraction" time={new Date(concept.created_at).toLocaleDateString()} />
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)', borderRadius: '1rem', padding: '2rem', color: 'white', textAlign: 'center' }}>
                        <div style={{ width: '3rem', height: '3rem', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                            <Zap size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>Quick Study</h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1.5rem' }}>Start a random 10-card session from your library.</p>
                        <button onClick={handleQuickStudy} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'white', color: '#4F46E5', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'transform 0.1s' }}>Start Session</button>
                    </div>

                    <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Learning Progress</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                                <span>Weekly Goal</span>
                                <span>75%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '99px' }}>
                                <div style={{ width: '75%', height: '100%', background: '#10B981', borderRadius: '99px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
