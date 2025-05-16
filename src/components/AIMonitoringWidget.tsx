import React, { useState, useEffect } from 'react';
import { Eye, Camera, Mic, Computer, AlertCircle } from 'lucide-react';

interface AIMonitoringWidgetProps {
  compact?: boolean;
}

const AIMonitoringWidget: React.FC<AIMonitoringWidgetProps> = ({ compact = false }) => {
  const [faceStatus, setFaceStatus] = useState<'ok' | 'warning' | 'error'>('ok');
  const [eyeStatus, setEyeStatus] = useState<'ok' | 'warning' | 'error'>('ok');
  const [audioStatus, setAudioStatus] = useState<'ok' | 'warning' | 'error'>('ok');
  const [tabStatus, setTabStatus] = useState<'ok' | 'warning' | 'error'>('ok');
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  
  // Simulate AI monitoring status changes
  useEffect(() => {
    const simulateMonitoring = () => {
      // Randomly change statuses for demonstration
      const randomStatus = () => {
        const rand = Math.random();
        if (rand < 0.7) return 'ok';
        if (rand < 0.9) return 'warning';
        return 'error';
      };
      
      // Face detection
      const newFaceStatus = randomStatus() as 'ok' | 'warning' | 'error';
      setFaceStatus(newFaceStatus);
      
      // Eye tracking
      const newEyeStatus = randomStatus() as 'ok' | 'warning' | 'error';
      setEyeStatus(newEyeStatus);
      
      // Audio monitoring
      const newAudioStatus = randomStatus() as 'ok' | 'warning' | 'error';
      setAudioStatus(newAudioStatus);
      
      // Tab switching detection
      const newTabStatus = randomStatus() as 'ok' | 'warning' | 'error';
      setTabStatus(newTabStatus);
      
      // Set warning message based on statuses
      if (newFaceStatus === 'error') {
        setWarningMessage('Face not detected. Please position yourself in front of the camera.');
      } else if (newEyeStatus === 'error') {
        setWarningMessage('Looking away from screen detected. Please focus on the exam.');
      } else if (newAudioStatus === 'error') {
        setWarningMessage('Unusual audio detected. Please maintain silence during the exam.');
      } else if (newTabStatus === 'error') {
        setWarningMessage('Tab switching detected. This activity is being logged.');
      } else if (newFaceStatus === 'warning' || newEyeStatus === 'warning' || newAudioStatus === 'warning' || newTabStatus === 'warning') {
        setWarningMessage('Please ensure you remain visible and focused during the exam.');
      } else {
        setWarningMessage(null);
      }
    };
    
    const interval = setInterval(simulateMonitoring, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Status indicator
  const getStatusIndicator = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok':
        return 'monitoring-active';
      case 'warning':
        return 'monitoring-warning';
      case 'error':
        return 'monitoring-error';
    }
  };
  
  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className={`monitoring-indicator ${getStatusIndicator(
          [faceStatus, eyeStatus, audioStatus, tabStatus].includes('error') ? 'error' :
          [faceStatus, eyeStatus, audioStatus, tabStatus].includes('warning') ? 'warning' : 'ok'
        )}`}>●</div>
        <span className="text-xs font-medium">
          {[faceStatus, eyeStatus, audioStatus, tabStatus].includes('error') ? 'Issue Detected' :
           [faceStatus, eyeStatus, audioStatus, tabStatus].includes('warning') ? 'Warning' : 'All Systems Active'}
        </span>
      </div>
    );
  }
  
  return (
    <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
      <h3 className="text-sm font-medium mb-3">AI Monitoring Status</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center">
          <Camera size={16} className="mr-2" />
          <span className="text-xs mr-2">Face Detection:</span>
          <span className={`monitoring-indicator ${getStatusIndicator(faceStatus)}`}>●</span>
        </div>
        
        <div className="flex items-center">
          <Eye size={16} className="mr-2" />
          <span className="text-xs mr-2">Eye Tracking:</span>
          <span className={`monitoring-indicator ${getStatusIndicator(eyeStatus)}`}>●</span>
        </div>
        
        <div className="flex items-center">
          <Mic size={16} className="mr-2" />
          <span className="text-xs mr-2">Audio Analysis:</span>
          <span className={`monitoring-indicator ${getStatusIndicator(audioStatus)}`}>●</span>
        </div>
        
        <div className="flex items-center">
          <Computer size={16} className="mr-2" />
          <span className="text-xs mr-2">Tab Monitor:</span>
          <span className={`monitoring-indicator ${getStatusIndicator(tabStatus)}`}>●</span>
        </div>
      </div>
      
      {warningMessage && (
        <div className="mt-2 p-2 bg-warning/10 dark:bg-warning/20 text-warning rounded flex items-start">
          <AlertCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-xs">{warningMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AIMonitoringWidget;