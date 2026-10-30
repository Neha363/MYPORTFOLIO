import React, { useState } from 'react';
import { ArrowUpRight, Code2, Cpu, Filter, GitBranch, ExternalLink, Zap } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { ProjectArchitecture } from '../types';

interface ProjectShowcaseProps {
  onSelectProject: (project: ProjectArchitecture) => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProjects = selectedCategory === 'all'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Architectures' },
    { id: 'kernel', label: 'Kernel Engineering' },
    { id: 'moe', label: 'Sparse MoE' },
    { id: 'quantization', label: 'Speculative & FP8' },
    { id: 'robotics', label: 'Edge & Robotics' },
  ];

  return (
    <section className="py-12 lg:py-20" id="architectures">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 lg:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold font-mono tracking-[0.14em] uppercase text-[#06B6D4]">
                FLAGSHIP RESEARCH & PRODUCTION SYSTEMS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans'] tracking-tight">
              Featured Neural Architectures
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mt-2">
              Original hardware kernels, distributed routing pipelines, and quantization mechanisms deployed in high-throughput production clusters.
            </p>
          </div>

          {/* Interactive Filter Control Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0A0E1A]/80 border border-[#8B5CF6]/20 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#1E293B] text-[#4CD7F6] border border-[#06B6D4]/50 shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F172A]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Responsive Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="relative rounded-2xl glass-panel p-6 lg:p-7 border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 transition-all duration-200 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
            >
              {/* Subtle top edge gradient highlight line */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#06B6D4]/50 to-transparent group-hover:via-[#8B5CF6]/80 transition-all" />

              <div>
                {/* Header Category & Headline Metric */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#8B5CF6]">
                    {project.categoryLabel}
                  </span>
                  
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-extrabold text-[#06B6D4] font-['Plus_Jakarta_Sans'] tabular-nums block">
                      {project.headlineMetric}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B] uppercase block">
                      {project.headlineMetricLabel}
                    </span>
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans'] mb-3 group-hover:text-[#4CD7F6] transition-colors flex items-center justify-between">
                  <span>{project.title}</span>
                  <ArrowUpRight className="w-5 h-5 text-[#64748B] group-hover:text-[#06B6D4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                </h3>

                {/* Abstract Text */}
                <p className="text-xs sm:text-sm text-[#94A3B8] font-sans leading-relaxed mb-5">
                  {project.abstract}
                </p>

                {/* Architecture Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-[#D0BCFF] bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 rounded-full"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Metric Row Items with Progress Bars */}
              <div className="border-t border-[#94A3B8]/10 pt-4 mt-auto space-y-2.5">
                {project.metrics.slice(0, 3).map((metric, mIdx) => (
                  <div
                    key={mIdx}
                    className="flex items-center justify-between gap-3 text-xs font-mono"
                  >
                    <span className="text-[#94A3B8] text-[11px] truncate w-1/3">
                      {metric.label}
                    </span>

                    {/* Progress Bar */}
                    <div className="flex-1 h-1.5 bg-[#060913] rounded-full overflow-hidden border border-[#94A3B8]/15 mx-2">
                      <div
                        className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] rounded-full"
                        style={{ width: `${metric.progressPercent}%` }}
                      />
                    </div>

                    <span className="text-[#06B6D4] font-semibold text-[11px] tabular-nums text-right w-20">
                      {metric.kinetic}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Quick Affordance */}
              <div className="mt-5 pt-3 border-t border-[#94A3B8]/10 flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                <span className="flex items-center gap-1.5 group-hover:text-[#F8FAFC] transition-colors">
                  <Code2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>Inspect Kernel & Math Formulation</span>
                </span>
                <span className="text-[#06B6D4] group-hover:underline">
                  Deep Dive →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
