import type { EventData } from '@/components/create-event/create-event.tsx';
import { formatDate, formatDateString } from '@/lib/utils';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { DateTime } from '../ui/date-time';
import { Label } from '../ui/label';
import { TrashButton } from '../ui/trashbutton';

export default function StepDate({
    onBack,
    onNext,
    dates,
    dateConfig,
    updateEvent,
}: {
    onBack: () => void;
    onNext: () => void;
    dates: { date: string; time: string }[];
    dateConfig: { setDateLater: boolean; dateMultipleChoice: boolean };
    updateEvent: (data: Partial<EventData>) => void;
}) {
    function onAdd(date: Date, time: string) {
        const formattedDate = formatDate(date);
        const newDate = { date: formattedDate, time: time };
        // avoid duplicates
        if (dates.find((d) => d.date === formattedDate && d.time === time)) {
            return;
        }
        updateEvent({ dates: [...dates, newDate] });
    }

    return (
        <div>
            <h1 className='text-2xl font-bold'>Welche Daten schlägst du vor?</h1>
            <div className='flex flex-col gap-4 mt-8 mb-4'>
                <Card className='p-5 mb-4'>
                    <DateTime onAdd={onAdd} disabled={dateConfig.setDateLater} />
                </Card>
            </div>

            <Card className='p-5 gap-2'>
                {dates.map((d, index) => (
                    <div key={index} className='flex items-center text-xl created-question-option'>
                        <span className='pr-3'>{formatDateString(d.date)}</span>
                        <span className='pr-4'>{d.time}</span>
                        <TrashButton
                            onClick={() => {
                                const newDates = dates.filter((_, i) => i !== index);
                                updateEvent({ dates: newDates });
                            }}
                        />
                    </div>
                ))}

                {dates.length > 1 && (
                    <div className='flex gap-3 items-center mt-4'>
                        <Checkbox
                            id='date-multiple-choice'
                            checked={dateConfig.dateMultipleChoice}
                            onCheckedChange={(checked) => updateEvent({ date_multiple_choice: checked as boolean })}
                            className='w-6 h-6'
                        />
                        <Label htmlFor='date-multiple-choice' className='text-base'>
                            Mehrfachauswahl erlauben
                        </Label>
                    </div>
                )}
                {dates.length < 1 && (
                    <div className='flex flex-row gap-4 text-base'>
                        <Checkbox
                            id='setDateLater'
                            checked={dateConfig.setDateLater}
                            onCheckedChange={(value) => updateEvent({ dateSetLater: value as boolean })}
                            className='w-6 h-6'
                        />
                        <Label htmlFor='setDateLater' className='text-base'>
                            Datum später bestimmen
                        </Label>
                    </div>
                )}
            </Card>

            <div className='flex flex-row gap-4 pt-12'>
                <Button variant='outline' onClick={onBack}>
                    Zurück
                </Button>
                <Button disabled={dates.length === 0 && !dateConfig.setDateLater} onClick={() => onNext()}>
                    Weiter
                </Button>
            </div>
        </div>
    );
}
