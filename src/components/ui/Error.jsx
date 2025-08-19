import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className,
  type = "default"
}) => {
  if (type === "inline") {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <div className="text-center space-y-3">
          <ApperIcon name="AlertTriangle" size={48} className="text-red-400 mx-auto" />
          <p className="text-red-600 font-medium">{message}</p>
          {onRetry && (
            <Button variant="danger" size="sm" onClick={onRetry}>
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <Card className="max-w-md w-full mx-4">
        <CardContent className="text-center py-12">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name="AlertTriangle" size={32} className="text-red-500" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Oops! Something went wrong</h3>
              <p className="text-gray-600">{message}</p>
            </div>

            {onRetry && (
              <div className="space-y-3">
                <Button variant="danger" onClick={onRetry} className="w-full">
                  <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                  Try Again
                </Button>
                <p className="text-sm text-gray-500">
                  If the problem persists, please refresh the page
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Error;