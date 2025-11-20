import type { Card, Rarity, Element, CardType } from '../data/Card';
import originsData from '../assets/origins-set.json';

/**
 * Raw card data structure from JSON import
 */
export interface RawCardData {
    id: string;
    name: string;
    text: string;
    rarity: { label: string };
    domains: { label: string }[];
    cardType: { label: string }[];
    energy: number;
    power?: number;
    cardImage: { url: string };
    collectorNumber: number;
    set: string;
    setName: string;
}

/**
 * Adapts raw JSON card data to the application's Card type
 * @param raw - Raw card data from JSON
 * @returns Transformed Card object
 */
export const adaptCard = (raw: RawCardData): Card => {
    // Helper to map rarity string to Rarity type
    const mapRarity = (r: string): Rarity => {
        return r as Rarity;
    };

    // Helper to map domain to Element type
    const mapElement = (d: string): Element => {
        return d as Element;
    };

    // Helper to map card type
    const mapType = (t: string): CardType => {
        return t as CardType;
    };

    // Strip HTML tags from text
    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>?/gm, '');
    };

    // Check if card has 'a' suffix (alternate art version)
    const isAlternate = raw.id.match(/-\d+a-/);
    const displayName = isAlternate ? `${raw.name} (Alternate)` : raw.name;

    return {
        id: raw.id,
        name: displayName,
        description: raw.text ? stripHtml(raw.text) : '',
        rarity: mapRarity(raw.rarity.label),
        element: mapElement(raw.domains[0]?.label || 'Neutral'), // Handle missing domain if any
        type: mapType(raw.cardType[0].label),
        power: raw.power || 0,
        cost: raw.energy || 0,
        image: raw.cardImage.url,
        collectorNumber: raw.collectorNumber,
        set: raw.set,
        setName: raw.setName,
        isAlternate: !!isAlternate,
    };
};

/**
 * Gets all cards from the imported JSON data
 * @returns Array of all Card objects
 */
export const getAllCards = (): Card[] => {
    return (originsData as unknown as RawCardData[]).map(adaptCard);
};

/**
 * Gets all cards with a specific collector number
 * @param number - The collector number to filter by
 * @returns Array of matching Card objects
 */
export const getCardsByNumber = (number: number): Card[] => {
    const allCards = getAllCards();
    return allCards.filter(card => card.collectorNumber === number);
};

/**
 * Gets cards by collector number and alternate status
 * @param number - The collector number to filter by
 * @param isAlternate - Whether to get alternate or standard versions
 * @returns Array of matching Card objects
 */
export const getCardsByNumberAndType = (number: number, isAlternate: boolean): Card[] => {
    const allCards = getAllCards();
    return allCards.filter(card => {
        if (card.collectorNumber !== number) return false;
        return card.isAlternate === isAlternate;
    });
};
