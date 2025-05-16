import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

const SignupPage: React.FC = () => {
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [otp, setOtp] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [otpError, setOtpError] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signup } = useAuth(); // This will call backend API
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const handleVerifyOtp = async () => {
        setOtpError('');
        setIsVerifying(true);

        try {
            const response = await fetch('/api/api/email/verify-otp', {  // ✅ Removed extra `/api`
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to verify OTP');
            }
            // ✅ Upload image to Cloudinary
            const uploadedImageURL = await uploadToCloudinary(imageFile);
            if (!uploadedImageURL) throw new Error("Image upload failed");
            setImageURL(uploadedImageURL);

            // ✅ OTP verified, now proceed with signup
            await signup(name, email, password, uploadedImageURL);

            // ✅ Navigate to face verification
            navigate('/face-verification');

        } catch (err) {
            console.error('OTP Verification Error:', err);
            setOtpError(err.message || "Failed to verify OTP");
        } finally {
            setIsVerifying(false);
            setIsLoading(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setOtpError('');

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/api/email/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send OTP');
            }

            // Optional: show success toast/message here
            setIsOtpModalOpen(true); // show modal
            setIsLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setError("Failed to send OTP");
            setIsLoading(false);
        }

    };

    return (

        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
            <header className="px-4 py-4 sm:px-6 flex justify-end">
                <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Toggle theme">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </header>

            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <Shield size={40} className="text-primary mx-auto" />
                        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Create your account</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Join SecureExam as a student</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 py-8 px-6 shadow rounded-lg">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="flex items-center p-3 bg-red-100 text-red-600 rounded-md">
                                    <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            <div>
                                <label className="label">Full Name</label>
                                <input type="text" className="input" required value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div>
                                <label className="label">Email</label>
                                <input type="email" className="input" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>



                            <div>
                                <label className="label">Password</label>
                                <input type="password" className="input" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <div>
                                <label className="label">Confirm Password</label>
                                <input type="password" className="input" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>

                            <div>
                                <label className="label">Profile Image</label>
                                <input type="file" accept="image/*" className="input" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setImageFile(file);
                                }} />
                            </div>

                            <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                                {isLoading ? 'Signing up...' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} SecureExam. All rights reserved.
            </footer>
            {isOtpModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Enter OTP</h2>
                        <input
                            type="text"
                            className="input mb-3"
                            placeholder="4-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        {otpError && <p className="text-red-500 text-sm mb-2">{otpError}</p>}
                        <div className="flex justify-end space-x-2">
                            <button
                                className="btn bg-gray-200 dark:bg-gray-700"
                                onClick={() => setIsOtpModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleVerifyOtp}
                                disabled={isVerifying}
                            >
                                {isVerifying ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Link for existing users to login */}
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
            <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} SecureExam. All rights reserved.
            </footer>
        </div>

    );
};

export default SignupPage;
