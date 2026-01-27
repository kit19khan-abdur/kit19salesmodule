import React, { useState } from 'react';
import { Plus, Trash2, X, Minus } from 'lucide-react';

const FilterSearch = ({ onClose, onSubmit }) => {
    const [allTask, setAllTask] = useState(false);
    const [applyType, setApplyType] = useState('any'); // 'all' or 'any'
    
    // Current filter being built
    const [currentField, setCurrentField] = useState('');
    const [currentOperator, setCurrentOperator] = useState('');
    const [currentValue, setCurrentValue] = useState('');
    
    // Applied filters
    const [appliedFilters, setAppliedFilters] = useState([]);

    const fieldOptions = [
        '--- Select Field---',
        'Title',
        'Description',
        'Status',
        'Owner',
        'Due Date',
        'Created Date',
        'Priority',
        'Type'
    ];

    const operatorOptions = [
        '---Operator---',
        'Contain',
        'Does not contain',
        'Equals',
        'Not equals',
        'Starts with',
        'Ends with',
        'Begin With',
        'Is empty',
        'Is not empty'
    ];

    const handleAddFilter = () => {
        if (currentField && currentOperator && currentValue) {
            const newFilter = {
                id: Date.now(),
                field: currentField,
                operator: currentOperator,
                value: currentValue
            };
            setAppliedFilters([...appliedFilters, newFilter]);
            // Reset current filter
            setCurrentField('');
            setCurrentOperator('');
            setCurrentValue('');
        }
    };

    const handleRemoveFilter = (id) => {
        setAppliedFilters(appliedFilters.filter(f => f.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({ allTask, applyType, filters: appliedFilters });
        }
    };

    return (
        <div className="bg-white rounded-lg w-full max-w-4xl">

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-6">
                {/* All Task Checkbox */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="allTask"
                        checked={allTask}
                        onChange={(e) => setAllTask(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="allTask" className="text-sm font-medium text-gray-700 cursor-pointer">
                        All Task
                    </label>
                </div>

                {/* Filter Builder Row */}
                <div className="flex items-center gap-3">
                    {/* Field Dropdown */}
                    <select
                        value={currentField}
                        onChange={(e) => setCurrentField(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '1.5rem',
                            paddingRight: '2.5rem'
                        }}
                    >
                        {fieldOptions.map((option, idx) => (
                            <option key={idx} value={option === '--- Select Field---' ? '' : option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    {/* Operator Dropdown */}
                    <select
                        value={currentOperator}
                        onChange={(e) => setCurrentOperator(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '1.5rem',
                            paddingRight: '2.5rem'
                        }}
                    >
                        {operatorOptions.map((option, idx) => (
                            <option key={idx} value={option === '---Operator---' ? '' : option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    {/* Value Input */}
                    <input
                        type="text"
                        value={currentValue}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        placeholder="Search value"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    {/* Add Button */}
                    <button
                        type="button"
                        onClick={handleAddFilter}
                        className="w-4 h-4  flex items-center justify-center bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* Apply Type Radio Buttons */}
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="applyType"
                            value="all"
                            checked={applyType === 'all'}
                            onChange={(e) => setApplyType(e.target.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Apply to All</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="applyType"
                            value="any"
                            checked={applyType === 'any'}
                            onChange={(e) => setApplyType(e.target.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Apply Any One</span>
                    </label>
                </div>

                {/* Applied Filters List */}
                {appliedFilters.length > 0 && (
                    <div className="space-y-2">
                        {appliedFilters.map((filter) => (
                            <div key={filter.id} className="grid grid-cols-4 gap-4 text-sm text-gray-600 py-2">
                                <div>{filter.field}</div>
                                <div>{filter.operator}</div>
                                <div className="text-blue-600">{filter.value}</div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFilter(filter.id)}
                                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </form>
        </div>
    );
};

export default FilterSearch;
