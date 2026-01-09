import React, { useState, useEffect } from 'react';
import { getSession } from '../../../../getSession';
import { updateDialerData, getScheduleCallAction } from '../../../../utils/lead';

const ScheduleCallForm = ({ lead, onSave, onCancel }) => {
  const [selectedPhone, setSelectedPhone] = useState(lead?.MobileNo || '');
  const [labelName, setLabelName] = useState('');
  const [labelOptions, setLabelOptions] = useState([]);
  const [isLabelsLoading, setIsLabelsLoading] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(new Date().toISOString().slice(0,16));

  const handleSave = () => {
    const data = {
      phone: selectedPhone,
      labelName,
      scheduleTime
    };
    const saveAsync = async () => {
      try {
        const { userId, parentId, TokenId } = getSession();
        const details = {
          UserId: userId || 0,
          ParentId: parentId || 0,
          Mode: 'NEW_RECORD',
          OperationJSON: JSON.stringify({ LeadId: lead?.LeadId || lead?.ID || lead?.Id || lead?.id, Phone: selectedPhone, Label: labelName, ScheduleTime: scheduleTime })
        };
        const payload = {
          Token: TokenId,
          Message: '',
          LoggedUserId: userId,
          MAC_Address: '',
          IP_Address: '',
          Details: details,
          BroadcastName: ''
        };
        const resp = await updateDialerData(payload);
        // resp should be objResponseStatusEntity; check Status
        if (resp && (resp.Status === 1 || resp.Status === '1')) {
          if (onSave) onSave(data);
        } else {
          console.error('updateDialerData failed', resp);
          if (onSave) onSave(data); // still call onSave so UI can continue; change if you want strict behavior
        }
      } catch (error) {
        console.error('ScheduleCallForm save error:', error);
        if (onSave) onSave(data);
      }
    };
    saveAsync();
  };

  useEffect(() => {
    let mounted = true;
    const fetchLabels = async () => {
      setIsLabelsLoading(true);
      try {
        const { userId, TokenId } = getSession();
        const details = {
          Mode: 'LABELS',
          Id: lead?.LeadId || lead?.ID || lead?.Id || 0,
          SettingJSON: '',
          UserId: userId || 0
        };
        const payload = {
          Token: TokenId,
          Message: '',
          LoggedUserId: userId,
          MAC_Address: '',
          IP_Address: '',
          Details: details,
          BroadcastName: ''
        };
        const resp = await getScheduleCallAction(payload);
        let raw = resp?.Details ?? resp?.d ?? resp ?? [];
        if (raw && raw.data) raw = raw.data;
        const arr = Array.isArray(raw) ? raw : [];
        // map possible fields to { value, label }
        const opts = arr.map((it, idx) => ({
          value: String(it.Id ?? it.ID ?? it.Value ?? it.ValueId ?? idx),
          label: it.Name ?? it.Label ?? it.ActionName ?? it.Value ?? it.Text ?? `Option ${idx+1}`
        }));
        if (mounted) {
          setLabelOptions(opts);
          if (!labelName && opts.length > 0) setLabelName(String(opts[0].value));
        }
      } catch (error) {
        console.error('fetch schedule labels error:', error);
      } finally {
        if (mounted) setIsLabelsLoading(false);
      }
    };
    fetchLabels();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input type="radio" checked={true} readOnly className="w-4 h-4" />
        <div className="text-sm font-medium">{selectedPhone}</div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Label Name</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm"
          value={labelName}
          onChange={(e) => setLabelName(e.target.value)}
        >
          <option value="">{isLabelsLoading ? 'Loading...' : 'Select Label Name'}</option>
          {!isLabelsLoading && labelOptions.length === 0 && (
            <option value="">No labels found</option>
          )}
          {labelOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Schedule Time*</label>
        <input
          type="datetime-local"
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
        <button onClick={onCancel} className="px-4 py-2 rounded border border-gray-300 text-sm">Cancel</button>
        <button onClick={handleSave} className="px-4 py-2 rounded bg-blue-600 text-white text-sm">Save</button>
      </div>
    </div>
  );
};

export default ScheduleCallForm;
