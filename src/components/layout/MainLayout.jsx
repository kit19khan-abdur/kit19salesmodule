import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarLocked, setSidebarLocked] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const v = localStorage.getItem('sidebarCollapsed');
      return v === 'true';
    } catch (e) { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem('sidebarCollapsed', sidebarCollapsed); } catch (e) { }
  }, [sidebarCollapsed]);

  const toggleSidebarLock = () => {
    setSidebarLocked(prev => !prev);
    if (sidebarLocked) {
      // If unlocking, close the sidebar
      setSidebarOpen(false);
    } else {
      // If locking, open the sidebar
      setSidebarOpen(true);
    }
  };

  const handleSidebarMouseEnter = () => {
    if (!sidebarLocked) {
      setSidebarHovered(true);
      setSidebarOpen(true);
    }
  };

  const handleSidebarMouseLeave = () => {
    if (!sidebarLocked) {
      setSidebarHovered(false);
      setSidebarOpen(false);
    }
  };

  const effectiveSidebarOpen = sidebarLocked || sidebarHovered || sidebarOpen;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={effectiveSidebarOpen}
        setIsOpen={setSidebarOpen}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        isLocked={sidebarLocked}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          setSidebarOpen={setSidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          toggleSidebarLock={toggleSidebarLock}
          sidebarLocked={sidebarLocked}
        />

        <main className="flex-1 overflow-y-auto pt-1 pl-1 lg:pl-1 lg:pt-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
