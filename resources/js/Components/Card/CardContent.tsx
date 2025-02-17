import React from "react";

interface Props {
    children: React.ReactNode;
    className?: string;
}

const CardContent = ({
    children,
    className = ''
 }) => {
    return (
        <div className={`px-6 py-4 ${className}`}>
            {children}
        </div>
    );
};

export default CardContent;
