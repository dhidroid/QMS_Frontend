import React, { useState, useEffect, useCallback } from 'react';
import EnterpriseTable from '../../design-system/organisms/EnterpriseTable';
import { api } from '../../api/endpoints';
import Badge from '../../design-system/atoms/Badge';
import Button from '../../design-system/atoms/Button';
import { Search, Filter, Eye, EyeOff, Plus } from 'lucide-react';
import { 
  Dialog, DialogActions, DialogContent, DialogTitle, 
  TextField, MenuItem, Button as MuiButton 
} from '@mui/material';

const AdminTicketList = ({ onViewDetails }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Masking State
  const [revealedIds, setRevealedIds] = useState(new Set());

  // Create Token State
  const [createOpen, setCreateOpen] = useState(false);
  const [newData, setNewData] = useState({ fullName: '', mobile: '', purpose: '' });
  const [creating, setCreating] = useState(false);

  // Common Services/Purpose Options (could be fetched or props)
  const services = ["General Inquiry", "Billing", "Technical Support", "New Connection", "Complaint"];

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.admin.getTickets({
        page: paginationModel.page + 1, // API is 1-indexed
        pageSize: paginationModel.pageSize,
        search: search,
        status: statusFilter
      });
      if (res && res.tickets) {
        setTickets(res.tickets);
        setRowCount(res.totalCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    } finally {
      setLoading(false);
    }
  }, [paginationModel, search, statusFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const toggleReveal = (id) => {
    const newSet = new Set(revealedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setRevealedIds(newSet);
  };

  const handleCreateSubmit = async () => {
    if (!newData.fullName || !newData.purpose) return; // Simple validation
    setCreating(true);
    try {
      await api.token.create(newData);
      setCreateOpen(false);
      setNewData({ fullName: '', mobile: '', purpose: '' });
      fetchTickets(); // Refresh
    } catch (err) {
      console.error("Failed to create token", err);
    } finally {
      setCreating(false);
    }
  };

  const columns = [
    { field: 'TokenNumber', headerName: 'Token #', width: 120, renderCell: (params) => <span className="font-mono font-bold">{params.value}</span> },
    { field: 'FullName', headerName: 'Customer Name', flex: 1, minWidth: 200 },
    { 
      field: 'Mobile', 
      headerName: 'Mobile', 
      width: 180,
      renderCell: (params) => {
        const val = params.value || '';
        const isRevealed = revealedIds.has(params.row.TokenGuid);
        const masked = val.length > 4 ? `${'*'.repeat(val.length - 4)}${val.slice(-4)}` : val;
        
        return (
          <div className="flex items-center gap-2 group">
            <span className="font-mono text-sm">{isRevealed ? val : masked}</span>
            {val && (
              <button 
                onClick={(e) => { e.stopPropagation(); toggleReveal(params.row.TokenGuid); }}
                className="text-slate-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            )}
          </div>
        );
      }
    },
    { field: 'Purpose', headerName: 'Service', width: 180 },
    { 
      field: 'Status', 
      headerName: 'Status', 
      width: 140,
      renderCell: (params) => {
        const status = (params.value || 'pending').toLowerCase();
        const variant = status === 'served' || status === 'completed' ? 'success' : status === 'called' ? 'warning' : status === 'noshow' ? 'destructive' : 'neutral';
        return <Badge variant={variant} className="capitalize">{status}</Badge>;
      }
    },
    { 
      field: 'CounterName', 
      headerName: 'Counter', 
      width: 150,
      renderCell: (params) => params.value ? <Badge variant="outline">{params.value}</Badge> : <span className="text-slate-400">-</span>
    },
    { 
      field: 'CreatedDate', 
      headerName: 'Created At', 
      width: 180, 
      valueFormatter: (params) => new Date(params.value).toLocaleString() 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button size="sm" variant="ghost" onClick={() => onViewDetails(params.row)}>View</Button>
      )
    }
  ];

  return (
    <div className="space-y-4 h-full relative">
      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
                className="w-full pl-9 pr-4 h-10 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                placeholder="Search by Name, Mobile, or Token #..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        <div className="flex gap-2 w-full sm:w-auto items-center">
             <div className="relative">
                <select 
                    className="h-10 pl-3 pr-8 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="called">Called</option>
                    <option value="served">Served</option>
                    <option value="noshow">No Show</option>
                </select>
                <Filter className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
            <Button variant="outline" onClick={fetchTickets}>Refresh</Button>
            <Button onClick={() => setCreateOpen(true)} className="gap-2 pl-3">
              <Plus size={16} /> New Token
            </Button>
        </div>
      </div>

      <EnterpriseTable
        rows={tickets}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        getRowId={(row) => row.TokenGuid}
      />

      {/* Create Token Modal */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Create New Token</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <TextField 
            label="Customer Name" 
            fullWidth 
            value={newData.fullName} 
            onChange={(e) => setNewData({...newData, fullName: e.target.value})}
            autoFocus
          />
           <TextField 
            label="Mobile Number" 
            fullWidth 
            value={newData.mobile} 
            onChange={(e) => setNewData({...newData, mobile: e.target.value})}
          />
           <TextField 
            select
            label="Service Purpose" 
            fullWidth 
            value={newData.purpose} 
            onChange={(e) => setNewData({...newData, purpose: e.target.value})}
          >
            {services.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions className="p-4">
          <MuiButton onClick={() => setCreateOpen(false)}>Cancel</MuiButton>
          <MuiButton 
            variant="contained" 
            onClick={handleCreateSubmit} 
            disabled={!newData.fullName || !newData.purpose || creating}
          >
            {creating ? 'Creating...' : 'Create Token'}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminTicketList;
