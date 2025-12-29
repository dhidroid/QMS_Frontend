import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TokenAnalytics = ({ tokens = [] }) => {
  const data = useMemo(() => {
    const counts = tokens.reduce((acc, t) => {
      const s = (t.Status || 'unknown').toLowerCase();
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([key, value]) => ({ name: key, value }));
  }, [tokens]);

  return (
    <div style={{ background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <h4>Token Status Overview</h4>
      <div style={{ height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TokenAnalytics;
