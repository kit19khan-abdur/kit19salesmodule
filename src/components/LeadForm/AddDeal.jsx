import React, { useState } from 'react';

const pipelines = ['solar', 'product', 'service'];
const stages = ['New', 'Contacted', 'Proposal', 'Welcome Mail send', 'Negotiation', 'Won', 'Lost'];
const owners = [
  '34594-Mohit.cheema (Mohit Cheema)',
  '34594-Manish.Singh (Manish Singh)',
  '34594-kmukesh343 (Mukesh Kumar)'
];

const AddDeal = ({ onSubmit, onClose, initial = {} }) => {
  const [dealValue, setDealValue] = useState(initial.dealValue || '');
  const [pipeline, setPipeline] = useState(initial.pipeline || pipelines[0]);
  const [stage, setStage] = useState(initial.stage || stages[0]);
  const [probability, setProbability] = useState(initial.probability || '5.00');
  const [salesOwner, setSalesOwner] = useState(initial.salesOwner || owners[0]);
  const [estimatedCloserDate, setEstimatedCloserDate] = useState(initial.estimatedCloserDate || '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!dealValue || String(dealValue).trim() === '') e.dealValue = 'Please enter deal value';
    if (!probability || isNaN(Number(probability))) e.probability = 'Enter valid probability';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const payload = {
      dealValue,
      pipeline,
      stage,
      probability: Number(probability),
      salesOwner,
      estimatedCloserDate
    };
    if (onSubmit) onSubmit(payload);
  };

  return (
    <div className="w-full max-h-[80vh] overflow-y-auto p-4">
      <form onSubmit={handleSave}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Deal value <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={dealValue}
            onChange={e => setDealValue(e.target.value)}
            placeholder="Please Enter Value"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          {errors.dealValue && <div className="text-sm text-red-600 mt-1">{errors.dealValue}</div>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Deal pipeline</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm" value={pipeline} onChange={e => setPipeline(e.target.value)}>
            {pipelines.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Deal Stage</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm" value={stage} onChange={e => setStage(e.target.value)}>
            {stages.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Probability(%)<span className="text-red-500">*</span></label>
          <input
            type="number"
            step="0.01"
            value={probability}
            onChange={e => setProbability(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          {errors.probability && <div className="text-sm text-red-600 mt-1">{errors.probability}</div>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Sales owner</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50" value={salesOwner} onChange={e => setSalesOwner(e.target.value)}>
            {owners.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Estimated Closer Date</label>
          <input
            type="date"
            value={estimatedCloserDate}
            onChange={e => setEstimatedCloserDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>

      </form>
    </div>
  );
};

export default AddDeal;