import React from 'react';
import { Terminal, ArrowRight, Github, BookOpen, Layers } from 'lucide-react';
import { HERO_METRICS } from '../data/portfolioData';
import { HeroVisualizer } from './HeroVisualizer';

interface HeroSectionProps {
  onOpenTerminal: () => void;
  onExploreProjects: () => void;
  onOpenBibtex: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenTerminal,
  onExploreProjects,
  onOpenBibtex,
}) => {
  return (
    <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden" id="top">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Split-Screen Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-14 lg:mb-20">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Overline Badge (Clean unboxed style with wide letter spacing) */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-bold font-mono tracking-[0.14em] uppercase text-[#06B6D4]">
                DISTRIBUTED COMPUTE · CUSTOM CUDA KERNELS
              </span>
            </div>

            {/* Display Headline in Plus Jakarta Sans with tight tracking and balanced wrapping */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.02em] leading-[1.12] text-[#F8FAFC] font-['Plus_Jakarta_Sans'] mb-5 [text-wrap:balance]">
              Architecting High-Throughput Neural Systems & Sub-Millisecond Inference.
            </h1>

            {/* Lead Copy in Inter with open line-height */}
            <p className="text-base sm:text-lg text-[#94A3B8] font-normal leading-relaxed mb-8 max-w-xl">
              Principal ML Systems Engineer specializing in hardware-aware asynchronous memory hierarchies, dynamic sparse Mixture-of-Experts routing, and tensor-parallel foundation model deployment at hyperscale.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <button
                onClick={onOpenTerminal}
                className="btn-hyper-gradient px-5 py-3 text-sm font-semibold text-white rounded-lg flex items-center gap-2 shadow-lg"
              >
                <Terminal className="w-4 h-4 text-white" />
                <span>Launch Inference Shell</span>
              </button>

              <button
                onClick={onExploreProjects}
                className="btn-glass-tech px-4 py-3 text-sm font-medium rounded-lg flex items-center gap-2"
              >
                <span>Inspect Architectures</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quiet Credential Links */}
            <div className="flex items-center gap-4 text-xs font-mono text-[#64748B] pt-4 border-t border-[#8B5CF6]/15">
              <a
                href="https://github.com/obsidian-kinetic"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#06B6D4] transition-colors flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>github.com/obsidian-kinetic</span>
              </a>
              <span aria-hidden="true">·</span>
              <button
                onClick={onOpenBibtex}
                className="hover:text-[#06B6D4] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>4 Papers (NeurIPS / MLSys)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Visual Container at Matching Height */}
          <div className="lg:col-span-6 flex items-center">
            <HeroVisualizer />
          </div>
        </div>

        {/* 4-Column Full-Width Metric Strip below the split */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 lg:p-6 rounded-2xl glass-panel border border-[#8B5CF6]/20 bg-[#0A0E1A]/80 shadow-xl">
          {HERO_METRICS.map((metric, idx) => (
            <div 
              key={idx} 
              className={`p-3 lg:p-4 ${idx !== 0 ? 'md:border-l md:border-[#94A3B8]/10' : ''}`}
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#06B6D4] font-['Plus_Jakarta_Sans'] tracking-tight tabular-nums mb-1">
                {metric.value}
              </div>
              <div className="text-[11px] font-mono font-semibold tracking-wider text-[#F8FAFC] uppercase mb-1">
                {metric.label}
              </div>
              <div className="text-xs text-[#94A3B8] font-sans leading-snug">
                {metric.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
