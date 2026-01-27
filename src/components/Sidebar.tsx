// src/components/Sidebar.tsx
import React from 'react';
import { MessageSquare, Settings, User, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

export interface SidebarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export interface SidebarProps {
  items?: SidebarItem[];
}

/**
 * Left app sidebar with navigation icons and connection status.
 * Teams-style narrow column with hover states and keyboard support.
 */
const Sidebar: React.FC<SidebarProps> = ({ items = [] }) => {
  const user = useSelector((s: RootState) => s.auth.user);
  // Default to 'connected' status since connection slice doesn't exist yet
  const connectionStatus = 'connected';

  const defaultItems: SidebarItem[] = [
    { id: 'chat', icon: <MessageSquare size={20} />, label: 'Chat', active: true },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const sidebarItems = items.length ? items : defaultItems;

  const getConnectionIcon = () => {
    switch (connectionStatus as string) {
      case 'connected':
        return <Wifi size={16} className="text-green-500" />;
      case 'reconnecting':
        return <Loader2 size={16} className="text-yellow-500 animate-spin" />;
      case 'offline':
        return <WifiOff size={16} className="text-red-500" />;
      default:
        return <WifiOff size={16} className="text-gray-400" />;
    }
  };

  return (
    <aside className="w-16 bg-secondary flex flex-col items-center py-4">
      {/* App Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <MessageSquare size={24} className="text-white" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1" role="navigation" aria-label="Main">
        <ul className="space-y-2" role="list">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                  item.active
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                onClick={item.onClick}
                aria-label={item.label}
                title={item.label}
              >
                {item.icon}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Connection Status */}
      <div className="mb-4 flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center"
          title={`Connection: ${connectionStatus}`}
        >
          {getConnectionIcon()}
        </div>
      </div>

      {/* User Avatar */}
      <div className="flex items-center justify-center">
        <div
          className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold text-sm"
          title={user?.username || 'Guest'}
        >
          {user?.username?.charAt(0).toUpperCase() || <User size={20} />}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
