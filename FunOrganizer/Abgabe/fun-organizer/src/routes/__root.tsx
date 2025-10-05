import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import type { SupabaseAuthState } from '@/lib/auth';
// import { TanstackDevtools } from '@tanstack/react-devtools';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { ConfirmDialogProvider } from '@/components/ui/confirm-dialog-provider';
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

type RouterContext = {
    auth: SupabaseAuthState;
};

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => {
        const { auth } = Route.useRouteContext();
        return (
            <>
                <ConfirmDialogProvider>
                    <Header />

                    <main>
                        <Outlet />
                    </main>
                    {auth.isAuthenticated && <Footer />}
                    <Toaster />
                </ConfirmDialogProvider>
                {/* <TanstackDevtools
                config={{
                    position: 'bottom-left',
                    }}
                    plugins={[
                        {
                            name: 'Tanstack Router',
                            render: <TanStackRouterDevtoolsPanel />,
                            },
                            ]}
                            /> */}
            </>
        );
    },
    notFoundComponent: () => {
        return (
            <div>
                <h2>Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
            </div>
        );
    },
});
