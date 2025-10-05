import { createContext, useContext, useEffect, useState } from 'react';
import { getUserByAuthId } from './db';
import { authUserSchema, userSchema, type CompleteUser } from './schemas';
import { supabase } from './supabase';

export interface SupabaseAuthState {
    isAuthenticated: boolean;
    user: CompleteUser | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
    refresh: () => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthState | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<CompleteUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            await setCompleteUser(session);
            setIsAuthenticated(!!session?.user);
            setIsLoading(false);
        });

        // Listen for auth changes
        let initial = true; // flag to skip the first call
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (initial) {
                initial = false;
                return; // skip the initial firing on page load because fetching additional user data does not work (supabase client not ready)
            }
            await setCompleteUser(session);
            setIsAuthenticated(!!session?.user);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
    };

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error: any) {
            console.error('Error signing out:', error.message);
        }
        // Clear local state regardless of logout result
        setUser(null);
        setIsAuthenticated(false);
    };

    const setCompleteUser = async (session: any) => {
        if (session?.user) {
            const fromUserTable = await getUserByAuthId(session.user.id);
            const user = userSchema.parse(fromUserTable);
            const { id: auth_user_id, ...restAuth } = session.user;
            const authUser = authUserSchema.parse({ auth_user_id, ...restAuth });
            const completeUserData = { ...user, ...authUser };
            setUser(completeUserData);
        } else {
            setUser(null);
        }
    };

    const refresh = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        await setCompleteUser(session);
    };

    return (
        <SupabaseAuthContext.Provider
            value={{
                isAuthenticated,
                user,
                login,
                logout,
                isLoading,
                refresh,
            }}
        >
            {children}
        </SupabaseAuthContext.Provider>
    );
}

export function useSupabaseAuth() {
    const context = useContext(SupabaseAuthContext);
    if (context === undefined) {
        throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider');
    }
    return context;
}
