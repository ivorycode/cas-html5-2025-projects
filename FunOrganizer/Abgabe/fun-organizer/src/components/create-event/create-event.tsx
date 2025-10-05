import StepQuestion from '@/components/create-event/step-question.tsx';
import { useSupabaseAuth } from '@/lib/auth.tsx';
import { createEvent, insertEmptyAnswerRows, saveDates, saveInvites, saveLocations, saveQuestions } from '@/lib/db.ts';
import type { supabaseUsers } from '@/lib/mock-users';
import type { SaveLocation, SaveQuestion } from '@/lib/schemas.ts';
import { useAppToast } from '@/lib/useAppToast';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import './create-event.css';
import { ProgressBar } from './progressbar';
import StepDate from './step-date';
import StepInvite from './step-invite';
import StepLocation from './step-location';
import StepName from './step-name';
import StepUebersicht from './step-uebersicht';

const steps = {
    NAME: 1,
    INVITE: 2,
    DATE: 3,
    LOCATION: 4,
    QUESTION: 5,
    UEBERSICHT: 6,
} as const;

type Steps = (typeof steps)[keyof typeof steps];

const eventDataInitalValue = {
    name: '',
    description: '',
    admin_id: null as number | null,
    eventState: 'open',
    invites: [] as typeof supabaseUsers,
    dates: [] as { date: string; time: string }[],
    date_multiple_choice: false,
    dateSetLater: false,
    locations: [] as SaveLocation[],
    location_multiple_choice: false,
    locationSetLater: false,
    questions: [] as SaveQuestion[],
};
export type EventData = typeof eventDataInitalValue;

export default function CreateEvent() {
    const auth = useSupabaseAuth();
    const navigator = useNavigate();
    const { successToast, errorToast } = useAppToast();

    const [step, setStep] = useState<Steps>(steps.NAME);
    const [event, setEvent] = useState<EventData>(eventDataInitalValue);
    const [isSaving, setIsSaving] = useState(false);

    function updateEvent(data: Partial<EventData>) {
        setEvent((prevEvent) => ({ ...prevEvent, ...data }));
    }

    function goToNextStep() {
        setStep((prevStep) => {
            if (prevStep < steps.UEBERSICHT) {
                return (prevStep + 1) as Steps;
            }
            return prevStep;
        });
    }

    function goBackStep() {
        setStep((prevStep) => {
            if (prevStep > steps.NAME) {
                return (prevStep - 1) as Steps;
            }
            return prevStep;
        });
    }

    async function saveEvent() {
        setIsSaving(true);
        try {
            const createdEvent = await createEvent(
                event.name,
                event.eventState,
                event.description,
                auth.user!.id,
                event.date_multiple_choice,
                event.location_multiple_choice,
            );
            const eventId = await createdEvent?.[0]?.id;
            await saveInvites(
                eventId,
                event.invites.map((i) => i.id),
            );
            if (event.dates.length > 0) {
                await saveDates(eventId, event.dates);
            }
            if (event.locations.length > 0) {
                await saveLocations(eventId, event.locations);
            }
            if (event.questions.length > 0) {
                await saveQuestions(eventId, event.questions);
            }
            await insertEmptyAnswerRows(
                eventId,
                event.invites.map((i) => i.id),
            );
            successToast('Event wurde erfolgreich erstellt!');

            await navigator({ to: `/events/${eventId}` });
        } catch (error) {
            errorToast((error as Error).message);
        }

        setIsSaving(false);
    }

    return (
        <div className='flex grow flex-col justify-between gap-8 create-details'>
            <div>
                {step === steps.NAME && (
                    <StepName
                        onNext={goToNextStep}
                        updateEvent={updateEvent}
                        formData={{ name: event.name, description: event.description }}
                    />
                )}
                {step === steps.INVITE && (
                    <StepInvite
                        onNext={goToNextStep}
                        onBack={goBackStep}
                        invites={event.invites}
                        updateEvent={updateEvent}
                    />
                )}
                {step === steps.DATE && (
                    <StepDate
                        onNext={goToNextStep}
                        onBack={goBackStep}
                        dates={event.dates}
                        dateConfig={{
                            setDateLater: event.dateSetLater,
                            dateMultipleChoice: event.date_multiple_choice,
                        }}
                        updateEvent={updateEvent}
                    />
                )}
                {step === steps.LOCATION && (
                    <StepLocation
                        onNext={goToNextStep}
                        onBack={goBackStep}
                        locations={event.locations}
                        updateEvent={updateEvent}
                        locationConfig={{
                            location_multiple_choice: event.location_multiple_choice,
                            locationSetLater: event.locationSetLater,
                        }}
                    />
                )}
                {step === steps.QUESTION && (
                    <StepQuestion
                        onBack={goBackStep}
                        onNext={goToNextStep}
                        questions={event.questions}
                        updateEvent={updateEvent}
                    />
                )}
                {step === steps.UEBERSICHT && (
                    <StepUebersicht event={event} onBack={goBackStep} onCreate={saveEvent} isSaving={isSaving} />
                )}
            </div>
            <div>
                <ProgressBar step={step} />
            </div>
        </div>
    );
}
