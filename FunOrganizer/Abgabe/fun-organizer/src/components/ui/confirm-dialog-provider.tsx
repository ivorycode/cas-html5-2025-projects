'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type ConfirmOptions = {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
};

type ConfirmDialogContextType = {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions>({});
    const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

    const confirm = (options: ConfirmOptions) => {
        setOptions(options);
        setIsOpen(true);
        return new Promise<boolean>((resolve) => {
            setResolver(() => resolve);
        });
    };

    const handleClose = (result: boolean) => {
        setIsOpen(false);
        resolver?.(result);
    };

    return (
        <ConfirmDialogContext.Provider value={{ confirm }}>
            {children}

            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{options.title ?? 'Bist du sicher?'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {options.description ?? 'Diese Aktion kann nicht rückgängig gemacht werden.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => handleClose(false)}>
                            {options.cancelText ?? 'Abbrechen'}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleClose(true)}>
                            {options.confirmText ?? 'Bestätigen'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ConfirmDialogContext.Provider>
    );
}

export function useConfirm() {
    const ctx = useContext(ConfirmDialogContext);
    if (!ctx) throw new Error('useConfirm must be used within ConfirmDialogProvider');
    return ctx.confirm;
}
