import React, { useState, useEffect } from 'react';
import type { FilterState } from '../hooks/useCollection';
import { Search, Filter } from 'lucide-react';
import type { Rarity, Element, CardType } from '../data/Card';
import { Input } from "@/components/ui/input"
import { useDebounce } from '../hooks/useDebounce';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface FiltersProps {
    filters: FilterState;
    onFilterChange: (key: keyof FilterState, value: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange }) => {
    const rarities: (Rarity | 'All')[] = ['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Showcase'];
    const elements: (Element | 'All')[] = ['All', 'Fury', 'Calm', 'Body', 'Chaos', 'Mind'];
    const types: (CardType | 'All')[] = ['All', 'Unit', 'Spell', 'Rune'];

    // Local state for search input to enable debouncing
    const [searchValue, setSearchValue] = useState(filters.search);
    const debouncedSearch = useDebounce(searchValue, 300);

    // Update parent filter when debounced value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        onFilterChange('search', debouncedSearch);
    }, [debouncedSearch]); // Intentionally omit onFilterChange to prevent infinite loop


    return (
        <div className="bg-background/80 backdrop-blur-md border-y border-border p-4 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-between">

                {/* Search */}
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary" size={18} />
                    <Input
                        type="text"
                        placeholder="Search cards..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-10 bg-background border-input hover:border-primary/50 focus-visible:ring-primary/50"
                        aria-label="Search cards"
                    />
                </div>

                {/* Filters Group */}
                <div className="flex flex-wrap gap-2 items-center justify-center md:justify-end">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-muted-foreground" />
                        <Select
                            value={filters.rarity}
                            onValueChange={(value) => onFilterChange('rarity', value)}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Rarity" />
                            </SelectTrigger>
                            <SelectContent>
                                {rarities.map((r) => (
                                    <SelectItem key={r} value={r}>{r} Rarity</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Select
                        value={filters.element}
                        onValueChange={(value) => onFilterChange('element', value)}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Element" />
                        </SelectTrigger>
                        <SelectContent>
                            {elements.map((e) => (
                                <SelectItem key={e} value={e}>{e} Element</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.type}
                        onValueChange={(value) => onFilterChange('type', value)}
                    >
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {types.map((t) => (
                                <SelectItem key={t} value={t}>{t} Type</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};
