import React from 'react';
import Sidebar from '../navigation/Sidebar';
import Topbar from '../navigation/Topbar';

const AdminLayout = ({ children, rightPanel }) => {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 lg:p-8 h-full overflow-auto">
          {children}
        </main>
      </div>
      {/* rightPanel area reserved for drawers */}
      <div className="w-0 lg:w-96 hidden lg:block" aria-hidden>
        {rightPanel}
      </div>
    </div>
  );
};

export default AdminLayout;
