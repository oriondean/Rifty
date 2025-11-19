import React, { useState, useRef } from 'react';
import type { Card } from '../data/Card';
import { Plus, Minus } from 'lucide-react';

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

    return (
        <div
            ref={containerRef}
            className="relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setShowPreview(false)}
        >
            {/* Compact Representation */}
            <div
                className={`
                    w-24 h-32 rounded-lg border-2 transition-all duration-300 flex flex-col items-center justify-between p-2 text-center relative overflow-hidden
                    hover:scale-105 hover:-translate-y-1 cursor-pointer
                    ${isOwned
                        ? 'bg-rift-800 border-rift-500 text-white shadow-lg shadow-rift-500/20 hover:shadow-xl hover:shadow-rift-500/40 hover:border-rift-400'
                        : 'bg-rift-950 border-rift-800 text-rift-600 hover:border-rift-700 hover:bg-rift-900'
                    }
                `}
            >
                <div className="flex items-center gap-1 w-full justify-between px-1">
                    <span className={`text-xs font-bold ${isOwned ? 'text-rift-300' : 'text-rift-700'}`}>
                        #{card.collectorNumber}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${getRarityColor(card.rarity)} flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg`} title={card.rarity}></div>
                </div>

                <span className="text-[10px] leading-tight font-medium line-clamp-3 z-10">
                    {card.name}
                </span>

                {/* Count Indicator */}
                <div className={`text-xs font-bold mt-1 ${isOwned ? 'text-rift-100' : 'text-rift-800'}`}>
                    x{ownedCount}
                </div>

                {/* Management Buttons (Visible on Hover) */}
                <div className="absolute inset-0 bg-rift-900/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-20 pointer-events-none">
                    <button
                        onClick={(e) => { e.stopPropagation(); onAdd(); }}
                        className="p-1 bg-green-600 hover:bg-green-500 text-white rounded-full shadow-lg transform hover:scale-110 transition-all pointer-events-auto"
                    >
                        <Plus size={16} />
                    </button>
                    <span className="text-white font-bold text-lg">{ownedCount}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="p-1 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg transform hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
                        disabled={ownedCount === 0}
                    >
                        <Minus size={16} />
                    </button>
                </div>

                {isOwned && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-rift-500/30">
                        <div className="h-full bg-rift-400 w-full" />
                    </div>
                )}
            </div>

            {/* Hover Preview (Image Only) */}
            {showPreview && (
                <div className={`absolute z-50 pointer-events-none
                    ${position.top ? 'bottom-full mb-2' : 'top-full mt-2'}
                    ${position.align === 'center' ? 'left-1/2 -translate-x-1/2' : ''}
                    ${position.align === 'left' ? 'left-0' : ''}
                    ${position.align === 'right' ? 'right-0' : ''}
                `}>
                    <div className="relative drop-shadow-2xl rounded-xl overflow-hidden border-2 border-rift-600 bg-rift-900">
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
