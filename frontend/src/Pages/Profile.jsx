import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import API from '../services/axios';
import '../styles/Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await API.get('/auth/profile');
                setProfile(response.data);
            } catch (err) {
                const message = err.response?.data?.message || 'Failed to load profile';
                setError(message);
                if (err.response?.status === 401) {
                    toast.error('Session expired. Please log in again.');
                } else {
                    toast.error(message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="profile-loading">
                <span className="spinner"></span>
                Loading profile...
            </div>
        );
    }

    if (error) {
        return <div className="profile-error">{error}</div>;
    }

    if (!profile) {
        return <div className="profile-not-found">Profile not found</div>;
    }

    return (
        <div className="profile-container">
            <h2>Your Profile</h2>

            <div className="profile-card">
                <div className="profile-field">
                    <span className="profile-label">Username</span>
                    <span className="profile-value">
                        {profile.username}
                        {profile.roles === 'ADMIN' && (
                            <span className="admin-badge">Admin</span>
                        )}
                    </span>
                </div>

                <div className="profile-field">
                    <span className="profile-label">Email</span>
                    <span className="profile-value">{profile.email}</span>
                </div>

                <div className="profile-field">
                    <span className="profile-label">Member Since</span>
                    <span className="profile-value">
                        {new Date(profile.joinedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </span>
                </div>
            </div>

            <div className="profile-actions">
                {profile.roles === 'ADMIN' ? (
                    <>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/addTrains')}
                        >
                            Add Train
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/location')}
                        >
                            Locations
                        </button>
                    </>
                ) : (
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/myBookings')}
                    >
                        My Bookings
                    </button>
                )}
            </div>
        </div>
    );
};

export default Profile;