import React, { useState } from 'react';
import Drawer from './common/Drawer';

const TaskDrawer = ({ isOpen, onClose, row, mode = 'view', onSave }) => {
  const [form, setForm] = useState(() => ({
    title: row?.title || '',
    desc: row?.desc || ''
  }));

  // Keep form in sync when row changes
  React.useEffect(() => {
    setForm({ title: row?.title || '', desc: row?.desc || '' });
  }, [row]);

  const handleSave = () => {
    if (onSave) onSave(form);
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? 'Edit Task' : 'View Task'} position="right" size="md">
      <div>
        {mode === 'view' ? (
          <div>
            <div className="mb-4">
              <div className="text-sm text-gray-500">Title</div>
              <div className="font-semibold">{row?.title}</div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-500">Description</div>
              <div className="text-sm text-gray-700">{row?.desc}</div>
            </div>
            <div className="text-sm text-gray-500">Due</div>
            <div className="mb-4">{row?.due}</div>
          </div>
        ) : (
          <div>
            <label className="block text-sm text-gray-500 mb-1">Title</label>
            <input className="w-full border rounded px-3 py-2 mb-3" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <label className="block text-sm text-gray-500 mb-1">Description</label>
            <textarea className="w-full border rounded px-3 py-2 mb-3" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
            <div className="flex justify-end">
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default TaskDrawer;
