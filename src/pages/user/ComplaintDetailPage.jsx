import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import StatusTimeline from '../../components/StatusTimeline';
import LoadingSpinner from '../../components/LoadingSpinner';
import { complaintApi } from '../../api';
import toast from 'react-hot-toast';
import { ArrowLeft, Clock, MessageSquare, Star, Paperclip, Send, AlertCircle, Building, User } from 'lucide-react';

const ComplaintDetailPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Feedback form state
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    setLoading(true);
    try {
      const res = await complaintApi.getById(id);
      setComplaint(res.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await complaintApi.addComment(id, { message: commentText, isInternal: false });
      setComplaint(res.data);
      setCommentText('');
      toast.success('Comment posted.');
    } catch (err) {
      toast.error(err.message || 'Failed to add comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const res = await complaintApi.submitFeedback(id, { rating, comment: feedbackComment });
      setComplaint(res.data);
      toast.success('Thank you! Feedback submitted and complaint closed.');
    } catch (err) {
      toast.error(err.message || 'Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) return <AppLayout title="Complaint Details"><LoadingSpinner /></AppLayout>;
  if (!complaint) return <AppLayout title="Complaint Details"><div>Complaint not found.</div></AppLayout>;

  return (
    <AppLayout title={`Service Request #${complaint.complaintNumber}`}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/my-complaints" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, color: '#64748B' }}>
          <ArrowLeft size={16} /> Back to My Complaints
        </Link>
      </div>

      {/* Visual Status Progress Bar */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="card-title">Status Resolution Pipeline</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>
        <StatusTimeline currentStatus={complaint.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Complaint Details & Comments */}
        <div style={{ flex: 2 }}>
          
          {/* Main Info Card */}
          <div className="card">
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
              {complaint.title}
            </h2>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748B', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span><strong>Category:</strong> {complaint.categoryName}</span>
              <span>•</span>
              <span><strong>Location:</strong> {complaint.location}</span>
              <span>•</span>
              <span><strong>Submitted:</strong> {new Date(complaint.createdAt).toLocaleString()}</span>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>Description</h4>
              <p style={{ fontSize: '14px', color: '#0F172A', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{complaint.description}</p>
            </div>

            {/* Attachments Section */}
            {complaint.attachments && complaint.attachments.length > 0 && (
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Attachments</h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {complaint.attachments.map(att => (
                    <a
                      key={att.id}
                      href={att.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <Paperclip size={14} /> {att.fileName} ({Math.round(att.fileSize / 1024)} KB)
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Feedback Section if RESOLVED */}
          {complaint.status === 'RESOLVED' && !complaint.feedback && (
            <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065F46', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
                <CheckCircle2 size={20} /> Complaint Resolved! Please Provide Feedback
              </div>
              <p style={{ fontSize: '14px', color: '#047857', marginBottom: '16px' }}>
                Your service request has been marked as resolved by staff. Please rate your resolution experience to close this ticket.
              </p>

              <form onSubmit={handleSubmitFeedback}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#065F46' }}>Rating (1 - 5 Stars)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: star <= rating ? '#F59E0B' : '#D1D5DB'
                        }}
                      >
                        <Star size={28} fill={star <= rating ? '#F59E0B' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#065F46' }}>Resolution Comment / Remarks</label>
                  <textarea
                    required
                    className="form-control"
                    rows={3}
                    placeholder="Share feedback on resolution speed, staff behavior, or quality..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                  />
                </div>

                <button type="submit" disabled={submittingFeedback} className="btn btn-primary">
                  {submittingFeedback ? 'Submitting...' : 'Submit Feedback & Close Complaint'}
                </button>
              </form>
            </div>
          )}

          {/* Submitted Feedback display if closed */}
          {complaint.feedback && (
            <div className="card" style={{ backgroundColor: '#F8FAFC' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>Your Feedback & Rating</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', marginBottom: '8px' }}>
                {[...Array(complaint.feedback.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="#F59E0B" />
                ))}
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginLeft: '6px' }}>
                  {complaint.feedback.rating} / 5 Stars
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#475569', fontStyle: 'italic' }}>"{complaint.feedback.comment}"</p>
            </div>
          )}

          {/* Activity Comments */}
          <div className="card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} /> Discussion & Comments ({complaint.comments?.length || 0})
            </h3>

            <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {complaint.comments && complaint.comments.length === 0 ? (
                <div style={{ fontSize: '14px', color: '#94A3B8', textAlign: 'center', padding: '16px 0' }}>No comments posted yet.</div>
              ) : (
                complaint.comments.map(comment => (
                  <div key={comment.id} style={{
                    backgroundColor: comment.isInternal ? '#FFFBEB' : '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '12px 16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                        {comment.authorName} <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>({comment.authorRole})</span>
                      </span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#334155' }}>{comment.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            {complaint.status !== 'CLOSED' && (
              <form onSubmit={handleAddComment}>
                <div className="form-group">
                  <textarea
                    required
                    className="form-control"
                    rows={2}
                    placeholder="Add a follow-up comment or question..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                <button type="submit" disabled={submittingComment} className="btn btn-secondary btn-sm">
                  <Send size={14} /> Post Comment
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Intelligent Estimations & Assignment Info */}
        <div style={{ flex: 1 }}>
          
          {/* Estimated Resolution Time */}
          {complaint.estimatedResolutionTime && (
            <div className="card" style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1E40AF', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
                <Clock size={18} /> Estimated Resolution Time
              </div>
              <p style={{ fontSize: '14px', color: '#1E3A8A', fontWeight: 700 }}>
                {complaint.estimatedResolutionTime}
              </p>
            </div>
          )}

          {/* Department & Staff Assignment Card */}
          <div className="card">
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>Assignment & Handling</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building size={16} style={{ color: '#64748B' }} />
                <div>
                  <div style={{ color: '#64748B' }}>Department</div>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>{complaint.departmentName || 'Pending Department Assignment'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={16} style={{ color: '#64748B' }} />
                <div>
                  <div style={{ color: '#64748B' }}>Assigned Staff</div>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>{complaint.staffName || 'Unassigned'}</div>
                </div>
              </div>

              {complaint.assignmentNotes && (
                <div style={{ marginTop: '8px', padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '6px', fontSize: '12px', color: '#475569' }}>
                  <strong>Assignment Notes:</strong> {complaint.assignmentNotes}
                </div>
              )}
            </div>
          </div>

          {/* Audit Status Change History */}
          <div className="card">
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>Audit History</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {complaint.statusHistory && complaint.statusHistory.map((hist, idx) => (
                <div key={idx} style={{ fontSize: '12px', borderLeft: '2px solid #2563EB', paddingLeft: '10px' }}>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>
                    {hist.oldStatus ? `${hist.oldStatus} ➔ ${hist.newStatus}` : `Created as ${hist.newStatus}`}
                  </div>
                  <div style={{ color: '#64748B' }}>By: {hist.changedByName}</div>
                  <div style={{ color: '#94A3B8' }}>{new Date(hist.changedAt).toLocaleString()}</div>
                  {hist.notes && <div style={{ color: '#475569', fontStyle: 'italic' }}>"{hist.notes}"</div>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default ComplaintDetailPage;
