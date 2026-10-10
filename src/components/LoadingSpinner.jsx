import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid #E2E8F0',
      borderTop: '3px solid #2563EB',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <p style={{ marginTop: '16px', color: '#64748B', fontSize: '14px', fontWeight: 500 }}>{message}</p>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

export default LoadingSpinner;
