import React from 'react';
import { X, Phone, Mail, Calendar } from 'lucide-react';

const LeadDetailPanel = ({ lead, onClose }) => {
  if (!lead) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Lead Details</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
            {lead.PersonName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{lead.PersonName}</h2>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${lead.IsOpen ? 'bg-green-100 text-green-700' : 'bg-gray-600 text-white'}`}>
              {lead.IsOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">Phone</label>
            <div className="flex items-center gap-2 mt-1">
              <Phone className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-900">{lead.CsvMobileNo}</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-900">{lead.CsvEmailId || 'N/A'}</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">Lead ID</label>
            <p className="mt-1 text-sm font-medium text-gray-900">{lead.LeadId}</p>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">Created Date</label>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-900">{lead.CreatedDate}</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">Source</label>
            <p className="mt-1 text-sm font-medium text-gray-900">{lead.Source || 'N/A'}</p>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">Type</label>
            <p className="mt-1 text-sm font-medium text-gray-900">{lead.Type || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition">
          View Full Details
        </button>
      </div>
    </div>
  );
};

export default LeadDetailPanel;
