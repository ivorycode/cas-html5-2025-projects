import { toast } from 'sonner';

export function useAppToast() {
    function successToast(message: string) {
        toast.success(message, {
            className: 'my-toast',
            position: 'top-center',
            style: { background: '#008435', color: '#fff' },
        });
    }
    function errorToast(message: string) {
        toast.error(message, {
            className: 'my-toast',
            position: 'top-center',
            style: { background: '#b00020', color: '#fff' },
        });
    }
    return { successToast, errorToast };
}
