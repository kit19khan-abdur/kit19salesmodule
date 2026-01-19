import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, X, Plus, Check } from 'lucide-react';

const CallListSidebar = ({ 
    menuItems, 
    customTabs, 
    selectedCategory, 
    onCategoryChange, 
    onAddTab, 
    onRemoveTab,
    isCollapsed,
    onToggleCollapse 
}) => {
    const [showAddTabForm, setShowAddTabForm] = useState(false);
    const [newTabName, setNewTabName] = useState('');
    const [newTabDescription, setNewTabDescription] = useState('');
    const [makeDefault, setMakeDefault] = useState(false);

    const handleAddTab = () => {
        if (newTabName.trim()) {
            onAddTab({
                name: newTabName,
                description: newTabDescription,
                makeDefault: makeDefault
            });
            setNewTabName('');
            setNewTabDescription('');
            setMakeDefault(false);
            setShowAddTabForm(false);
        }
    };

    const handleCancelAddTab = () => {
        setNewTabName('');
        setNewTabDescription('');
        setMakeDefault(false);
        setShowAddTabForm(false);
    };

    if (isCollapsed) {
        return (
            <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4">
                <button
                    onClick={onToggleCollapse}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Expand sidebar"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        );
    }

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">ClickToCall Dialer</h2>
                <button
                    onClick={onToggleCollapse}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Collapse sidebar"
                >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onCategoryChange(item.id)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                selectedCategory === item.id
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <span>{item.label}</span>
                            {item.count > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    selectedCategory === item.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {item.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Divider */}
                {customTabs.length > 0 && <div className="border-t border-gray-200 my-3"></div>}

                {/* Custom Tabs */}
                <div className="space-y-1">
                    {customTabs.map((tab) => (
                        <div
                            key={tab.id}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <span>{tab.label}</span>
                            {tab.removable && (
                                <button
                                    onClick={() => onRemoveTab(tab.id)}
                                    className="p-0.5 rounded hover:bg-gray-200 text-gray-500 hover:text-red-600 transition-colors"
                                    title="Remove tab"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {!showAddTabForm && (<button
                    onClick={() => setShowAddTabForm(!showAddTabForm)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add New Tab
                </button>)}

                {/* Add New Tab Form */}
                {showAddTabForm && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-700">Add New Tab</h3>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleCancelAddTab}
                                    className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                                    title="Cancel"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleAddTab}
                                    className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-green-600 transition-colors"
                                    title="Save"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Name"
                                    value={newTabName}
                                    onChange={(e) => setNewTabName(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Description
                                </label>
                                <textarea
                                    placeholder="Enter Description"
                                    value={newTabDescription}
                                    onChange={(e) => setNewTabDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="makeDefault"
                                    checked={makeDefault}
                                    onChange={(e) => setMakeDefault(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <label htmlFor="makeDefault" className="text-sm text-gray-600 cursor-pointer">
                                    Make Default
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add New Tab Button */}
            {/* <div className="px-4 py-3 border-t border-gray-200">
                
            </div> */}
        </div>
    );
};

export default CallListSidebar;
