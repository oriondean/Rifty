import { useCollection } from './hooks/useCollection';
import { CardGrid } from './components/CardGrid';
import { Filters } from './components/Filters';
import { BulkAddControl } from './components/BulkAddControl';
import { Zap } from 'lucide-react';

function App() {
  const { allUserCards, filters, updateFilter, addCard, addCards, removeCard } = useCollection();

  return (
    <div className="min-h-screen bg-lol-950 text-lol-100 font-sans selection:bg-lol-300 selection:text-lol-950">
      {/* Header */}
      <header className="bg-lol-900 border-b-2 border-lol-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-lol-950 via-lol-900 to-lol-950 opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-lol-300/5" />
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-lol-850 border-2 border-lol-300 shadow-lg shadow-lol-300/20 clip-corners">
              <Zap className="text-hextech-cyan" size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl font-fantasy font-bold text-transparent bg-clip-text bg-gradient-to-r from-lol-300 via-lol-200 to-lol-300 tracking-wider drop-shadow-[0_0_10px_rgba(200,155,60,0.5)]">
                RIFTBOUND
              </h1>
              <p className="text-lol-400 text-sm font-semibold tracking-widest uppercase">
                Collection Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-lol-300 font-bold uppercase tracking-widest">Bulk Add</span>
              <BulkAddControl onAddBulk={addCards} />
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <Filters
        filters={filters}
        onFilterChange={updateFilter}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto min-h-[calc(100vh-300px)]">
        <CardGrid
          userCards={allUserCards}
          filters={filters}
          onAddCard={addCard}
          onRemoveCard={removeCard}
        />
      </main>

      {/* Footer */}
      <footer className="bg-lol-900 border-t-2 border-lol-700 py-8 text-center text-lol-600 text-sm">
        <p>&copy; 2025 Riftbound Archives. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
