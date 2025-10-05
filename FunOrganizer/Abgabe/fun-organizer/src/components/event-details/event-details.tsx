import EndEventButton from '@/components/event-details/EndEventButton.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useConfirm } from '@/components/ui/confirm-dialog-provider';
import { useSupabaseAuth } from '@/lib/auth';
import { deleteEvent, updateUserAnswers } from '@/lib/db';
import type { EventDetail } from '@/lib/schemas';
import { useSubscriptions } from '@/lib/subscription';
import { useAppToast } from '@/lib/useAppToast';
import { Link, useNavigate } from '@tanstack/react-router';
import { Calendar1, Clock2, MapPin, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import UserAvatarGroup from '../ui/user-avatar-group';
import DetailQuestion from './detail-question';
import DetailWhen from './detail-when';
import DetailWhere from './detail-where';
import styles from './event-details.module.css';
import { formatDateString } from '@/lib/utils.ts';

export function EventDetails({ event }: { event: EventDetail }) {
    const navigate = useNavigate();
    const { errorToast } = useAppToast();
    const auth = useSupabaseAuth();
    const { answerChange } = useSubscriptions();

    // ✅ Ganzes Event als State
    const [currentEvent, setCurrentEvent] = useState<EventDetail>(event);
    const [allAnswers, setAllAnswers] = useState(event.answer);

    const userAnswers = allAnswers.find((a) => a.user_id === auth.user!.id)?.answer!;
    const prevAnswers = useRef<typeof userAnswers>(userAnswers);
    const confirm = useConfirm();

    // Update-Funktion, um Event-Daten anzupassen
    function updatePage(updated: Partial<EventDetail>) {
        setCurrentEvent((prev) => ({
            ...prev,
            ...updated,
        }));
    }

    useEffect(() => {
        if (!answerChange) return;
        if (answerChange.event_id === currentEvent.id && answerChange.user_id !== auth.user!.id) {
            setAllAnswers((prev) => prev.map((a) => (a.id === answerChange.id ? answerChange : a)));
        }
    }, [answerChange]);

    async function saveAnswer(userAnswers: any) {
        try {
            await updateUserAnswers(auth.user!.id, currentEvent.id, userAnswers);
        } catch (err) {
            errorToast((err as Error).message);
            // reset to the old values
            setAllAnswers((prev) =>
                prev.map((a) => (a.user_id === auth.user!.id ? { ...a, answer: prevAnswers.current! } : a)),
            );
        }
    }

    async function onDateChanged(newDateIds: number[]) {
        prevAnswers.current = userAnswers;
        setAllAnswers((prev) =>
            prev.map((a) => (a.user_id === auth.user!.id ? { ...a, answer: { ...a.answer, date: newDateIds } } : a)),
        );
        await saveAnswer({ ...userAnswers, date: newDateIds });
    }

    async function onLocationChanged(newLocationIds: number[]) {
        prevAnswers.current = userAnswers;
        setAllAnswers((prev) =>
            prev.map((a) =>
                a.user_id === auth.user!.id ? { ...a, answer: { ...a.answer, location: newLocationIds } } : a,
            ),
        );
        await saveAnswer({ ...userAnswers, location: newLocationIds });
    }

    async function onQuestionChanged(questionId: number, newQuestionOptions: number[]) {
        prevAnswers.current = userAnswers;

        const isNewVote = !userAnswers.questions.some((q) => q.id === questionId);

        setAllAnswers((prev) =>
            prev.map((a) => {
                if (a.user_id === auth.user!.id) {
                    return {
                        ...a,
                        answer: {
                            ...a.answer,
                            questions: isNewVote
                                ? [...a.answer.questions, { id: questionId, options: newQuestionOptions }]
                                : a.answer.questions.map((q) =>
                                      q.id === questionId ? { ...q, options: newQuestionOptions } : q,
                                  ),
                        },
                    };
                } else {
                    return a;
                }
            }),
        );

        await saveAnswer({
            ...userAnswers,
            questions: [...userAnswers.questions, { id: questionId, options: newQuestionOptions }],
        });
    }

    async function handleDelete() {
        const ok = await confirm({
            title: 'Event löschen?',
            description: 'Dieses Event wird dauerhaft gelöscht und kann nicht wiederhergestellt werden.',
            confirmText: 'Löschen',
            cancelText: 'Abbrechen',
        });

        if (!ok) return;

        try {
            await deleteEvent(currentEvent.id);
            navigate({ to: '/dashboard' });
        } catch (err) {
            console.error('Fehler beim Löschen:', err);
            errorToast('Event konnte nicht gelöscht werden.');
        }
    }
    function formatedTime(time: string) {
        return time.slice(0, -3);
    }
    function linkWithProtocol(link: string) {
        return (link.indexOf('://') === -1) ? 'http://' + link : link;
    }

    return (
        <div>
            <div className='mb-6'>
                {/* Titel + Kommentar immer sichtbar */}
                <div className='mb-6'>
                    <h1 className='text-4xl font-extrabold'>{currentEvent.name}</h1>
                    {currentEvent.comment && (
                        <p className='mt-2 text-lg text-muted-foreground'>{currentEvent.comment}</p>
                    )}
                </div>

                {/* Nur sichtbar, wenn Event abgeschlossen ist */}
                {currentEvent.state === 'closed' && (
                    <div className='mt-4 mb-6 border-2 border-emerald-500 bg-emerald-50 rounded-xl p-4 shadow-sm'>
                        <div className='flex items-start gap-2 mb-3'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-5 w-5 text-emerald-600'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M9 12l2 2l4-4m6 2a9 9 0 11-18 0a9 9 0 0118 0z'
                                />
                            </svg>
                            <span className='text-emerald-700 font-semibold'>Dieses Event ist abgeschlossen</span>
                        </div>

                        {currentEvent.event_results && (
                            <div className='flex flex-col gap-2 text-gray-700'>
                                {currentEvent.event_results.date && (
                                    <p className='flex' >
                                        <Calendar1 className='h-5 pr-2' /> Datum:{' '}
                                        <span className='font-semibold pl-2'>
                                            {formatDateString(currentEvent.event_results.date)}
                                        </span>
                                    </p>
                                )}
                                {currentEvent.event_results.time && (
                                    <p className='flex' >
                                        <Clock2 className='h-5 pr-2' /> Zeit:{' '}
                                        <span className='font-semibold pl-2'>{formatedTime(currentEvent.event_results.time)}</span>
                                    </p>
                                )}
                                {currentEvent.event_results.location && (
                                    <p className='flex' >
                                        <MapPin className='h-5 pr-2' /> Ort: {' '}
                                        {currentEvent.event_results.location.link ? (
                                            <a
                                                href={linkWithProtocol(currentEvent.event_results.location.link)}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='text-blue-600 underline hover:text-blue-800'
                                            >
                                                {currentEvent.event_results.location.name}
                                                {currentEvent.event_results.location.address &&
                                                    `, ${currentEvent.event_results.location.address}`}
                                            </a>
                                        ) : (
                                            <>
                                                {currentEvent.event_results.location.name}
                                                {currentEvent.event_results.location.address &&
                                                    `, ${currentEvent.event_results.location.address}`}
                                            </>
                                        )}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className='flex flex-wrap items-center gap-3'>
                <div className='font-bold'>Eingeladen:</div>
                <div>
                    <UserAvatarGroup users={currentEvent.invites.map((invite) => invite.user)} />
                </div>
            </div>

            <Accordion type='single' collapsible className='w-full space-y-2 mt-6'>
                {currentEvent.date.length > 0 && (
                    <AccordionItem value='Wann?' className={styles.accordionTab}>
                        <AccordionTrigger>Wann?</AccordionTrigger>
                        <AccordionContent className='flex flex-col gap-4 text-balance'>
                            <DetailWhen
                                dates={currentEvent.date}
                                answers={allAnswers}
                                invites={currentEvent.invites}
                                multipleChoice={currentEvent.date_multiple_choice}
                                onChange={onDateChanged}
                                readonly={currentEvent.state === 'closed'}
                            />
                        </AccordionContent>
                    </AccordionItem>
                )}

                {currentEvent.location.length > 0 && (
                    <AccordionItem value='Wo?' className={styles.accordionTab}>
                        <AccordionTrigger>Wo?</AccordionTrigger>
                        <AccordionContent className='flex flex-col gap-4 text-balance'>
                            <DetailWhere
                                locations={currentEvent.location}
                                answers={allAnswers}
                                invites={currentEvent.invites}
                                multipleChoice={currentEvent.location_multiple_choice}
                                onChange={onLocationChanged}
                                readonly={currentEvent.state === 'closed'}
                            />
                        </AccordionContent>
                    </AccordionItem>
                )}

                {currentEvent.question.map((question) => (
                    <AccordionItem key={question.id} value={question.id.toString()} className={styles.accordionTab}>
                        <AccordionTrigger>{question.question}</AccordionTrigger>
                        <AccordionContent className='flex flex-col gap-4 text-balance'>
                            <DetailQuestion
                                question={question}
                                answers={allAnswers}
                                invites={currentEvent.invites}
                                multipleChoice={question.multiple_choice}
                                onChange={onQuestionChanged}
                                readonly={currentEvent.state === 'closed'}
                            />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {auth.user?.id === currentEvent.admin_id && (
                <div>
                    <h3 className='mt-10 mb-4 font-bold'>Admin Actions:</h3>
                    <div className='flex flex-col items-stretch gap-4'>
                        {currentEvent.state !== 'closed' && (
                            <>
                                <Button asChild>
                                    <Link to='/events/addquestion' search={{ id: currentEvent.id }}>
                                        Frage hinzufügen
                                    </Link>
                                </Button>

                                <EndEventButton
                                    eventId={currentEvent.id}
                                    eventState={currentEvent.state}
                                    update={updatePage}
                                    answers={allAnswers}
                                />
                            </>
                        )}

                        <Button
                            icon={<Trash />}
                            onClick={handleDelete}
                            asChild
                            className='bg-red-500 hover:bg-red-600 text-white'
                        >
                            Event löschen
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
