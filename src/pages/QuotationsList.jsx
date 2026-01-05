import React, { useState } from 'react';
import { useQuotations, useCreateQuotation } from '../hooks/useApi';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import { FiPlus, FiDownload, FiMail, FiMessageSquare, FiEye, FiEdit2 } from 'react-icons/fi';
import { formatDate, formatCurrency } from '../utils/helpers';
import { DEFAULT_PAGE_SIZE } from '../config/constants';

const QuotationsList = () => {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });

  const { data, isLoading } = useQuotations(filters);

  const columns = [
    {
      key: 'quotationNumber',
      label: 'Quotation #',
      render: (value) => <span className="font-medium text-gray-900">{value}</span>
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (value) => <span className="text-sm">{value}</span>
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => (
        <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const variant = {
          'Draft': 'default',
          'Sent': 'info',
          'Accepted': 'success',
          'Rejected': 'danger'
        }[value] || 'default';
        return <Badge variant={variant} size="sm">{value}</Badge>;
      }
    },
    {
      key: 'date',
      label: 'Date',
      render: (value) => <span className="text-sm text-gray-500">{formatDate(value)}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button className="text-blue-600 hover:text-blue-700" title="View">
            <FiEye className="w-4 h-4" />
          </button>
          <button className="text-indigo-600 hover:text-indigo-700" title="Edit">
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button className="text-green-600 hover:text-green-700" title="Download PDF">
            <FiDownload className="w-4 h-4" />
          </button>
          <button className="text-purple-600 hover:text-purple-700" title="Send Email">
            <FiMail className="w-4 h-4" />
          </button>
          <button className="text-emerald-600 hover:text-emerald-700" title="Send WhatsApp">
            <FiMessageSquare className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
        <Button variant="primary" icon={<FiPlus />}>
          Create Quotation
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={data?.items || []}
          loading={isLoading}
          emptyMessage="No quotations found"
        />

        {data && data.totalItems > 0 && (
          <Pagination
            currentPage={filters.page}
            totalPages={data.totalPages}
            pageSize={filters.pageSize}
            totalItems={data.totalItems}
            onPageChange={(page) => setFilters({ ...filters, page })}
            onPageSizeChange={(pageSize) => setFilters({ ...filters, pageSize, page: 1 })}
          />
        )}
      </Card>
    </div>
  );
};

export default QuotationsList;
