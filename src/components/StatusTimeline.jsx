import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const steps = [
  { key: 'PENDING', label: 'Submitted' },
  { key: 'ASSIGNED', label: 'Assigned' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'RESOLVED', label: 'Resolved' },
  { key: 'CLOSED', label: 'Closed' }
];

const statusOrder = {
  'PENDING': 1,
  'ASSIGNED': 2,
  'IN_PROGRESS': 3,
  'RESOLVED': 4,
  'CLOSED': 5
};

const StatusTimeline = ({ currentStatus }) => {
  const currentLevel = statusOrder[currentStatus] || 1;

  return (
    <div className="timeline">
      {steps.map((step, idx) => {
        const stepLevel = idx + 1;
        const isCompleted = stepLevel < currentLevel || currentStatus === 'CLOSED';
        const isActive = stepLevel === currentLevel && currentStatus !== 'CLOSED';

        return (
          <div
            key={step.key}
            className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
          >
            <div className="timeline-node">
              {isCompleted ? <CheckCircle2 size={20} /> : isActive ? <Clock size={20} /> : stepLevel}
            </div>
            <span className="timeline-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
