import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import KpiCard from '../../components/KpiCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { complaintApi } from '../../api';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle2, AlertCircle, PlusCircle, ArrowRight } from 'lucide-react';

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await complaintApi.getMyComplaints(0, 5);
        setComplaints(res.data.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'PENDING').length;
  const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

  return (
    <AppLayout title="Dashboard">
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        color: 'white',
        borderRadius: '12px',
        padding: '28px 32px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>SmartServe Complaint & Service Portal</h2>
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>Track your existing complaints or file a new service request with automated priority scoring.</p>
        </div>
        <Link to="/create-complaint" className="btn btn-primary" style={{ flexShrink: 0 }}>
          <PlusCircle size={18} /> Submit Complaint
        </Link>
      </div>

      {/* KPI Section */}
      <div className="kpi-grid">
        <KpiCard title="Total Complaints" value={total} icon={FileText} color="#2563EB" bgColor="#EFF6FF" />
        <KpiCard title="Pending Action" value={pending} icon={Clock} color="#F59E0B" bgColor="#FEF3C7" />
        <KpiCard title="In Progress" value={inProgress} icon={AlertCircle} color="#8B5CF6" bgColor="#EDE9FE" />
        <KpiCard title="Resolved / Closed" value={resolved} icon={CheckCircle2} color="#10B981" bgColor="#D1FAE5" />
      </div>

      {/* Recent Complaints Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Service Requests</h3>
          <Link to="/my-complaints" style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : complaints.length === 0 ? (
          <EmptyState
            title="No complaints filed yet"
            description="You haven't submitted any service requests or complaints."
            action={
              <Link to="/create-complaint" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                File First Complaint
              </Link>
            }
          />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.complaintNumber}</td>
                    <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </td>
                    <td>{item.categoryName}</td>
                    <td><PriorityBadge priority={item.priority} /></td>
                    <td><StatusBadge status={item.status} /></td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/complaints/${item.id}`} className="btn btn-secondary btn-sm">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default UserDashboard;
