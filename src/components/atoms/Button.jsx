import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = React.forwardRef(
  ({ className, variant = "primary", size = "md", icon, iconPosition = "left", children, disabled, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-gradient-primary hover:shadow-lg hover:shadow-primary-500/25 text-white focus:ring-primary-500",
      secondary: "bg-white border-2 border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-600 focus:ring-primary-500",
      accent: "bg-gradient-accent hover:shadow-lg hover:shadow-accent-500/25 text-white focus:ring-accent-500",
      success: "bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-500",
      warning: "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500",
      danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
      ghost: "hover:bg-gray-100 text-gray-600 hover:text-gray-700 focus:ring-gray-500",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
      xl: "px-8 py-4 text-lg",
    };

    const iconSizes = {
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <ApperIcon name={icon} size={iconSizes[size]} className="mr-2" />
        )}
        {children}
        {icon && iconPosition === "right" && (
          <ApperIcon name={icon} size={iconSizes[size]} className="ml-2" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;