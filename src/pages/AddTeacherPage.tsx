import React, { useState } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const AddTeacher: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setOtpError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
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
            if (!response.ok) throw new Error(data.message || 'Failed to send OTP');

            setIsOtpModalOpen(true);
        } catch (err: any) {
            console.error('OTP Send Error:', err);
            setError(err.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtpAndCreate = async () => {
        setIsVerifying(true);
        setOtpError('');

        try {
            const response = await fetch('/api/api/email/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'OTP verification failed');

            // ✅ OTP verified — now create the teacher
            const teacherResponse = await fetch('/api/api/register-teacher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const teacherData = await teacherResponse.json();
            if (!teacherResponse.ok) throw new Error(teacherData.message || 'Failed to create teacher');

            // Navigate or show success
            navigate('/admin'); // or show toast
        } catch (err: any) {
            console.error('Error verifying OTP or creating teacher:', err);
            setOtpError(err.message || 'Error during verification or creation');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
            <Header/>
            <header className="px-4 py-4 sm:px-6 flex justify-end">
                
            </header>

            <div className="flex-1 flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <Shield size={40} className="text-primary mx-auto" />
                        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Add Teacher</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Create a new teacher account</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 py-8 px-6 shadow rounded-lg">
                        <form onSubmit={handleSendOtp} className="space-y-6">
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

                            <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                                {isLoading ? 'Sending OTP...' : 'Add Teacher'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
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
                            <button className="btn bg-gray-200 dark:bg-gray-700" onClick={() => setIsOtpModalOpen(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleVerifyOtpAndCreate} disabled={isVerifying}>
                                {isVerifying ? 'Verifying...' : 'Verify & Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddTeacher;
