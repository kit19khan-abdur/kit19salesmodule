import { Calendar, Phone, Plus, Settings, Filter, DollarSign, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const FollowupTable = () => {

    const mockData = [
        {
            id: 1,
            followup: 'Call-Back',
            dueDate: '13 Jan 2026 16:49:29',
            created: '10 Jan 2026 09:30:15',
            contactNo: 3,
            phone: '+91 98765 43210',
            assignedTo: 'Rajesh Kumar',
            notifications: 2,
            status: 'today'
        },
        {
            id: 2,
            followup: 'Follow-up Email',
            dueDate: '12 Jan 2026 14:20:00',
            created: '08 Jan 2026 11:45:22',
            contactNo: 1,
            phone: '+91 87654 32109',
            assignedTo: 'Priya Sharma',
            notifications: 5,
            status: 'overdue'
        },
        {
            id: 3,
            followup: 'Product Demo',
            dueDate: '15 Jan 2026 10:00:00',
            created: '11 Jan 2026 16:12:33',
            contactNo: 0,
            phone: '+91 76543 21098',
            assignedTo: 'Amit Patel',
            notifications: 1,
            status: 'scheduled'
        },
        {
            id: 4,
            followup: 'Contract Review',
            dueDate: '13 Jan 2026 18:30:00',
            created: '09 Jan 2026 13:25:44',
            contactNo: 2,
            phone: '+91 65432 10987',
            assignedTo: 'Sneha Reddy',
            notifications: 3,
            status: 'today'
        },
        {
            id: 5,
            followup: 'Client Meeting',
            dueDate: '20 Jan 2026 11:00:00',
            created: '12 Jan 2026 08:15:55',
            contactNo: 4,
            phone: '+91 54321 09876',
            assignedTo: 'Vikram Singh',
            notifications: 0,
            status: 'scheduled'
        },
        {
            id: 6,
            followup: 'Quote Follow-up',
            dueDate: '11 Jan 2026 17:00:00',
            created: '07 Jan 2026 14:50:10',
            contactNo: 1,
            phone: '+91 43210 98765',
            assignedTo: 'Neha Gupta',
            notifications: 7,
            status: 'overdue'
        }
    ];

    const getStatusColor = (status) => {
        const colors = {
            overdue: 'text-red-600 bg-red-50',
            today: 'text-green-600 bg-green-50',
            scheduled: 'text-orange-600 bg-orange-50',
            none: 'text-blue-600 bg-blue-50'
        };
        return colors[status] || colors.scheduled;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Follow-up
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Created Details
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Contact No.
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Related To
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mockData.map((row, index) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                {/* Follow-up Column */}
                                <td className="px-6 py-4">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(row?.status)}`}>
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">{row.followup}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">Due: {row.dueDate}</div>
                                        </div>
                                    </div>
                                </td>

                                {/* Created Details Column */}
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-700">{row.created}</div>
                                </td>

                                {/* Contact No. Column */}
                                <td className="px-6 py-4 text-center">
                                    <span className="text-sm font-medium text-gray-900">{row.contactNo}</span>
                                </td>

                                {/* Related To Column */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                                                <img src="https://kit19.com/assets/custom/img/img_avatar.png" alt="person" className='w-9 h-9 rounded-full' />
                                            </div>
                                           
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#056d68] text-white text-xs rounded-full flex items-center justify-center font-semibold">
                                                    {row.notifications || 0}
                                                </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <Phone size={14} className="text-gray-400" />
                                                <span className="text-sm font-medium text-gray-900">{row.phone}</span>
                                                <ExternalLink size={14} className="text-gray-400 cursor-pointer hover:text-blue-600" title="View details" />
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                Assigned To: <span className="text-gray-700">{row.assignedTo}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Action Column */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Add new follow-up"
                                        >
                                            <Plus size={18} />
                                        </button>
                                        <button
                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Settings"
                                        >
                                            <Settings size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FollowupTable;
