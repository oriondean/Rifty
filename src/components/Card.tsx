import React from 'react';
import type { Card as CardType } from '../data/Card';
import { Zap, Sparkles, Flame, Droplets, Mountain, Sun } from 'lucide-react';
import { clsx } from 'clsx';

interface CardProps {
    card: CardType;
    onRemove: (id: string) => void;
}

const rarityColors = {
    Common: 'border-gray-500 text-gray-400',
    Uncommon: 'border-green-500 text-green-400',
    Rare: 'border-blue-500 text-blue-400',
    Epic: 'border-purple-500 text-purple-400',
    Legendary: 'border-orange-500 text-orange-400',
    Mythic: 'border-red-500 text-red-400',
    Showcase: 'border-yellow-500 text-yellow-400',
};

const elementIcons = {
    Fury: Flame,
    Calm: Droplets,
    Body: Mountain,
    Chaos: Zap,
    Mind: Sun,
};

export const Card: React.FC<CardProps> = ({ card, onRemove }) => {
    const ElementIcon = elementIcons[card.element];

    return (
        <div className={clsx(
            "relative group w-64 h-96 rounded-xl border-2 bg-rift-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rift-500/20 overflow-hidden",
            rarityColors[card.rarity]
        )}>
            {/* Image Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rift-900 via-rift-900/80 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col p-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="bg-rift-900/80 backdrop-blur-sm p-1.5 rounded-full border border-current">
                        <ElementIcon size={20} />
                    </div>
                    <div className="bg-rift-900/80 backdrop-blur-sm px-2 py-1 rounded-full border border-current text-xs font-bold uppercase tracking-wider">
                        {card.rarity}
                    </div>
                </div>

                <div className="mt-auto space-y-3">
                    {/* Title & Type */}
                    <div>
                        <h3 className="text-xl font-bold text-white leading-tight group-hover:text-rift-300 transition-colors">
                            {card.name}
                        </h3>
                        <p className="text-xs text-rift-300 font-medium uppercase tracking-wide opacity-80">
                            {card.type}
                        </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-300 line-clamp-3 italic">
                        "{card.description}"
                    </p>

                    {/* Stats */}
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                        <div className="flex items-center gap-1.5 text-yellow-400" title="Power">
                            <Zap size={16} className="fill-current" />
                            <span className="font-bold text-lg">{card.power}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-blue-400" title="Cost">
                            <Sparkles size={16} className="fill-current" />
                            <span className="font-bold text-lg">{card.cost}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 border-2 border-current opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />

            {/* Delete Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(card.id);
                }}
                className="absolute top-2 right-2 z-20 p-1.5 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
                title="Remove Card"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
            </button>
        </div>
    );
};
