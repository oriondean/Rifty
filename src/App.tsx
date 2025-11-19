import { useCollection } from './hooks/useCollection';
import { CardGrid } from './components/CardGrid';
import { Filters } from './components/Filters';
import { BulkAddControl } from './components/BulkAddControl';
import { Sparkles } from 'lucide-react';

function App() {
  const { allUserCards, filters, updateFilter, addCard, addCards, removeCard } = useCollection();

  return (
    <div className="min-h-screen bg-rift-900 text-rift-100 font-sans selection:bg-rift-500 selection:text-white">
      {/* Header */}
      <header className="bg-rift-900 border-b border-rift-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rift-900 via-rift-800 to-rift-900 opacity-50" />
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rift-800 rounded-xl border border-rift-600 shadow-lg shadow-rift-500/10">
              <Sparkles className="text-rift-400" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-fantasy font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-rift-300 tracking-wider">
                Rifty
              </h1>
              <p className="text-rift-400 text-sm font-medium tracking-wide uppercase opacity-80">
                Card Collection Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-rift-400 font-medium uppercase tracking-wider">Bulk Add</span>
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
      <footer className="bg-rift-900 border-t border-rift-800 py-8 text-center text-rift-500 text-sm">
        <p>&copy; 2025 Riftbound Archives. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
