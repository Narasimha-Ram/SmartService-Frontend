import React from 'react';

const StatusBadge = ({ status }) => {
  const formatStatus = (st) => {
    if (!st) return 'Pending';
    return st.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  const statusKey = (status || 'PENDING').toLowerCase();

  return (
    <span className={`badge badge-${statusKey}`}>
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;
