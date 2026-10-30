import React, { useEffect, useState } from 'react';
import { X, Copy, Check, ExternalLink, Github, Cpu, BookOpen, Layers, Terminal } from 'lucide-react';
import { ProjectArchitecture } from '../types';

interface ProjectModalProps {
  project: ProjectArchitecture | null;
  onClose: () => void;
  onOpenTerminalWithProject?: (id: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onOpenTerminalWithProject,
}) => {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const copyCode = () => {
    navigator.clipboard.writeText(project.details.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyCitation = () => {
    navigator.clipboard.writeText(project.details.citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl glass-modal p-6 sm:p-8 border border-[#8B5CF6]/40 text-[#F8FAFC] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 mb-6 border-b border-[#94A3B8]/15">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold font-mono tracking-wider uppercase text-[#06B6D4]">
                {project.categoryLabel}
              </span>
              <span className="text-[11px] font-mono text-[#64748B]">·</span>
              <span className="text-[11px] font-mono text-[#D0BCFF]">
                {project.parameters.precision}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-[#F8FAFC]">
              {project.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0A0E1A] hover:bg-[#1E293B] border border-[#8B5CF6]/20 rounded-xl transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technical Architecture Parameter Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-[#0A0E1A]/90 border border-[#8B5CF6]/20 font-mono text-xs">
          <div>
            <span className="text-[10px] text-[#64748B] block uppercase">MODEL / KERNEL SCALE</span>
            <span className="text-[#F8FAFC] font-semibold mt-0.5 block">
              {project.parameters.totalParams}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#64748B] block uppercase">ACTIVE PARAMS</span>
            <span className="text-[#06B6D4] font-semibold mt-0.5 block">
              {project.parameters.activeParams}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#64748B] block uppercase">MAX CONTEXT WINDOW</span>
            <span className="text-[#D0BCFF] font-semibold mt-0.5 block">
              {project.parameters.contextWindow}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#64748B] block uppercase">KERNEL THROUGHPUT</span>
            <span className="text-[#10B981] font-semibold mt-0.5 block">
              {project.parameters.kernelThroughput}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#64748B] block uppercase">MEMORY BUS EFFICIENCY</span>
            <span className="text-[#4CD7F6] font-semibold mt-0.5 block">
              {project.parameters.memoryBandwidth}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#64748B] block uppercase">HEADLINE SPEEDUP</span>
            <span className="text-[#06B6D4] font-bold text-sm mt-0.5 block tabular-nums">
              {project.headlineMetric}
            </span>
          </div>
        </div>

        {/* Motivation & Problem Statement */}
        <div className="mb-6">
          <h4 className="text-xs font-mono font-bold uppercase text-[#06B6D4] mb-2 tracking-wider">
            Systems Motivation & Architectural Bottlenecks
          </h4>
          <p className="text-sm text-[#CBC3D7] font-sans leading-relaxed">
            {project.details.motivation}
          </p>
        </div>

        {/* Mathematical Formulation */}
        <div className="mb-6 p-4 rounded-xl bg-[#060913] border border-[#8B5CF6]/25">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[#8B5CF6] tracking-wider">
              Mathematical Formulation & Objective
            </span>
            <span className="text-[10px] font-mono text-[#64748B]">LaTeX Representation</span>
          </div>
          <pre className="font-mono text-xs sm:text-sm text-[#4CD7F6] overflow-x-auto whitespace-pre-wrap py-1">
            {project.details.mathematicalFormulation}
          </pre>
        </div>

        {/* Key Kernel & Pipeline Highlights */}
        <div className="mb-6">
          <h4 className="text-xs font-mono font-bold uppercase text-[#06B6D4] mb-3 tracking-wider">
            Kernel Engineering & Hardware Invariants
          </h4>
          <ul className="space-y-2">
            {project.details.kernelHighlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#94A3B8] font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] mt-2 shrink-0" />
                <span className="leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Code Snippet Container */}
        <div className="mb-6 rounded-xl bg-[#060913] border border-[#8B5CF6]/30 overflow-hidden font-mono text-xs">
          <div className="bg-[#0A0E1A] px-4 py-2.5 border-b border-[#8B5CF6]/20 flex items-center justify-between">
            <span className="text-[11px] text-[#94A3B8]">
              Implementation Kernel Excerpt (Triton / CUDA)
            </span>
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 text-[11px] text-[#06B6D4] hover:text-[#4CD7F6] transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="p-4 text-[#D0BCFF] overflow-x-auto text-[11px] sm:text-xs leading-relaxed max-h-60">
            {project.details.codeSnippet}
          </pre>
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-[#94A3B8]/15 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <a
              href={project.details.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-[#0A0E1A] hover:bg-[#1E293B] border border-[#8B5CF6]/30 rounded-lg text-[#F8FAFC] transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4 text-[#06B6D4]" />
              <span>GitHub Repository</span>
            </a>

            <a
              href={project.details.paperUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-[#0A0E1A] hover:bg-[#1E293B] border border-[#8B5CF6]/30 rounded-lg text-[#F8FAFC] transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
              <span>ArXiv Paper</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyCitation}
              className="px-3 py-2 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#060913] border border-[#94A3B8]/20 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedCitation ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCitation ? 'Citation Copied' : 'Cite Paper'}</span>
            </button>

            <button
              onClick={onClose}
              className="btn-hyper-gradient px-4 py-2 text-white font-semibold rounded-lg"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
