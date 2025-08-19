import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ProgressRing from "@/components/molecules/ProgressRing";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const StudyTimerWidget = ({ className }) => {
  // Timer states
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [session, setSession] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings
  const [workDuration, setWorkDuration] = useState(25); // minutes
  const [shortBreakDuration, setShortBreakDuration] = useState(5); // minutes
  const [longBreakDuration, setLongBreakDuration] = useState(15); // minutes
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Calculate current session duration
  const getCurrentDuration = () => {
    if (isBreak) {
      return session % sessionsUntilLongBreak === 0 
        ? longBreakDuration * 60 
        : shortBreakDuration * 60;
    }
    return workDuration * 60;
  };

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  // Handle session completion
  const handleSessionComplete = () => {
    setIsRunning(false);
    
    if (isBreak) {
      // Break finished, start new work session
      setIsBreak(false);
      setSession(prev => prev + 1);
      setTimeLeft(workDuration * 60);
      toast.success(`Break finished! Starting session ${session + 1}`);
    } else {
      // Work session finished, start break
      setIsBreak(true);
      const isLongBreak = session % sessionsUntilLongBreak === 0;
      const breakDuration = isLongBreak ? longBreakDuration : shortBreakDuration;
      setTimeLeft(breakDuration * 60);
      
      toast.success(
        `Session ${session} completed! ${isLongBreak ? 'Long' : 'Short'} break time (${breakDuration} min)`
      );
    }
  };

  // Timer controls
  const startTimer = () => {
    setIsRunning(true);
    if (!isBreak && timeLeft === workDuration * 60) {
      toast.info(`Starting session ${session} (${workDuration} minutes)`);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setSession(1);
    setTimeLeft(workDuration * 60);
    toast.info('Timer reset');
  };

  // Apply settings
  const applySettings = () => {
    setIsRunning(false);
    setIsBreak(false);
    setSession(1);
    setTimeLeft(workDuration * 60);
    setShowSettings(false);
    toast.success('Timer settings updated');
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const progress = ((getCurrentDuration() - timeLeft) / getCurrentDuration()) * 100;

  return (
    <Card className={cn("relative", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Clock" size={20} />
            Study Timer
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            icon="Settings"
            className="h-8 w-8 p-0"
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="flex flex-col items-center space-y-4">
          <ProgressRing
            progress={progress}
            size={120}
            strokeWidth={8}
            color={isBreak ? "success" : "primary"}
            showTime={true}
            timeText={formatTime(timeLeft)}
            className="mx-auto"
          />
          
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600">
              {isBreak ? (
                session % sessionsUntilLongBreak === 0 ? 'Long Break' : 'Short Break'
              ) : (
                `Session ${session}`
              )}
            </div>
            <div className="text-xs text-gray-500">
              {session > 1 && `${session - 1} completed`}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          {!isRunning ? (
            <Button
              variant="primary"
              onClick={startTimer}
              icon="Play"
              size="sm"
            >
              Start
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={pauseTimer}
              icon="Pause"
              size="sm"
            >
              Pause
            </Button>
          )}
          
          <Button
            variant="ghost"
            onClick={resetTimer}
            icon="RotateCcw"
            size="sm"
          >
            Reset
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="border-t pt-4 space-y-3">
            <div className="text-sm font-medium text-gray-700">Timer Settings</div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-600 mb-1">Work (min)</label>
                <select
                  value={workDuration}
                  onChange={(e) => setWorkDuration(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {[15, 20, 25, 30, 45, 60].map(min => (
                    <option key={min} value={min}>{min}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-600 mb-1">Short Break (min)</label>
                <select
                  value={shortBreakDuration}
                  onChange={(e) => setShortBreakDuration(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {[5, 10, 15].map(min => (
                    <option key={min} value={min}>{min}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-600 mb-1">Long Break (min)</label>
                <select
                  value={longBreakDuration}
                  onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {[15, 20, 25, 30].map(min => (
                    <option key={min} value={min}>{min}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-600 mb-1">Sessions to Long Break</label>
                <select
                  value={sessionsUntilLongBreak}
                  onChange={(e) => setSessionsUntilLongBreak(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {[2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <Button
              variant="primary"
              onClick={applySettings}
              size="sm"
              className="w-full"
            >
              Apply Settings
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyTimerWidget;