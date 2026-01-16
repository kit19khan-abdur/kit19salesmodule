import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Phone, Mail, Building2, MapPin, Calendar, DollarSign, User, Package, MessageSquare, Notebook, NotebookPen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConversionRow = ({ conversion, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    return (
        <>
            {/* Main Row */}
            <motion.tr
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all ${
                    isExpanded ? 'bg-indigo-50/30' : ''
                }`}
            >
                {/* Expand Button */}
                <td className="px-4 py-4">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-indigo-600" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                    </button>
                </td>

                {/* Lead No */}
                <td className="px-4 py-4">
                    <span className="font-semibold text-gray-900">{conversion.leadNo}</span>
                </td>

                {/* Name */}
                <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                            {conversion.name ? conversion.name.charAt(0).toUpperCase() : 'N'}
                        </div>
                        <span className="text-gray-900 font-medium">
                            {conversion.name || '-'}
                        </span>
                    </div>
                </td>

                {/* Company Name */}
                <td className="px-4 py-4">
                    <span className="text-gray-600">{conversion.companyName || '-'}</span>
                </td>

                {/* Mobile */}
                <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm">{conversion.mobile}</span>
                    </div>
                </td>

                {/* Email */}
                <td className="px-4 py-4">
                    {conversion.email ? (
                        <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm">{conversion.email}</span>
                        </div>
                    ) : (
                        <span className="text-gray-400">-</span>
                    )}
                </td>

                {/* Total Business */}
                <td className="px-4 py-4">
                    <span className="font-semibold text-emerald-600">
                        {formatCurrency(conversion.totalBusiness)}
                    </span>
                </td>

                {/* Total Orders */}
                <td className="px-4 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-semibold text-sm">
                        {conversion.totalOrders}
                    </span>
                </td>

                {/* Last Order Date */}
                <td className="px-4 py-4">
                    <span className="text-gray-600 text-sm">
                        {conversion.lastOrderDate || '-'}
                    </span>
                </td>

                {/* City */}
                <td className="px-4 py-4">
                    <span className="text-gray-600">{conversion.city || '-'}</span>
                </td>

                {/* State */}
                <td className="px-4 py-4">
                    <span className="text-gray-600">{conversion.state || '-'}</span>
                </td>
            </motion.tr>

            {/* Expanded Details Row */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border-b border-gray-100"
                    >
                        <td colSpan="11" className="px-4 py-5">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ml-10">
                                {/* Follow-up Status */}
                                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                            <User className="w-4 h-4 text-emerald-600" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1">Follow-up Status</p>
                                    <p className="font-semibold text-gray-900">{conversion.followupStatus}</p>
                                </div>

                                {/* Order Date */}
                                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <Calendar className="w-4 h-4 text-blue-600" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1">Order Date</p>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {conversion.orderDate || '-'}
                                    </p>
                                </div>

                                {/* Remarks */}
                                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <Notebook className="w-4 h-4 text-purple-600" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1">Remarks</p>
                                    <p className="font-semibold text-gray-900">
                                        {conversion.remarks || '-'}
                                    </p>
                                </div>

                                {/* Products */}
                                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                            <Package className="w-4 h-4 text-orange-600" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1">Products</p>
                                    <p className="font-semibold text-gray-900">
                                        {conversion.products || '-'}
                                    </p>
                                </div>

                                {/* Amount Paid */}
                                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                            <DollarSign className="w-4 h-4 text-emerald-600" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1">Amount Paid</p>
                                    <p className="font-semibold text-emerald-600">
                                        {formatCurrency(conversion.amountPaid)}
                                    </p>
                                </div>

                                {/* Assigned To */}
                                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                            <User className="w-4 h-4 text-indigo-600" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1">Assigned To</p>
                                    <p className="font-semibold text-gray-900">
                                        {conversion.assignedTo || '-'}
                                    </p>
                                </div>
                            </div>
                        </td>
                    </motion.tr>
                )}
            </AnimatePresence>
        </>
    );
};

export default ConversionRow;
