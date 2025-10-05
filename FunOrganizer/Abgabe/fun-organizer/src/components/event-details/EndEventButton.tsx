import { Button } from '@/components/ui/button.tsx';
import { useConfirm } from '@/components/ui/confirm-dialog-provider';
import { getDateById, getLocationById, updateEventById } from '@/lib/db.ts';
import type { EventResults } from '@/lib/schemas';
import { useAppToast } from '@/lib/useAppToast';

export default function EndEventButton(props: { eventId: number; eventState: string; update: any; answers: any[] }) {
    const { eventId, update, answers } = props;
    let eventResultsData: EventResults = {
        date: null,
        time: null,
        location: null,
        questions: null,
    };
    const confirm = useConfirm();
    const { successToast, errorToast } = useAppToast();

    // Helper function to find the most frequent element in an array
    function mostFrequent<T extends number>(arr: T[]): T | null {
        const frequency: Record<T, number> = {} as Record<T, number>;
        let maxCount = 0;
        let result: T | null = null;

        for (const num of arr) {
            frequency[num] = (frequency[num] || 0) + 1;
            if (frequency[num] > maxCount) {
                maxCount = frequency[num];
                result = num;
            }
        }

        return result;
    }

    // Function to get results for a specific event
    function eventResults() {
        const dateArray: number[] = [];
        const locationArray: number[] = [];
        answers.forEach((answer) => {
            answer.answer.date.forEach((date: number) => {
                dateArray.push(date);
            });
            answer.answer.location.forEach((location: number) => {
                locationArray.push(location);
            });
        });

        const chosenDate = mostFrequent(dateArray);
        const chosenLocation = mostFrequent(locationArray);

        return {
            date: !!chosenDate ? chosenDate : null,
            location: !!chosenLocation ? chosenLocation : null,
        };
    }

    async function changeEventState() {
        const ok = await confirm({
            title: 'Event wirklich beenden?',
            description: 'Danach können keine Änderungen mehr gemacht werden.',
            confirmText: 'Beenden',
            cancelText: 'Abbrechen',
        });

        if (!ok) return;

        try {
            await endEvent(eventId);
            update({ state: 'closed' });
            successToast('Event wurde erfolgreich beendet 🎉');
        } catch (err) {
            console.error('Fehler beim Beenden:', err);
            errorToast('Fehler beim Beenden des Events');
        }
    }

    async function endEvent(eventId: number) {
        const results = eventResults();
        if (results.date !== null) {
            await getDateById(results.date).then((date) => {
                eventResultsData = { ...eventResultsData, date: date.date, time: date.time };
            });
        }
        if (results.location !== null) {
            await getLocationById(results.location).then((location) => {
                eventResultsData = {
                    ...eventResultsData,
                    location: {
                        name: location.name,
                        address: location.adress,
                        link: location.link,
                    },
                };
            });
        }
        await updateEventById(eventId, { state: 'closed', event_results: eventResultsData }).catch((error) => {
            console.error('Error updating event with results:', error);
        });
        update({
            state: 'closed',
            event_results: eventResultsData as EventResults,
        });
    }

    return (
        <>
            <Button onClick={changeEventState}>Event beenden</Button>
        </>
    );
}
