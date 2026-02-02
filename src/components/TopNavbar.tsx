// src/components/TopNavbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { logout } from '../auth/authSlice';

interface TopNavbarProps {
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onProfileClick, onSettingsClick }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    setDropdownOpen(false);
    void dispatch(logout());
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    onProfileClick?.();
  };

  const handleSettingsClick = () => {
    setDropdownOpen(false);
    onSettingsClick?.();
  };

  return (
    <header className="top-navbar">
      <div className="top-navbar-left">
        <h1 className="top-navbar-title">Secure Messenger</h1>
      </div>
      <div className="top-navbar-right" ref={dropdownRef}>
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
            <div className="top-navbar-dropdown-header" role="menuitem">
              <div className="top-navbar-dropdown-avatar">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="top-navbar-dropdown-info">
                <span className="top-navbar-dropdown-name">{user?.displayName || user?.username}</span>
                <span className="top-navbar-dropdown-email">{user?.email || 'No email'}</span>
              </div>
            </div>
            <hr className="top-navbar-dropdown-divider" />
            <button
              type="button"
              className="top-navbar-dropdown-item"
              onClick={handleProfileClick}
              role="menuitem"
            >
              <User size={16} />
              <span>My Profile</span>
            </button>
            <button
              type="button"
              className="top-navbar-dropdown-item"
              onClick={handleSettingsClick}
              role="menuitem"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
            <hr className="top-navbar-dropdown-divider" />
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
