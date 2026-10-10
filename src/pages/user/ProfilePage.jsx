import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { userApi } from '../../api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Shield, Save } from 'lucide-react';

const ProfilePage = () => {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userApi.getProfile()
      .then(res => setProfile(res.data))
      .catch(err => toast.error('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userApi.updateProfile({ name: profile.name, phone: profile.phone });
      setProfile(res.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout title="My Profile">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#2563EB',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 700,
              margin: '0 auto 12px'
            }}>
              {profile.name ? profile.name[0].toUpperCase() : 'U'}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{profile.name}</h2>
            <span className="badge badge-assigned" style={{ marginTop: '4px' }}>{profile.role}</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  required
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="email"
                  disabled
                  className="form-control"
                  style={{ paddingLeft: '40px', backgroundColor: '#F1F5F9' }}
                  value={profile.email}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="tel"
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                  placeholder="+1 (555) 000-0000"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
