import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';
import { Tag, Plus, Trash2, Edit2 } from 'lucide-react';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      toast.error('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await adminApi.createCategory({ name, description });
      setCategories(prev => [...prev, res.data]);
      setName('');
      setDescription('');
      toast.success('Category created.');
    } catch (err) {
      toast.error(err.message || 'Failed to create category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this category?')) return;
    try {
      await adminApi.deleteCategory(id);
      fetchCategories();
      toast.success('Category deactivated.');
    } catch (err) {
      toast.error('Failed to delete category.');
    }
  };

  return (
    <AppLayout title="Category Management">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Category List */}
        <div style={{ flex: 2 }} className="card">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag size={18} /> Complaint Categories ({categories.length})
          </h3>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="table-container" style={{ marginTop: '16px' }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id}>
                      <td>#{cat.id}</td>
                      <td style={{ fontWeight: 600 }}>{cat.name}</td>
                      <td style={{ color: '#64748B' }}>{cat.description || 'N/A'}</td>
                      <td>
                        <span className={`badge ${cat.isActive ? 'badge-resolved' : 'badge-closed'}`}>
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleDelete(cat.id)} className="btn btn-danger btn-sm">
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

        {/* Add Category Form */}
        <div style={{ flex: 1 }} className="card">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Add New Category
          </h3>

          <form onSubmit={handleCreate} style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label className="form-label">Category Name *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g., Plumbing, IT Hardware"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Scope of issues covered by this category..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {submitting ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>

      </div>
    </AppLayout>
  );
};

export default CategoriesPage;
