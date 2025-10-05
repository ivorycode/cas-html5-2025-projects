import { createRouter, RouterProvider } from '@tanstack/react-router';

// Import the generated route tree
import { Loader2 } from 'lucide-react';
import { SupabaseAuthProvider, useSupabaseAuth } from './lib/auth';
import SubscriptionProvider from './lib/subscription';
import { routeTree } from './routeTree.gen';

// Create a new router instance
export const router = createRouter({
    routeTree,
    context: { auth: undefined! },
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

function InnerApp() {
    const auth = useSupabaseAuth();

    if (auth.isLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                Loading <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            </div>
        );
    }

    return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
    return (
        <SupabaseAuthProvider>
            <SubscriptionProvider>
                <InnerApp />
            </SubscriptionProvider>
        </SupabaseAuthProvider>
    );
}

export default App;
