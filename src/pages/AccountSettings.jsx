
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { User, Lock, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';

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

const InputGroup = ({ label, type = 'text', value, onChange, placeholder = '' }) => (
    <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
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
        />
    </div>
);

const StatusMessage = ({ type, message }) => {
    if (!message) return null;
    const isSuccess = type === 'success';
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            backgroundColor: isSuccess ? '#ECFDF5' : '#FEF2F2',
            color: isSuccess ? '#059669' : '#DC2626',
            marginBottom: '1rem',
            fontSize: '0.9rem'
        }}>
            {isSuccess ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message}
        </div>
    );
};

const AccountSettings = () => {
    const { user } = useAuth();

    // Profile form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

    // Password form state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSaveProfile = async () => {
        setProfileLoading(true);
        setProfileMessage({ type: '', text: '' });

        try {
            await api.put('/auth/profile', {
                first_name: firstName,
                last_name: lastName,
                email: email
            });
            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            const msg = error.response?.data?.detail || 'Failed to update profile';
            setProfileMessage({ type: 'error', text: msg });
        }

        setProfileLoading(false);
    };

    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setPasswordLoading(true);
        setPasswordMessage({ type: '', text: '' });

        try {
            await api.put('/auth/password', {
                current_password: currentPassword,
                new_password: newPassword
            });
            setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            const msg = error.response?.data?.detail || 'Failed to update password';
            setPasswordMessage({ type: 'error', text: msg });
        }

        setPasswordLoading(false);
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Account Settings</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Manage your profile, security preferences, and account data.</p>
            </div>

            <SettingsSection title="Profile Information" icon={User}>
                <StatusMessage type={profileMessage.type} message={profileMessage.text} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <InputGroup label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <InputGroup label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <InputGroup label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <div style={{ marginTop: '1rem' }}>
                    <button className="btn btn-primary" onClick={handleSaveProfile} disabled={profileLoading}>
                        {profileLoading ? <><Loader2 size={18} className="animate-spin" style={{ marginRight: '0.5rem' }} /> Saving...</> : 'Save Changes'}
                    </button>
                </div>
            </SettingsSection>

            <SettingsSection title="Security" icon={Lock}>
                <StatusMessage type={passwordMessage.type} message={passwordMessage.text} />
                <InputGroup label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <InputGroup label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password (min 8 chars)" />
                    <InputGroup label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <button className="btn btn-secondary" onClick={handleUpdatePassword} disabled={passwordLoading}>
                        {passwordLoading ? <><Loader2 size={18} className="animate-spin" style={{ marginRight: '0.5rem' }} /> Updating...</> : 'Update Password'}
                    </button>
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
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
        </div>
    );
};

export default AccountSettings;

