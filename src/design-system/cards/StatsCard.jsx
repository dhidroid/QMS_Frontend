import React from 'react';

const StatsCard = ({ title, value, trend }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="mt-1 flex items-center justify-between">
        <div className="text-2xl font-semibold tabular-nums">{value}</div>
        {trend && (
          <div className={`text-sm px-2 py-1 rounded ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend > 0 ? `+${trend}%` : `${trend}%`}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
