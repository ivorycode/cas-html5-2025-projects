import { useSupabaseAuth } from '@/lib/auth';
import { supabaseUsers } from '@/lib/mock-users';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

export function Login() {
    const navigate = useNavigate();
    const [pendingUser, setPendingUser] = useState<string | null>(null);
    const auth = useSupabaseAuth();

    async function handleLogin(user: (typeof supabaseUsers)[number]) {
        setPendingUser(user.email);
        await auth.login(user.email, user.pw!);
    }

    useEffect(() => {
        // Only navigate after login intent and auth state is ready
        if (pendingUser && auth.isAuthenticated) {
            navigate({ to: '/dashboard' });
            setPendingUser(null);
        }
    }, [pendingUser, auth.isAuthenticated]);

    return (
        <div className='flex flex-col gap-4'>
            <h1 className='text-2xl'>Wer möchtest du sein? 😎</h1>
            <div className='grid grid-cols-2 gap-5'>
                {supabaseUsers.map((user) => (
                    <Card className='w-full cursor-pointer p-4' onClick={() => handleLogin(user)} key={user.email}>
                        <CardHeader className='p-0'>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription className='hyphens-auto text-xs'>{user.email}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}
