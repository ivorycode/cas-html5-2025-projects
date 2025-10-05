import { EventDetails } from '@/components/event-details/event-details';
import { getEventById } from '@/lib/db';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/events/$eventId')({
    loader: async ({ params }) => {
        const { eventId } = params;
        const idNum = Number(eventId);
        if (!eventId || isNaN(idNum) || !Number.isInteger(idNum) || idNum <= 0) {
            throw new Error('Invalid event ID');
        }
        const eventData = await getEventById(idNum);
        return eventData;
    },
    component: RouteComponent,
    errorComponent: ErrorComponent, // Add this line
});

function RouteComponent() {
    const event = Route.useLoaderData();
    return <EventDetails event={event} />;
}

function ErrorComponent({ error }: { error: Error }) {
    return <div className='text-red-600'>Custom error: {error.message}</div>;
}
