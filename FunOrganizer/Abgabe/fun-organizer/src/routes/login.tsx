import { Login } from '@/components/login';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
    component: RouteComponent,
});

function RouteComponent() {
    return <Login />;
}
