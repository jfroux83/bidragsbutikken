type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastEvent {
    message: string;
    type: ToastType;
}

// Create a custom event name
const TOAST_EVENT = 'app:toast';

// Create custom event dispatcher
const dispatchToast = (detail: ToastEvent) => {
    const event = new CustomEvent(TOAST_EVENT, { detail });
    document.dispatchEvent(event);
};

export const toast = {
    success: (message: string) => dispatchToast({ message, type: 'success' }),
    error: (message: string) => dispatchToast({ message, type: 'error' }),
    info: (message: string) => dispatchToast({ message, type: 'info' }),
    warning: (message: string) => dispatchToast({ message, type: 'warning' })
};
