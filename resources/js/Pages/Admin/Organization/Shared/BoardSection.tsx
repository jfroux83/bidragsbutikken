import React from "react";
import { BoardSection as BoardSectionType } from "@/Pages/Admin/Types/types";
import BoardCard from "@/Pages/Admin/Organization/Shared/BoardCard";

interface Props {
    section: BoardSectionType;
    onCardDrop: (cardId: number, destinationSectionId: number, sectionKey: string) => void;
}

const BoardSection = ({
    section,
    onCardDrop,
}: Props) => {

    const getSectionColor = (sectionId: number): string => {
        switch (sectionId) {
            case 1:
                return 'bg-gray-200';
            default:
                return 'bg-green-200';
        }
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const cardIdStr = event.dataTransfer.getData('cardId');

        if (cardIdStr) {
            const cardId = parseInt(cardIdStr, 10);
            // Call the parent handler with the card id and this section's id as the destination
            onCardDrop(cardId, section.id, section.key);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Necessary to allow a drop
    };

    const sectionColor = getSectionColor(section.id);

    return (
        <div className="w-96 bg-gray-100 rounded p-4">
            <h2 className="font-bold mb-4 text-nowrap">{section.title}</h2>
            <div
                className="space-y-2 min-h-16 border border-dashed border-gray-300 rounded p-2"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {section.cards.map(card => (
                    <BoardCard key={card.id} card={card} cardBgColor={sectionColor} />
                ))}
            </div>
        </div>
    );
};

export default BoardSection;
