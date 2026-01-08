import React, { useState, useRef, useEffect } from 'react';
import { Search, Phone, Mail, LayoutGrid, List, RefreshCw, MoreVertical, ChevronLeft, ChevronRight, MessageSquare, Trash2, MessageSquareMore } from 'lucide-react';
import { GoGitBranch } from 'react-icons/go';
import { FaWhatsapp } from 'react-icons/fa';
import RowActionMenu from '../../../../components/RowActionMenu';
import LeadDetailsDrawer from './LeadDetailsDrawer';
import nodata from '../../../../assets/nodata.gif';

const LeadTable = ({
    leads,
    selectedLead,
    onSelectLead,
    searchText,
    onSearchChange,
    onSearch,
    viewMode,
    setViewMode,
    totalRecord,
    itemsPerPage,
    onPageChange,
    currentPage
}) => {
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [rowMenu, setRowMenu] = useState({ show: false, rowId: null });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedLeadForDrawer, setSelectedLeadForDrawer] = useState(null);
    const rowMenuAnchorRefs = useRef({});
    const totalPages = Math.ceil(totalRecord / parseInt(itemsPerPage));

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleSelectAll = () => {
        if (selectedLeads.length === leads.length) {
            setSelectedLeads([]);
        } else {
            setSelectedLeads(leads.map(l => l.id));
        }
    };

    const handleSelectLead = (id) => {
        if (selectedLeads.includes(id)) {
            setSelectedLeads(selectedLeads.filter(lid => lid !== id));
        } else {
            setSelectedLeads([...selectedLeads, id]);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const getPaginationNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                value={searchText}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('card')}
                                className={`p-1.5 rounded ${viewMode === 'card' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Showing Records */}
            <div className="px-6 py-2 border-b border-gray-200 flex items-center justify-start bg-gray-50">
                <div className="text-sm text-gray-600">
                    Showing Records: <strong>All Leads</strong>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className="border-b border-gray-200">
                            <th className="px-3 py-3 text-left">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                    checked={selectedLeads.length === leads.length && leads.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                Lead Details
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                Mobile No
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                Email ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                Creation Details
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                Source
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                Type
                            </th>
                        </tr>
                    </thead>
                    {leads?.length > 0 ? (
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leads.map((lead) => (
                                <tr
                                    key={lead.ID}
                                    className={`transition hover:bg-gray-50 group cursor-pointer ${selectedLead === lead.ID ? 'bg-blue-50' : ''}`}
                                    onClick={() => {
                                        setSelectedLeadForDrawer(lead);
                                        setIsDrawerOpen(true);
                                    }}
                                >
                                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                            checked={selectedLeads.includes(lead.ID)}
                                            onChange={() => handleSelectLead(lead.ID)}
                                        />
                                    </td>
                                    <td className="px-4 py-2 relative">
                                        <div className="flex items-center  justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer">
                                                        {getInitials(lead.PersonName)}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-gray-900 text-sm cursor-pointer">{lead.PersonName}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span title="Send Email">
                                                    <Mail
                                                        className="w-5 h-5 cursor-pointer text-gray-600 hover:text-blue-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Handle mail action
                                                        }}
                                                    />
                                                </span>
                                                <span title="Add FollowUp">
                                                    <GoGitBranch
                                                        className="w-5 h-5 cursor-pointer text-gray-600 hover:text-purple-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Handle branch action
                                                        }}
                                                    />
                                                </span>
                                                <span title="Send WhatsApp">
                                                    <FaWhatsapp
                                                        className="w-5 h-5 cursor-pointer text-gray-600 hover:text-green-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Handle WhatsApp action
                                                        }}
                                                    />
                                                </span>
                                                <span title="Send SMS">
                                                    <MessageSquareMore
                                                        className="w-5 h-5 cursor-pointer text-gray-600 hover:text-blue-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Handle SMS action
                                                        }}
                                                    />
                                                </span>
                                                <span title="Delete">
                                                    <Trash2
                                                        className="w-5 h-5 cursor-pointer text-gray-600 hover:text-red-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Handle delete action
                                                        }}
                                                    />
                                                </span>
                                                <span
                                                    id={`row-action-icon-${lead.ID}`}
                                                    ref={el => rowMenuAnchorRefs.current[lead.ID] = el}
                                                    className="cursor-pointer"
                                                    title="More Actions"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setRowMenu(rowMenu.show && rowMenu.rowId === lead.ID ? { show: false, rowId: null } : { show: true, rowId: lead.ID });
                                                    }}
                                                >
                                                    <MoreVertical className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                                                </span>
                                            </div>
                                            {/* Row action menu dropdown */}
                                            <RowActionMenu
                                                show={rowMenu.show && rowMenu.rowId === lead.ID}
                                                anchorRef={{ current: rowMenuAnchorRefs.current[lead.ID] }}
                                                onClose={() => setRowMenu({ show: false, rowId: null })}
                                                menuId={`row-action-menu-${lead.ID}`}
                                                onAction={action => {
                                                    setRowMenu({ show: false, rowId: null });
                                                    if (action === 'edit') {
                                                        alert(`Edit lead: ${lead.PersonName}`);
                                                    } else if (action === 'sendVoice') {
                                                        alert(`Send voice to: ${lead.PersonName}`);
                                                    } else if (action === 'meeting') {
                                                        alert(`Create meeting with: ${lead.PersonName}`);
                                                    } else if (action === 'appointment') {
                                                        alert(`Add appointment for: ${lead.PersonName}`);
                                                    } else {
                                                        alert(`Action: ${action} for ${lead.PersonName}`);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex cursor-pointer hover:text-green-600 items-center gap-1 text-blue-600 font-medium">
                                            <span>{lead.MobileNo ? lead.CsvMobileNo : '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-3 text-xs">
                                            {lead.EmailId && (
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="truncate max-w-50">{lead.EmailId ? lead.CsvEmailId : '-'}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="text-xs">
                                            <div className="mb-1">
                                                {/* <span className="font-semibold text-gray-700">Date</span> */}
                                                <span className="ml-2 text-gray-600">{lead.CreatedOn ? lead.CreatedOn : '-'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{lead.SourceName || '-'}</td>
                                    {/* <td className="px-4 py-2">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${lead.IsOpen ? 'bg-green-100 text-green-700' : 'bg-gray-600 text-white'}`}>
                                            {lead.IsOpen ? 'Open' : 'Closed'}
                                        </span>
                                    </td> */}
                                    {/* <td className="px-4 py-2 text-sm text-gray-700">{lead.Type || '-'}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan="8">
                                    <div className="flex items-center justify-center h-[30vh] w-full bg-[#ffffff]">
                                        <img src={nodata} alt="nodata" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>

            {/* Floating Pagination */}
            <div className="fixed bottom-6 right-20 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 z-50">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded transition ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                    {getPaginationNumbers().map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`min-w-[32px] h-8 px-2 rounded text-sm font-medium transition ${currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                {page}
                            </button>
                        )
                    ))}
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded transition ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Lead Details Drawer */}
            <LeadDetailsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                lead={selectedLeadForDrawer}
            />
        </div>
    );
};

export default LeadTable;
