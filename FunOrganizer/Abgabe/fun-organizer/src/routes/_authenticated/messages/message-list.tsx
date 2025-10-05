import { Notification } from '@/components/ui/Notification.tsx';
import { useSupabaseAuth } from '@/lib/auth.tsx';
import { getEventInvitesForUser, getUserAnswers } from '@/lib/db.ts';
import type { EventType } from '@/lib/schemas.ts';
import { useSubscriptions } from '@/lib/subscription.tsx';
import { formatDateString } from '@/lib/utils.ts';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense, useEffect, useState } from 'react';

export const Route = createFileRoute('/_authenticated/messages/message-list')({
    component: MessageList,
});

function Loading() {
    return <div>Nachrichten werden geladen...</div>;
}

function MessageList() {
    const auth = useSupabaseAuth();
    const invites = useSubscriptions();

    const [invitedEvents, setInvitedEvents] = useState<EventType[]>([]);
    const [answers, setAnswers] = useState<any[]>([]);

    useEffect(() => {
        if (auth.user) {
            // Fetch events the user is invited to
            getEventInvitesForUser(auth.user.id)
                .then((data) => {
                    setInvitedEvents(data ?? []);
                })
                .catch((error) => {
                    console.error('Error fetching invited events:', error);
                });
            // Fetch all answers by the user
            getUserAnswers(auth.user.id)
                .then((answers) => {
                    setAnswers(answers ?? []);
                })
                .catch((error) => {
                    console.error('Error fetching answers:', error);
                });
        }
    }, [invites]);

    // Order events by id in descending order (means newest first)
    const orderdEvents = invitedEvents.sort((a, b) => b.id - a.id);

    function containsNumber(str: string) {
        return /\d/.test(str);
    }

    return (
        <>
            <div className='messages gap-4 flex flex-col justify-items-center items-center'>
                <h1 className='text-3xl'>Nachrichten</h1>
                <Suspense fallback={<Loading />}>
                    {orderdEvents.length > 0 &&
                        orderdEvents.map((event: EventType) => (
                            <Notification
                                key={event.id}
                                type={
                                    event.state === 'closed'
                                        ? 'Abgeschlossen'
                                        : event.admin_id === auth.user?.id
                                          ? 'Admin Aktion'
                                          : !answers.some(
                                                  (answer) =>
                                                      answer.event_id === event.id &&
                                                      containsNumber(JSON.stringify(answer.answer)),
                                              )
                                            ? 'Wartet auf Dich'
                                            : 'Warten auf andere'
                                }
                                icon={
                                    event.state === 'closed'
                                        ? 'success'
                                        : event.admin_id === auth.user?.id
                                          ? 'admin'
                                          : !answers.some(
                                                  (answer) =>
                                                      answer.event_id === event.id &&
                                                      containsNumber(JSON.stringify(answer.answer)),
                                              )
                                            ? 'action'
                                            : 'waiting'
                                }
                                title={event.name}
                                text={
                                    event.state === 'closed'
                                        ? `${event.event_results?.date ? formatDateString(event.event_results.date) : ''} 
                                            ${event.event_results?.time ? '| ' + event.event_results.time : ''}
                                            ${event.event_results?.location?.name ? '| ' + event.event_results.location.name : ''} `
                                        : event.comment
                                          ? event.comment
                                          : ''
                                }
                                eventId={event.id}
                            />
                        ))}
                </Suspense>
            </div>
        </>
    );
}
