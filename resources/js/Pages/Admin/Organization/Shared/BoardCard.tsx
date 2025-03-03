import { BoardCard as BoardCardType } from "@/Pages/Admin/Types/types";
import React from "react";

interface Props {
    card: BoardCardType;
    cardBgColor: string;
}

const BoardCard = ({
    card,
    cardBgColor,
}: Props) => {

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        // Store the card id as a string in the DataTransfer object
        event.dataTransfer.setData("cardId", String(card.id));
    };

    return (
        <div
            className={`${cardBgColor ? cardBgColor : "bg-white"} shadow rounded p-2 text-nowrap`}
            draggable={true}
            onDragStart={handleDragStart}
        >
            <h3 className="font-semibold">{card.title}</h3>
            <p className="text-sm text-gray-600">{card.description}</p>
        </div>
    );
};

export default BoardCard;
