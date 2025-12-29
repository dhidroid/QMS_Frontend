import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card } from '../atoms/Card';

const EnterpriseTable = ({
  rows,
  columns,
  loading,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  rowSelectionModel,
  onRowSelectionModelChange,
  onSortModelChange,
  checkboxSelection = true,
  getRowId
}) => {
  return (
    <Card className="h-[650px] w-full p-0 overflow-hidden border-gray-200 shadow-sm bg-white">
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[10, 25, 50, 100]}
        paginationMode="server"
        sortingMode="server"
        onSortModelChange={onSortModelChange}
        checkboxSelection={checkboxSelection}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={onRowSelectionModelChange}
        disableRowSelectionOnClick
        getRowId={getRowId || ((row) => row.id || row.TokenGuid || row.TokenId)}
        sx={{
            border: 0,
            fontFamily: 'Inter, sans-serif',
            '& .MuiDataGrid-cell:focus': {
                outline: 'none',
            },
            '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.025em'
            },
            '& .MuiDataGrid-virtualScroller': {
                backgroundColor: '#ffffff',
            },
            '& .MuiDataGrid-row': {
                borderBottom: '1px solid #f1f5f9',
            },
            '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f8fafc',
            },
            '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
            }
        }}
      />
    </Card>
  );
};

export default EnterpriseTable;
