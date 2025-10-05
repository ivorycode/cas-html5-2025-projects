import CreateEvent from '@/components/create-event/create-event';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/events/create')({
    component: CreateEvent,
});
