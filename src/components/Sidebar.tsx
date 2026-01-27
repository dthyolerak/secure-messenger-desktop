// src/components/Sidebar.tsx
import React from 'react';
import { MessageSquare, Settings } from 'lucide-react';

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

const Sidebar: React.FC<SidebarProps> = ({ items = [] }) => {
  const defaultItems: SidebarItem[] = [
    { id: 'chat', icon: <MessageSquare size={20} />, label: 'Chat', active: true },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const sidebarItems = items.length ? items : defaultItems;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav" role="navigation" aria-label="Main">
        <ul className="sidebar-items" role="list">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`sidebar-item ${item.active ? 'active' : ''}`}
                onClick={item.onClick}
                aria-label={item.label}
                title={item.label}
              >
                <span className="sidebar-item-icon" aria-hidden>
                  {item.icon}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
