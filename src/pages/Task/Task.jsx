import React, { useMemo, useState, useEffect } from 'react';
import { Settings, MoreHorizontal } from 'lucide-react';
import RowActionMenu from '../../components/RowActionMenu';
import EllipsisMenu from '../../components/EllipsisMenu';
import TaskDrawer from '../../components/TaskDrawer';
import CommentModal from '../../components/CommentModal';

const SAMPLE = [
  {
    id: 1,
    title: 'NewTask_20251118092825',
    desc: 'test',
    due: '29 Nov 2025 10:43:00',
    related: 'Mr. Ham Bim',
    owner: 'Abhishek Kumar (32222-Abhi)'
  },
  {
    id: 2,
    title: 'NewTask_20251110214516',
    desc: 'NewTask_20251110214516NewTask_2...',
    due: '11 Nov 2025 23:00:00',
    related: 'Lead0811',
    owner: 'Abhishek Kumar (Abhi01)'
  },
  {
    id: 3,
    title: 'NewTask_20251110112502',
    desc: 'NewTask_20251110112502',
    due: '11 Nov 2025 12:40:00',
    related: 'Lead0811',
    owner: 'Abhishek Kumar (Abhi01)'
  }
];

const FILTERS = ['open', 'overdue', 'completed', 'all'];

const Task = () => {
  const [filter, setFilter] = useState('open');
  const [selected, setSelected] = useState(() => new Set());
  const [menuRow, setMenuRow] = useState(null);
  const [ellipsisRow, setEllipsisRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElEllipsis, setAnchorElEllipsis] = useState(null);

  const data = useMemo(() => {
    // For demo purposes we don't compute actual overdue/completed state
    if (filter === 'all') return SAMPLE;
    if (filter === 'open') return SAMPLE;
    if (filter === 'overdue') return SAMPLE.filter((_, i) => i % 2 === 0);
    if (filter === 'completed') return SAMPLE.filter((_, i) => i % 2 === 1);
    return SAMPLE;
  }, [filter]);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) => {
      if (prev.size === data.length) return new Set();
      return new Set(data.map((d) => d.id));
    });
  };

  const onAction = (action, row) => {
    // Hook up real actions here
    // action could be 'edit', 'sendVoice', 'meeting', 'appointment'
    // we'll just alert for demo
    // Actions map
    if (action === 'view' || action === 'edit') {
      setDrawerMode(action === 'edit' ? 'edit' : 'view');
      setDrawerRow(row);
      setDrawerOpen(true);
    } else if (action === 'comment') {
      setCommentRow(row);
      setCommentOpen(true);
    } else {
      // default fallback demo behavior
      // eslint-disable-next-line no-alert
      alert(`${action} on ${row.title}`);
    }

    // close menus
    setMenuRow(null);
    setEllipsisRow(null);
    setAnchorEl(null);
    setAnchorElEllipsis(null);
  };

  // Drawer & Comment state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('view');
  const [drawerRow, setDrawerRow] = useState(null);

  const [commentOpen, setCommentOpen] = useState(false);
  const [commentRow, setCommentRow] = useState(null);

  useEffect(() => {
    const handleDocClick = () => {
      setMenuRow(null);
      setEllipsisRow(null);
      setAnchorEl(null);
      setAnchorElEllipsis(null);
    };
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {FILTERS.map((f) => (
            <label key={f} className="inline-flex items-center space-x-2">
              <input
                type="radio"
                name="task-filter"
                value={f}
                checked={filter === f}
                onChange={() => setFilter(f)}
              />
              <span className="capitalize text-sm">{f === 'all' ? 'Show All' : f}</span>
            </label>
          ))}
        </div>
        <div className="text-sm text-gray-500">1 to {data.length} of {SAMPLE.length} entries</div>
      </div>

      <div className="bg-white rounded border">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input type="checkbox" onChange={toggleSelectAll} checked={selected.size === data.length && data.length>0} />
              </th>
              <th className="px-4 py-3 text-left">Task</th>
              <th className="px-4 py-3 text-left">Related to</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 relative">
                <td className="px-4 py-4 align-top">
                  <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleSelect(row.id)} />
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="font-semibold">{row.title}</div>
                  <div className="text-sm text-gray-500">{row.desc}</div>
                  <div className="text-xs text-gray-400 mt-1">Due: {row.due}</div>
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">{row.related.charAt(0)}</div>
                    <div>
                      <div className="font-semibold">{row.related}</div>
                      <div className="text-sm text-gray-500">Owner : {row.owner}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 align-top relative">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setMenuRow(menuRow === row.id ? null : row.id); setAnchorEl(e.currentTarget); }}
                      className="p-2 rounded hover:bg-gray-100"
                      aria-label="more"
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEllipsisRow(ellipsisRow === row.id ? null : row.id); setAnchorElEllipsis(e.currentTarget); }}
                      className="p-2 rounded hover:bg-gray-100"
                      aria-label="settings"
                    >
                      <Settings className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {menuRow === row.id && (
                    <RowActionMenu show={true} anchorRef={{ current: anchorEl }} onAction={(act) => onAction(act, row)} menuId={`row-menu-${row.id}`} onClose={() => { setMenuRow(null); setAnchorEl(null); }} />
                  )}

                  {ellipsisRow === row.id && (
                    <EllipsisMenu show={true} anchorRef={{ current: anchorElEllipsis }} onAction={(act) => onAction(act, row)} menuId={`ellipsis-menu-${row.id}`} onClose={() => { setEllipsisRow(null); setAnchorElEllipsis(null); }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer for view/edit */}
      <TaskDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        row={drawerRow}
        mode={drawerMode}
        onSave={(updated) => {
          // demo: update local SAMPLE data would require lifting state; for now show alert
          // eslint-disable-next-line no-alert
          alert('Saved: ' + JSON.stringify(updated));
        }}
      />

      {/* Comment modal */}
      <CommentModal
        isOpen={commentOpen}
        onClose={() => setCommentOpen(false)}
        row={commentRow}
        onSubmit={(text) => {
          // demo: show alert
          // eslint-disable-next-line no-alert
          alert('Comment submitted: ' + text);
        }}
      />
    </div>
  );
};

export default Task;
