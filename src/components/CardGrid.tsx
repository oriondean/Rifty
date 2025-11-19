import React, { useMemo } from 'react';
import { CompactCard } from './CompactCard';
import type { Card as CardType } from '../data/Card';
import { getAllCards } from '../utils/cardAdapter';
import type { FilterState } from '../hooks/useCollection';

interface CardGridProps {
    userCards: CardType[]; // Unfiltered user collection for ownership counts
    filters: FilterState;
    onAddCard: (card: CardType) => void;
    onRemoveCard: (id: string) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({ userCards, filters, onAddCard, onRemoveCard }) => {
    const allCards = useMemo(() => getAllCards(), []);

    // Filter all cards based on current filters
    const filteredAllCards = useMemo(() => {
        return allCards.filter((card) => {
            const matchesSearch = card.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                card.description.toLowerCase().includes(filters.search.toLowerCase());
            const matchesRarity = filters.rarity === 'All' || card.rarity === filters.rarity;
            const matchesElement = filters.element === 'All' || card.element === filters.element;
            const matchesType = filters.type === 'All' || card.type === filters.type;

            return matchesSearch && matchesRarity && matchesElement && matchesType;
        });
    }, [allCards, filters]);

    // Group cards by set
    const cardsBySet = useMemo(() => {
        const groups = new Map<string, { name: string, cards: CardType[] }>();

        filteredAllCards.forEach(card => {
            if (!groups.has(card.set)) {
                groups.set(card.set, { name: card.setName, cards: [] });
            }
            groups.get(card.set)?.cards.push(card);
        });

        // Sort cards within sets by collector number, with alternates after standard cards
        groups.forEach(group => {
            group.cards.sort((a, b) => {
                // First sort by collector number
                if (a.collectorNumber !== b.collectorNumber) {
                    return a.collectorNumber - b.collectorNumber;
                }
                // If same collector number, standard (no 'a' suffix) comes before alternate ('a' suffix)
                const aIsAlternate = a.id.match(/-\d+a-/);
                const bIsAlternate = b.id.match(/-\d+a-/);
                if (!aIsAlternate && bIsAlternate) return -1; // a comes first
                if (aIsAlternate && !bIsAlternate) return 1;  // b comes first
                return 0; // both are same type
            });
        });

        // Enforce Set Order: OGN -> PG -> SFD
        const orderedGroups = new Map<string, { name: string, cards: CardType[] }>();
        const order = ['OGN', 'PG', 'SFD'];

        order.forEach(code => {
            if (groups.has(code)) {
                orderedGroups.set(code, groups.get(code)!);
                groups.delete(code);
            }
        });

        // Add any remaining sets
        groups.forEach((value, key) => orderedGroups.set(key, value));

        return orderedGroups;
    }, [filteredAllCards]);

    // Count owned cards (using unfiltered user collection)
    const ownedCounts = useMemo(() => {
        const counts = new Map<string, number>();
        userCards.forEach(card => {
            // Key by set + collector number to be unique across sets
            const key = `${card.set}-${card.collectorNumber}`;
            counts.set(key, (counts.get(key) || 0) + 1);
        });
        return counts;
    }, [userCards]);

    const handleRemoveOne = (card: CardType) => {
        // Find the last instance of this card in the user's collection
        // We need to match by set and collector number (or name/id if unique in source)
        // Since userCards have unique IDs, we need to find one that matches the source card's data
        const instanceToRemove = userCards.find(c =>
            c.set === card.set && c.collectorNumber === card.collectorNumber
        );

        if (instanceToRemove) {
            onRemoveCard(instanceToRemove.id);
        }
    };

    return (
        <div className="space-y-8 px-6 py-6">
            {filteredAllCards.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-rift-300">
                    <p className="text-xl">No cards found matching your filters.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {Array.from(cardsBySet.entries()).map(([setCode, group]) => {
                        // Calculate set statistics
                        const totalCardsInSet = group.cards.length;
                        const uniqueOwned = group.cards.filter(card => {
                            const key = `${card.set}-${card.collectorNumber}`;
                            return (ownedCounts.get(key) || 0) > 0;
                        }).length;
                        const duplicatesCount = group.cards.filter(card => {
                            const key = `${card.set}-${card.collectorNumber}`;
                            return (ownedCounts.get(key) || 0) > 1;
                        }).length;
                        const completionPercentage = totalCardsInSet > 0 ? Math.round((uniqueOwned / totalCardsInSet) * 100) : 0;

                        return (
                            <div key={setCode} className="space-y-4">
                                <div className="flex items-baseline gap-4 border-b border-rift-800 pb-2">
                                    <h2 className="text-2xl font-fantasy font-bold text-rift-100">{group.name}</h2>
                                    <span className="text-rift-500 font-mono text-sm uppercase tracking-wider">{setCode}</span>
                                    <div className="flex items-center gap-3 ml-auto text-sm">
                                        <span className="text-rift-400">
                                            Owned: <span className="text-rift-100 font-bold">{uniqueOwned}/{totalCardsInSet}</span>
                                        </span>
                                        <span className="text-rift-400">
                                            With Duplicates: <span className="text-rift-100 font-bold">{duplicatesCount}</span>
                                        </span>
                                        <span className="text-rift-400">
                                            Completion: <span className={`font-bold ${completionPercentage === 100 ? 'text-green-400' : 'text-rift-100'}`}>{completionPercentage}%</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 justify-center">
                                    {group.cards.map(card => {
                                        const key = `${card.set}-${card.collectorNumber}`;
                                        const count = ownedCounts.get(key) || 0;

                                        return (
                                            <CompactCard
                                                key={card.id}
                                                card={card}
                                                ownedCount={count}
                                                onAdd={() => onAddCard(card)}
                                                onRemove={() => handleRemoveOne(card)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
