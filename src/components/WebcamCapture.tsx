import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, AlertCircle, CheckCircle } from 'lucide-react';

interface WebcamCaptureProps {
  onCapture?: (imageSrc: string) => void;
  width?: number;
  height?: number;
  showControls?: boolean;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onCapture,
  width = 640,
  height = 480,
  showControls = true,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(true);

  // Video constraints
  const videoConstraints = {
    width,
    height,
    facingMode: 'user', // Front camera
  };

  // Handle camera errors
  const handleUserMediaError = useCallback((error: string | DOMException) => {
    let errorMessage = 'Failed to access camera';
    
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera access to continue.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please connect a camera and try again.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is in use by another application.';
      } else {
        errorMessage = `Camera error: ${error.message}`;
      }
    } else {
      errorMessage = `Camera error: ${error}`;
    }
    
    setError(errorMessage);
    setCameraActive(false);
  }, []);

  // Capture image from webcam
  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      if (onCapture) onCapture(imageSrc);
    }
  }, [onCapture]);

  // Retake photo
  const retake = useCallback(() => {
    setCapturedImage(null);
  }, []);
  
  // If we already captured an image, show it with retake option
  if (capturedImage) {
    return (
      <div className="flex flex-col items-center">
        <div className="relative overflow-hidden rounded-lg border-2 border-primary/50">
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="w-full h-auto"
            style={{ maxWidth: width, maxHeight: height }}
          />
          <div className="absolute top-2 right-2 bg-success/90 text-white p-1 rounded-full">
            <CheckCircle size={20} />
          </div>
        </div>
        
        {showControls && (
          <button
            onClick={retake}
            className="mt-4 btn btn-outline flex items-center"
          >
            <Camera size={16} className="mr-2" />
            Retake
          </button>
        )}
      </div>
    );
  }

  // If there's an error accessing the camera
  if (error) {
    return (
      <div className="flex flex-col items-center">
        <div 
          className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
          style={{ width, height: height || 'auto', minHeight: 240 }}
        >
          <AlertCircle size={40} className="text-error mb-4" />
          <p className="text-center text-error px-4">{error}</p>
        </div>
        
        {showControls && (
          <button
            onClick={() => {
              setError(null);
              setCameraActive(true);
            }}
            className="mt-4 btn btn-primary flex items-center"
          >
            <Camera size={16} className="mr-2" />
            Retry Camera Access
          </button>
        )}
      </div>
    );
  }

  // Render webcam component
  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden rounded-lg border-2 border-primary/50">
        {cameraActive && (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            width={width}
            height={height}
            onUserMediaError={handleUserMediaError}
            mirrored={true}
            className="w-full h-auto"
          />
        )}
        
        {/* Scanning effect overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border-4 border-primary/30 rounded-lg"></div>
          <div 
            className="absolute top-0 left-0 right-0 h-1 bg-primary/60"
            style={{
              animation: 'translateY 2s ease-in-out infinite',
              transformOrigin: 'top',
            }}
          ></div>
        </div>
      </div>
      
      {showControls && (
        <button
          onClick={capture}
          className="mt-4 btn btn-primary flex items-center"
        >
          <Camera size={16} className="mr-2" />
          Capture
        </button>
      )}
      
      <style jsx>{`
        @keyframes translateY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(${height}px); }
        }
      `}</style>
    </div>
  );
};

export default WebcamCapture;