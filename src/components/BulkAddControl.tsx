import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Plus } from 'lucide-react';
import { getCardsByNumberAndType } from '../utils/cardAdapter';
import type { Card } from '../data/Card';
import { NOTIFICATION_DURATION } from '../constants';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface BulkAddControlProps {
    onAddBulk: (cards: Card[]) => void;
}

export const BulkAddControl: React.FC<BulkAddControlProps> = ({ onAddBulk }) => {
    const [bulkInput, setBulkInput] = useState('');
    const [selectedSet, setSelectedSet] = useState('OGN');
    const [status, setStatus] = useState('');
    const [showError, setShowError] = useState(false);

    const handleBulkAdd = () => {
        const inputs = bulkInput.split(/\s+/).filter(s => s.trim());
        if (inputs.length === 0) {
            setShowError(true);
            setTimeout(() => setShowError(false), NOTIFICATION_DURATION);
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
            setTimeout(() => setStatus(''), NOTIFICATION_DURATION);
        } else {
            setStatus('No matches');
            setTimeout(() => setStatus(''), NOTIFICATION_DURATION);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBulkInput(e.target.value);
        if (showError) {
            setShowError(false);
        }
    };

    return (
        <div className="flex items-start gap-2">
            <div className="flex flex-col gap-1">
                <Select value={selectedSet} onValueChange={setSelectedSet}>
                    <SelectTrigger className="w-[80px] h-9">
                        <SelectValue placeholder="Set" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="OGN">OGN</SelectItem>
                        <SelectItem value="PG">PG</SelectItem>
                    </SelectContent>
                </Select>
                {status && <span className="text-xs text-green-400 font-medium px-1" role="status">{status}</span>}
            </div>

            <div className="relative">
                <Textarea
                    placeholder="1 5 12 7a..."
                    value={bulkInput}
                    onChange={handleInputChange}
                    className={`min-h-[36px] h-9 w-48 resize-none overflow-hidden font-mono text-xs flex items-center ${showError ? 'border-red-500 border-2 focus-visible:ring-red-500' : ''}`}
                    aria-label="Bulk add cards by collector number"
                    aria-invalid={showError}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleBulkAdd();
                        }
                    }}
                />
                {showError && (
                    <div className="absolute top-full mt-1 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                        Please enter card numbers in the format "1 5 12 7a..."
                    </div>
                )}
            </div>
            <Button onClick={handleBulkAdd} size="sm" className="h-9 px-3">
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
};
