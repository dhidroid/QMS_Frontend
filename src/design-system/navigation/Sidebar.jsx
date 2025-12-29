import React from 'react';
import { Home, FileText, Users, LayoutDashboard, Settings } from 'lucide-react';

const NavItem = ({ icon: Icon, label, active }) => (
  <button className={`flex items-center gap-3 px-4 py-2 rounded-md w-full text-sm ${active ? 'bg-slate-800 text-white shadow' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
    <Icon className="w-4 h-4" />
    <span className="hidden md:inline">{label}</span>
  </button>
);

const Sidebar = () => {
  return (
    <aside className="w-20 md:w-56 bg-slate-900 text-slate-200 flex flex-col shadow-lg">
      <div className="px-4 py-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">QM</div>
        <div className="hidden md:block font-semibold">QMS</div>
      </div>

      <nav className="mt-4 space-y-1 px-2">
        <NavItem icon={LayoutDashboard} label="Dashboard" active />
        <NavItem icon={FileText} label="Orders" />
        <NavItem icon={Home} label="Inventory" />
        <NavItem icon={Users} label="Users" />
        <NavItem icon={Settings} label="Settings" />
      </nav>

      <div className="mt-auto p-4 text-xs text-slate-400 hidden md:block">Signed in as Admin</div>
    </aside>
  );
};

export default Sidebar;
