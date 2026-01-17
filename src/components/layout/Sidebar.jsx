import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome, FiUsers, FiUserPlus, FiCalendar, FiPhone, FiTarget,
  FiCheckSquare, FiMapPin, FiActivity, FiStar, FiTrello, FiClock,
  FiFileText, FiDollarSign, FiCreditCard, FiBook,
  FiLogOut, FiChevronDown, FiChevronRight
} from 'react-icons/fi';
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import clsx from 'clsx';
import { THEME } from '../../config/constants';
import { IoMdSync } from "react-icons/io";
import { CopyPlus, ListFilterPlus, Merge } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, collapsed = false, setCollapsed = null, isLocked = false, onMouseEnter, onMouseLeave }) => {
  const location = useLocation();
  const navigate = useNavigate()
  const username = localStorage.getItem('FName') || 'User';
  const [expandedMenus, setExpandedMenus] = useState({});

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Enquiries', href: '/enquiries', icon: FiUsers },
    { name: 'Leads', href: '/leads', icon: FiUserPlus },
    { name: 'Merge Duplicate', href: '/merge', icon: Merge },
    { name: 'Conversions', href: '/conversions', icon: IoMdSync },
    { name: 'Follow-ups', href: '/followups', icon: HiOutlineRocketLaunch },
    { name: 'Segmentation', href: '/segments', icon: FiUsers },
    { name: 'Call List', href: '/call-list', icon: FiPhone },
    { name: 'Tasks', href: '/tasks', icon: FiCheckSquare },
    { name: 'Appointments', href: '/appointments', icon: FiCalendar },
    { name: 'Physical Appointments', href: '/physical-appointments', icon: FiMapPin },
    { name: 'Lead Activities', href: '/activities', icon: FiActivity },
    {
      name: 'Custom Events',
      icon: FiStar,
      subItems: [
        { name: 'Create Event', href: '/custom-events/create', icon: CopyPlus },
        { name: 'Webhook Events', href: '/custom-events/webhook', icon: ListFilterPlus }
      ]
    },
    { name: 'Pipeline Deal', href: '/pipeline', icon: FiTrello },
    { name: 'Pipeline History', href: '/pipeline-history', icon: FiClock },
    { name: 'Quotations', href: '/quotations', icon: FiFileText },
    { name: 'Invoices', href: '/invoices', icon: FiFileText },
    { name: 'Revenue', href: '/revenue', icon: FiDollarSign },
    { name: 'Credit Notes', href: '/credit-notes', icon: FiCreditCard },
    { name: 'Customer Ledger', href: '/ledger', icon: FiBook }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-30 transform transition-all duration-300 ease-in-out border-r',
          isOpen ? 'w-64' : 'w-16',
          'bg-white lg:static'
        )}
        style={{ borderColor: '#e6edf0' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 bg-white">
            <h1 className={clsx('font-bold text-gray-900 transition-all', isOpen ? 'text-xl' : 'text-xs')}>{isOpen ? 'Sales CRM' : 'CRM'}</h1>
            <div className={clsx('flex items-center gap-2', !isOpen && 'hidden')}>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenus[item.name];
              const isSubItemActive = hasSubItems && item.subItems.some(sub => location.pathname === sub.href);

              if (hasSubItems) {
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      title={item.name}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full',
                        !isOpen ? 'justify-center' : '',
                        isSubItemActive ? 'text-white' : 'text-gray-700'
                      )}
                      style={isSubItemActive ? { backgroundColor: THEME.primary } : {}}
                    >
                      <item.icon className="w-5 h-5 shrink-0" style={isSubItemActive ? { color: '#fff' } : { color: '#4a5568' }} />
                      <span className={clsx(!isOpen ? 'hidden' : 'flex-1 text-left text-gray-700', isSubItemActive && 'text-white')}>{item.name}</span>
                      {isOpen && (
                        isExpanded ?
                          <FiChevronDown className="w-4 h-4 shrink-0" style={isSubItemActive ? { color: '#fff' } : { color: '#4a5568' }} /> :
                          <FiChevronRight className="w-4 h-4 shrink-0" style={isSubItemActive ? { color: '#fff' } : { color: '#4a5568' }} />
                      )}
                    </button>
                    {isExpanded && isOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.subItems.map((subItem) => {
                          const isSubActive = location.pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              title={subItem.name}
                              className={clsx(
                                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                isSubActive ? 'text-white bg-opacity-80' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                              )}
                              style={isSubActive ? { backgroundColor: THEME.primary } : {}}
                            >
                              <subItem.icon className="w-4 h-4 shrink-0" style={isSubActive ? { color: '#fff' } : { color: '#4a5568' }} />
                              <span className={clsx('text-gray-700', isSubActive && 'text-white')}>{subItem.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  title={item.name}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    !isOpen ? 'justify-center' : '',
                    isActive ? 'text-white' : 'text-gray-700'
                  )}
                  style={isActive ? { backgroundColor: THEME.primary } : {}}
                >
                  <item.icon className="w-5 h-5 shrink-0" style={isActive ? { color: '#fff' } : { color: '#4a5568' }} />
                  <span className={clsx(!isOpen ? 'hidden' : 'inline text-gray-700', isActive && 'text-white')}>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-800">
            <div className={clsx('flex items-center gap-3 mb-3', !isOpen ? 'justify-center' : '')}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
                style={{ backgroundColor: THEME.primary }}
              >
                {username.charAt(0).toUpperCase()}
              </div>
              {isOpen && (
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#111]">{username}</p>
                  {/* <p className="text-xs text-gray-400">Role</p> */}
                </div>
              )}
            </div>
            <button
              onClick={logout}
              title="Logout"
              className={clsx('flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors', !isOpen ? 'justify-center' : '')}
            >
              <FiLogOut className="w-5 h-5 shrink-0" />
              {isOpen && 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
