import React from 'react';
import { Terminal, Cpu, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenTerminal: () => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTerminal, onOpenContact }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#060913]/85 border-b border-[#8B5CF6]/15 transition-all">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a 
          href="#top" 
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#F8FAFC] font-['Plus_Jakarta_Sans'] whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] via-[#3B82F6] to-[#06B6D4] p-[1px] shadow-sm">
            <div className="w-full h-full bg-[#060913] rounded-[7px] flex items-center justify-center group-hover:bg-[#0A0E1A] transition-colors">
              <Cpu className="w-4 h-4 text-[#06B6D4]" />
            </div>
          </div>
          <span>Obsidian Kinetic</span>
          <span className="text-xs font-mono text-[#06B6D4] font-medium tracking-normal hidden sm:inline opacity-80">
            // ML SYSTEMS
          </span>
        </a>

        {/* Zone 2: 4-5 concise single-line text nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#94A3B8]">
          <a 
            href="#architectures" 
            className="hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#8B5CF6]"
          >
            Architectures
          </a>
          <a 
            href="#terminal" 
            className="hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#8B5CF6]"
          >
            Inference Shell
          </a>
          <a 
            href="#benchmarks" 
            className="hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#8B5CF6]"
          >
            Benchmarks
          </a>
          <a 
            href="#publications" 
            className="hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#8B5CF6]"
          >
            Publications
          </a>
          <a 
            href="#experience" 
            className="hover:text-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[#8B5CF6]"
          >
            Experience
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenTerminal}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono text-[#4CD7F6] bg-[#0F172A]/80 border border-[#8B5CF6]/25 rounded-lg hover:border-[#06B6D4]/60 hover:bg-[#1E293B]/80 transition-colors whitespace-nowrap shrink-0"
            title="Open Interactive Shell"
          >
            <Terminal className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Interactive Console</span>
          </button>
          
          <button
            onClick={onOpenContact}
            className="btn-hyper-gradient px-4 py-2 text-xs font-semibold text-white rounded-lg whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <span>Request Brief</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
