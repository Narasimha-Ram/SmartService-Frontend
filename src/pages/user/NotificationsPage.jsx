import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { notificationApi } from '../../api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle2, ArrowRight } from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getAll();
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read.');
    } catch (err) {
      toast.error('Failed to mark notifications.');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppLayout title="Notifications">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} /> Notification History
          </h3>
          {notifications.some(n => !n.isRead) && (
            <button onClick={handleMarkAllRead} className="btn btn-secondary btn-sm">
              <CheckCircle2 size={16} /> Mark All as Read
            </button>
          )}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : notifications.length === 0 ? (
          <EmptyState title="No notifications" description="You have no notifications at this time." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => !n.isRead && handleMarkRead(n.id)}
                style={{
                  backgroundColor: n.isRead ? '#FFFFFF' : '#EFF6FF',
                  border: `1px solid ${n.isRead ? '#E2E8F0' : '#BFDBFE'}`,
                  borderRadius: '8px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: n.isRead ? 'default' : 'pointer'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!n.isRead && <span style={{ width: '8px', height: '8px', backgroundColor: '#2563EB', borderRadius: '50%' }} />}
                    {n.title}
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>{n.message}</p>
                  <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px', display: 'block' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>

                {n.relatedComplaintId && (
                  <Link to={`/complaints/${n.relatedComplaintId}`} className="btn btn-secondary btn-sm">
                    View Complaint <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default NotificationsPage;
