import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';
import { ShieldCheck, Building, User } from 'lucide-react';

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getStaff();
      setStaff(res.data || []);
    } catch (err) {
      toast.error('Failed to load staff roster.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Staff Personnel Roster">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} /> Service Staff Members ({staff.length})
          </h3>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id}>
                    <td>#{s.id}</td>
                    <td style={{ fontWeight: 600 }}>{s.userName}</td>
                    <td>{s.userEmail}</td>
                    <td>{s.departmentName}</td>
                    <td>{s.designation || 'Service Technician'}</td>
                    <td>
                      <span className={`badge ${s.isActive ? 'badge-resolved' : 'badge-closed'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
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

export default StaffPage;
