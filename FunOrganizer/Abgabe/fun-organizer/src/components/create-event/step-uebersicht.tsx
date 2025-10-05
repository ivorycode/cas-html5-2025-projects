import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { EventData } from './create-event';

type Props = {
    event: EventData;
    onBack: () => void;
    onCreate: () => void;
    isSaving?: boolean;
};

export default function StepUebersicht({ event, onBack, onCreate, isSaving }: Props) {
    return (
        <div className='flex justify-center'>
            <div className='w-full'>
                <h2 className='text-2xl font-bold mb-6'>Übersicht</h2>

                <div className='overflow-x-auto rounded-lg shadow-sm'>
                    <table className='w-full border border-gray-200 '>
                        <thead className='bg-gray-100'>
                            <tr>
                                <th className='text-left p-3 border-b border-gray-200'>Kategorie</th>
                                <th className='text-left p-3 border-b border-gray-200'>Details</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200 text-sm align-top'>
                            <tr>
                                <td className='p-3 font-semibold bg-gray-50'>Name</td>
                                <td className='p-3 bg-white'>{event.name}</td>
                            </tr>
                            <tr>
                                <td className='p-3 font-semibold bg-gray-50'>Beschreibung</td>
                                <td className='p-3 bg-white text-gray-600'>
                                    {event.description || <span className='text-gray-400'>Keine Beschreibung</span>}
                                </td>
                            </tr>
                            <tr>
                                <td className='p-3 font-semibold bg-gray-50'>Einladungen</td>
                                <td className='p-3 bg-white'>
                                    {event.invites.length > 0 ? (
                                        <ul className='space-y-1'>
                                            {event.invites.map((i) => (
                                                <li key={i.id} className='text-gray-700'>
                                                    {i.name}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className='text-gray-400'>Keine Einladungen</span>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className='p-3 font-semibold bg-gray-50'>Termine</td>
                                <td className='p-3 bg-white'>
                                    {event.dates.length > 0 ? (
                                        <ul className='space-y-1'>
                                            {event.dates.map((d, idx) => (
                                                <li key={idx}>
                                                    {d.date} {d.time}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className='text-gray-400'>Keine Termine</span>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className='p-3 font-semibold bg-gray-50'>Orte</td>
                                <td className='p-3 bg-white'>
                                    {event.locations.length > 0 ? (
                                        <ul className='space-y-1'>
                                            {event.locations.map((p, index) => (
                                                <li key={index}>
                                                    {p.name} {p.adress && `(${p.adress})`}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className='text-gray-400'>Keine Orte</span>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className='p-3 font-semibold bg-gray-50'>Fragen</td>
                                <td className='p-3 bg-white'>
                                    {event.questions.length > 0 ? (
                                        <ul className='space-y-1'>
                                            {event.questions.map((q, index) => (
                                                <li key={index}>
                                                    {q.question}{' '}
                                                    <span className='text-xs text-gray-500'>
                                                        {q.multiple_choice ? '(Mehrfachauswahl)' : '(Einzelauswahl)'}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className='text-gray-400'>Keine Fragen</span>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className='flex gap-4 mt-8'>
                    <Button onClick={onBack} disabled={isSaving}>
                        Zurück
                    </Button>
                    <Button
                        variant='secondary'
                        onClick={onCreate}
                        className='border-2 border-primary-dark'
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                        Umfrage erstellen
                    </Button>
                </div>
            </div>
        </div>
    );
}
