
/* eslint-disable no-unused-vars */
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BrainCircuit, FileText, MessageSquare, Laptop, LogOut, Settings, Activity } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            color: isActive ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
            backgroundColor: isActive ? 'var(--color-primary-subtle)' : 'transparent',
            fontWeight: isActive ? '600' : '500',
            marginBottom: '0.5rem',
            transition: 'all 0.2s ease'
        })}
    >
        <Icon size={20} />
        {label}
    </NavLink>
);

import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
    const { logout } = useAuth();

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--color-bg-surface)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: 'white',
                borderRight: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
                    <img src="/logo.png" alt="CrushUni Logo" style={{ height: '32px', width: 'auto' }} />
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-main)' }}>CrushUni</span>
                </div>

                <nav style={{ flex: 1 }}>
                    <SidebarItem to="/app/overview" icon={Activity} label="Overview" />
                    <SidebarItem to="/app/flashcards" icon={FileText} label="Flashcards" />
                    <SidebarItem to="/app/chatbot" icon={MessageSquare} label="AI Tutor" />
                    <SidebarItem to="/app/extractor" icon={Laptop} label="Concept Extractor" />
                    <SidebarItem to="/app/settings" icon={Settings} label="Settings" />
                </nav>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                    <button onClick={logout} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        width: '100%',
                        color: 'var(--color-text-muted)',
                        fontWeight: '500',
                        cursor: 'pointer'
                    }}>
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
