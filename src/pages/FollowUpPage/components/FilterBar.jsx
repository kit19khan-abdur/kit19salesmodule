import { Calendar, DollarSign, Filter, Funnel } from "lucide-react";
import salesfunnel from "../../../assets/salesfunnel.jpg";
import moneybag from "../../../assets/moneybag.svg";
import { useState } from "react";

const filters = [
    { id: 'overdue', label: 'Overdue', color: 'red', count: 1247 },
    { id: 'today', label: 'Due Today', color: 'green', count: 892 },
    { id: 'scheduled', label: 'Scheduled', color: 'orange', count: 3456 },
    { id: 'none', label: 'No Followup', color: 'blue', count: 2103 }
];
const FilterBar = () => {
    const [activeFilters, setActiveFilters] = useState(['all']);
    const getFilterActiveColor = (color) => {
        const actives = {
            red: 'bg-red-50 border-red-500',
            green: 'bg-green-50 border-green-500',
            orange: 'bg-orange-50 border-orange-500',
            blue: 'bg-blue-50 border-blue-500'
        };
        return actives[color];
    };

    const getStatusColor = (status) => {
        const colors = {
            red: 'text-red-600 bg-red-50',
            green: 'text-green-600 bg-green-50',
            orange: 'text-orange-600 bg-orange-50',
            blue: 'text-blue-600 bg-blue-50'
        };
        return colors[status] || colors.scheduled;
    };

    const getFilterBorderColor = (color) => {
        const borders = {
            red: 'border-red-300 hover:border-red-400',
            green: 'border-green-300 hover:border-green-400',
            orange: 'border-orange-300 hover:border-orange-400',
            blue: 'border-blue-300 hover:border-blue-400'
        };
        return borders[color];
    };

    const toggleFilter = (filterId) => {
        if (filterId === 'all') {
            setActiveFilters(['all']);
        } else {
            const newFilters = activeFilters.includes(filterId)
                ? activeFilters.filter(f => f !== filterId)
                : [...activeFilters.filter(f => f !== 'all'), filterId];

            setActiveFilters(newFilters.length === 0 ? ['all'] : newFilters);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                    {filters.map(filter => {
                        const allSelected = activeFilters.includes('all')
                        const isActive = allSelected || activeFilters.includes(filter.id)
                        return (
                            <button
                                key={filter.id}
                                onClick={() => toggleFilter(filter.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${isActive
                                    ? getFilterActiveColor(filter.color)
                                    : `bg-white ${getFilterBorderColor(filter.color)}`
                                    }`}
                                title={`Filter by ${filter.label}`}
                            >
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isActive ? 'border-current' : 'border-gray-300'
                                    }`}>
                                    {isActive && (
                                        <div className="w-3 h-3 rounded-sm bg-current"></div>
                                    )}
                                </div>
                                <span className="text-sm items-center font-medium flex text-gray-700"><Calendar className={`${getStatusColor(filter?.color)}}`} size={18} />{filter.label}</span>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                    {filter?.count?.toLocaleString()}
                                </span>
                            </button>
                        )
                    })}
                    <button
                        onClick={() => toggleFilter('all')}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium px-2"
                    >
                        Show All
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="Advanced filters">
                        <img src={salesfunnel} alt="Sales Funnel" className="w-5 h-5" />
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">4</span>
                    </button>
                    <div className="flex items-center gap-2 text-gray-600" title="Total value">
                        {/* <DollarSign size={18} /> */}
                        <img src={moneybag} alt="Sales Funnel" className="w-5 h-5" />
                        <span className="text-sm font-semibold">₹45.2M</span>
                    </div>
                    <div className="text-sm text-gray-600 border-l pl-4">
                        1 to 100 of <span className="font-semibold">570,373</span> entries
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
