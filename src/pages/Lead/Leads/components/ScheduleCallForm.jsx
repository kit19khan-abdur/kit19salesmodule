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
        const formatScheduleTime = (val) => {
          if (!val) return '';
          // Expecting input like 'YYYY-MM-DDTHH:mm' (value from datetime-local)
          const [datePart, timePart] = String(val).split('T');
          if (!datePart || !timePart) return String(val);
          const [year, month, day] = datePart.split('-');
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          const m = months[parseInt(month, 10) - 1] || month;
          // timePart may include seconds; keep only HH:mm
          const hhmm = timePart.split(':').slice(0,2).join(':');
          return `${day}-${m}-${year} ${hhmm}`;
        };

        const details = {
          UserId: userId || 0,
          ParentId: parentId || 0,
          Mode: 'NEW_RECORD',
          OperationJSON: JSON.stringify({
            LabelName: labelName,
            ScheduleTime: formatScheduleTime(scheduleTime),
            EntityName: 'lead',
            EntityId: String(lead?.LeadId || lead?.ID || lead?.Id || lead?.id || 0),
            MobileNo: selectedPhone
          })
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
          Mode: 'SELECT',
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
          const parseJsonSafe = (s) => {
            if (!s || typeof s !== 'string') return null;
            const trimmed = s.trim();
            if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) return null;
            try { return JSON.parse(trimmed); } catch (e) { return null; }
          };
          let opts = [];
          if (Array.isArray(raw) && raw.length > 0) {
            // If each item has a Text JSON payload, try to parse and extract useful lists
            for (let i = 0; i < raw.length; i++) {
              const it = raw[i];
              // If item.Text is JSON string, parse it
              const parsed = parseJsonSafe(it.Text || it.TextN || it.Value || it.SettingJSON || '');
              if (parsed) {
                // If parsed has leftTabs (common in UI config), use that
                if (Array.isArray(parsed.leftTabs)) {
                  opts = parsed.leftTabs.map((t, idx) => ({ value: String(t.name ?? idx), label: String(t.text ?? t.name ?? `Option ${idx+1}`) }));
                  break;
                }
                // If parsed is an array, map it
                if (Array.isArray(parsed)) {
                  opts = parsed.map((p, idx) => ({ value: String(p.Id ?? p.id ?? p.value ?? idx), label: String(p.Name ?? p.name ?? p.label ?? p.text ?? `Option ${idx+1}`) }));
                  break;
                }
              }
            }
            // If opts still empty, map raw items directly
            if (opts.length === 0) {
              opts = raw.map((it, idx) => ({
                value: String(it.Id ?? it.ID ?? it.Value ?? it.ValueId ?? idx),
                label: String(it.Name ?? it.Label ?? it.ActionName ?? it.Value ?? it.Text ?? `Option ${idx+1}`)
              }));
            }
          } else if (raw && typeof raw === 'object') {
            // single object case - Text may contain JSON describing options
            const parsed = parseJsonSafe(raw.Text || raw.TextN || raw.SettingJSON || raw.Value || '');
            if (parsed) {
              if (Array.isArray(parsed.leftTabs)) {
                opts = parsed.leftTabs.map((t, idx) => ({ value: String(t.name ?? idx), label: String(t.text ?? t.name ?? `Option ${idx+1}`) }));
              } else if (Array.isArray(parsed)) {
                opts = parsed.map((p, idx) => ({ value: String(p.Id ?? p.id ?? p.value ?? idx), label: String(p.Name ?? p.name ?? p.label ?? p.text ?? `Option ${idx+1}`) }));
              } else {
                // If parsed is an object but not an array, stringify a useful label
                opts = [{ value: String(parsed.Id ?? parsed.id ?? raw.Id ?? 0), label: String(parsed.Name ?? parsed.Title ?? raw.Text ?? 'Option 1') }];
              }
            } else {
              // fallback: use raw object fields
              opts = [{ value: String(raw.Id ?? raw.ID ?? 0), label: String(raw.Text ?? raw.Name ?? 'Option 1') }];
            }
          }
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
