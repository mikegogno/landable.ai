import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  User,
  Settings,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Resumes', path: '/dashboard/resume' },
    { icon: MessageSquare, label: 'Cover Letters', path: '/dashboard/cover-letter' },
    { icon: User, label: 'Portfolio', path: '/dashboard/portfolio' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];
  
  return (
    <div className={cn(
      "bg-white border-r min-h-screen flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center">
            <span className="font-bold text-xl text-primary">Landable</span>
            <span className="font-bold text-xl">.ai</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      {/* User Info */}
      <div className="p-4 border-b">
        {!collapsed ? (
          <div>
            <p className="font-medium truncate">
              {user?.email}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.email?.split('@')[0] || 'User'}
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) => cn(
                  "flex items-center rounded-md px-3 py-2 hover:bg-gray-100 transition-colors",
                  isActive ? "bg-primary/10 text-primary font-medium" : "text-gray-700"
                )}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Version */}
      <div className="p-4 text-xs text-gray-400 border-t">
        {!collapsed && "v1.0.0"}
      </div>
    </div>
  );
}