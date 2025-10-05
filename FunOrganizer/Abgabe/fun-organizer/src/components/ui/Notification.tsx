import { Link } from '@tanstack/react-router';
import { Check, CircleAlert, Clock10, InfoIcon, PenLine } from 'lucide-react';
import { Button } from '../ui/button';

export function Notification({ type = 'info', icon = 'info', title = 'Event', text = '', eventId = 1 }) {
    function notificationIcon(icon: string) {
        switch (icon) {
            case 'info':
                return <InfoIcon color='white' />;
            case 'success':
                return <Check color='white' />;
            case 'admin':
                return <PenLine color='white' />;
            case 'waiting':
                return <Clock10 color='white' />;
            case 'action':
                return <CircleAlert color='#002235' />;
            default:
                return <InfoIcon color='white' />;
        }
    }

    const notificationClasses = `notification ${icon} w-full max-w-sm p-4 rounded-lg shadow-sm bg-white gap-2`;
    const linkTo = eventId ? `/events/${eventId}` : '/dashboard';

    return (
        <>
            <div className={notificationClasses}>
                <Link to={linkTo} className='text-xl'>
                    <div className='text-xs'>{type}</div>
                    <div className={'notification-icon ' + icon}>{notificationIcon(icon)}</div>
                    <div className='pt-2 font-medium text-heading'>
                        {title}
                    </div>
                    <div className='notification-text text-sm pt-2'>{text}</div>
                    {icon === 'action' && (
                        <Button variant='secondary' className='mt-2'>
                            Jetzt abstimmen!
                        </Button>
                    )}
                </Link>
                {icon === 'admin' && (
                    <Link to={'/events/' + eventId}>
                        <Button variant='outline'>Bearbeiten</Button>
                    </Link>
                )}
            </div>
        </>
    );
}
