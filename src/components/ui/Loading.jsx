import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, type = "default" }) => {
  if (type === "skeleton") {
    return (
      <div className={cn("animate-pulse space-y-4", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className={cn("animate-pulse space-y-6", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className={cn("animate-pulse space-y-4", className)}>
        <div className="bg-gray-200 rounded-xl h-12"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-xl h-16"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary-500 animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-r-accent-500 animate-spin animate-reverse"></div>
      </div>
    </div>
  );
};

export default Loading;