import React, { useState, useRef } from 'react';
import type { Card } from '../data/Card';
import { Plus, Minus } from 'lucide-react';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CompactCardProps {
    card: Card;
    ownedCount: number;
    onAdd: () => void;
    onRemove: () => void;
}

export const CompactCard: React.FC<CompactCardProps> = ({ card, ownedCount, onAdd, onRemove }) => {
    const [showPreview, setShowPreview] = useState(false);
    const [position, setPosition] = useState<{ top: boolean; align: 'center' | 'left' | 'right' }>({ top: true, align: 'center' });
    const containerRef = useRef<HTMLDivElement>(null);
    const isOwned = ownedCount > 0;

    // Get rarity color
    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'Common': return 'bg-gray-400';
            case 'Uncommon': return 'bg-green-500';
            case 'Rare': return 'bg-blue-500';
            case 'Epic': return 'bg-purple-500';
            case 'Legendary': return 'bg-yellow-500';
            case 'Mythic': return 'bg-pink-500';
            case 'Showcase': return 'bg-gradient-to-r from-purple-500 to-pink-500';
            default: return 'bg-gray-500';
        }
    };

    const handleMouseEnter = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            // Preview dimensions (approx based on image aspect ratio)
            const previewHeight = 350;
            const previewWidth = 250;
            const cardWidth = rect.width;

            const spaceAbove = rect.top;
            const showOnTop = spaceAbove > previewHeight;

            const overhang = (previewWidth - cardWidth) / 2;

            let align: 'center' | 'left' | 'right' = 'center';
            if (rect.left < overhang) {
                align = 'left';
            } else if (viewportWidth - rect.right < overhang) {
                align = 'right';
            }

            setPosition({ top: showOnTop, align });
        }
        setShowPreview(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Optional: Trigger a primary action or just show preview
            setShowPreview(true);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative group focus-within:z-30"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setShowPreview(false)}
            onFocus={handleMouseEnter}
            onBlur={() => setShowPreview(false)}
        >
            {/* Compact Representation */}
            <div
                role="button"
                tabIndex={0}
                aria-label={`${card.name} - ${isOwned ? `Owned x${ownedCount}` : 'Not owned'}`}
                onKeyDown={handleKeyDown}
                className={cn(
                    "w-24 h-32 rounded-lg border-2 flex flex-col items-center justify-between p-2 text-center relative overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring",
                    isOwned
                        ? 'bg-primary/10 border-primary text-foreground shadow-lg shadow-primary/20'
                        : 'bg-card border-border text-muted-foreground'
                )}
            >
                <div className="flex items-center gap-1 w-full justify-between px-1">
                    <span className={cn("text-xs font-bold", isOwned ? 'text-primary' : 'text-muted-foreground')}>
                        #{card.collectorNumber}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${getRarityColor(card.rarity)} flex-shrink-0`} title={card.rarity}></div>
                </div>

                <span className="text-[10px] leading-tight font-medium line-clamp-3 z-10">
                    {card.name}
                </span>

                {/* Count Indicator */}
                <div className={cn("text-xs font-bold mt-1", isOwned ? 'text-primary' : 'text-muted-foreground')}>
                    x{ownedCount}
                </div>

                {/* Management Buttons (Visible on Hover or Focus) */}
                <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 flex flex-col items-center justify-center gap-2 z-20 pointer-events-none">
                    <Button
                        onClick={(e) => { e.stopPropagation(); onAdd(); }}
                        size="icon"
                        className="h-8 w-8 rounded-full pointer-events-auto"
                        variant="default"
                    >
                        <Plus size={16} />
                    </Button>
                    <span className="font-bold text-lg" aria-hidden="true">{ownedCount}</span>
                    <Button
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        size="icon"
                        className="h-8 w-8 rounded-full pointer-events-auto"
                        variant="destructive"
                        disabled={ownedCount === 0}
                    >
                        <Minus size={16} />
                    </Button>
                </div>

                {isOwned && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/30">
                        <div className="h-full bg-primary w-full" />
                    </div>
                )}
            </div>

            {/* Hover Preview (Image Only) */}
            {showPreview && (
                <div className={cn(
                    "absolute z-50 pointer-events-none",
                    position.top ? 'bottom-full mb-2' : 'top-full mt-2',
                    position.align === 'center' ? 'left-1/2 -translate-x-1/2' : '',
                    position.align === 'left' ? 'left-0' : '',
                    position.align === 'right' ? 'right-0' : ''
                )}>
                    <div className="relative drop-shadow-2xl rounded-xl overflow-hidden border-2 border-border bg-card">
                        <img
                            src={card.image}
                            alt={card.name}
                            className="max-w-[250px] max-h-[350px] object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
