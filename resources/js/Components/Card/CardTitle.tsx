import React from "react";

interface Props {
    children: React.ReactNode;
    className?: string;
}

const CardTitle = ({
    children,
    className = ''
}: Props) => {
    return (
        <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
            {children}
        </h3>
    );
};

export default CardTitle;
