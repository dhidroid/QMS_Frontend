import React from 'react';
import DataTable from '../../design-system/molecules/DataTable';
import Badge from '../../design-system/atoms/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../design-system/atoms/Card';

const UserManagementTable = ({ users }) => {
  const columns = [
    { key: 'UserId', label: 'ID', width: '60px' },
    { key: 'Username', label: 'Username' },
    { key: 'Role', label: 'Role', render: (row) => <Badge variant="outline" className="uppercase text-[10px]">{row.Role}</Badge> },
    { key: 'DisplayName', label: 'Display Name', render: (row) => row.DisplayName || '-' },
    { key: 'IsActive', label: 'Status', render: (row) => (
      row.IsActive 
        ? <Badge variant="success">Active</Badge> 
        : <Badge variant="neutral">Inactive</Badge>
    )},
  ];

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>System Users</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable 
          columns={columns} 
          data={users} 
          keyField="UserId"
        />
      </CardContent>
    </Card>
  );
};

export default UserManagementTable;
