import { useSupabaseAuth } from '@/lib/auth';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Check, LogOut, Mail, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProfileOption from '../../../components/ui/profileoption';
import './profile.css';

export const Route = createFileRoute('/_authenticated/user/profile')({
    component: UserProfile,
});

function UserProfile() {
    const auth = useSupabaseAuth();
    const navigate = useNavigate();
    const [pendingUser, setPendingUser] = useState<string | null>(null);

    async function handleLogout() {
        setPendingUser(auth.user!.email);
        await auth.logout();
    }

    useEffect(() => {
        async function checkLogoutThenNavigate() {
            // Only navigate after logout when user is logged out
            if (pendingUser && !auth.isAuthenticated) {
                // setPendingUser(null);
                await navigate({ to: '/' });
            }
        }
        checkLogoutThenNavigate();
    }, [pendingUser, auth.isAuthenticated]);

    if (pendingUser) {
        return <div>Wir loggen dich aus...</div>;
    }

    return (
        <>
            <div className='main-profile-container'>
                <div className='profile-picture'>
                    {/* <User size={70} /> */}
                    <span>{auth.user?.emoji}</span>
                </div>
                <h2>
                    {auth.user?.first_name} {auth.user?.last_name}
                </h2>
                <div className='profile-email-container'>
                    <Mail />
                    <span>{auth.user?.email}</span>
                </div>
                <hr />
            </div>

            <ProfileOption icon={<Check size={50} />} text='Meine Events' link='/events/events' />
            <ProfileOption icon={<Settings size={50} />} text='Settings' link='/user/settings' />
            <ProfileOption icon={<LogOut size={50} />} text='Log out' onClick={handleLogout} />
        </>
    );
}
