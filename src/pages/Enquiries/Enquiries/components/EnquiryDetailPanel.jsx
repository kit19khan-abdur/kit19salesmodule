import React from 'react';
import { X, Phone, Mail, MessageSquare, User, MapPin, TrendingUp, Clock, Calendar, Plus } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { GoGitBranch } from 'react-icons/go';

const EnquiryDetailPanel = ({ enquiry, onClose, activities = [] }) => {
  if (!enquiry) return null;

  const statusColors = {
    'Hot Lead': 'bg-red-100 text-red-700',
    'Lead': 'bg-gray-600 text-white',
    'Open': 'bg-green-100 text-green-700'
  };

  const status = enquiry.IsOpen ? 'Open' : 'Lead';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-150 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
        {/* Panel Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-900">Enquiry Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Panel Content */}
        <div className="p-6 space-y-6">
          {/* Lead Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{enquiry.PersonName}</h1>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
                  {status}
                </span>
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={enquiry.Image}
                  alt={enquiry.PersonName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://docs.kit19.com/default/person.png';
                  }}
                />
              </div>
            </div>
          </div>


          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{enquiry.CsvMobileNo}</p>
                </div>
              </div>
              {enquiry.CsvEmailId && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{enquiry.CsvEmailId}</p>
                  </div>
                </div>
              )}
              {(enquiry.Latitude && enquiry.Longitude) && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-900">{enquiry.Latitude}, {enquiry.Longitude}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lead Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Enquiry ID</p>
                <p className="text-sm font-medium text-gray-900">{enquiry.EnquiryId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Created</p>
                <p className="text-sm font-medium text-gray-900">{enquiry.CreatedDate}</p>
              </div>
              {enquiry.Source && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Source</p>
                  <p className="text-sm font-medium text-gray-900">{enquiry.Source}</p>
                </div>
              )}
              {enquiry.Type && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Type</p>
                  <p className="text-sm font-medium text-gray-900">{enquiry.Type}</p>
                </div>
              )}
            </div>
          </div>

          {/* Activities */}
          {activities.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity, idx) => (
                  <div key={idx} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.EventName || activity.EventDescription}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.UserLogin || 'System'} • {activity.EventDate ? new Date(activity.EventDate).toLocaleString() : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {/* <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-sm font-medium">
                <GoGitBranch className="w-4 h-4" />
                Add Follow-up
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-sm font-medium">
                <Calendar className="w-4 h-4" />
                Schedule Meeting
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-sm font-medium">
                <Plus className="w-4 h-4" />
                Add Note
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default EnquiryDetailPanel;
