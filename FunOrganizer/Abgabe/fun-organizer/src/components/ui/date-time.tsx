import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDate, formatDateString } from '@/lib/utils';
import { useState } from 'react';

export function DateTime({ onAdd, disabled }: { onAdd: (date: Date, time: string) => void; disabled: boolean }) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState<string>('12:00');

    return (
        <div className='flex flex-wrap gap-4'>
            <div className='flex flex-col gap-3'>
                {/* <Label htmlFor='date-picker' className='px-1'>
                    Date
                </Label> */}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild disabled={disabled}>
                        <Button variant='outline' id='date-picker' className='w-32 justify-between font-normal'>
                            {date ? formatDateString(formatDate(date)) : 'Datum'}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
                        <Calendar
                            mode='single'
                            selected={date}
                            captionLayout='dropdown'
                            startMonth={new Date()}
                            endMonth={new Date(2035, 11)} // December 2025
                            hidden={{
                                before: new Date(), // Jan 1, 2025
                                // after: new Date(2025, 11, 31), // Dec 31, 2025
                            }}
                            onSelect={(date) => {
                                setDate(date);
                                setOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className='flex flex-col gap-3'>
                {/* <Label htmlFor='time-picker' className='px-1'>
                    Time
                </Label> */}
                <Input
                    type='time'
                    id='time-picker'
                    value={time}
                    className='inCard bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                    onChange={(e) => setTime(e.target.value)}
                    disabled={disabled}
                />
            </div>
            <Button onClick={() => onAdd(date!, time!)} disabled={!date || !time || disabled}>
                Hinzufügen
            </Button>
        </div>
    );
}
