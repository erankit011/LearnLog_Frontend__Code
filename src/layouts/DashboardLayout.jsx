import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LayoutDashboard, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { getAvatarUrl } from '../utils/getAvatarUrl';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Journal', href: '/journal', icon: BookOpen },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-semibold text-gray-900">LearnLog</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50 font-medium'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {user?.avatar ? (
                  <img
                    src={getAvatarUrl(user.avatar)}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.nextElementSibling;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : (
                  <span className="text-blue-700 font-semibold text-sm">
                    {user?.fullName?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                  {user?.fullName || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm sm:text-base"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-white border-b-2 border-gray-200">
          <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg active:scale-95 transition-all"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            </button>
            <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
              {navigation.find((item) => isActive(item.href))?.name || 'Dashboard'}
            </h1>
            <div className="w-8 lg:hidden" />
          </div>
        </header>

        <main className="p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
