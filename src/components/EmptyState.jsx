import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({ title = 'No records found', description = 'There are no items to display at this time.', action }) => (
  <div style={{ textAlign: 'center', padding: '48px 24px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
    <div style={{ width: '56px', height: '56px', background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#64748B' }}>
      <FolderOpen size={28} />
    </div>
    <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>{title}</h4>
    <p style={{ fontSize: '14px', color: '#64748B', marginBottom: action ? '20px' : 0 }}>{description}</p>
    {action}
  </div>
);

export default EmptyState;
