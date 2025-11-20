import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Plus } from 'lucide-react';
import { getCardsByNumberAndType } from '../utils/cardAdapter';
import type { Card } from '../data/Card';

interface BulkAddControlProps {
    onAddBulk: (cards: Card[]) => void;
}

export const BulkAddControl: React.FC<BulkAddControlProps> = ({ onAddBulk }) => {
    const [bulkInput, setBulkInput] = useState('');
    const [selectedSet, setSelectedSet] = useState('OGN');
    const [status, setStatus] = useState('');

    const handleBulkAdd = () => {
        const inputs = bulkInput.split(/\s+/).filter(s => s.trim());
        if (inputs.length === 0) {
            setStatus('No numbers');
            return;
        }

        let addedCount = 0;
        const cardsToAdd: Card[] = [];

        inputs.forEach(input => {
            const trimmed = input.trim();
            // Check if input has 'a' suffix (e.g., "7a")
            const isAlternate = trimmed.endsWith('a');
            const numberStr = isAlternate ? trimmed.slice(0, -1) : trimmed;
            const num = parseInt(numberStr);

            if (isNaN(num)) return;

            // Get cards with this collector number, filtered by alternate status
            const matches = getCardsByNumberAndType(num, isAlternate).filter(c => c.set === selectedSet);

            if (matches.length > 0) {
                cardsToAdd.push(...matches);
                addedCount += matches.length;
            }
        });

        if (cardsToAdd.length > 0) {
            onAddBulk(cardsToAdd);
            setStatus(`Added ${addedCount}`);
            setBulkInput('');
            setTimeout(() => setStatus(''), 3000);
        } else {
            setStatus('No matches');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <div className="flex items-start gap-2">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 bg-rift-900 rounded-lg p-1 border border-rift-600 h-9">
                    <select
                        value={selectedSet}
                        onChange={(e) => setSelectedSet(e.target.value)}
                        className="bg-transparent text-sm border-none focus:ring-0 cursor-pointer text-rift-100"
                        aria-label="Select Set"
                    >
                        <option value="OGN" className="bg-rift-900 text-rift-100">OGN</option>
                        <option value="PG" className="bg-rift-900 text-rift-100">PG</option>
                    </select>
                </div>
                {status && <span className="text-xs text-green-400 font-medium px-1" role="status">{status}</span>}
            </div>

            <Textarea
                placeholder="1 5 12 7a..."
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                className="min-h-[36px] h-9 w-48 resize-none overflow-hidden bg-rift-950 border-rift-700 font-mono text-xs flex items-center"
                aria-label="Bulk add cards by collector number"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleBulkAdd();
                    }
                }}
            />
            <Button onClick={handleBulkAdd} size="sm" className="h-9 px-3">
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
};
