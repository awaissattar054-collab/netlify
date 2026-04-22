import { Shield, ChevronRight } from "lucide-react";
import { Link } from "wouter";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground dark selection:bg-primary/30 selection:text-primary">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50 no-print">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <span className="font-mono font-bold tracking-tight text-lg uppercase">
              GuardRail<span className="text-primary">.AI</span>
            </span>
          </Link>
          
          <nav className="flex items-center gap-6 font-mono text-sm">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Docs <ChevronRight className="w-3 h-3" />
            </a>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      <footer className="border-t border-border/50 py-8 text-center text-muted-foreground font-mono text-xs no-print">
        <div className="container mx-auto px-4 flex flex-col items-center gap-2">
          <Shield className="w-4 h-4 opacity-50" />
          <p>GUARDRAIL.AI // COMPLIANCE INTELLIGENCE SYSTEM</p>
          <p className="opacity-50">v1.0.0-rc2 // {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
