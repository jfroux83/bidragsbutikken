import React from "react";
import {X} from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: string;
}

const SlidingPanel = ({
    isOpen,
    onClose,
    title,
    children,
    width = 'w-2/3'
}: Props) => {

    return (
        <div className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-transform transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
        } ${width} z-50`}>
            <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button onClick={onClose}>
                    <X className="w-5 h-5 text-gray-600" />
                </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-48px)]">{children}</div>
        </div>
    );
};

export default SlidingPanel;
