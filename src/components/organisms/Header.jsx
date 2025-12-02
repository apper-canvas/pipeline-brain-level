import React from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

export const Header = ({ title, onMenuToggle, isMobileMenuOpen }) => {
  const { user } = useSelector(state => state.user);
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-surface border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
        </button>
        
        <h1 className="text-xl font-semibold text-gray-800 ml-4 md:ml-0">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-700">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500">{user.emailAddress}</p>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ApperIcon name="LogOut" size={16} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg text-gray-700 hover:bg-gray-100">
            <ApperIcon name="Bell" className="w-5 h-5" />
          </button>
          
          <button className="p-2 rounded-lg text-gray-700 hover:bg-gray-100">
            <ApperIcon name="Settings" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;