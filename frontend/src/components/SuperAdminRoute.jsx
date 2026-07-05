// src/components/SuperAdminRoute.jsx
import { useEffect, useState } from 'react';
import { useNavigate }         from 'react-router-dom';
import API                     from '../services/api';

export default function SuperAdminRoute({ children }) {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);
    const [allowed,  setAllowed]  = useState(false);

    useEffect(() => {
        checkRole();
    }, []);

    const checkRole = async () => {
        try {
            const res  = await API.get('/api/auth/me');
            const user = res.data.user;

            if (user?.role === 'Superadmin') {
                setAllowed(true);
            } else {
                // logged in but not superadmin → back to dashboard
                navigate('/dashboard', { replace: true });
            }
        } catch (err) {
            // not logged in → to login
            navigate('/login', { replace: true });
        } finally {
            setChecking(false);
        }
    };

    if (checking) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#FFF4E1',
                fontFamily: 'Inter, sans-serif'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 32, height: 32,
                        border: '3px solid #428475',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 12px'
                    }}/>
                    <p style={{ color: '#428475', fontSize: 13 }}>
                        Verifying superadmin access...
                    </p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return allowed ? children : null;
}