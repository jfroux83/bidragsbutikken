import React from "react";

interface Props {
    children: React.ReactNode;
    className?: string;
}

const Card = ({
    children,
    className = ''
}: Props) => {
    return (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
            {children}
        </div>
    );
};

export default Card;
