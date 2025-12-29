import React, { useState } from 'react';
import DataTable from '../../design-system/molecules/DataTable';
import Badge from '../../design-system/atoms/Badge';
import Button from '../../design-system/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../design-system/atoms/Card';
import { Edit, Link as LinkIcon, Eye, Trash2 } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';

const FormListTable = ({ forms, onDelete, onToast }) => {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, formId: null, title: '' });

  const columns = [
    { key: 'Title', label: 'Form Title', render: (row) => <span className="font-semibold">{row.Title}</span> },
    { key: 'IsActive', label: 'Status', width: '100px', render: (row) => (
        row.IsActive 
           ? <Badge variant="success">Active</Badge> 
           : <Badge variant="neutral">Inactive</Badge>
    )},
    { key: 'CreatedAt', label: 'Created', width: '150px', render: (row) => new Date(row.CreatedAt).toLocaleDateString() },
  ];

  const renderActions = (row) => (
    <div className="flex items-center gap-1">
      <Button 
        size="icon" 
        variant="ghost" 
        onClick={() => window.location.href = `/admin/forms/${row.FormId}`} 
        title="Edit"
      >
        <Edit size={16} />
      </Button>
      <Button 
         size="icon" 
         variant="ghost" 
         onClick={() => {
            const url = `${window.location.origin}/book/form/${row.FormId}`;
            navigator.clipboard.writeText(url);
            onToast('Link copied to clipboard', 'success');
         }}
         title="Copy Link"
      >
        <LinkIcon size={16} />
      </Button>
      <Button 
        size="icon" 
        variant="ghost" 
        onClick={() => window.open(`/book/form/${row.FormId}`, '_blank')} 
        title="View Form"
      >
        <Eye size={16} />
      </Button>
      <Button 
        size="icon" 
        variant="ghost" 
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => setDeleteModal({ isOpen: true, formId: row.FormId, title: row.Title })}
        title="Delete"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );

  return (
    <>
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Form Management</CardTitle>
          <Button onClick={() => window.location.href = '/admin/forms'}>
             + Create New Form
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable 
             columns={columns} 
             data={forms} 
             keyField="FormId"
             rowActions={renderActions}
          />
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Form"
        message={`Are you sure you want to delete "${deleteModal.title}"?`}
        confirmText="Delete"
        confirmColor="danger"
        onCancel={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={() => {
          onDelete(deleteModal.formId);
          setDeleteModal({ ...deleteModal, isOpen: false });
        }}
      />
    </>
  );
};

export default FormListTable;
