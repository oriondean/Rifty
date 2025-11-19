import React from 'react';
import type { FilterState } from '../hooks/useCollection';
import { Search, Filter } from 'lucide-react';
import type { Rarity, Element, CardType } from '../data/Card';

interface FiltersProps {
    filters: FilterState;
    onFilterChange: (key: keyof FilterState, value: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange }) => {
    const rarities: (Rarity | 'All')[] = ['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Showcase'];
    const elements: (Element | 'All')[] = ['All', 'Fury', 'Calm', 'Body', 'Chaos', 'Mind'];
    const types: (CardType | 'All')[] = ['All', 'Unit', 'Spell', 'Rune'];

    return (
        <div className="bg-rift-800/50 backdrop-blur-md border-y border-rift-700 p-4 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-between">

                {/* Search */}
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-rift-400 transition-colors duration-200 group-focus-within:text-rift-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search cards..."
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                        className="w-full bg-rift-900 border border-rift-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-rift-400 focus:ring-2 focus:ring-rift-400/50 transition-all duration-200 hover:border-rift-500 focus:shadow-lg focus:shadow-rift-400/20"
                    />
                </div>

                {/* Filters Group */}
                <div className="flex flex-wrap gap-2 items-center justify-center md:justify-end">
                    <div className="flex items-center gap-2 bg-rift-900 rounded-lg p-1 border border-rift-600">
                        <Filter size={16} className="ml-2 text-rift-400" />
                        <select
                            value={filters.rarity}
                            onChange={(e) => onFilterChange('rarity', e.target.value)}
                            className="bg-transparent text-sm border-none focus:ring-0 cursor-pointer text-rift-100"
                        >
                            {rarities.map((r) => <option key={r} value={r} className="bg-rift-900 text-rift-100">{r} Rarity</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-rift-900 rounded-lg p-1 border border-rift-600">
                        <select
                            value={filters.element}
                            onChange={(e) => onFilterChange('element', e.target.value)}
                            className="bg-transparent text-sm border-none focus:ring-0 cursor-pointer text-rift-100"
                        >
                            {elements.map((e) => <option key={e} value={e} className="bg-rift-900 text-rift-100">{e} Element</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-rift-900 rounded-lg p-1 border border-rift-600">
                        <select
                            value={filters.type}
                            onChange={(e) => onFilterChange('type', e.target.value)}
                            className="bg-transparent text-sm border-none focus:ring-0 cursor-pointer text-rift-100"
                        >
                            {types.map((t) => <option key={t} value={t} className="bg-rift-900 text-rift-100">{t} Type</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};
