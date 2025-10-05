import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSupabaseAuth } from '@/lib/auth';
import { updateUserProfileByAuthUid } from '@/lib/db'; // Pfad anpassen
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import './profile.css';

export const Route = createFileRoute('/_authenticated/user/settings')({
    component: UserSettings,
});

function UserSettings() {
    const auth = useSupabaseAuth();
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emoji, setEmoji] = useState('');

    useEffect(() => {
        if (auth.user) {
            setFirstName(auth.user.first_name || '');
            setLastName(auth.user.last_name || '');
            setEmoji(auth.user.emoji || '');
        }
    }, [auth.user]);

    const handleSave = async () => {
        if (!auth.user) return;
        setLoading(true);
        try {
            const authUid = (auth.user as any).user_id ?? (auth.user as any).auth_user_id;

            if (!authUid) {
                throw new Error('No auth UID on user (user_id/auth_user_id missing)');
            }

            await updateUserProfileByAuthUid(authUid, {
                first_name: firstName,
                last_name: lastName,
                emoji,
            });

            await auth.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (auth.isLoading) return <p>Lade Benutzerdaten…</p>;
    if (!auth.isAuthenticated) return <p>Bitte einloggen.</p>;

    return (
        <>
            <div>
                <h1>User Settings</h1>
                <label className='block space-y-1 mb-4'>
                    <span className='text-sm'>First name</span>
                    <Input id='firstName' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </label>
                <label className='block space-y-1 mb-4'>
                    <span className='text-sm'>Last name</span>
                    <Input id='lastName' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </label>

                <label className='block space-y-1 mb-4'>
                    <span className='text-sm'>Emoji</span>
                    <Input id='emoji' value={emoji} onChange={(e) => setEmoji(e.target.value)} />
                </label>
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving…' : 'Save Changes'}
                </Button>
            </div>
        </>
    );
}
