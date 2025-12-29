import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../api/endpoints';
import DashboardShell from '../design-system/layout/DashboardShell';
import DetailDrawer from '../design-system/organisms/DetailDrawer';
import Toast from '../components/Toast';
import Button from '../design-system/atoms/Button';
import Badge from '../design-system/atoms/Badge';
import { jsPDF } from "jspdf";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Download, Printer } from 'lucide-react';

// Sub-components
import DashboardOverview from './admin-components/DashboardOverview';
import TokenQueueTable from './admin-components/TokenQueueTable';
import UserManagementTable from './admin-components/UserManagementTable';
import FormListTable from './admin-components/FormListTable';
import AdminTicketList from './admin-components/AdminTicketList';
import AnalyticsDashboard from './admin-components/AnalyticsDashboard';
import ProfilePage from './ProfilePage';

const AdminDashboard = () => {
  // --- State Management ---
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard'); // dashboard | tokens | settings | users | forms | tokensFull
  const [counterName, setCounterName] = useState(localStorage.getItem('qms_counter') || 'Counter 1');
  const [selectedToken, setSelectedToken] = useState(null); // For Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Settings / Admin Data
  const [pushSubs, setPushSubs] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'handler', displayName: '' });
  const [users, setUsers] = useState([]);
  const [forms, setForms] = useState([]);

  // UI State
  const [toast, setToast] = useState(null);

  // --- Actions ---
  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchTokens = async () => {
    try {
      const res = await api.admin.getTokens();
      if (res.tokens) setTokens(res.tokens);
    } catch (err) {
      console.error('Failed to fetch tokens', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.admin.getUsers();
      if (res && res.users) {
        setUsers(res.users);
      }
    } catch (e) {
      console.error('Failed to fetch users', e);
    }
  };

  const fetchForms = async () => {
    try {
      const res = await api.forms.list();
      if (res.success && res.forms) setForms(res.forms);
    } catch (err) {
      console.error("Failed to fetch forms");
    }
  };

  const fetchPushSubs = async () => {
    try {
      const res = await api.admin.getPushSubs();
      if (res && res.subs) setPushSubs(res.subs);
    } catch (err) {
      console.error('Failed to load push subscriptions', err);
    }
  };

  // --- Effects ---
  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('qms_counter', counterName);
  }, [counterName]);

  useEffect(() => {
    if (view === 'users') fetchUsers();
    if (view === 'forms') fetchForms();
    if (view === 'settings') fetchPushSubs();
  }, [view]);

  // --- Handlers ---
  const handleStatusUpdate = async (tokenGuid, status, rowCounterName) => {
    try {
      // Use passed counter name if available (from row action), otherwise default to current dashboard counter
      const finalCounter = rowCounterName || counterName;
      await api.admin.updateStatus({ tokenGuid, status, counterName: finalCounter });
      fetchTokens();
      if (selectedToken && selectedToken.TokenGuid === tokenGuid) {
        // Update selected token in drawer without closing if possible
        setSelectedToken(prev => ({ ...prev, Status: status }));
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleCallNext = async () => {
    try {
      const res = await api.admin.callNext({ counterName });
      if (res.success) {
        fetchTokens();
        showToast(`Called token ${res.tokenNumber} → ${counterName}`, 'success');
      } else {
        showToast(res.message || 'No pending tokens', 'error');
      }
    } catch (err) {
      showToast('Error calling next token', 'error');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.admin.createUser(newUser);
      if (res && res.success) {
        showToast('User created', 'success');
        setNewUser({ username: '', password: '', role: 'handler', displayName: '' });
        fetchUsers();
      }
    } catch (err) {
      showToast('Failed to create user', 'error');
    }
  };

  const handleDeleteForm = async (formId) => {
    try {
      await api.forms.delete(formId);
      showToast('Form deleted', 'success');
      fetchForms();
    } catch (e) {
      showToast('Failed to delete form', 'error');
    }
  };

  const handleExportCSV = () => {
    if (!tokens.length) return showToast('No data to export', 'error');

    // Create CSV header & rows
    const headers = ['Token #', 'Name', 'Phone', 'Service', 'Counter', 'Status', 'Date', 'Time'];
    const rows = tokens.map(t => [
      t.TokenNumber,
      `"${t.FullName}"`,
      t.Mobile,
      `"${t.Purpose}"`,
      t.CounterName || '',
      t.Status,
      new Date(t.CreatedDate).toLocaleDateString(),
      new Date(t.CreatedDate).toLocaleTimeString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `qms_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGeneratePDF = () => {
    if (!selectedToken) return;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 160]
    });

    const centerX = 40;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Token #${selectedToken.TokenNumber}`, centerX, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleDateString(), centerX, 28, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(10, 35, 70, 35);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(selectedToken.FullName || "Guest", centerX, 45, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(selectedToken.Purpose || "General Service", centerX, 52, { align: "center" });
    doc.text(`Mobile: ${selectedToken.Mobile || '-'}`, centerX, 58, { align: "center" });

    doc.text("--------------------------------", centerX, 70, { align: "center" });
    doc.text("Thank you for visiting!", centerX, 80, { align: "center" });

    doc.save(`Token_${selectedToken.TokenNumber}.pdf`);
  };

  // --- Computed ---
  const stats = useMemo(() => {
    const total = tokens.length;
    const pending = tokens.filter(t => (t.Status || '').toLowerCase() === 'pending').length;
    const called = tokens.filter(t => (t.Status || '').toLowerCase() === 'called').length;
    const served = tokens.filter(t => ['served', 'completed'].includes((t.Status || '').toLowerCase())).length;
    return { total, pending, called, served };
  }, [tokens]);

  const viewTitle = {
    dashboard: 'Dashboard Overview',
    tokens: 'Live Token Queue',
    tokensFull: 'All Tokens History',
    analytics: 'Analytics & Insights',
    'token-today': "Today's Token Analytics",
    'token-week': "Weekly Token Report",
    'token-month': "Monthly Token Overview",
    users: 'User Management',
    forms: 'Booking Forms',
    settings: 'System Settings',
    profile: 'My Profile',
  }[view] || 'Admin Dashboard';

  // --- Render ---
  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardOverview stats={stats} setView={setView} onCallNext={handleCallNext} query={query} setQuery={setQuery} />;
      case 'tokens':
        return <TokenQueueTable
          tokens={tokens}
          query={query}
          setQuery={setQuery}
          onStatusUpdate={handleStatusUpdate}
          onViewDetails={(token) => { setSelectedToken(token); setDrawerOpen(true); }}
          counterName={counterName}
          onExport={handleExportCSV}
        />;
      case 'tokensFull':
        return <AdminTicketList onViewDetails={(token) => { setSelectedToken(token); setDrawerOpen(true); }} />;
      case 'users':
        return <UserManagementTable users={users} />;
      case 'analytics':
      case 'token-today':
        return <AnalyticsDashboard range="today" />;
      case 'token-week':
        return <AnalyticsDashboard range="week" />;
      case 'token-month':
        return <AnalyticsDashboard range="month" />;
      case 'forms':
        return <FormListTable forms={forms} onDelete={handleDeleteForm} onToast={showToast} />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return (
          <div className="grid gap-6 max-w-2xl">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-semibold mb-4">Create New User</h3>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input className="border p-2 rounded" placeholder="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
                  <input className="border p-2 rounded" placeholder="Display Name" value={newUser.displayName} onChange={e => setNewUser({ ...newUser, displayName: e.target.value })} />
                  <input className="border p-2 rounded" placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                  <select className="border p-2 rounded" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                    <option value="handler">Handler</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <Button type="submit">Create User</Button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-semibold mb-4">Push Subscriptions</h3>
              <div className="text-sm text-muted-foreground">
                {pushSubs.length} active subscriptions
              </div>
              <Button variant="outline" size="sm" onClick={fetchPushSubs} className="mt-2">Refresh List</Button>
            </div>
          </div>
        );
      default:
        return <div>Unknown View</div>;
    }
  };

  return (
    <DashboardShell
      title={viewTitle}
      activeView={view}
      onViewChange={setView}
      actions={
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground hidden md:block">Counter:</span>
          <select
            value={counterName}
            onChange={(e) => setCounterName(e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="Counter 1">Counter 1</option>
            <option value="Counter 2">Counter 2</option>
            <option value="Counter 3">Counter 3</option>
            <option value="Reception">Reception</option>
          </select>
          <Button onClick={handleCallNext}>Call Next</Button>
        </div>
      }
    >
      {renderContent()}

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedToken ? `Token #${selectedToken.TokenNumber}` : 'Details'}
        actions={
          selectedToken && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer size={16} className="mr-2" /> Print
              </Button>
              <Button size="sm" onClick={handleGeneratePDF}>
                <Download size={16} className="mr-2" /> Download PDF
              </Button>
            </div>
          )
        }
      >
        {selectedToken ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge className="mt-1 capitalize" variant={selectedToken.Status === 'served' ? 'success' : 'neutral'}>
                  {selectedToken.Status}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Counter</div>
                <div className="font-medium">{selectedToken.CounterName || '-'}</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Customer Info</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <div className="font-medium">{selectedToken.FullName}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Service:</span>
                  <div className="font-medium">{selectedToken.Purpose}</div>
                </div>
              </div>
            </div>

            {selectedToken.Extra && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Additional Data</h4>
                <TableContainer component={Paper} elevation={0} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Field</strong></TableCell>
                        <TableCell><strong>Value</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(() => {
                        try {
                          const extra = JSON.parse(selectedToken.Extra);
                          return Object.entries(extra).map(([key, value]) => (
                            <TableRow key={key}>
                              <TableCell component="th" scope="row" className="text-muted-foreground">
                                {key}
                              </TableCell>
                              <TableCell>{value && typeof value === 'object' ? JSON.stringify(value) : String(value)}</TableCell>
                            </TableRow>
                          ));
                        } catch (e) {
                          return (
                            <TableRow>
                              <TableCell colSpan={2} className="text-red-500">Invalid Data Format</TableCell>
                            </TableRow>
                          );
                        }
                      })()}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}

            <div className="pt-4 flex gap-2">
              <Button className="w-full" onClick={() => handleStatusUpdate(selectedToken.TokenGuid, 'served')}>Mark Served</Button>
              <Button className="w-full" variant="destructive" onClick={() => handleStatusUpdate(selectedToken.TokenGuid, 'noshow')}>No Show</Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground pt-10">Select a token to view details</div>
        )}
      </DetailDrawer>

      {/* Global Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </DashboardShell>
  );
};

export default AdminDashboard;
