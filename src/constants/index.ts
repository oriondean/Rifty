import type { Rarity } from '../data/Card';

/**
 * Storage key for localStorage persistence
 */
export const STORAGE_KEY = 'rifty-collection';

/**
 * Duration for notification messages in milliseconds
 */
export const NOTIFICATION_DURATION = 3000;

/**
 * Rarity ordering for sorting cards
 */
export const RARITY_ORDER: Record<Rarity, number> = {
    Common: 1,
    Uncommon: 2,
    Rare: 3,
    Epic: 4,
    Showcase: 5,
} as const;

/**
 * Order in which card sets should be displayed
 */
export const SET_ORDER = ['OGN', 'PG', 'SFD'] as const;

/**
 * Sets to exclude from display
 */
export const EXCLUDED_SETS = ['SFD'] as const;

/**
 * Rarity color mapping for UI display
 */
export const RARITY_COLORS: Record<Rarity, string> = {
    Common: 'bg-gray-400',
    Uncommon: 'bg-green-500',
    Rare: 'bg-blue-500',
    Epic: 'bg-purple-500',
    Showcase: 'bg-pink-500',
} as const;
