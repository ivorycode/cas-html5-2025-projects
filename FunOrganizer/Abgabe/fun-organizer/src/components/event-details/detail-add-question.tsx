import { saveQuestions } from '@/lib/db';
import type { EventDetail, SaveQuestion } from '@/lib/schemas';
import { useAppToast } from '@/lib/useAppToast';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { AddQuestion } from '../add-question';

export function DetailAddQuestion({ event }: { event: EventDetail }) {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const { successToast, errorToast } = useAppToast();

    async function saveQuestion(question: SaveQuestion) {
        setIsSaving(true);
        try {
            await saveQuestions(event.id, [question]);
            successToast('Frage erfolgreich hinzugefügt');
            navigate({ to: `/events/${event.id}` });
        } catch (error) {
            errorToast((error as Error).message);
        }
        setIsSaving(false);
    }

    return (
        <>
            <div className='flex flex-col gap-4'>
            <div className='text-2xl'>{event.name}</div>

            <p className='text-muted-foreground'>Frage hinzufügen</p>
            <AddQuestion onAddQuestion={saveQuestion} backTo={`/events/${event.id}`} isSaving={isSaving} />
            </div>
        </>
    );
}
