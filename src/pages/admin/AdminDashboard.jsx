import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import KpiCard from '../../components/KpiCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { analyticsApi, adminApi } from '../../api';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Users,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#64748B'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, complaintsRes] = await Promise.all([
          analyticsApi.getDashboard(),
          adminApi.getAllComplaints({ page: 0, size: 5 })
        ]);
        setStats(dashRes.data);
        setRecentComplaints(complaintsRes.data.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <AppLayout title="Admin Control Dashboard"><LoadingSpinner /></AppLayout>;

  return (
    <AppLayout title="Admin Overview & Analytics">
      {/* KPI Row */}
      <div className="kpi-grid">
        <KpiCard title="Total Complaints" value={stats?.totalComplaints} icon={FileText} color="#2563EB" bgColor="#EFF6FF" />
        <KpiCard title="Pending Assignment" value={stats?.pendingComplaints} icon={Clock} color="#F59E0B" bgColor="#FEF3C7" />
        <KpiCard title="In Progress" value={stats?.inProgressComplaints} icon={AlertCircle} color="#8B5CF6" bgColor="#EDE9FE" />
        <KpiCard title="Resolved / Closed" value={stats?.resolvedComplaints + stats?.closedComplaints} icon={CheckCircle2} color="#10B981" bgColor="#D1FAE5" />
        <KpiCard title="Critical Priority" value={stats?.criticalComplaints} icon={AlertTriangle} color="#EF4444" bgColor="#FEE2E2" />
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        
        {/* Monthly Trend Chart */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} /> Monthly Complaint Volume
            </h3>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={stats?.monthlyTrend || []}>
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3 className="card-title">Category Distribution</h3>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats?.categoryDistribution || []}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ category, count }) => `${category}: ${count}`}
                >
                  {(stats?.categoryDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Master Complaint Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Inbound Complaints</h3>
          <Link to="/admin/complaints" style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Manage All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Complaint #</th>
                <th>Title</th>
                <th>Category</th>
                <th>Submitted By</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentComplaints.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.complaintNumber}</td>
                  <td style={{ maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </td>
                  <td>{item.categoryName}</td>
                  <td>{item.userName}</td>
                  <td><PriorityBadge priority={item.priority} /></td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>
                    <Link to={`/admin/complaints/${item.id}`} className="btn btn-secondary btn-sm">
                      Manage Ticket
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
