import React, { useState, useRef } from 'react';

const activityTypes = [
  'Facebook Chat',
  'Call',
  'Email',
  'Meeting',
  'Demo'
];

const sampleOwners = [
  'kmukesh343 (Mukesh Kumar)',
  '34594-Vikas.Rawat (Vikas Rawat)',
  '34594-Chintan.Gujrati (Chintan Gujrati)'
];

const sampleCollaborators = [
  '34594-Mohit.cheema (Mohit Cheema)',
  '34594-Manish.Singh (Surjit Kaur)',
  '34594-Rachit.Kumar (naseem khan)',
  '34594-Perumal.R (Perumal R)',
  '34594-kmukesh343 (Mukesh Kumar)'
];

const AddTask = ({ onClose, onSubmit, initial = {} }) => {
  const [title, setTitle] = useState(initial.title || `NewTask_${Date.now()}`);
  const [description, setDescription] = useState(initial.description || '');
  const [remarks, setRemarks] = useState(initial.remarks || '');
  const [activityType, setActivityType] = useState(initial.activityType || activityTypes[0]);
  const [dueDateTime, setDueDateTime] = useState(initial.dueDateTime || '');
  const [owner, setOwner] = useState(initial.owner || sampleOwners[0]);

  // Collaborators multi-select
  const [collabQuery, setCollabQuery] = useState('');
  const [collaborators, setCollaborators] = useState(initial.collaborators || []);
  const [showCollabSuggestions, setShowCollabSuggestions] = useState(false);
  const collabRef = useRef(null);

  const handleAddCollaborator = (c) => {
    if (!collaborators.includes(c)) setCollaborators(prev => [...prev, c]);
    setCollabQuery('');
    setShowCollabSuggestions(false);
  };

  const handleRemoveCollaborator = (c) => {
    setCollaborators(prev => prev.filter(x => x !== c));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !dueDateTime) {
      alert('Please provide Title and Due Date and Time');
      return;
    }
    const payload = { title, description, remarks, activityType, dueDateTime, owner, collaborators };
    if (onSubmit) onSubmit(payload);
  };

  return (
    <div className="w-full max-h-[80vh] overflow-y-auto p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="Start Typing the details about the task."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Remarks</label>
          <textarea
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="about the task..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Sales Activity Type</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm" value={activityType} onChange={e => setActivityType(e.target.value)}>
            {activityTypes.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Due Date and Time <span className="text-red-500">*</span></label>
          <input
            type="datetime-local"
            value={dueDateTime}
            onChange={e => setDueDateTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Owner</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm" value={owner} onChange={e => setOwner(e.target.value)}>
            {sampleOwners.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div className="mb-4 relative" ref={collabRef}>
          <label className="block text-sm font-medium text-gray-700">Collaborators</label>

          <div className="flex flex-wrap gap-2 mb-2">
            {collaborators.map((c) => (
              <div key={c} className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded text-sm">
                <span>{c}</span>
                <button type="button" className="text-gray-600" onClick={() => handleRemoveCollaborator(c)}>×</button>
              </div>
            ))}
          </div>

          <input
            type="text"
            value={collabQuery}
            onChange={e => { setCollabQuery(e.target.value); setShowCollabSuggestions(true); }}
            onFocus={() => setShowCollabSuggestions(true)}
            onBlur={() => setTimeout(() => setShowCollabSuggestions(false), 150)}
            placeholder="---Select Collaborators---"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />

          {showCollabSuggestions && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-40 max-h-40 overflow-auto">
              {sampleCollaborators.filter(u => u.toLowerCase().includes((collabQuery||'').toLowerCase()) && !collaborators.includes(u)).map((u) => (
                <div key={u} onMouseDown={(e) => { e.preventDefault(); handleAddCollaborator(u); }} className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm">{u}</div>
              ))}
            </div>
          )}
        </div>

      </form>
    </div>
  );
};

export default AddTask;