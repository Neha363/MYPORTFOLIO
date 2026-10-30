export interface ProjectArchitecture {
  id: string;
  title: string;
  category: 'kernel' | 'moe' | 'quantization' | 'robotics';
  categoryLabel: string;
  abstract: string;
  headlineMetric: string;
  headlineMetricLabel: string;
  tags: string[];
  metrics: {
    label: string;
    baseline: string;
    kinetic: string;
    improvement: string;
    progressPercent: number;
  }[];
  parameters: {
    totalParams: string;
    activeParams: string;
    contextWindow: string;
    precision: string;
    kernelThroughput: string;
    memoryBandwidth: string;
  };
  details: {
    motivation: string;
    mathematicalFormulation: string;
    kernelHighlights: string[];
    codeSnippet: string;
    citation: string;
    githubUrl: string;
    paperUrl: string;
  };
}

export interface BenchmarkTarget {
  id: string;
  name: string;
  hardware: string;
  vram: string;
  interconnect: string;
  records: {
    model: string;
    framework: string;
    batchSize: number;
    ttftMs: number;
    throughputTokSec: number;
    vramUsedGb: number;
    speedupVsBaseline: string;
    lossConvergence: number;
  }[];
}

export interface Publication {
  id: string;
  title: string;
  conference: string;
  year: number;
  award?: string;
  authors: string[];
  abstract: string;
  arxivId: string;
  bibtex: string;
  doi: string;
  citations: number;
  pdfSize: string;
  links: {
    paper: string;
    code: string;
    poster: string;
  };
}

export interface TerminalLog {
  id: string;
  type: 'command' | 'output' | 'success' | 'warning' | 'error' | 'metric';
  text: string;
  timestamp: string;
  metadata?: Record<string, string | number>;
}
