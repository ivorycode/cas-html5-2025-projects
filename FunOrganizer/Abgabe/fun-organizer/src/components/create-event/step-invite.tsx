import { useSupabaseAuth } from '@/lib/auth.tsx';
import { supabaseUsers } from '@/lib/mock-users';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Combobox } from '../ui/combobox';
import type { EventData } from './create-event';
import './create-event.css';

const userOptions = supabaseUsers.map((user) => ({
    value: user.id.toString(),
    label: user.name + ' ' + user.emoji,
}));

export default function StepInvite({
    onNext,
    onBack,
    invites,
    updateEvent,
}: {
    onBack: () => void;
    onNext: () => void;
    invites: typeof supabaseUsers;
    updateEvent: (data: Partial<EventData>) => void;
}) {
    const auth = useSupabaseAuth();
    const [selectedUser, setSelectedUser] = useState<typeof supabaseUsers>(invites || []);
    useEffect(() => {
        if (auth.user?.id && !selectedUser.some((u) => u.id === auth.user?.id)) {
            onChooseUser(auth.user.id.toString());
        }
    }, [auth?.user?.id]);
    function onChooseUser(userId: string) {
        const user = supabaseUsers.find((u) => u.id.toString() === userId);
        if (user && !selectedUser.includes(user)) {
            const newUsers = [...selectedUser, user];
            setSelectedUser(newUsers);
            updateEvent({ invites: newUsers });
        }
    }
    function removeUser(userId: string) {
        if (userId == String(auth?.user?.id)) {
            return;
        }
        const newUsers = selectedUser.filter((u) => u.id.toString() !== userId);
        setSelectedUser(newUsers);
        updateEvent({ invites: newUsers });
    }

    const hasData = selectedUser.length > 1 ? false : true;
    const optionsWithoutSelected = userOptions.filter(
        (option) => !selectedUser.some((user) => user.id.toString() === option.value),
    );

    return (
        <div>
            <h1 className='text-2xl font-bold'>Wen möchtes du einladen?</h1>
            <div className='flex flex-col gap-4 my-8'>
                <Combobox options={optionsWithoutSelected} onChoose={onChooseUser} />
            </div>

            <div className='flex flex-wrap gap-2 mb-4'>
                {selectedUser.length > 0 ? (
                    selectedUser.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => removeUser(user.id.toString())}
                            className={user.id === auth.user?.id ? 'admin invite-person' : 'invite-person'}
                            title={`Entferne ${user.name}`}
                        >
                            <div className='text-xl -translate-y-1'>{user.emoji}</div>
                            <div className='-translate-y-1 text-sm'>{user.name}</div>
                        </button>
                    ))
                ) : (
                    <p>Keine Benutzer ausgewählt</p>
                )}
            </div>

            <div className='flex gap-4 mt-8'>
                <Button onClick={onBack}>Zurück</Button>
                <Button onClick={() => onNext()} disabled={hasData}>
                    Weiter
                </Button>
            </div>
        </div>
    );
}
