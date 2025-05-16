// src/pages/ActivateAccountPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ActivateAccountPage = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const activateAccount = async () => {
            try {
                const response = await fetch(`/api/activate/${token}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });


                if (!response.ok) {
                    throw new Error('Activation failed');
                }

                setStatus('success');
                setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
            } catch (err) {
                setStatus('error');
            }
        };

        if (token) activateAccount();
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            {status === 'loading' && <p>Activating your account...</p>}
            {status === 'success' && <p className="text-green-600">Account activated! Redirecting to login...</p>}
            {status === 'error' && <p className="text-red-600">Activation failed. Token might be invalid or expired.</p>}
        </div>
    );
};

export default ActivateAccountPage;
