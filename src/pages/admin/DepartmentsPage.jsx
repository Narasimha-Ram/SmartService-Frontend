import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';
import { Building, Plus, Trash2 } from 'lucide-react';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [headName, setHeadName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getDepartments();
      setDepartments(res.data || []);
    } catch (err) {
      toast.error('Failed to load departments.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await adminApi.createDepartment({ name, description, headName });
      setDepartments(prev => [...prev, res.data]);
      setName('');
      setDescription('');
      setHeadName('');
      toast.success('Department created.');
    } catch (err) {
      toast.error(err.message || 'Failed to create department.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this department?')) return;
    try {
      await adminApi.deleteDepartment(id);
      fetchDepartments();
      toast.success('Department deactivated.');
    } catch (err) {
      toast.error('Failed to delete department.');
    }
  };

  return (
    <AppLayout title="Department Management">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Department List */}
        <div style={{ flex: 2 }} className="card">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={18} /> Service Departments ({departments.length})
          </h3>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="table-container" style={{ marginTop: '16px' }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Department</th>
                    <th>Department Head</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map(dept => (
                    <tr key={dept.id}>
                      <td>#{dept.id}</td>
                      <td style={{ fontWeight: 600 }}>{dept.name}</td>
                      <td>{dept.headName || 'N/A'}</td>
                      <td>
                        <span className={`badge ${dept.isActive ? 'badge-resolved' : 'badge-closed'}`}>
                          {dept.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleDelete(dept.id)} className="btn btn-danger btn-sm">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Department Form */}
        <div style={{ flex: 1 }} className="card">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Add New Department
          </h3>

          <form onSubmit={handleCreate} style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label className="form-label">Department Name *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g., Electrical & Power Operations"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department Head Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Robert Vance"
                value={headName}
                onChange={(e) => setHeadName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Responsibilities of this department..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {submitting ? 'Creating...' : 'Create Department'}
            </button>
          </form>
        </div>

      </div>
    </AppLayout>
  );
};

export default DepartmentsPage;
