import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { categoryApi, complaintApi } from '../../api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Sparkles, AlertTriangle, Upload, Send } from 'lucide-react';

const CreateComplaintPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    location: '',
    priority: 'MEDIUM'
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Intelligent feature states
  const [suggestedPriority, setSuggestedPriority] = useState(null);
  const [duplicates, setDuplicates] = useState([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    categoryApi.getActive()
      .then(res => setCategories(res.data || []))
      .catch(err => console.error(err));
  }, []);

  // Priority Recommendation & Duplicate Checking on input change
  const handleDescriptionChange = (val) => {
    setFormData(prev => ({ ...prev, description: val }));

    // Simple priority recommendation heuristic
    const lower = val.toLowerCase();
    const criticalWords = ['fire', 'flood', 'unsafe', 'dangerous', 'emergency', 'electric shock', 'gas leak'];
    const highWords = ['broken', 'not working', 'leak', 'outage', 'down', 'failure'];

    if (criticalWords.some(w => lower.includes(w))) {
      setSuggestedPriority('CRITICAL');
      setFormData(prev => ({ ...prev, priority: 'CRITICAL' }));
    } else if (highWords.some(w => lower.includes(w))) {
      setSuggestedPriority('HIGH');
      setFormData(prev => ({ ...prev, priority: 'HIGH' }));
    } else {
      setSuggestedPriority('MEDIUM');
    }
  };

  const handleCheckDuplicates = async () => {
    if (!formData.title || !formData.categoryId) {
      toast.error('Please fill in title and category before checking for duplicates.');
      return;
    }
    setCheckingDuplicates(true);
    try {
      const res = await complaintApi.checkDuplicates({
        title: formData.title,
        description: formData.description,
        categoryId: parseInt(formData.categoryId),
        location: formData.location
      });
      setDuplicates(res.data || []);
      if (res.data && res.data.length > 0) {
        toast.custom((t) => (
          <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: '12px 16px', borderRadius: '8px', color: '#92400E' }}>
            ⚠️ <strong>Potential duplicate found!</strong> Check similar complaints below before submitting.
          </div>
        ));
      } else {
        toast.success('No duplicate complaints found nearby.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingDuplicates(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error('Please select a category.');
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      const complaintJson = JSON.stringify({
        title: formData.title,
        description: formData.description,
        categoryId: parseInt(formData.categoryId),
        location: formData.location,
        priority: formData.priority
      });

      payload.append('complaint', new Blob([complaintJson], { type: 'application/json' }));
      if (file) {
        payload.append('file', file);
      }

      const res = await complaintApi.create(payload);
      toast.success('Complaint submitted successfully!');
      navigate(`/complaints/${res.data.id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Submit Service Request">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Intelligent Recommendation Banner */}
        {suggestedPriority && (
          <div className="ai-suggestion">
            <Sparkles className="ai-icon" size={20} />
            <div>
              <div className="ai-title">Smart Priority Suggestion: {suggestedPriority}</div>
              <div className="ai-desc">
                Based on your complaint description keywords, SmartServe auto-recommended <strong>{suggestedPriority}</strong> priority.
              </div>
            </div>
          </div>
        )}

        {/* Duplicates Warning if found */}
        {duplicates.length > 0 && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '10px', padding: '16px 20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B', fontWeight: 600, marginBottom: '8px' }}>
              <AlertTriangle size={18} /> Potential Similar Complaints Found ({duplicates.length})
            </div>
            <p style={{ fontSize: '13px', color: '#7F1D1D', marginBottom: '12px' }}>
              Another user may have already reported this issue. Please check if your issue is listed below to avoid duplicate reports:
            </p>
            {duplicates.map(d => (
              <div key={d.id} style={{ background: 'white', padding: '8px 12px', borderRadius: '6px', border: '1px solid #FECACA', marginBottom: '6px', fontSize: '13px' }}>
                <strong>{d.complaintNumber}</strong>: {d.title} ({d.status}) - {d.location}
              </div>
            ))}
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Complaint Details</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title / Subject *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Brief summary of the issue (e.g., Water leakage in Restroom 2B)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  required
                  className="form-control"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Room Number *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g., Block B, 3rd Floor, Room 304"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Priority Level</label>
                <select
                  className="form-control"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="LOW">LOW - Minor / Aesthetic</option>
                  <option value="MEDIUM">MEDIUM - Standard issue</option>
                  <option value="HIGH">HIGH - Urgent / Operational Impact</option>
                  <option value="CRITICAL">CRITICAL - Safety / Emergency</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description *</label>
              <textarea
                required
                className="form-control"
                rows={5}
                placeholder="Provide specific details about the issue, when it started, and any relevant context..."
                value={formData.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Attachment (Photo / PDF - Optional)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label htmlFor="file-upload" className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                  <Upload size={16} /> Choose File
                </label>
                <span style={{ fontSize: '13px', color: '#64748B' }}>
                  {file ? file.name : 'No file selected (Max 10MB)'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCheckDuplicates}
                disabled={checkingDuplicates}
              >
                {checkingDuplicates ? 'Checking...' : '🔍 Check Duplicate Complaints'}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '10px 24px' }}
              >
                <Send size={16} /> {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateComplaintPage;
