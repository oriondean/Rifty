export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Showcase';
export type Element = 'Fury' | 'Calm' | 'Body' | 'Chaos' | 'Mind';
export type CardType = 'Unit' | 'Spell' | 'Rune';

export interface Card {
    id: string;
    name: string;
    description: string;
    rarity: Rarity;
    element: Element;
    type: CardType;
    power: number;
    cost: number;
    image: string;
    collectorNumber: number;
    set: string;
    setName: string;
}