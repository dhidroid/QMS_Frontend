import React from 'react';
import DataTable from '../../design-system/molecules/DataTable';
import Badge from '../../design-system/atoms/Badge';
import Button from '../../design-system/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../design-system/atoms/Card';
import { Search } from 'lucide-react';

const TokenQueueTable = ({ tokens, query, setQuery, onStatusUpdate, onViewDetails, counterName, onExport }) => {
  const filteredTokens = React.useMemo(() => {
    if (!query) return tokens;
    const q = query.toLowerCase();
    return tokens.filter(t => 
      (t.FullName || '').toLowerCase().includes(q) || 
      String(t.TokenNumber).includes(q)
    );
  }, [tokens, query]);

  const columns = [
    { key: 'TokenNumber', label: '#', width: '80px', align: 'left', render: (row) => <span className="font-mono text-sm font-bold">#{row.TokenNumber}</span> },
    { key: 'FullName', label: 'Customer Name', width: '200px' },
    { key: 'Purpose', label: 'Service Details', render: (row) => (
      <div>
        <div className="font-medium">{row.Purpose}</div>
        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
           {/* Add extra data logic here if needed, but keeping it clean for now */}
           {row.counter && <span className="mr-2">{row.counter}</span>}
        </div>
      </div>
    )},
    { key: 'CounterName', label: 'Counter', width: '150px', render: (row) => row.CounterName || <span className="text-muted-foreground">-</span> },
    { key: 'Status', label: 'Status', width: '120px', render: (row) => {
        const status = (row.Status || '').toLowerCase();
        let variant = 'neutral';
        if (status === 'pending') variant = 'warning';
        if (status === 'called') variant = 'default'; // Blue for active
        if (status === 'served') variant = 'success';
        if (status === 'noshow') variant = 'destructive';
        
        return <Badge variant={variant} className="capitalize">{status}</Badge>;
    }},
  ];

  const renderRowActions = (row) => {
    const status = (row.Status || '').toLowerCase();
    
    return (
     <div className="flex items-center gap-2">
       {status === 'pending' && (
         <Button size="sm" onClick={(e) => { e.stopPropagation(); onStatusUpdate(row.TokenGuid, 'called', counterName); }}>Call</Button>
       )}
       {status === 'called' && (
         <>
           <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onStatusUpdate(row.TokenGuid, 'served'); }} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200">
             Serve
           </Button>
           <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onStatusUpdate(row.TokenGuid, 'noshow'); }} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
             No Show
           </Button>
         </>
       )}
       <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onViewDetails(row); }}>Details</Button>
     </div>
    );
  };

  return (
    <Card className="h-full flex flex-col border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-4">
            <CardTitle className="text-lg font-bold">Live Queue</CardTitle>
            <Button variant="outline" size="sm" onClick={onExport} className="h-8">Export CSV</Button>
        </div>
        <div className="relative w-64">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
           <input
             type="text"
             placeholder="Search name or #..."
             className="w-full h-9 rounded-md border border-input bg-transparent px-9 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
             value={query}
             onChange={(e) => setQuery(e.target.value)}
           />
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <DataTable 
           columns={columns} 
           data={filteredTokens} 
           keyField="TokenGuid"
           rowActions={renderRowActions}
           onRowClick={onViewDetails}
        />
      </CardContent>
    </Card>
  );
};

export default TokenQueueTable;
