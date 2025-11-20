import { describe, it, expect } from 'vitest';
import { adaptCard, getAllCards, getCardsByNumber, getCardsByNumberAndType } from '../cardAdapter';
import type { RawCardData } from '../cardAdapter';

describe('cardAdapter', () => {
    const mockRawCard: RawCardData = {
        id: 'OGN-1-fury',
        name: 'Test Card',
        text: '<p>Test description</p>',
        rarity: { label: 'Common' },
        domains: [{ label: 'Fury' }],
        cardType: [{ label: 'Unit' }],
        energy: 3,
        power: 5,
        cardImage: { url: '/test.jpg' },
        collectorNumber: 1,
        set: 'OGN',
        setName: 'Origins',
    };

    describe('adaptCard', () => {
        it('should transform raw card data to Card type', () => {
            const result = adaptCard(mockRawCard);

            expect(result).toMatchObject({
                id: 'OGN-1-fury',
                name: 'Test Card',
                rarity: 'Common',
                element: 'Fury',
                type: 'Unit',
                cost: 3,
                power: 5,
                collectorNumber: 1,
                set: 'OGN',
                setName: 'Origins',
                isAlternate: false,
            });
        });

        it('should strip HTML from description', () => {
            const result = adaptCard(mockRawCard);
            expect(result.description).toBe('Test description');
            expect(result.description).not.toContain('<p>');
        });

        it('should detect alternate cards', () => {
            const alternateCard = {
                ...mockRawCard,
                id: 'OGN-1a-fury',
                name: 'Test Card',
            };

            const result = adaptCard(alternateCard);
            expect(result.isAlternate).toBe(true);
            expect(result.name).toContain('(Alternate)');
        });

        it('should handle missing power', () => {
            const { power, ...cardWithoutPower } = mockRawCard;
            const result = adaptCard(cardWithoutPower);
            expect(result.power).toBe(0);
        });
    });

    describe('getAllCards', () => {
        it('should return array of cards', () => {
            const cards = getAllCards();
            expect(Array.isArray(cards)).toBe(true);
            expect(cards.length).toBeGreaterThan(0);
        });

        it('should return properly typed cards', () => {
            const cards = getAllCards();
            const firstCard = cards[0];

            expect(firstCard).toHaveProperty('id');
            expect(firstCard).toHaveProperty('name');
            expect(firstCard).toHaveProperty('rarity');
            expect(firstCard).toHaveProperty('element');
            expect(firstCard).toHaveProperty('type');
        });
    });

    describe('getCardsByNumber', () => {
        it('should filter cards by collector number', () => {
            const cards = getCardsByNumber(1);
            expect(cards.every(c => c.collectorNumber === 1)).toBe(true);
        });
    });

    describe('getCardsByNumberAndType', () => {
        it('should filter by collector number and alternate status', () => {
            const standardCards = getCardsByNumberAndType(1, false);
            const alternateCards = getCardsByNumberAndType(1, true);

            expect(standardCards.every(c => !c.isAlternate)).toBe(true);
            expect(alternateCards.every(c => c.isAlternate)).toBe(true);
        });
    });

    describe('adaptCard edge cases', () => {
        it('should handle missing text field', () => {
            const { text, ...cardWithoutText } = mockRawCard;
            const result = adaptCard(cardWithoutText as any);
            expect(result.description).toBe('');
        });

        it('should handle empty domains array', () => {
            const cardWithEmptyDomains = {
                ...mockRawCard,
                domains: [],
            };
            const result = adaptCard(cardWithEmptyDomains);
            expect(result.element).toBe('Neutral');
        });

        it('should handle missing energy field', () => {
            const { energy, ...cardWithoutEnergy } = mockRawCard;
            const result = adaptCard(cardWithoutEnergy as any);
            expect(result.cost).toBe(0);
        });

        it('should preserve exact card ID', () => {
            const result = adaptCard(mockRawCard);
            expect(result.id).toBe(mockRawCard.id);
        });

        it('should correctly map all rarity types', () => {
            const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Showcase'];
            rarities.forEach(rarity => {
                const card = { ...mockRawCard, rarity: { label: rarity } };
                const result = adaptCard(card);
                expect(result.rarity).toBe(rarity);
            });
        });

        it('should correctly map all element types', () => {
            const elements = ['Fury', 'Calm', 'Body', 'Chaos', 'Mind'];
            elements.forEach(element => {
                const card = { ...mockRawCard, domains: [{ label: element }] };
                const result = adaptCard(card);
                expect(result.element).toBe(element);
            });
        });

        it('should correctly map all card types', () => {
            const types = ['Unit', 'Spell', 'Rune'];
            types.forEach(type => {
                const card = { ...mockRawCard, cardType: [{ label: type }] };
                const result = adaptCard(card);
                expect(result.type).toBe(type);
            });
        });
    });

    describe('getCardsByNumber edge cases', () => {
        it('should return empty array for non-existent collector number', () => {
            const cards = getCardsByNumber(99999);
            expect(cards).toEqual([]);
        });

        it('should handle collector number 0', () => {
            const cards = getCardsByNumber(0);
            expect(Array.isArray(cards)).toBe(true);
        });
    });
});
