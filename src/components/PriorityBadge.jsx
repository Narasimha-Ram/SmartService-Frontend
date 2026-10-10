import React from 'react';

const PriorityBadge = ({ priority }) => {
  const priorityKey = (priority || 'MEDIUM').toLowerCase();

  return (
    <span className={`badge badge-${priorityKey}`}>
      {priority || 'MEDIUM'}
    </span>
  );
};

export default PriorityBadge;
