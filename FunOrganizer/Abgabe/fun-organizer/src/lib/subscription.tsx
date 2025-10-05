import type { RealtimeChannel } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSupabaseAuth } from './auth';
import type { EventDetail } from './schemas';
import { supabase } from './supabase';

type SingleAnswer = EventDetail['answer'][number];
type SingleInvite = EventDetail['invites'][number];

interface SubscriptionContextType {
    answerChange: SingleAnswer | null;
    invite: SingleInvite | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export default function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const auth = useSupabaseAuth();
    const [answerChange, setAnswerChange] = useState<SingleAnswer | null>(null);
    const [invite, setInvite] = useState<SingleInvite | null>(null);

    let answerChannel: RealtimeChannel | null = null;
    let inviteChannel: RealtimeChannel | null = null;

    useEffect(() => {
        if (auth.user) {
            async function setUpSubscriptions() {
                const answerChannelName = 'answer:' + ':' + auth.user!.id.toString();
                const token = (await supabase.auth.getSession()).data.session?.access_token;
                supabase.realtime.setAuth(token);

                answerChannel = supabase
                    .channel(answerChannelName)
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'answer' }, (payload) => {
                        if (payload.eventType === 'UPDATE') {
                            setAnswerChange(payload.new as SingleAnswer);
                        }
                    })
                    .subscribe();

                // Realtime-Updates von invites abonnieren
                inviteChannel = supabase
                    .channel('invites-user-channel')
                    .on('postgres_changes', { event: '*', schema: 'public', table: 'invites' }, (payload) => {
                        if (payload.eventType === 'INSERT') {
                            setInvite(payload.new as SingleInvite);
                        }
                    })
                    .subscribe();
            }
            setUpSubscriptions();
        }

        return () => {
            if (answerChannel) {
                supabase.removeChannel(answerChannel);
            }
            if (inviteChannel) {
                supabase.removeChannel(inviteChannel);
            }
        };
    }, [auth.user?.id]);

    return <SubscriptionContext.Provider value={{ answerChange, invite }}>{children}</SubscriptionContext.Provider>;
}

export function useSubscriptions() {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscriptions must be used within SubscriptionContext');
    }
    return context;
}
