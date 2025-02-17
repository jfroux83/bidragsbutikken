import {ReactNode} from "react";
import {LucideIcon} from "lucide-react";

interface ActionButton {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'warning';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    disabled?: boolean;
}

interface Props {
    title: string;
    description?: string;
    actions?: ActionButton[];
    fullWidth?: boolean;
    children: ReactNode;
    containerClassName?: string;
    contentClassName?: string;
}

const PageLayout = ({
    title,
    description = '',
    actions = [],
    fullWidth = false,
    children,
    containerClassName = '',
    contentClassName = '',
}: Props) => {

    // Helper function to get button styles based on variant
    const getButtonStyles = (variant?: string) => {
        const baseStyles = "inline-flex items-center rounded-md border text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";

        switch (variant) {
            case 'secondary':
                return `${baseStyles} border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500`;
            case 'danger':
                return `${baseStyles} border-red-600 bg-white text-red-600 hover:bg-red-50 focus:ring-red-500`;
            case 'warning':
                return `${baseStyles} border-yellow-600 bg-white text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500`;
            default: // primary
                return `${baseStyles} border-green-600 bg-white text-green-600 hover:bg-green-50 focus:ring-green-500`;
        }
    };

    // Helper function to get button size styles
    const getSizeStyles = (size?: string) => {
        switch (size) {
            case 'sm':
                return 'px-2.5 py-1.5 text-xs';
            case 'lg':
                return 'px-4 py-2 text-base';
            default: // md
                return 'px-3 py-2 text-sm';
        }
    };

    return (
        <div className="min-h-full">
            {/* Header section */}
            <header className="bg-white shadow rounded-md">
                <div className={`${fullWidth ? 'max-w-full mx-4' : 'max-w-7xl mx-auto'} px-4 sm:px-6 lg:px-8 py-6`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                            {description && (
                                <p className="mt-1 text-sm text-gray-600">{description}</p>
                            )}
                        </div>
                        {actions.length > 0 && (
                            <div className="flex items-center space-x-3">
                                {actions.map((action, index) => {
                                    const Icon = action.icon;
                                    return (
                                        <button
                                            key={index}
                                            onClick={action.onClick}
                                            disabled={action.disabled || action.isLoading}
                                            className={`
                                                ${getButtonStyles(action.variant)}
                                                ${getSizeStyles(action.size)}
                                                ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                                transition-colors duration-200
                                            `}
                                        >
                                            {action.isLoading ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                                            ) : Icon && (
                                                <Icon className="h-5 w-5 -ml-0.5 mr-2" aria-hidden="true" />
                                            )}
                                            {action.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </header>
            {/* Main Content */}
            <main className={`${containerClassName}`}>
                <div className={`
                    ${fullWidth ? 'max-w-full mx-4' : 'max-w-7xl mx-auto'}
                    px-4 sm:px-6 lg:px-8 py-8
                    ${contentClassName}
                `}>
                    {children}
                </div>
            </main>
        </div>
    );
}

export default PageLayout;
