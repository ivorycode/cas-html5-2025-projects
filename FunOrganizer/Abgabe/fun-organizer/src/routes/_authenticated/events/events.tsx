import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card.tsx';
import { useSupabaseAuth } from '@/lib/auth.tsx';
import { getEventInvitesForUser } from '@/lib/db.ts';
import { formatDateString } from '@/lib/utils.ts';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Calendar1, CheckCircle, Clock2, MapPin } from 'lucide-react';
import { Suspense } from 'react';

export const Route = createFileRoute('/_authenticated/events/events')({
    loader: async ({ context }) => {
        const { auth } = context;
        const invitedEvents = (await getEventInvitesForUser(auth.user!.id)) ?? [];
        return {
            invitedEvents,
        };
    },
    component: Events,
});

function Loading() {
    return <div>Lade Events...</div>;
}

function Events() {
    const { invitedEvents } = Route.useLoaderData();
    const auth = useSupabaseAuth();

    // Order events by id in descending order (means newest first)
    const orderdEvents = invitedEvents.sort((a, b) => b.id - a.id);

    function formatedTime(time: string) {
        return time.slice(0, -3);
    }
    function linkWithProtocol(link: string) {
        return (link.indexOf('://') === -1) ? 'http://' + link : link;
    }

    return (
        <>
            <div className='gap-4 flex flex-col justify-items-center items-center'>
                <h1 className='text-3xl'>Events für {auth.user?.first_name}</h1>
                <div className='flex flex-col justify-center gap-4 w-full'>
                    <Suspense fallback={<Loading />}>
                        {orderdEvents.length === 0 ? (
                            <p>No events found.</p>
                        ) : (
                            orderdEvents.map((event) => (
                                <Card className='w-full p-3 gap-2' key={event.id}>
                                    <h3 className='text-2xl font-medium'>
                                        <Link to='/events/$eventId' params={{ eventId: String(event.id) }}>
                                            <b>{event.name}</b>
                                        </Link>{' '}
                                    </h3>
                                    <p>{event.comment}</p>

                                    {event.state === 'closed' && event.event_results !== null ? (
                                        <div className='border-2 border-emerald-500 bg-emerald-50 rounded-xl p-4 my-2 shadow-sm'>
                                            <div className='flex items-center gap-2 mb-3'>
                                                <CheckCircle className='text-emerald-600 w-5 h-5' />
                                                <h3 className='text-lg font-bold text-emerald-700'>
                                                    Event abgeschlossen
                                                </h3>
                                            </div>

                                            <div className='flex flex-col gap-2 text-gray-700'>
                                                {event.event_results?.date && (
                                                    <p className='flex'>
                                                        <Calendar1 className='h-5 pr-2' /> Datum:{' '}
                                                        <span className='font-semibold pl-2'>
                                                            {formatDateString(event.event_results.date)}
                                                        </span>
                                                    </p>
                                                )}
                                                {event.event_results?.time && (
                                                    <p className='flex'>
                                                        <Clock2 className='h-5 pr-2' /> Zeit:{' '}
                                                        <span className='font-semibold pl-2'>
                                                            {formatedTime(event.event_results.time)}
                                                        </span>
                                                    </p>
                                                )}
                                                {event.event_results?.location && (
                                                    <p className='flex'>
                                                        <MapPin className='h-5 pr-2' /> Ort: {' '}
                                                        {event.event_results.location.link ? (
                                                            <a
                                                                href={linkWithProtocol(event.event_results.location.link)}
                                                                target='_blank'
                                                                rel='noopener noreferrer'
                                                                className='text-blue-600 underline hover:text-blue-800'
                                                            >
                                                                {event.event_results.location.name}
                                                                {event.event_results.location.address &&
                                                                    `, ${event.event_results.location.address}`}
                                                            </a>
                                                        ) : (
                                                            <>
                                                                {event.event_results.location.name}
                                                                {event.event_results.location.address &&
                                                                    `, ${event.event_results.location.address}`}
                                                            </>
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className='text-xs'>
                                            Umfrage erstellt: {new Date(event.created_at).toLocaleDateString()}
                                        </p>
                                    )}
                                    <Link
                                        to='/events/$eventId'
                                        params={{ eventId: String(event.id) }}
                                        className='underline text-primary'
                                    >
                                        <Button>
                                            {event.admin_id === auth.user?.id && event.state === 'open'
                                                ? 'Event bearbeiten'
                                                : 'Abstimmung ansehen'}
                                        </Button>
                                    </Link>
                                </Card>
                            ))
                        )}
                    </Suspense>
                </div>
            </div>
        </>
    );
}
