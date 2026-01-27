// src/components/TopNavbar.tsx
import React, { useState } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { logout } from '../auth/authSlice';

const TopNavbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    setDropdownOpen(false);
    void dispatch(logout());
  };

  return (
    <header className="top-navbar">
      <div className="top-navbar-left">
        <h1 className="top-navbar-title">Secure Messenger</h1>
      </div>
      <div className="top-navbar-right">
        <button
          type="button"
          className="top-navbar-user"
          onClick={() => setDropdownOpen((o) => !o)}
          aria-label="User menu"
          aria-expanded={dropdownOpen}
          aria-haspopup="menu"
        >
          <User size={20} />
          <span className="top-navbar-username">{user?.username}</span>
          <ChevronDown size={16} className={dropdownOpen ? 'rotate' : ''} />
        </button>
        {dropdownOpen && (
          <div className="top-navbar-dropdown" role="menu">
            <div className="top-navbar-dropdown-item" role="menuitem">
              <User size={16} />
              <span>{user?.username}</span>
            </div>
            <button
              type="button"
              className="top-navbar-dropdown-item top-navbar-dropdown-logout"
              onClick={handleLogout}
              role="menuitem"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNavbar;
