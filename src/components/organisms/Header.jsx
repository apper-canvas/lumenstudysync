import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, className }) => {
  return (
    <header className={cn("bg-white border-b border-gray-200 px-4 py-4 lg:px-6", className)}>
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="p-2"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          <div className="ml-4">
            <h1 className="text-lg font-semibold text-gray-900">StudySync</h1>
          </div>
        </div>

        {/* Desktop title */}
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold text-gray-900">Academic Dashboard</h1>
          <p className="text-sm text-gray-600">Manage your studies efficiently</p>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ApperIcon name="Bell" size={20} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ApperIcon name="Settings" size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;