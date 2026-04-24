import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar  from './Topbar.jsx';

const styles = {
  app: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg)',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    marginLeft: 'var(--sidebar-w)',
  },
  content: {
    flex: 1,
    padding: '28px 32px',
    overflowY: 'auto',
  },
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={styles.app}>
      <Sidebar />
      <div style={styles.main}>
        <Topbar onMenuClick={() => setSidebarOpen(v => !v)} />
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
