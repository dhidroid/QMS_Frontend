import React, { useEffect, useState } from 'react';
import { api } from '../../api/endpoints';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { TrendingUp, Users, CheckCircle, Clock, XCircle } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-xl border shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
      {trend && <div className="text-xs text-green-600 mt-1 flex items-center gap-1">+ {trend} today</div>}
    </div>
    <div className={`p-3 rounded-lg ${color} text-white`}>
      <Icon size={20} />
    </div>
  </div>
);

const AnalyticsDashboard = ({ range = 'week' }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await api.analytics.get(range);
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [range]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading Analytics...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load data</div>;

  const { summary, trend, pieData } = data;

  const rangeTitle = {
      'today': 'Today (Hourly)',
      'week': 'Last 7 Days',
      'month': 'Last 30 Days'
  }[range] || 'Trend';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Tickets" 
          value={summary.total} 
          icon={TrendingUp} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Pending" 
          value={summary.pending} 
          icon={Clock} 
          color="bg-amber-500" 
        />
        <StatCard 
          title="Served" 
          value={summary.served} 
          icon={CheckCircle} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Cancelled" 
          value={summary.cancelled} 
          icon={XCircle} 
          color="bg-red-500" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold mb-6">Ticket Volume ({rangeTitle})</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey={range === 'today' ? "Label" : "Date"} // Use Label as fallback key from SP
                  axisLine={false}
                  tickLine={false}
                  tick={{fill: '#888', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{fill: '#888', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  cursor={{stroke: '#0ea5e9', strokeWidth: 2}}
                />
                <Area 
                  type="monotone" 
                  dataKey="Count" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
           <h3 className="font-semibold mb-6">Status Distribution</h3>
           <div className="h-[250px] w-full flex-1">
             <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="Count"
                        nameKey="Status"
                    >
                        {pieData && pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                </RePieChart>
             </ResponsiveContainer>
           </div>
           
           <div className="mt-4">
               <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex gap-3">
                     <TrendingUp className="text-blue-600 shrink-0" size={20} />
                     <div>
                        <p className="text-sm font-medium text-blue-900">Insight</p>
                        <p className="text-xs text-blue-700 mt-1">
                           Service efficiency is {summary.served > summary.pending ? 'optimal' : 'lagging'}. 
                           {summary.pending > 10 ? ' High load detected.' : ' Queue load is manageable.'}
                        </p>
                     </div>
                  </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
