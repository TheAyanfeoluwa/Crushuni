
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Trash2, Shield, Mail, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SettingsSection = ({ title, icon: Icon, children }) => (
    <div style={{
        background: 'white',
        borderRadius: '1rem',
        border: '1px solid var(--color-border)',
        padding: '2rem',
        marginBottom: '2rem'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
                <Icon size={20} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-main)', margin: 0 }}>{title}</h2>
        </div>
        {children}
    </div>
);

const InputGroup = ({ label, type = 'text', defaultValue = '', placeholder = '' }) => (
    <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>{label}</label>
        <input
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--color-border)',
                fontSize: '1rem',
                transition: 'all 0.2s',
                outline: 'none'
            }}
            className="input-focus"
        />
        <style dangerouslySetInnerHTML={{
            __html: `
            .input-focus:focus {
                border-color: var(--color-primary);
                box-shadow: 0 0 0 2px var(--color-primary-20);
            }
        `}} />
    </div>
);

const AccountSettings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Account Settings</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Manage your profile, security preferences, and account data.</p>
            </div>

            <SettingsSection title="Profile Information" icon={User}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <InputGroup label="First Name" defaultValue={user?.first_name || ''} />
                        <InputGroup label="Last Name" defaultValue={user?.last_name || ''} />
                    </div>
                    <InputGroup label="Email Address" type="email" defaultValue={user?.email || ''} />
                    <div style={{ marginTop: '1rem' }}>
                        <button className="btn btn-primary">Save Changes</button>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Security" icon={Lock}>
                <InputGroup label="Current Password" type="password" placeholder="••••••••" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <InputGroup label="New Password" type="password" placeholder="New password" />
                    <InputGroup label="Confirm New Password" type="password" placeholder="Confirm new password" />
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <button className="btn btn-secondary">Update Password</button>
                </div>
            </SettingsSection>

            <div style={{
                background: '#FEF2F2',
                borderRadius: '1rem',
                border: '1px solid #FECACA',
                padding: '2rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: '#B91C1C' }}>
                    <Trash2 size={24} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Danger Zone</h2>
                </div>

                <p style={{ color: '#7F1D1D', marginBottom: '1.5rem' }}>
                    Once you delete your account, there is no going back. Please be certain.
                </p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{
                        background: '#DC2626',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer'
                    }}>
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
