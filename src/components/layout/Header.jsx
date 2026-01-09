import React, { useState, useEffect } from 'react';
import { FiMenu, FiBell, FiSettings } from 'react-icons/fi';
import { X, Check, Trash2, Mail, MailOpen } from 'lucide-react';
import clsx from 'clsx';
import { THEME } from '../../config/constants';
import { getSession } from '../../getSession';
import { getNotifications } from '../../utils/lead';

const Header = ({ setSidebarOpen, sidebarCollapsed, setSidebarCollapsed, toggleSidebarLock, sidebarLocked }) => {
  const user = { name: localStorage.getItem('FName') || 'User', email: localStorage.getItem('email') || 'user@example.com' };
  const displayName = localStorage.getItem('DisplayName') || 'User';
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotifLoading, setIsNotifLoading] = useState(false);

  const { userId, TokenId } = getSession();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    let mounted = true;
    const fetchNotifications = async () => {
      setIsNotifLoading(true);
      try {
        const payload = {
          Token: TokenId,
          Message: "",
          LoggedUserId: userId,
          MAC_Address: "",
          IP_Address: "",
          Details: { strUserID: String(userId || '0') },
          BroadcastName: ""
        };
        const resp = await getNotifications(payload);
        let raw = resp?.Details ?? resp?.d ?? resp ?? [];
        if (raw && raw.data) raw = raw.data;
        const arr = Array.isArray(raw) ? raw : [];
        // Map backend fields to the UI shape
        const mapped = arr.map((it, idx) => ({
          id: it.NotificationId || it.Id || it.ID || it.id || idx,
          title: it.Title || it.NotificationTitle || it.Event || it.Subject || 'Notification',
          message: it.Message || it.Description || it.Body || it.Msg || it.NotificationText || '',
          time: it.Time || it.CreatedOn || it.CreatedDate || it.Date || it.TimeStamp || '',
          isRead: (it.IsRead === 1 || it.IsRead === true || it.Read === true || String(it.IsRead) === '1') ? true : false,
          raw: it
        }));
        if (mounted) setNotifications(mapped);
      } catch (error) {
        console.error('fetchNotifications error:', error);
      } finally {
        if (mounted) setIsNotifLoading(false);
      }
    };
    fetchNotifications();
    return () => { mounted = false; };
  }, [userId, TokenId]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-6">
      <div className="flex items-center justify-between w-full">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <FiMenu className="w-6 h-6" />
          </button>

          {/* Desktop collapse/expand toggle */}
          <button
            onClick={toggleSidebarLock}
            className={clsx(
              "hidden lg:inline-flex items-center justify-center p-2 rounded transition",
              sidebarLocked ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"
            )}
            title={sidebarLocked ? 'Unlock sidebar (hover mode)' : 'Lock sidebar (always open)'}
          >
            <FiMenu className="w-5 h-5" />
          </button>

          {/* Search bar */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <span className="text-2xl font-extrabold text-green-600 leading-none uppercase">{displayName}</span>
              </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-gray-600 hover:text-gray-900"
            >
              <FiBell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popup */}
            {showNotifications && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                ></div>

                {/* Notification Panel */}
                <div className="absolute right-0 top-6 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
                  {/* Header */}
                  <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        Notifications
                        <span className="ml-2 text-sm font-normal text-gray-600">({notifications.length})</span>
                      </h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="p-1 hover:bg-white rounded-lg transition"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    {unreadCount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{unreadCount} unread</span>
                        <button onClick={markAllAsRead} className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Mark all as read
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="flex-1 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer group ${
                          !notification.isRead ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          {/* Icon */}
                          <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            {!notification.isRead ? (
                              <Mail className="w-5 h-5 text-blue-600" />
                            ) : (
                              <MailOpen className="w-5 h-5 text-gray-500" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="text-sm font-semibold text-gray-900 truncate pr-2">
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-1.5"></span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">{notification.time}</span>
                              
                              {/* Action buttons - show on hover */}
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                  className="p-1 hover:bg-blue-100 rounded transition"
                                  title="Mark as read"
                                >
                                  <Check className="w-4 h-4 text-blue-600" />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                                  className="p-1 hover:bg-red-100 rounded transition"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
                    <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2 hover:bg-blue-50 rounded-lg transition">
                      View All Notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
