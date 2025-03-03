import React, {useEffect, useState} from "react";
import { BoardSection as BoardSectionType, BoardCard as BoardCardType } from "@/Pages/Admin/Types/types";
import axios from "axios";
import {toast} from "@/Lib/toast";
import BoardSection from "@/Pages/Admin/Organization/Shared/BoardSection";
import Spinner from "@/Components/UI/Spinner";

interface Props {
    organization: {
        id: number;
        name: string;
    }
}

const Vendors = ({
    organization
}: Props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [sections, setSections] = useState<BoardSectionType[]>([]);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await axios.get(`/admin/organization/vendors/${organization.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                if (response.data.message === 'success') {
                    setSections(response.data.dataset);
                    toast.success('Vendors successfully loaded!');
                } else {
                    toast.error('Something went wrong. Please try again.');
                }

            } catch (error) {
                console.error(error.message);
                toast.error('Something went wrong. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchVendors();
    }, []);

    const handleCardDrop = async (cardId: number, destinationSectionId: number, sectionKey: string) => {
        setSections(prevSections => {
            // Find the card and its current section
            let cardToMove: BoardCardType | null = null;
            const newSections = prevSections.map(section => {
                const filteredCards = section.cards.filter(card => {
                    if (card.id === cardId) {
                        cardToMove = card;
                        return false;
                    }
                    return true;
                });
                return { ...section, cards: filteredCards };
            });

            // If the card is found, add it to the destination section
            if (cardToMove) {
                return newSections.map(section => {
                    if (section.id === destinationSectionId) {
                        return { ...section, cards: [...section.cards, cardToMove] };
                    }
                    return section;
                });
            }
            return newSections;
        });

        try {
            const response = await axios.post('/admin/organization/vendors/save', {
                organizationId: organization.id,
                vendorId: cardId,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.data.message === 'success') {
                toast.success('Vendor successfully saved!');
            } else {
                toast.error('Something went wrong. Please try again');
            }
        } catch (error) {
            console.error(error.message);
            toast.error('Something went wrong. Please try again');
        }
    };

    return (
        <>
            {isLoading ? (
                    <Spinner />
            ) : (
                <div className="flex space-x-4 p-4">
                    {sections.map(section => (
                        <BoardSection
                            key={section.id}
                            section={section}
                            onCardDrop={handleCardDrop}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default Vendors;
