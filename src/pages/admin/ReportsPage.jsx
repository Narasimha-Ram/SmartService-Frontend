import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { adminApi } from '../../api';
import toast from 'react-hot-toast';
import { FileSpreadsheet, Download, Filter } from 'lucide-react';

const ReportsPage = () => {
  const [format, setFormat] = useState('CSV');
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Fetch all complaints for report generation
      const res = await adminApi.getAllComplaints({ page: 0, size: 500 });
      const complaints = res.data.content || [];

      let content = '';
      let filename = `SmartServe_Complaints_Report_${new Date().toISOString().slice(0, 10)}.csv`;

      if (format === 'CSV') {
        const headers = ['Complaint #', 'Title', 'User', 'Category', 'Priority', 'Status', 'Location', 'Created At'];
        const rows = complaints.map(c => [
          `"${c.complaintNumber}"`,
          `"${c.title.replace(/"/g, '""')}"`,
          `"${c.userName}"`,
          `"${c.categoryName}"`,
          `"${c.priority}"`,
          `"${c.status}"`,
          `"${c.location}"`,
          `"${new Date(c.createdAt).toLocaleString()}"`
        ]);
        content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      } else {
        filename = `SmartServe_Report_${new Date().toISOString().slice(0, 10)}.json`;
        content = JSON.stringify(complaints, null, 2);
      }

      const blob = new Blob([content], { type: format === 'CSV' ? 'text/csv' : 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`Report downloaded as ${format}`);
    } catch (err) {
      toast.error('Failed to export report.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AppLayout title="Export Reports & Data Audit">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <FileSpreadsheet size={28} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Generate Operational Reports</h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
              Export complete complaint records, priority audits, and department metrics in standard data formats.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Export Format</label>
            <select className="form-control" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="CSV">Comma Separated Values (.CSV)</option>
              <option value="JSON">JavaScript Object Notation (.JSON)</option>
            </select>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '16px' }}
          >
            <Download size={18} /> {downloading ? 'Generating Report...' : `Export ${format} Report`}
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
