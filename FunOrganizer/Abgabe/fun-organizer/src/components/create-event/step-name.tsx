import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import type { EventData } from './create-event';

export default function StepName({
    onNext,
    updateEvent,
    formData,
}: {
    onNext: () => void;
    updateEvent: (data: Partial<EventData>) => void;
    formData: { name: string; description?: string };
}) {
    const hasData = formData.name ? false : true;
    return (
        <div>
            <h1 className='text-2xl font-bold'>Gib deinem Event einen Namen</h1>
            <div className='flex flex-col gap-4 my-8'>
                <Input
                    type='text'
                    placeholder='Name'
                    value={formData.name}
                    onChange={(e) => updateEvent({ ...formData, name: e.target.value })}
                />
                <Textarea
                    placeholder='Beschreibung'
                    value={formData.description}
                    onChange={(e) => updateEvent({ ...formData, description: e.target.value })}
                />
            </div>
            <Button disabled={hasData} onClick={() => onNext()}>
                Weiter
            </Button>
        </div>
    );
}
