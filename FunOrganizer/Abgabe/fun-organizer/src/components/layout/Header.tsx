import logo from '@/assets/logo.svg';
import { useSupabaseAuth } from '@/lib/auth';
import { Link, useNavigate } from '@tanstack/react-router';
import { Bell } from 'lucide-react';
import './Header.css';
import { useEffect, useState } from 'react';
import { useSubscriptions } from '@/lib/subscription.tsx';

export const Header = () => {
    const auth = useSupabaseAuth();
    const navigator = useNavigate();
    const [hasNewMessages, setHasNewMessages] = useState(false);
    const invite = useSubscriptions();

    useEffect(() => {
        if (invite) {
            if (invite.invite?.user_id === auth.user?.id){
                setHasNewMessages(true);
            }
        }
    }, [invite]);

    function openMessages() {
        setHasNewMessages(false);
        navigator({ to: '/messages/message-list' });
    }

    return (
        <>
            <header>
                <Link to='/dashboard'>
                    <img src={logo} className='logo' alt='fun organizer' />
                </Link>
                {auth.isAuthenticated && <div onClick={openMessages}>{
                    hasNewMessages ? <span className='messageInfo'><Bell /></span> : <Bell />
                }</div>}
            </header>
        </>
    );
};
