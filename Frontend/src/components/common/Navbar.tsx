import React from 'react';
import { LogOut, Bell, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';

const Navbar: React.FC = () => {
  const { fullName, role, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">TechV Learning</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-medium">
            {fullName ? getInitials(fullName) : <User size={16} />}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{fullName}</p>
            <p className="text-xs text-gray-400 capitalize">{role?.toLowerCase()}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
