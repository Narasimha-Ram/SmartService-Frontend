import React from 'react';

const KpiCard = ({ title, value, icon: Icon, color = '#2563EB', bgColor = '#EFF6FF' }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-icon" style={{ backgroundColor: bgColor, color }}>
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <div className="kpi-value">{value !== undefined && value !== null ? value : 0}</div>
        <div className="kpi-label">{title}</div>
      </div>
    </div>
  );
};

export default KpiCard;
