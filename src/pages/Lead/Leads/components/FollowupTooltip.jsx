import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getFollowupsByLeadId } from '../../../../utils/lead';
import { getSession } from '../../../../getSession';

const FollowupTooltip = ({ lead, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const [followupData, setFollowupData] = useState({
    status: lead?.FollowupStatus || 'Call-Back',
    date: lead?.FollowupDate || new Date().toISOString().split('T')[0],
    time: lead?.FollowupTime || '01:15:00',
    assignedTo: lead?.AssignedTo || 'Abhi01 (Abhishek Kumar)',
    remarks: lead?.Remarks || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showTooltip && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 8
      });
    }
  }, [showTooltip]);

  useEffect(() => {
    if (!lead) return;
    let mounted = true;
    const fetchFollowups = async () => {
      setIsLoading(true);
      try {
        const { userId, TokenId } = getSession();
        const payload = {
          Token: TokenId,
          Message: "",
          LoggedUserId: userId,
          MAC_Address: "",
          IP_Address: "",
          Details: { LeadId: lead.LeadId || lead.ID || lead.Id || lead.id },
          BroadcastName: ""
        };
        const resp = await getFollowupsByLeadId(payload);
        let raw = resp?.Details ?? resp?.d ?? resp ?? [];
        if (typeof raw === 'string') {
          try { raw = JSON.parse(raw); } catch (e) { /* keep as-is */ }
        }
        if (raw && raw.data) raw = raw.data;
        const arr = Array.isArray(raw) ? raw : [];
        const first = arr[0] || null;
        if (mounted && first) {
          setFollowupData({
            status: first.FollowupStatus || first.Status || lead?.FollowupStatus || 'Call-Back',
            date: first.FollowupDate || first.Date || lead?.FollowupDate || new Date().toISOString().split('T')[0],
            time: first.FollowupTime || first.Time || lead?.FollowupTime || '01:15:00',
            assignedTo: first.AssignedTo || first.AssignedUser || lead?.AssignedTo || 'Abhi01 (Abhishek Kumar)',
            remarks: first.Remarks || first.Note || lead?.Remarks || ''
          });
        }
      } catch (error) {
        console.error('FollowupTooltip fetch error:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchFollowups();
    return () => { mounted = false; };
  }, [lead]);

  const tooltipContent = showTooltip && createPortal(
    <div 
      className="fixed z-[9999] w-64 bg-white border-2 border-blue-400 rounded-lg shadow-xl p-3"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateY(-50%)'
      }}
    >
      {/* Arrow pointing to the left */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l-2 border-b-2 border-blue-400 transform rotate-45"></div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <span className="font-semibold text-gray-700">Followup Details</span>
        </div>
        
        <div className="space-y-1.5">
          {isLoading && (
            <div className="py-4 text-center text-sm text-gray-500">Loading...</div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Status</span>
            <span className="text-gray-900">{followupData.status}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Date</span>
            <span className="text-gray-900">{followupData.date}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Time</span>
            <span className="text-gray-900">{followupData.time}</span>
          </div>
          
          <div className="flex flex-col gap-1 border-t border-gray-200 pt-1.5">
            <span className="text-gray-600 font-medium">AssignedTo</span>
            <span className="text-gray-900">{followupData.assignedTo}</span>
          </div>
          
          <div className="flex flex-col gap-1 border-t border-gray-200 pt-1.5">
            <span className="text-gray-600 font-medium">Remarks</span>
            <span className="text-gray-900">{followupData.remarks}</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </div>
      {tooltipContent}
    </div>
  );
};

export default FollowupTooltip;
