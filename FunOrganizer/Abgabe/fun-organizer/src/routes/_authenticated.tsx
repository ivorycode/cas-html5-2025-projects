import { Button } from '@/components/ui/button';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: ({ context }) => {
        if (!context.auth.isAuthenticated) {
            throw new Error('Not authenticated');
        }
    },
    errorComponent: (e) => {
        const navigate = useNavigate();
        return (
            <>
                {/* <div>You are not authorized to view this page</div> */}
                <div>{e.error.message}</div>
                <div>
                    <Button className='cursor-pointer' onClick={() => navigate({ to: '/login' })}>
                        Goto Login
                    </Button>
                </div>
            </>
        );
    },
});
