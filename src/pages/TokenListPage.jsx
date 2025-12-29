import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { SaveAlt as SaveAltIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { api } from '../api/endpoints';
import TokenAnalytics from '../components/TokenAnalytics';

const TokenListPage = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTokens = async () => {
    try {
      const res = await api.admin.getTokens();
      if (res && res.tokens) setTokens(res.tokens);
    } catch (err) {
      console.error('Failed to load tokens', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const exportExcel = () => {
    if (!tokens || tokens.length === 0) return;
    const data = tokens.map(t => ({
      TokenGuid: t.TokenGuid,
      TokenNumber: t.TokenNumber,
      FullName: t.FullName,
      Purpose: t.Purpose,
      CounterName: t.CounterName,
      Status: t.Status,
      CreatedAt: t.CreatedAt,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tokens');
    XLSX.writeFile(wb, `tokens_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'_')}.xlsx`);
  };

  const columns = [
    { field: 'TokenNumber', headerName: '#', width: 90 },
    { field: 'FullName', headerName: 'Name', width: 200 },
    { field: 'Purpose', headerName: 'Purpose', width: 240 },
    { field: 'CounterName', headerName: 'Counter', width: 150 },
    { field: 'Status', headerName: 'Status', width: 120 },
    { field: 'CreatedAt', headerName: 'Created', width: 180 },
  ];

  const rows = tokens.map((t, idx) => ({
    id: t.TokenGuid || idx,
    TokenNumber: t.TokenNumber,
    FullName: t.FullName,
    Purpose: t.Purpose,
    CounterName: t.CounterName || '-',
    Status: t.Status || '-',
    CreatedAt: t.CreatedAt ? new Date(t.CreatedAt).toLocaleString() : '-',
  }));

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3>Complete Token Listing</h3>
        <div>
          <Button variant="contained" color="primary" startIcon={<SaveAltIcon />} onClick={exportExcel} style={{ marginRight: 8 }}>Export Excel</Button>
          <Button variant="outlined" onClick={fetchTokens}>Refresh</Button>
        </div>
      </div>

      <div style={{ height: 520, width: '100%' }}>
        <DataGrid
          columns={columns}
          rows={rows}
          loading={loading}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 25, page: 0 } } }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <TokenAnalytics tokens={tokens} />
      </div>
    </div>
  );
};

export default TokenListPage;
