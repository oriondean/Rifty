import React, { useMemo } from 'react';
import { CompactCard } from './CompactCard';
import type { Card as CardType } from '../data/Card';
import { useCardData } from '../contexts/CardDataContext';
import type { FilterState } from '../hooks/useCollection';
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { EXCLUDED_SETS, SET_ORDER, RARITY_COLORS } from '../constants';

interface CardGridProps {
    userCards: CardType[]; // Unfiltered user collection for ownership counts
    filters: FilterState;
    onAddCard: (card: CardType) => void;
    onRemoveCard: (id: string) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({ userCards, filters, onAddCard, onRemoveCard }) => {
    const allCards = useCardData();

    // Filter all cards based on current filters
    const filteredAllCards = useMemo(() => {
        return allCards.filter((card) => {
            if (EXCLUDED_SETS.includes(card.set as typeof EXCLUDED_SETS[number])) return false;
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

        SET_ORDER.forEach(code => {
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
            // Key by set + collector number + alternate status to be unique
            const key = `${card.set}-${card.collectorNumber}-${card.isAlternate ? 'a' : 'n'}`;
            counts.set(key, (counts.get(key) || 0) + 1);
        });
        return counts;
    }, [userCards]);

    const handleRemoveOne = (card: CardType) => {
        // Find the last instance of this card in the user's collection
        // We need to match by set, collector number, and alternate status
        const instanceToRemove = userCards.find(c =>
            c.set === card.set &&
            c.collectorNumber === card.collectorNumber &&
            c.isAlternate === card.isAlternate
        );

        if (instanceToRemove) {
            onRemoveCard(instanceToRemove.id);
        }
    };

    return (
        <div className="space-y-8 px-6 py-6">
            {filteredAllCards.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <p className="text-xl">No cards found matching your filters.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {Array.from(cardsBySet.entries()).map(([setCode, group]) => {
                        // Calculate set statistics
                        const totalCardsInSet = group.cards.length;
                        const uniqueOwned = group.cards.filter(card => {
                            const key = `${card.set}-${card.collectorNumber}-${card.isAlternate ? 'a' : 'n'}`;
                            return (ownedCounts.get(key) || 0) > 0;
                        }).length;
                        const duplicatesCount = group.cards.reduce((acc, card) => {
                            const key = `${card.set}-${card.collectorNumber}-${card.isAlternate ? 'a' : 'n'}`;
                            const count = ownedCounts.get(key) || 0;
                            return acc + (count > 1 ? count - 1 : 0);
                        }, 0);
                        const completionPercentage = totalCardsInSet > 0 ? Math.round((uniqueOwned / totalCardsInSet) * 100) : 0;

                        return (
                            <div key={setCode} className="space-y-4">
                                <div className="flex items-baseline gap-4 border-b pb-2">
                                    <h2 className="text-2xl font-fantasy font-bold">{group.name}</h2>
                                    <span className="text-muted-foreground font-mono text-sm uppercase tracking-wider">{setCode}</span>
                                </div>

                                {/* Statistics Panel */}
                                <Card className="bg-muted/50">
                                    <CardContent className="p-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {/* Overall Progress */}
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Set Progress</span>
                                                <div className="flex items-baseline gap-2">
                                                    <span className={`text-2xl font-bold ${completionPercentage === 100 ? 'text-primary' : ''}`}>
                                                        {completionPercentage}%
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">
                                                        ({uniqueOwned}/{totalCardsInSet})
                                                    </span>
                                                </div>
                                                <Progress value={completionPercentage} className="h-1.5" />
                                            </div>

                                            {/* Duplicates */}
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Duplicates</span>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-2xl font-bold">{duplicatesCount}</span>
                                                    <span className="text-sm text-muted-foreground">extra cards</span>
                                                </div>
                                            </div>

                                            {/* Rarity Breakdown */}
                                            <div className="col-span-2 grid grid-cols-3 sm:grid-cols-5 gap-2">
                                                {['Common', 'Uncommon', 'Rare', 'Epic', 'Showcase'].map(rarity => {
                                                    const rarityCards = group.cards.filter(c => c.rarity === rarity);
                                                    const totalRarity = rarityCards.length;
                                                    if (totalRarity === 0) return null;

                                                    const ownedRarity = rarityCards.filter(c => {
                                                        const key = `${c.set}-${c.collectorNumber}-${c.isAlternate ? 'a' : 'n'}`;
                                                        return (ownedCounts.get(key) || 0) > 0;
                                                    }).length;

                                                    const rarityColor = RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || 'bg-gray-500';

                                                    return (
                                                        <div key={rarity} className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-1">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${rarityColor}`} />
                                                                <span className="text-[10px] text-muted-foreground uppercase">{rarity}</span>
                                                            </div>
                                                            <span className="text-sm font-mono text-muted-foreground">
                                                                {ownedRarity}/{totalRarity}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="flex flex-wrap gap-2 justify-center">
                                    {group.cards.map(card => {
                                        const key = `${card.set}-${card.collectorNumber}-${card.isAlternate ? 'a' : 'n'}`;
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
