import logo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/lib/auth';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: IndexRoute,
});

function IndexRoute() {
    const navigate = useNavigate();
    const auth = useSupabaseAuth();

    return (
        <div className='flex flex-col justify-center items-center gap-6'>
            <img src={logo} alt='Fun Organizer Logo' className='w-24 h-24 mb-2 drop-shadow-lg' />
            <h1 className='text-4xl font-extrabold text-blue-700 text-center'>Willkommen beim Fun Organizer!</h1>
            <p className='text-lg text-gray-700 text-center'>
                Organisiere spielend leicht Events, Umfragen und Treffen mit deinen Freunden. Wähle Termine, Orte und
                Fragen aus, lade Teilnehmer ein und stimme gemeinsam ab.
            </p>
            <div className='w-full flex flex-col gap-2 mt-4 items-center'>
                {!auth.isAuthenticated ? (
                    <Button
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow max-w-2xs'
                        onClick={() => navigate({ to: '/login' })}
                        size='lg'
                    >
                        Jetzt einloggen
                    </Button>
                ) : (
                    <>
                        <div className='text-emerald-700 font-semibold text-center'>
                            Du bist eingeloggt als {auth.user?.email}
                        </div>
                        <Button
                            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow'
                            onClick={() => navigate({ to: '/dashboard' })}
                        >
                            Zum Dashboard
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
