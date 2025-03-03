export interface BoardCard {
    id: number;
    title: string;
    description?: string;
}

export interface BoardSection {
    id: number;
    key: string;
    title: string;
    cards: BoardCard[];
}
