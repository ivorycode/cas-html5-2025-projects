import { Button } from '@/components/ui/button.tsx';
import { Notification } from '@/components/ui/Notification.tsx';
import { useSupabaseAuth } from '@/lib/auth';
import { getEventInvitesForUser, getUserAnswers } from '@/lib/db.ts';
import { useSubscriptions } from '@/lib/subscription.tsx';
import { formatDateString } from '@/lib/utils.ts';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Suspense, useEffect, useState } from 'react';

export const Route = createFileRoute('/_authenticated/dashboard')({
    loader: async ({ context }) => {
        const { auth } = context;
        const invitedEvents = await getEventInvitesForUser(auth.user!.id);
        const answers = await getUserAnswers(auth.user!.id);
        return {
            invitedEventsFromLoader: invitedEvents ?? [],
            answersFromLoader: answers ?? [],
        };
    },
    component: Dashboard,
});

function Loading() {
    return <div>Neuigkeiten werden geladen...</div>;
}

function Dashboard() {
    const { invitedEventsFromLoader, answersFromLoader: answers } = Route.useLoaderData();
    const navigate = useNavigate();
    const auth = useSupabaseAuth();
    const { invite } = useSubscriptions();
    const [invitedEvents, setInvitedEvents] = useState(invitedEventsFromLoader);

    useEffect(() => {
        if (invite) {
            // Überprüfen, ob das Event bereits in der Liste ist
            const isEventAlreadyInList = invitedEvents.some((event) => event.id === invite.event_id);
            if (!isEventAlreadyInList) {
                // Hole die Event-Details und füge sie der Liste hinzu
                getEventInvitesForUser(auth.user!.id)
                    .then((invitedEvents) => {
                        setInvitedEvents(invitedEvents ?? []);
                    })
                    .catch((error) => {
                        console.error('Error fetching invited events:', error);
                    });
            }
        }
    }, [invite]);

    function containsNumber(str: string) {
        return /\d/.test(str);
    }

    const messagesList = invitedEvents
        .filter((invitedEvent) => {
            return (
                (invitedEvent.state === 'open' && // is open and
                    (!answers.some(
                        (answer) =>
                            answer.event_id === invitedEvent.id && containsNumber(JSON.stringify(answer.answer)),
                    ) ||
                        invitedEvent.admin_id == auth.user?.id)) || // or is admin
                invitedEvent.state === 'closed' // or is closed
            );
        })
        .map((event) => {
            return {
                id: event.id,
                type:
                    event.state === 'closed'
                        ? 'Abgeschlossen'
                        : event.admin_id === auth.user?.id
                          ? 'Admin Aktion'
                          : 'Wartet auf Dich',
                title: event.name,
                text:
                    event.state === 'closed'
                        ? `${event.event_results?.date ? formatDateString(event.event_results.date) : ''} 
                    ${event.event_results?.time ? '| ' + event.event_results.time : ''}
                    ${event.event_results?.location?.name ? '| ' + event.event_results.location.name : ''} `
                        : event.admin_id === auth.user?.id
                          ? 'Du bist der Admin und kannst die Abstimmung bearbeiten oder abschliessen.'
                          : 'Du bist eingeladen, an der Abstimmung teilzunehmen.',
                icon: event.state === 'closed' ? 'success' : event.admin_id === auth.user?.id ? 'admin' : 'action',
                eventId: event.id,
            };
        })
        .sort((a, b) => b.id - a.id); // Sortiere nach id absteigend -> neueste Nachricht zuerst

    return (
        <div className='App'>
            <div className='text-2xl justify-center flex mb-4'>
                {!auth.user && <div>Authentifizierung fehlgeschlagen</div>}
                Hallo {auth.user?.first_name} {auth.user?.emoji}
            </div>
            <div className='messages gap-4 flex flex-col justify-items-center items-center'>
                <Suspense fallback={<Loading />}>
                    {messagesList.length > 0 &&
                        messagesList.map((message) => (
                            <Notification
                                key={message.id}
                                type={message.type}
                                title={message.title}
                                text={message.text}
                                icon={message.icon}
                                eventId={message.eventId}
                            />
                        ))}
                    {messagesList.length === 0 && <div className='text-center'>Du hast keine neuen Nachrichten.</div>}
                </Suspense>
            </div>
            <div className='flex justify-center mt-8'>
                <Button
                    variant='secondary'
                    className='text-lg py-6 px-6 border-2 border-primary'
                    onClick={() => navigate({ to: '/events/create' })}
                >
                    Neue Abstimmung 🚀
                </Button>
            </div>
        </div>
    );
}
