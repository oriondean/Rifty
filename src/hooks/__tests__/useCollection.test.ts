import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCollection } from '../useCollection';
import type { Card } from '../../data/Card';

const mockCard: Card = {
    id: 'test-1',
    name: 'Test Card',
    description: 'A test card',
    rarity: 'Common',
    element: 'Fury',
    type: 'Unit',
    power: 5,
    cost: 3,
    image: '/test.jpg',
    collectorNumber: 1,
    set: 'TEST',
    setName: 'Test Set',
    isAlternate: false,
};

describe('useCollection', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should initialize with empty collection', () => {
        const { result } = renderHook(() => useCollection());
        expect(result.current.totalCount).toBe(0);
    });

    it('should add card to collection', () => {
        const { result } = renderHook(() => useCollection());

        act(() => {
            result.current.addCard(mockCard);
        });

        expect(result.current.totalCount).toBe(1);
        expect(result.current.allUserCards).toHaveLength(1);
    });

    it('should remove card from collection', () => {
        const { result } = renderHook(() => useCollection());

        act(() => {
            result.current.addCard(mockCard);
        });

        const cardId = result.current.allUserCards[0].id;

        act(() => {
            result.current.removeCard(cardId);
        });

        expect(result.current.totalCount).toBe(0);
    });

    it('should filter cards by search', () => {
        const { result } = renderHook(() => useCollection());

        act(() => {
            result.current.addCard(mockCard);
            result.current.addCard({ ...mockCard, id: 'test-2', name: 'Different Card' });
        });

        act(() => {
            result.current.updateFilter('search', 'Different');
        });

        expect(result.current.displayedCount).toBe(1);
    });

    it('should persist to localStorage', () => {
        const { result } = renderHook(() => useCollection());

        act(() => {
            result.current.addCard(mockCard);
        });

        const saved = localStorage.getItem('rifty-collection');
        expect(saved).toBeTruthy();

        const parsed = JSON.parse(saved!);
        expect(parsed).toHaveLength(1);
    });

    it('should load from localStorage on init', () => {
        localStorage.setItem('rifty-collection', JSON.stringify([mockCard]));

        const { result } = renderHook(() => useCollection());
        expect(result.current.totalCount).toBe(1);
    });

    it('should handle localStorage errors gracefully on init', () => {
        // Set invalid JSON to trigger parse error
        localStorage.setItem('rifty-collection', 'invalid json');

        const { result } = renderHook(() => useCollection());
        expect(result.current.totalCount).toBe(0);
    });

    it('should add multiple cards at once', () => {
        const { result } = renderHook(() => useCollection());

        const cards = [
            mockCard,
            { ...mockCard, id: 'test-2', name: 'Card 2' },
            { ...mockCard, id: 'test-3', name: 'Card 3' },
        ];

        act(() => {
            result.current.addCards(cards);
        });

        expect(result.current.totalCount).toBe(3);
    });

    it('should filter by rarity', () => {
        const { result } = renderHook(() => useCollection());

        act(() => {
            result.current.addCard(mockCard);
            result.current.addCard({ ...mockCard, id: 'test-2', rarity: 'Rare' });
        });

        act(() => {
            result.current.updateFilter('rarity', 'Rare');
        });

        expect(result.current.displayedCount).toBe(1);
    });

    it('should filter by element', () => {
        const { result } = renderHook(() => useCollection());

        act(() => {
            result.current.addCard(mockCard);
            result.current.addCard({ ...mockCard, id: 'test-2', element: 'Calm' });
        });

        act(() => {
            result.current.updateFilter('element', 'Calm');
        });

        expect(result.current.displayedCount).toBe(1);
    });

    it('should filter by type', () => {
        const { result } = renderHook(() => useCollection());

        act(() => {
            result.current.addCard(mockCard);
            result.current.addCard({ ...mockCard, id: 'test-2', type: 'Spell' });
        });

        act(() => {
            result.current.updateFilter('type', 'Spell');
        });

        expect(result.current.displayedCount).toBe(1);
    });

    it('should sort by name ascending (default)', () => {
        const { result } = renderHook(() => useCollection());

        act(() => {
            result.current.addCard({ ...mockCard, id: 'test-1', name: 'Zebra' });
            result.current.addCard({ ...mockCard, id: 'test-2', name: 'Apple' });
        });

        // Default sort is already name:asc, so cards should be sorted
        expect(result.current.cards[0].name).toBe('Apple');
        expect(result.current.cards[1].name).toBe('Zebra');
    });

    it('should sort by name descending', () => {
        const { result } = renderHook(() => useCollection());

        act(() => {
            result.current.addCard({ ...mockCard, id: 'test-1', name: 'Apple' });
            result.current.addCard({ ...mockCard, id: 'test-2', name: 'Zebra' });
        });

        act(() => {
            result.current.updateSort('name'); // Toggle to descending since default is name:asc
        });

        expect(result.current.cards[0].name).toBe('Zebra');
        expect(result.current.cards[1].name).toBe('Apple');
    });

    it('should sort by rarity', () => {
        const { result } = renderHook(() => useCollection());

        act(() => {
            result.current.addCard({ ...mockCard, id: 'test-1', rarity: 'Epic' });
            result.current.addCard({ ...mockCard, id: 'test-2', rarity: 'Common' });
            result.current.addCard({ ...mockCard, id: 'test-3', rarity: 'Rare' });
        });

        act(() => {
            result.current.updateSort('rarity');
        });

        expect(result.current.cards[0].rarity).toBe('Common');
        expect(result.current.cards[1].rarity).toBe('Rare');
        expect(result.current.cards[2].rarity).toBe('Epic');
    });

    it('should sort by power', () => {
        const { result } = renderHook(() => useCollection());

        act(() => {
            result.current.addCard({ ...mockCard, id: 'test-1', power: 10 });
            result.current.addCard({ ...mockCard, id: 'test-2', power: 3 });
            result.current.addCard({ ...mockCard, id: 'test-3', power: 7 });
        });

        act(() => {
            result.current.updateSort('power');
        });

        expect(result.current.cards[0].power).toBe(3);
        expect(result.current.cards[1].power).toBe(7);
        expect(result.current.cards[2].power).toBe(10);
    });

    it('should sort by cost', () => {
        const { result } = renderHook(() => useCollection());

        act(() => {
            result.current.addCard({ ...mockCard, id: 'test-1', cost: 5 });
            result.current.addCard({ ...mockCard, id: 'test-2', cost: 1 });
        });

        act(() => {
            result.current.updateSort('cost');
            result.current.updateSort('cost'); // Toggle to descending
        });

        expect(result.current.cards[0].cost).toBe(5);
        expect(result.current.cards[1].cost).toBe(1);
    });

    it('should search in description', () => {
        const { result } = renderHook(() => useCollection());

        act(() => {
            result.current.addCard({ ...mockCard, id: 'test-1', name: 'Card 1', description: 'Has special ability' });
            result.current.addCard({ ...mockCard, id: 'test-2', name: 'Card 2', description: 'Normal card' });
        });

        act(() => {
            result.current.updateFilter('search', 'special');
        });

        expect(result.current.displayedCount).toBe(1);
    });

    it('should handle case-insensitive search', () => {
        const { result } = renderHook(() => useCollection());

        act(() => {
            result.current.addCard({ ...mockCard, id: 'test-1', name: 'UPPERCASE' });
        });

        act(() => {
            result.current.updateFilter('search', 'uppercase');
        });

        expect(result.current.displayedCount).toBe(1);
    });
});
