import React from 'react';

interface StatsPanelProps {
    totalCount: number;
    displayedCount: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ totalCount, displayedCount }) => {
    return (
        <div className="bg-rift-800 border-b border-rift-700 py-2 px-6 flex justify-between items-center text-sm text-rift-300">
            <div>
                <span className="font-bold text-white">{displayedCount}</span> cards shown
                {displayedCount !== totalCount && (
                    <span className="opacity-60"> (filtered from {totalCount})</span>
                )}
            </div>
            <div className="flex gap-4">
                <span>Collection Status: <span className="text-green-400 font-bold">Active</span></span>
            </div>
        </div>
    );
};
