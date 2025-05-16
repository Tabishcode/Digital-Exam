import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Shield } from 'lucide-react';
import WebcamCapture from '../components/WebcamCapture';
import { useAuth } from '../contexts/AuthContext';

const FaceVerificationPage: React.FC = () => {
  const [verificationState, setVerificationState] = useState<'initial' | 'capturing' | 'verifying' | 'success' | 'failed'>('initial');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  const { user, verifyFace } = useAuth();
  const navigate = useNavigate();

  // Start face verification process
  const startVerification = () => {
    setVerificationState('capturing');
    setCountdown(3);
  };

  // Handle image capture
  const handleCapture = async (imageSrc: string) => {
    setVerificationState('verifying');

    try {
      // Call face verification API
      const isVerified = await verifyFace();

      if (isVerified) {
        setVerificationState('success');

        // Navigate to appropriate dashboard after a delay
        setTimeout(() => {
          if (user?.role === 'teacher') {
            navigate('/teacher');
          } else {
            navigate('/student');
          }
        }, 2000);
      } else {
        setVerificationState('failed');
        setErrorMessage('Face verification failed. Please try again.');
      }
    } catch (error) {
      setVerificationState('failed');
      setErrorMessage('An error occurred during verification. Please try again.');
    }
  };

  // Retry verification
  const handleRetry = () => {
    setVerificationState('initial');
    setErrorMessage(null);
  };

  // Countdown timer for capturing
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (verificationState === 'capturing' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (verificationState === 'capturing' && countdown === 0) {
      // Auto-capture after countdown
      const webcamElement = document.querySelector('video');
      if (webcamElement) {
        const canvas = document.createElement('canvas');
        canvas.width = webcamElement.videoWidth;
        canvas.height = webcamElement.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(webcamElement, 0, 0);
          const imageSrc = canvas.toDataURL('image/jpeg');
          handleCapture(imageSrc);
        }
      }
    }

    return () => clearTimeout(timer);
  }, [verificationState, countdown]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <Shield size={40} className="text-primary" />
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Face Verification
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              We need to verify your identity before you can access the system
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 py-8 px-6 shadow rounded-lg">
            <div className="text-center mb-6">
              {verificationState === 'initial' && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Position your face in the frame and ensure good lighting for accurate verification.
                </p>
              )}

              {verificationState === 'capturing' && (
                <div className="mb-4">
                  <div className="text-2xl font-bold text-primary mb-2">{countdown}</div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Stay still, capturing your image...
                  </p>
                </div>
              )}

              {verificationState === 'verifying' && (
                <div className="mb-4">
                  <div className="flex justify-center mb-2">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Verifying your identity...
                  </p>
                </div>
              )}

              {verificationState === 'success' && (
                <div className="mb-4 text-success">
                  <CheckCircle size={48} className="mx-auto mb-2" />
                  <p className="font-medium">Verification successful!</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Redirecting to your dashboard...
                  </p>
                </div>
              )}

              {verificationState === 'failed' && (
                <div className="mb-4 text-error">
                  <AlertCircle size={48} className="mx-auto mb-2" />
                  <p className="font-medium">Verification failed</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {errorMessage || 'Please try again.'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center mb-6">
              {verificationState === 'initial' && (
                <WebcamCapture
                  width={400}
                  height={300}
                  showControls={false}
                />
              )}

              {(verificationState === 'capturing' || verificationState === 'verifying') && (
                <WebcamCapture
                  width={400}
                  height={300}
                  showControls={false}
                />
              )}

              {(verificationState === 'success' || verificationState === 'failed') && (
                <div
                  className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                  style={{ height: 300 }}
                >
                  {verificationState === 'success' ? (
                    <CheckCircle size={64} className="text-success opacity-50" />
                  ) : (
                    <AlertCircle size={64} className="text-error opacity-50" />
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-center">
              {verificationState === 'initial' && (
                <button
                  onClick={startVerification}
                  className="btn btn-primary"
                >
                  Start Verification
                </button>
              )}

              {verificationState === 'failed' && (
                <button
                  onClick={handleRetry}
                  className="btn btn-primary"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} SecureExam. All rights reserved.
      </footer>
    </div>
  );
};

export default FaceVerificationPage;