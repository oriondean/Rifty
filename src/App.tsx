import { useCollection } from './hooks/useCollection';
import { CardGrid } from './components/CardGrid';
import { Filters } from './components/Filters';
import { BulkAddControl } from './components/BulkAddControl';
import { TrinityForceIcon } from './components/TrinityForceIcon';
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

function App() {
  const { allUserCards, filters, updateFilter, addCard, addCards, removeCard } = useCollection();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
        {/* Header */}
        <header className="bg-card border-b border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-card to-background opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5" />
          <div className="max-w-7xl mx-auto px-6 py-8 relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-card border-2 border-primary shadow-lg shadow-primary/20 clip-corners">
                <TrinityForceIcon size={32} className="text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-fantasy font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-foreground to-primary tracking-wider drop-shadow-sm">
                  RIFTY
                </h1>
                <p className="text-muted-foreground text-sm font-semibold tracking-widest uppercase">
                  Riftbound Collection Manager
                </p>
              </div>
            </div>

            <div className="flex items-end gap-4">
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-primary font-bold uppercase tracking-widest">Bulk Add</span>
                <BulkAddControl onAddBulk={addCards} />
              </div>
              <ModeToggle />
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
        <footer className="bg-card border-t border-border py-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 Riftbound Archives. All rights reserved.</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
