import React from 'react';
import { Cpu, Github, ExternalLink, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#8B5CF6]/15 bg-[#060913] pt-12 pb-16 text-xs text-[#94A3B8]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#94A3B8]/10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0F172A] border border-[#8B5CF6]/30 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-[#06B6D4]" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
                Obsidian Kinetic
              </span>
              <span className="block text-[11px] font-mono text-[#64748B]">
                AI Systems & Custom CUDA Kernel Research
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
            <a
              href="https://github.com/obsidian-kinetic"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#F8FAFC] transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://arxiv.org"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#F8FAFC] transition-colors"
            >
              arXiv Preprints
            </a>
            <a
              href="https://scholar.google.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#F8FAFC] transition-colors"
            >
              Google Scholar
            </a>
            <a
              href="#top"
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#06B6D4] hover:underline"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#64748B]">
          <p>© {new Date().getFullYear()} Alex Vance. Distributed computing & high-performance inference research.</p>
          <p>Crafted with Obsidian Kinetic Deep Obsidian Design System</p>
        </div>
      </div>
    </footer>
  );
};
