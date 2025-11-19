# Rifty - Riftbound Card Collection Manager

A modern, feature-rich web application for managing your Riftbound card collection with a premium fantasy-themed UI.

## Development

This application was created using a combination of:
- **Claude 4.5 Sonnet** (Anthropic)
- **Gemini 3** (Google)

Built with **Google Antigravity** - an advanced AI-powered development platform.

## Features

### Collection Management
- **Visual Card Grid**: Browse all cards organized by set (Origins, Proving Grounds, Shattered Fates)
- **Ownership Tracking**: Track how many copies of each card you own
- **Quick Add/Remove**: Hover over cards to quickly add or remove copies with intuitive +/- buttons
- **Bulk Add**: Efficiently add multiple cards at once using collector numbers
  - Support for alternate art cards using 'a' suffix (e.g., `7a` for alternate Fury Rune)
  - Set-specific filtering (OGN, PG, SFD)

### Filtering & Search
- **Advanced Search**: Full-text search across card names and descriptions
- **Multi-Filter System**: Filter by rarity, element, and card type
- **Real-time Updates**: Instant filtering as you type or change selections

### Set Statistics
Each set displays comprehensive collection statistics:
- **Owned**: Number of unique cards owned vs. total cards in set
- **With Duplicates**: Count of cards you have multiple copies of
- **Completion**: Percentage of set completion (turns green at 100%)

### Visual Enhancements
- **Rarity Indicators**: Color-coded dots on each card showing rarity at a glance
  - Common: Grey
  - Uncommon: Green
  - Rare: Blue
  - Epic: Purple
  - Showcase: Purple-Pink gradient
- **Hover Animations**: Smooth scale and lift effects on card hover
- **Card Previews**: Large card image preview on hover
- **Responsive Design**: Optimized for both desktop and mobile devices

### Data Persistence
- **Local Storage**: Your collection is automatically saved to browser local storage
- **Instant Sync**: Changes are saved immediately as you add or remove cards

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Local Storage API** for data persistence

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Adding Cards
1. **Individual Cards**: Hover over any card and click the green `+` button
2. **Bulk Add**: 
   - Select a set from the dropdown (OGN, PG, SFD)
   - Enter collector numbers separated by spaces (e.g., `1 5 12 7a`)
   - Use 'a' suffix for alternate art cards (e.g., `7a` for Fury Rune Alternate)
   - Press Enter or click the `+` button

### Removing Cards
- Hover over a card and click the red `-` button to remove one copy

### Filtering
- Use the search bar to find specific cards
- Select filters for Rarity, Element, or Card Type
- Filters can be combined for precise results

## Card Sets

- **OGN** - Origins
- **PG** - Proving Grounds  
- **SFD** - Shattered Fates

## Known Issues

- **Bulk Add with Alternate Art Cards**: The bulk add feature currently does not properly distinguish between standard and alternate art cards when using the 'a' suffix. Entering `7` or `7a` may add both the standard and alternate versions instead of just the alternate version. As a workaround, use the individual card hover buttons to add alternate art cards.

## License

This is a fan-made tool for the Riftbound card game. All card data and imagery are property of their respective owners.

## Acknowledgments

- Riftbound card game by Riot Games
- Card data (`origins-set.json`) sourced from [OwenMelbz's GitHub Gist](https://gist.github.com/OwenMelbz/e04dadf641cc9b81cb882b4612343112)
- UI/UX inspired by modern card collection management tools
