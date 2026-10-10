import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import StatusTimeline from '../../components/StatusTimeline';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  UserCheck,
  RefreshCw,
  Building,
  User,
  MessageSquare,
  Paperclip,
  Clock,
  Sparkles,
  Send,
  Lock
} from 'lucide-react';

const AdminComplaintDetailPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assignment state
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [assignNotes, setAssignNotes] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Status update state
  const [nextStatus, setNextStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Internal comment state
  const [internalComment, setInternalComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [compRes, deptsRes] = await Promise.all([
        adminApi.getComplaintById(id),
        adminApi.getDepartments()
      ]);
      setComplaint(compRes.data);
      setDepartments(deptsRes.data || []);
    } catch (err) {
      toast.error('Failed to load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = async (deptId) => {
    setSelectedDept(deptId);
    setSelectedStaff('');
    if (!deptId) {
      setStaffList([]);
      return;
    }
    try {
      const res = await adminApi.getStaffByDept(deptId);
      setStaffList(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDept) {
      toast.error('Please select a department.');
      return;
    }
    setAssigning(true);
    try {
      const res = await adminApi.assignComplaint(id, {
        departmentId: parseInt(selectedDept),
        staffId: selectedStaff ? parseInt(selectedStaff) : null,
        notes: assignNotes
      });
      setComplaint(res.data);
      toast.success('Complaint assigned successfully.');
      setAssignNotes('');
    } catch (err) {
      toast.error(err.message || 'Failed to assign complaint.');
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!nextStatus) {
      toast.error('Please select a status.');
      return;
    }
    setUpdatingStatus(true);
    try {
      const res = await adminApi.updateStatus(id, {
        status: nextStatus,
        notes: statusNotes
      });
      setComplaint(res.data);
      toast.success(`Status updated to ${nextStatus}`);
      setStatusNotes('');
    } catch (err) {
      toast.error(err.message || 'Invalid status transition.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddInternalComment = async (e) => {
    e.preventDefault();
    if (!internalComment.trim()) return;
    setPostingComment(true);
    try {
      const res = await adminApi.addInternalComment(id, {
        message: internalComment,
        isInternal: true
      });
      setComplaint(res.data);
      setInternalComment('');
      toast.success('Internal note added.');
    } catch (err) {
      toast.error(err.message || 'Failed to add note.');
    } finally {
      setPostingComment(false);
    }
  };

  if (loading) return <AppLayout title="Manage Complaint"><LoadingSpinner /></AppLayout>;
  if (!complaint) return <AppLayout title="Manage Complaint"><div>Complaint not found.</div></AppLayout>;

  return (
    <AppLayout title={`Manage Ticket #${complaint.complaintNumber}`}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/admin/complaints" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, color: '#64748B' }}>
          <ArrowLeft size={16} /> Back to All Complaints
        </Link>
      </div>

      {/* Visual Status Progress Pipeline */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="card-title">Resolution Workflow</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>
        <StatusTimeline currentStatus={complaint.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Complaint Details, Assignment Form, Status Form */}
        <div style={{ flex: 2 }}>

          {/* Ticket Information Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                  {complaint.title}
                </h2>
                <div style={{ fontSize: '13px', color: '#64748B' }}>
                  Submitted by <strong>{complaint.userName}</strong> ({complaint.userEmail}) on {new Date(complaint.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748B', margin: '16px 0', flexWrap: 'wrap' }}>
              <span><strong>Category:</strong> {complaint.categoryName}</span>
              <span>•</span>
              <span><strong>Location:</strong> {complaint.location}</span>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>Issue Description</h4>
              <p style={{ fontSize: '14px', color: '#0F172A', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{complaint.description}</p>
            </div>

            {/* Attachments */}
            {complaint.attachments && complaint.attachments.length > 0 && (
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Attachments</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {complaint.attachments.map(att => (
                    <a key={att.id} href={att.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                      <Paperclip size={14} /> {att.fileName}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin Action 1: Department & Staff Assignment */}
          <div className="card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={18} /> Assign Department & Staff
            </h3>
            
            <form onSubmit={handleAssignSubmit} style={{ marginTop: '16px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Select Department *</label>
                  <select
                    className="form-control"
                    value={selectedDept}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                  >
                    <option value="">-- Choose Department --</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Assign Staff Member</label>
                  <select
                    className="form-control"
                    value={selectedStaff}
                    disabled={!selectedDept}
                    onChange={(e) => setSelectedStaff(e.target.value)}
                  >
                    <option value="">-- Choose Staff (Optional) --</option>
                    {staffList.map(s => (
                      <option key={s.id} value={s.id}>{s.userName} ({s.designation || 'Staff'})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Assignment Notes / Directives</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Please inspect the site and complete repair by Friday."
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                />
              </div>

              <button type="submit" disabled={assigning} className="btn btn-primary btn-sm">
                {assigning ? 'Assigning...' : 'Save & Assign Ticket'}
              </button>
            </form>
          </div>

          {/* Admin Action 2: Update Status State Transition */}
          <div className="card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={18} /> Update Complaint Status
            </h3>

            <form onSubmit={handleStatusUpdate} style={{ marginTop: '16px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Current Status: <StatusBadge status={complaint.status} /></label>
                  <select
                    className="form-control"
                    value={nextStatus}
                    onChange={(e) => setNextStatus(e.target.value)}
                  >
                    <option value="">-- Select Next Status --</option>
                    <option value="ASSIGNED">ASSIGNED (In Queue)</option>
                    <option value="IN_PROGRESS">IN_PROGRESS (Staff Working)</option>
                    <option value="RESOLVED">RESOLVED (Work Completed)</option>
                    <option value="CLOSED">CLOSED (Finalized)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status Update Remarks</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Reason or update details (e.g., Parts ordered, tech dispatched)"
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" disabled={updatingStatus} className="btn btn-primary btn-sm">
                {updatingStatus ? 'Updating...' : 'Update Ticket Status'}
              </button>
            </form>
          </div>

          {/* Discussion & Internal Notes */}
          <div className="card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} /> Ticket Discussion & Internal Notes
            </h3>

            <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {complaint.comments && complaint.comments.map(c => (
                <div key={c.id} style={{
                  backgroundColor: c.isInternal ? '#FFFBEB' : '#F8FAFC',
                  border: `1px solid ${c.isInternal ? '#FCD34D' : '#E2E8F0'}`,
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: c.isInternal ? '#92400E' : '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {c.isInternal && <Lock size={12} />} {c.authorName} ({c.authorRole})
                    </span>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#334155' }}>{c.message}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddInternalComment}>
              <div className="form-group">
                <textarea
                  required
                  className="form-control"
                  rows={2}
                  placeholder="Write an internal administrative note (visible to admins only)..."
                  value={internalComment}
                  onChange={(e) => setInternalComment(e.target.value)}
                />
              </div>
              <button type="submit" disabled={postingComment} className="btn btn-secondary btn-sm">
                <Send size={14} /> Add Internal Note
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Intelligent Recommendations & Feedback */}
        <div style={{ flex: 1 }}>
          
          {/* Intelligent Features Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 100%)', border: '1px solid #BFDBFE' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E3A8A', fontWeight: 700, fontSize: '15px', marginBottom: '12px' }}>
              <Sparkles size={18} /> Intelligent Suggestions
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', color: '#1E40AF', fontWeight: 600 }}>Recommended Priority:</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1E3A8A' }}>
                {complaint.recommendedPriority}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#1E40AF', fontWeight: 600 }}>Estimated Resolution Time:</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E3A8A' }}>
                {complaint.estimatedResolutionTime}
              </div>
            </div>
          </div>

          {/* Current Assignment Details */}
          <div className="card">
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>Current Handling Assignment</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748B' }}>Department: </span>
                <strong style={{ color: '#0F172A' }}>{complaint.departmentName || 'Not Assigned'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Staff Member: </span>
                <strong style={{ color: '#0F172A' }}>{complaint.staffName || 'Not Assigned'}</strong>
              </div>
              {complaint.assignedAt && (
                <div>
                  <span style={{ color: '#64748B' }}>Assigned Date: </span>
                  <span>{new Date(complaint.assignedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* User Feedback if Closed */}
          {complaint.feedback && (
            <div className="card" style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#065F46', marginBottom: '8px' }}>User Resolution Feedback</h4>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#D97706', marginBottom: '6px' }}>
                ⭐ {complaint.feedback.rating} / 5 Stars
              </div>
              <p style={{ fontSize: '13px', color: '#047857', fontStyle: 'italic' }}>"{complaint.feedback.comment}"</p>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
};

export default AdminComplaintDetailPage;
