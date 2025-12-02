import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Header } from "@/components/organisms/Header";
import ApperIcon from "@/components/ApperIcon";

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

const navigation = [
    { name: 'Pipeline', path: '/', icon: 'BarChart3' },
    { name: 'Companies', path: '/companies', icon: 'Building2' },
    { name: 'Contacts', path: '/contacts', icon: 'Users' },
    { name: 'Tasks', path: '/tasks', icon: 'CheckSquare' },
    { name: 'Quotes', path: '/quotes', icon: 'FileText' },
    { name: 'Sales Orders', path: '/sales-orders', icon: 'ShoppingCart' },
  ];

  const getPageTitle = () => {
    const currentNav = navigation.find(nav => 
      nav.path === location.pathname || (nav.path === '/' && location.pathname === '/pipeline')
    );
    return currentNav?.name || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-navy-600 transform transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0 md:z-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            <div className="flex items-center px-6 py-4 border-b border-navy-500">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-coral-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="ml-2 text-white font-semibold text-lg">Pipeline Pro</span>
              </div>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = item.path === location.pathname || 
                  (item.path === '/' && (location.pathname === '/' || location.pathname === '/pipeline'));
                
                return (
                  <a
                    key={item.name}
                    href={item.path}
                    className={`
                      flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-navy-500 text-white'
                        : 'text-gray-300 hover:bg-navy-500 hover:text-white'
                      }
                    `}
                  >
                    <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile backdrop */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
)}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Header 
            title={getPageTitle()}
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isMobileMenuOpen={isMobileMenuOpen}
          />
          
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}