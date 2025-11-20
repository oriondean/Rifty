import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { getAllCards } from '../utils/cardAdapter';
import type { Card } from '../data/Card';

/**
 * Context for providing card data throughout the application
 */
const CardDataContext = createContext<Card[]>([]);

interface CardDataProviderProps {
    children: ReactNode;
}

/**
 * Provider component that loads card data once and shares it
 * with all child components via context
 */
export const CardDataProvider = ({ children }: CardDataProviderProps) => {
    const cards = useMemo(() => getAllCards(), []);

    return (
        <CardDataContext.Provider value={cards}>
            {children}
        </CardDataContext.Provider>
    );
};

/**
 * Hook to access card data from context
 * @returns Array of all Card objects
 */
export const useCardData = () => {
    const context = useContext(CardDataContext);

    if (!context) {
        throw new Error('useCardData must be used within a CardDataProvider');
    }

    return context;
};
