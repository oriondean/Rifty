import { useState, useMemo, useEffect } from 'react';
import type { Card, Rarity, Element, CardType } from '../data/Card';

export type SortField = 'name' | 'power' | 'cost' | 'rarity';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
    search: string;
    rarity: Rarity | 'All';
    element: Element | 'All';
    type: CardType | 'All';
}

const STORAGE_KEY = 'rifty-collection';

export const useCollection = () => {
    // Initialize from LocalStorage or empty array
    const [cards, setCards] = useState<Card[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    // Persist to LocalStorage whenever cards change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }, [cards]);

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        rarity: 'All',
        element: 'All',
        type: 'All',
    });
    const [sort, setSort] = useState<{ field: SortField; direction: SortDirection }>({
        field: 'name',
        direction: 'asc',
    });

    const filteredCards = useMemo(() => {
        return cards.filter((card) => {
            const matchesSearch = card.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                card.description.toLowerCase().includes(filters.search.toLowerCase());
            const matchesRarity = filters.rarity === 'All' || card.rarity === filters.rarity;
            const matchesElement = filters.element === 'All' || card.element === filters.element;
            const matchesType = filters.type === 'All' || card.type === filters.type;

            return matchesSearch && matchesRarity && matchesElement && matchesType;
        });
    }, [cards, filters]);

    const sortedCards = useMemo(() => {
        return [...filteredCards].sort((a, b) => {
            let comparison = 0;
            if (sort.field === 'rarity') {
                const rarityOrder: Record<string, number> = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5, Mythic: 6, Showcase: 7 };
                comparison = rarityOrder[a.rarity] - rarityOrder[b.rarity];
            } else if (typeof a[sort.field] === 'string') {
                comparison = (a[sort.field] as string).localeCompare(b[sort.field] as string);
            } else {
                comparison = (a[sort.field] as number) - (b[sort.field] as number);
            }

            return sort.direction === 'asc' ? comparison : -comparison;
        });
    }, [filteredCards, sort]);

    const updateFilter = (key: keyof FilterState, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const updateSort = (field: SortField) => {
        setSort((prev) => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const removeCard = (id: string) => {
        setCards((prev) => prev.filter((c) => c.id !== id));
    };

    const addCard = (card: Card) => {
        // Generate a unique ID for the collection instance
        const newCard = { ...card, id: crypto.randomUUID() };
        setCards((prev) => [newCard, ...prev]);
    };

    const addCards = (newCards: Card[]) => {
        const cardsWithIds = newCards.map(c => ({ ...c, id: crypto.randomUUID() }));
        setCards((prev) => [...cardsWithIds, ...prev]);
    };

    return {
        cards: sortedCards,
        allUserCards: cards,
        filters,
        sort,
        updateFilter,
        updateSort,
        removeCard,
        addCard,
        addCards,
        totalCount: cards.length,
        displayedCount: sortedCards.length,
    };
};
