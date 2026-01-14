import React from 'react'
import { Filter, Plus, Settings } from 'lucide-react'

const FollowUpHeader = ({ title = 'Follow Ups', total = 0, onAdd = () => {}, onFilter = () => {}, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 flex items-center justify-between">
      <div>
        <div className="text-lg font-semibold">{title}</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block">
          {children}
        </div>

        <button onClick={onFilter} className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-50">
          <Settings size={16} className='animate-spin' />
        </button>
      </div>
    </div>
  )
}

export default FollowUpHeader
