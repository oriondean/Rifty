import React, { useState, useMemo } from 'react';
import { Search, X, Plus, Layers } from 'lucide-react';
import { getAllCards, getCardsByNumber } from '../utils/cardAdapter';
import type { Card } from '../data/Card';
import { Card as CardComponent } from './Card';

interface CardSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (card: Card) => void;
    onAddBulk: (cards: Card[]) => void;
}

export const CardSearchModal: React.FC<CardSearchModalProps> = ({ isOpen, onClose, onAdd, onAddBulk }) => {
    const [activeTab, setActiveTab] = useState<'search' | 'bulk'>('search');
    const [search, setSearch] = useState('');
    const [bulkInput, setBulkInput] = useState('');
    const [bulkStatus, setBulkStatus] = useState('');
    const [selectedSet, setSelectedSet] = useState<string>('');

    const allCards = useMemo(() => getAllCards(), []);

    // Extract unique sets for the dropdown
    const availableSets = useMemo(() => {
        const sets = new Map<string, string>();
        allCards.forEach(card => {
            if (card.set && card.setName) {
                sets.set(card.set, card.setName);
            }
        });
        return Array.from(sets.entries()).map(([code, name]) => ({ code, name }));
    }, [allCards]);

    // Set default selected set
    React.useEffect(() => {
        if (availableSets.length > 0 && !selectedSet) {
            setSelectedSet(availableSets[0].code);
        }
    }, [availableSets, selectedSet]);

    const filteredCards = useMemo(() => {
        if (!search) return [];
        return allCards.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    }, [allCards, search]);

    const handleBulkAdd = () => {
        if (!selectedSet) {
            setBulkStatus('Please select a set.');
            return;
        }

        const numbers = bulkInput.split(/\s+/).map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (numbers.length === 0) {
            setBulkStatus('No valid numbers found.');
            return;
        }

        let addedCount = 0;
        const cardsToAdd: Card[] = [];

        numbers.forEach(num => {
            // Filter matches by both collector number AND the selected set
            const matches = getCardsByNumber(num).filter(c => c.set === selectedSet);
            if (matches.length > 0) {
                cardsToAdd.push(...matches);
                addedCount += matches.length;
            }
        });

        if (cardsToAdd.length > 0) {
            onAddBulk(cardsToAdd);
            setBulkStatus(`Successfully added ${addedCount} cards from ${availableSets.find(s => s.code === selectedSet)?.name}.`);
            setBulkInput('');
        } else {
            setBulkStatus(`No matching cards found in ${availableSets.find(s => s.code === selectedSet)?.name} for these numbers.`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-rift-900 border border-rift-700 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-rift-800">
                    <h2 className="text-2xl font-bold text-white">Add Cards</h2>
                    <button onClick={onClose} className="text-rift-400 hover:text-white transition-colors cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-rift-800">
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer ${activeTab === 'search' ? 'bg-rift-800 text-white border-b-2 border-rift-500' : 'text-rift-400 hover:text-rift-200'
                            }`}
                    >
                        Search
                    </button>
                    <button
                        onClick={() => setActiveTab('bulk')}
                        className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer ${activeTab === 'bulk' ? 'bg-rift-800 text-white border-b-2 border-rift-500' : 'text-rift-400 hover:text-rift-200'
                            }`}
                    >
                        Bulk Add
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'search' ? (
                        <div className="space-y-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-rift-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by card name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-rift-950 border border-rift-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-rift-500 focus:ring-1 focus:ring-rift-500 transition-all"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {filteredCards.map(card => (
                                    <div key={card.id} className="relative group cursor-pointer" onClick={() => onAdd(card)}>
                                        <div className="absolute inset-0 bg-rift-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl z-10 flex items-center justify-center">
                                            <Plus size={48} className="text-white drop-shadow-lg" />
                                        </div>
                                        <div className="pointer-events-none">
                                            <CardComponent card={card} onRemove={() => { }} />
                                        </div>
                                    </div>
                                ))}
                                {search && filteredCards.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-rift-500">
                                        No cards found matching "{search}"
                                    </div>
                                )}
                                {!search && (
                                    <div className="col-span-full text-center py-12 text-rift-500 flex flex-col items-center gap-4">
                                        <Layers size={48} className="opacity-50" />
                                        <p>Type to search for cards to add to your collection.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-rift-300 mb-2 uppercase tracking-wide">
                                    Select Set
                                </label>
                                <select
                                    value={selectedSet}
                                    onChange={(e) => setSelectedSet(e.target.value)}
                                    className="w-full bg-rift-950 border border-rift-700 rounded-xl p-3 text-white focus:outline-none focus:border-rift-500 focus:ring-1 focus:ring-rift-500 transition-all mb-4"
                                >
                                    {availableSets.map(set => (
                                        <option key={set.code} value={set.code} className="bg-rift-950 text-white">
                                            {set.name} ({set.code})
                                        </option>
                                    ))}
                                </select>

                                <label className="block text-sm font-bold text-rift-300 mb-2 uppercase tracking-wide">
                                    Enter Card Numbers
                                </label>
                                <p className="text-xs text-rift-500 mb-4">
                                    Enter collector numbers separated by spaces (e.g., "1 5 12 44").
                                </p>
                                <textarea
                                    value={bulkInput}
                                    onChange={(e) => setBulkInput(e.target.value)}
                                    className="w-full h-48 bg-rift-950 border border-rift-700 rounded-xl p-4 text-white font-mono focus:outline-none focus:border-rift-500 focus:ring-1 focus:ring-rift-500 transition-all resize-none"
                                    placeholder="1 2 3..."
                                />
                            </div>

                            {bulkStatus && (
                                <div className={`p-4 rounded-lg text-sm font-medium ${bulkStatus.includes('Successfully') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                    {bulkStatus}
                                </div>
                            )}

                            <button
                                onClick={handleBulkAdd}
                                className="w-full py-3 bg-rift-500 hover:bg-rift-400 text-white rounded-xl font-bold transition-colors shadow-lg shadow-rift-500/20 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Plus size={20} />
                                Add Cards
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
