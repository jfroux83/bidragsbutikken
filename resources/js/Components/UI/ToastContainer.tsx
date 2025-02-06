import {useEffect, useState} from "react";
import {usePage} from "@inertiajs/react";
import {AlertTriangle, CheckCircle, Info, X, XCircle} from "lucide-react";

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

const ToastContainer = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const { flash } = usePage().props;

    // Icons for different toast types
    const icons = {
        success: CheckCircle,
        error: XCircle,
        info: Info,
        warning: AlertTriangle
    }

    // Colors for different toast types
    const colors = {
        success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    };

    const iconColors = {
        success: 'text-emerald-500',
        error: 'text-red-500',
        info: 'text-blue-500',
        warning: 'text-yellow-500',
    };

    useEffect(() => {
        // Check for flash messages and create toasts
        // @ts-ignore
        if (flash.success) {
            // @ts-ignore
            addToast(flash.success, 'success');
        }
        // @ts-ignore
        if (flash.error) {
            // @ts-ignore
            addToast(flash.error, 'error');
        }
        // @ts-ignore
        if (flash.info) {
            // @ts-ignore
            addToast(flash.info, 'info');
        }
        // @ts-ignore
        if (flash.warning) {
            // @ts-ignore
            addToast(flash.warning, 'warning');
        }
    }, [flash]);

    const addToast = (message: string, type: ToastType) => {
        const id = Date.now().toString();
        setToasts(current => [...current, { id, message, type }]);

        // Remove toast after 3 seconds
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    };

    const removeToast = (id: string) => {
        setToasts(current => current.filter(toast => toast.id !== id));
    };

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map(toast => {
                const Icon = icons[toast.type];

                return (
                    <div
                        key={toast.id}
                        className={`${colors[toast.type]} flex items-center justify-between gap-2 rounded-lg border p-4 shadow-lg transition-all duration-500 ease-in-out min-w-[300px] max-w-md`}
                        role="alert"
                    >
                        <div className="flex items-center gap-2">
                            <Icon className={`h-5 w-5 ${iconColors[toast.type]}`} />
                            <p className="text-sm font-medium">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-auto inline-flex h-5 w-5 items-center justify-center hover:opacity-70"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default ToastContainer;
