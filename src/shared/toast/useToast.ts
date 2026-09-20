import {create} from 'zustand';

type Toast = { id: number; message: string; severity: 'success' | 'error' | 'info' };

interface ToastStore {
    toasts: Toast[];
    push: (t: Omit<Toast, 'id'>) => void;
    dismiss: (id: number) => void
}

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    push: (t) => set(s => ({toasts: [...s.toasts, {...t, id: Date.now() + Math.random()}]})),
    dismiss: (id) => set(s => ({toasts: s.toasts.filter(t => t.id !== id)})),
}));

export const useToast = () => {
    const push = useToastStore(s => s.push);
    return {
        success: (message: string) => push({message, severity: 'success'}),
        error: (message: string) => push({message, severity: 'error'}),
        info: (message: string) => push({message, severity: 'info'}),
    };
};
