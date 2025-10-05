import type { EventData } from '@/components/create-event/create-event.tsx';
import { Card } from '@/components/ui/card.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { TrashButton } from '@/components/ui/trashbutton.tsx';
import type { SaveLocation } from '@/lib/schemas';
import { useState } from 'react';
import { Button } from '../ui/button';

interface StepLocation {
    onBack: () => void;
    onNext: () => void;
    locations: SaveLocation[];
    updateEvent: (data: Partial<EventData>) => void;
    locationConfig: { location_multiple_choice: boolean; locationSetLater: boolean };
}

export default function StepLocation({ onBack, onNext, locations, updateEvent, locationConfig }: StepLocation) {
    const [location, setLocation] = useState<SaveLocation>({ name: '', adress: '', link: '' });

    function addLocation() {
        updateEvent({ locations: [...locations, location] });
        setLocation({ name: '', adress: '', link: '' });
    }

    return (
        <div>
            <h1>Wo wollt ihr euch treffen?</h1>
            <div className='flex flex-col gap-2 my-4'>
                <Card className='p-5 mb-4'>
                    <Input
                        className='inCard'
                        id='placeName'
                        type='text'
                        placeholder='Name'
                        value={location.name}
                        onChange={(e) => {
                            setLocation((prev) => ({ ...prev, name: e.target.value }));
                        }}
                    />
                    {
                        // Only show adress and link input if name is filled
                        location.name && (
                            <>
                                <Input
                                    className='inCard'
                                    type='text'
                                    placeholder='Adresse'
                                    value={location.adress}
                                    onChange={(e) => {
                                        setLocation((prev) => ({ ...prev, adress: e.target.value }));
                                    }}
                                />
                                <Input
                                    className='inCard'
                                    id='link'
                                    type='text'
                                    placeholder='Link'
                                    value={location.link}
                                    onChange={(e) => {
                                        setLocation((prev) => ({ ...prev, link: e.target.value }));
                                    }}
                                />
                            </>
                        )
                    }

                    <Button onClick={addLocation} disabled={location.name.trim() === ''} className='mt-2'>
                        Hinzufügen
                    </Button>
                </Card>

                <Card className='p-5 gap-2  '>
                    <ul>
                        {locations.map((p, index) => (
                            <li key={index} className='created-question-option'>
                                <div>
                                    <h2 className='flex w-1/2'>{p.name}</h2>
                                    <p className='text-xs'>
                                        {p?.adress}
                                        {p.link && `, ${p?.link}`}
                                    </p>
                                </div>
                                <TrashButton
                                    onClick={() => {
                                        const newLocations = locations.filter((_, i) => i !== index);
                                        updateEvent({ locations: newLocations });
                                    }}
                                />{' '}
                            </li>
                        ))}
                    </ul>
                    {locations.length > 1 && (
                        <div className='flex flex-row gap-4'>
                            <Checkbox
                                id='dateMultipleChoice'
                                checked={locationConfig.location_multiple_choice}
                                onCheckedChange={(value) => updateEvent({ location_multiple_choice: value as boolean })}
                            />
                            <Label htmlFor='dateMultipleChoice'>Mehrfachauswahl erlauben</Label>
                        </div>
                    )}

                    {locations.length < 1 && (
                        <div className='flex flex-row gap-4 text-base'>
                            <Checkbox
                                id='setDateLater'
                                checked={locationConfig.locationSetLater}
                                onCheckedChange={(value) => updateEvent({ locationSetLater: value as boolean })}
                                className='w-6 h-6'
                            />
                            <Label htmlFor='setDateLater' className='text-base'>
                                Ort später bestimmen
                            </Label>
                        </div>
                    )}
                </Card>
            </div>
            <div className='flex flex-row gap-4 pt-12'>
                <Button variant='outline' onClick={onBack}>
                    Zurück
                </Button>
                <Button disabled={locations.length === 0 && !locationConfig.locationSetLater} onClick={() => onNext()}>
                    Weiter
                </Button>
            </div>
        </div>
    );
}
