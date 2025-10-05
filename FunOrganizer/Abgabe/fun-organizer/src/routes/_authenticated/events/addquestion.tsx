import { DetailAddQuestion } from '@/components/event-details/detail-add-question';
import { getEventById } from '@/lib/db';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/events/addquestion')({
    validateSearch: (search: Record<string, unknown>) => {
        const id = typeof search.id === 'number' && !isNaN(search.id) ? search.id : undefined;
        return { id };
    },
    loaderDeps: ({ search }) => ({ id: search.id }),
    loader: async ({ context, deps: { id } }) => {
        if (id === undefined) {
            return {
                event: undefined,
                error: 'id ist keine Nummer.',
            };
        }
        try {
            const event = await getEventById(id);
            if (event.admin_id !== context.auth.user?.id) {
                return {
                    event: undefined,
                    error: 'Du bist nicht der Admin dieses Events!',
                };
            }
            return { event, error: undefined };
        } catch (e) {
            return {
                event: undefined,
                error: 'Beim Laden der Event-Daten ist ein Fehler aufgetreten.',
            };
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    const event = Route.useLoaderData();

    if (event.error) {
        return <div className='text-red-600'>Error: {event.error}</div>;
    }

    return <DetailAddQuestion event={event.event!} />;
}
