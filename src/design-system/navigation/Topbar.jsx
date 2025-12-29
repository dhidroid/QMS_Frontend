import React from 'react';
import { Search } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white/60 backdrop-blur">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        <div className="hidden sm:flex items-center bg-slate-100 border rounded-md px-2 py-1 text-sm text-slate-500">
          <Search className="w-4 h-4 mr-2" />
          <input placeholder="Search" className="bg-transparent outline-none" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-sm px-3 py-1 rounded bg-slate-100">Create</button>
        <div className="text-sm text-slate-600">Admin</div>
      </div>
    </header>
  );
};

export default Topbar;
