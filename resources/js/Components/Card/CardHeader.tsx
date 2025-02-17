import React from "react";

interface Props {
    children?: React.ReactNode;
    className?: string;
}

const CardHeader = ({
    children,
    className = ''
}: Props) => {
    return (
        <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
            {children}
        </div>
    );
};

export default CardHeader;
