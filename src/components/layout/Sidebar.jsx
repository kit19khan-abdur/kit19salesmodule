import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiUserPlus, FiCalendar, FiPhone, FiTarget,
  FiCheckSquare, FiMapPin, FiActivity, FiStar, FiTrello, FiClock,
  FiFileText, FiDollarSign, FiCreditCard, FiBook,
  FiLogOut
} from 'react-icons/fi';
import clsx from 'clsx';
import { THEME } from '../../config/constants';

const Sidebar = ({ isOpen, setIsOpen, collapsed = false, setCollapsed = null, isLocked = false, onMouseEnter, onMouseLeave }) => {
  const location = useLocation();
  const navigate = useNavigate()
  const username = localStorage.getItem('FName') || 'User';

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Enquiries', href: '/enquiries', icon: FiUsers },
    { name: 'Leads', href: '/leads', icon: FiUserPlus },
    { name: 'Follow-ups', href: '/followups', icon: FiCalendar },
    { name: 'Conversions', href: '/conversions', icon: FiTarget },
    { name: 'Segmentation', href: '/segments', icon: FiUsers },
    { name: 'Call List', href: '/call-list', icon: FiPhone },
    { name: 'Tasks', href: '/tasks', icon: FiCheckSquare },
    { name: 'Appointments', href: '/appointments', icon: FiCalendar },
    { name: 'Physical Appointments', href: '/physical-appointments', icon: FiMapPin },
    { name: 'Activities', href: '/activities', icon: FiActivity },
    { name: 'Custom Events', href: '/custom-events', icon: FiStar },
    { name: 'Pipeline', href: '/pipeline', icon: FiTrello },
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
