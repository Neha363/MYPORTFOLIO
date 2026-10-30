import React, { useState } from 'react';
import { BookOpen, Copy, Check, ExternalLink, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { PUBLICATIONS } from '../data/portfolioData';
import { Publication } from '../types';

export const PublicationsSection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const copyBibtex = (pub: Publication) => {
    navigator.clipboard.writeText(pub.bibtex);
    setCopiedId(pub.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-12 lg:py-20" id="publications">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold font-mono tracking-[0.14em] uppercase text-[#06B6D4]">
              PEER-REVIEWED SCIENTIFIC LITERATURE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans'] tracking-tight">
            Research Publications & Preprints
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mt-2">
            Foundational contributions to memory hierarchies, kernel compilation, and sparse deep learning presented at top ML systems conferences.
          </p>
        </div>

        {/* Publications List */}
        <div className="space-y-4">
          {PUBLICATIONS.map((pub) => {
            const isExpanded = expandedId === pub.id;
            const isCopied = copiedId === pub.id;

            return (
              <div
                key={pub.id}
                className="rounded-2xl glass-panel p-6 border border-[#8B5CF6]/20 bg-[#0A0E1A]/70 hover:border-[#8B5CF6]/40 transition-all"
              >
                {/* Clean Unboxed Metadata Line with typographic separators */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#94A3B8] mb-2.5">
                  <span className="font-semibold text-[#06B6D4]">{pub.conference}</span>
                  <span aria-hidden="true">·</span>
                  <span>{pub.year}</span>
                  {pub.award && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#F59E0B] font-semibold">{pub.award}</span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span>{pub.citations} citations</span>
                  <span aria-hidden="true">·</span>
                  <span>arXiv:{pub.arxivId}</span>
                </div>

                {/* Paper Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans'] mb-2">
                  {pub.title}
                </h3>

                {/* Author List */}
                <div className="text-xs sm:text-sm text-[#94A3B8] font-sans mb-4">
                  {pub.authors.map((author, aIdx) => (
                    <span key={aIdx}>
                      <span className={author === 'Alex Vance' ? 'text-[#F8FAFC] font-semibold underline decoration-[#8B5CF6]' : ''}>
                        {author}
                      </span>
                      {aIdx < pub.authors.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>

                {/* Expandable Abstract Preview */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#94A3B8]/10 text-xs sm:text-sm text-[#CBC3D7] font-sans leading-relaxed space-y-4 bg-[#060913]/60 p-4 rounded-xl border border-[#8B5CF6]/15">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#06B6D4] block mb-1 uppercase">
                        Paper Abstract
                      </span>
                      <p>{pub.abstract}</p>
                    </div>

                    {/* BibTeX Code Snippet Block */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-[#8B5CF6] uppercase">
                          BibTeX Citation
                        </span>
                        <button
                          onClick={() => copyBibtex(pub)}
                          className="flex items-center gap-1 text-[11px] font-mono text-[#06B6D4] hover:underline"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-[#10B981]" />
                              <span className="text-[#10B981]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy BibTeX</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3 bg-[#060913] border border-[#94A3B8]/15 rounded-lg text-[11px] font-mono text-[#94A3B8] overflow-x-auto">
                        {pub.bibtex}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Card Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#94A3B8]/10 text-xs font-mono">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleExpand(pub.id)}
                      className="text-[#F8FAFC] hover:text-[#06B6D4] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Abstract & BibTeX' : 'View Abstract & BibTeX'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => copyBibtex(pub)}
                      className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'BibTeX'}</span>
                    </button>

                    <a
                      href={pub.links.paper}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#06B6D4] hover:underline flex items-center gap-1"
                    >
                      <span>arXiv PDF</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
