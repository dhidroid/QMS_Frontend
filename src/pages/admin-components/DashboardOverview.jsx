import React from 'react';
import StatCard from '../../design-system/molecules/StatCard';
import { Card, CardContent } from '../../design-system/atoms/Card';
import { ClipboardList, FileText, Users, Monitor, Smartphone, Settings } from 'lucide-react';
import clsx from 'clsx';

const MenuCard = ({ icon: Icon, title, desc, onClick, colorClass }) => (
  <Card 
    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group border-border/60"
    onClick={onClick}
  >
    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
      <div className={clsx("p-4 rounded-full bg-opacity-10 transition-transform group-hover:scale-110", colorClass)}>
        <Icon size={32} className={clsx("opacity-100", colorClass.replace('bg-', 'text-'))} />
      </div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      </div>
    </CardContent>
  </Card>
);

const DashboardOverview = ({ stats, setView, onCallNext, query, setQuery }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Tokens" 
          value={stats.total} 
          subValue="Today's volume" 
          trend="neutral"
          trendValue="+0%"
        />
        <StatCard 
          label="Pending Queue" 
          value={stats.pending} 
          subValue="Waiting for service"
          trend={stats.pending > 10 ? 'down' : 'neutral'} 
          trendValue={stats.pending > 10 ? 'Busy' : 'Normal'}
        />
        <StatCard 
          label="Called / In-Service" 
          value={stats.called} 
          subValue="Currently serving"
          trend="up"
          trendValue="Active"
        />
        <StatCard 
          label="Completed" 
          value={stats.served} 
          subValue="Successfully served"
          trend="up"
          trendValue="Great job"
        />
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <MenuCard 
             icon={ClipboardList} 
             title="Live Queue" 
             desc="Monitor and call active tokens" 
             onClick={() => setView('tokens')}
             colorClass="bg-blue-500 text-blue-600"
           />
           <MenuCard 
             icon={FileText} 
             title="Form Builder" 
             desc="Create & edit booking forms" 
             onClick={() => setView('forms')}
             colorClass="bg-purple-500 text-purple-600"
           />
           <MenuCard 
             icon={Users} 
             title="User Manager" 
             desc="Manage system admins & handlers" 
             onClick={() => setView('users')}
             colorClass="bg-green-500 text-green-600"
           />
           <MenuCard 
             icon={Monitor} 
             title="Display Screen" 
             desc="Launch public display" 
             onClick={() => window.open('/display', '_blank')}
             colorClass="bg-amber-500 text-amber-600"
           />
           <MenuCard 
             icon={Smartphone} 
             title="Booking Page" 
             desc="Open public booking interface" 
             onClick={() => window.open('/book', '_blank')}
             colorClass="bg-rose-500 text-rose-600"
           />
           <MenuCard 
             icon={Settings} 
             title="Settings" 
             desc="Configure counters & subs" 
             onClick={() => setView('settings')}
             colorClass="bg-slate-500 text-slate-600"
           />
           <MenuCard 
             icon={Monitor} 
             title="Counter POS" 
             desc="Open handler terminal" 
             onClick={() => window.open('/admin/terminal', '_blank')}
             colorClass="bg-teal-500 text-teal-600"
           />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
