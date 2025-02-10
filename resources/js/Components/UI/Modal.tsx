import { X } from 'lucide-react';
import React from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '7xl' | 'full';
    className?: string;
}

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size,
    className
}: Props) => {

if (!isOpen) return null;

const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
    '4xl': 'sm:max-w-4xl',
    '5xl': 'sm:max-w-5xl',
    '7xl': 'sm:max-w-7xl',
    'full': 'sm:max-w-[90%]'
};

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Modal panel */}
            <div className={`bg-white rounded-lg shadow-xl transform transition-all sm:w-full ${sizeClasses[size ?? 'md']} ${className ?? ''} max-h-[90vh] flex flex-col`}>
                {/* Header */}
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Content (flex-grow makes it stretch) */}
                <div className="flex-grow overflow-auto px-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
