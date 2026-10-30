import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Trash2, Cpu, CheckCircle2, ChevronRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { TerminalLog } from '../types';

const INITIAL_LOGS: TerminalLog[] = [
  {
    id: '1',
    type: 'output',
    text: 'Obsidian Kinetic v3.8.4-RELEASE [CUDA 12.4 / Driver 550.54.14 / Hopper Architecture]',
    timestamp: '23:12:01',
  },
  {
    id: '2',
    type: 'output',
    text: 'Cluster connected: 8x NVIDIA H100 80GB SXM5 (Total 640GB HBM3 @ 3.35 TB/s per GPU).',
    timestamp: '23:12:02',
  },
  {
    id: '3',
    type: 'success',
    text: 'Initialized Kinetic Attention Engine with Asynchronous TMA pipelines and zero shared-memory bank conflicts.',
    timestamp: '23:12:03',
  },
  {
    id: '4',
    type: 'output',
    text: 'Type "help" to inspect available diagnostic commands or select a preset benchmark below.',
    timestamp: '23:12:04',
  },
];

const PRESETS = [
  { label: 'Run Speculative Benchmark', cmd: 'run benchmark --model speculative-stream --tokens 512' },
  { label: 'Inspect FlashKernel-v4 Weights', cmd: 'inspect kernel --target flashkernel-v4' },
  { label: 'Cluster GPU Telemetry', cmd: 'cluster status' },
  { label: 'Quantize MoE Experts (FP8)', cmd: 'quantize moe --precision fp8 --eval fineweb' },
];

export const InteractiveTerminal: React.FC = () => {
  const [logs, setLogs] = useState<TerminalLog[]>(INITIAL_LOGS);
  const [inputVal, setInputVal] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const executeCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    // Add command log
    const now = new Date().toTimeString().split(' ')[0];
    const newCommandLog: TerminalLog = {
      id: Math.random().toString(),
      type: 'command',
      text: trimmed,
      timestamp: now,
    };

    setLogs((prev) => [...prev, newCommandLog]);
    setCommandHistory((prev) => [trimmed, ...prev]);
    setHistoryIndex(-1);
    setInputVal('');
    setIsProcessing(true);

    const parts = trimmed.toLowerCase().split(' ');
    const primary = parts[0];

    setTimeout(() => {
      handleCommandResponse(trimmed, parts);
      setIsProcessing(false);
    }, 450);
  };

  const handleCommandResponse = (raw: string, parts: string[]) => {
    const now = new Date().toTimeString().split(' ')[0];
    const addLog = (type: TerminalLog['type'], text: string) => {
      setLogs((prev) => [
        ...prev,
        { id: Math.random().toString(), type, text, timestamp: now },
      ]);
    };

    const cmd = parts[0];

    if (cmd === 'clear') {
      setLogs([]);
      return;
    }

    if (cmd === 'help') {
      addLog('output', 'AVAILABLE KINETIC SYSTEM COMMANDS:');
      addLog('output', '  run benchmark [--model <id>] [--tokens <N>]    - Execute live model latency & throughput test');
      addLog('output', '  inspect kernel [--target <name>]               - Dump Triton / CUDA kernel configuration & registers');
      addLog('output', '  cluster status                                 - Show 8x H100 SXM5 telemetry (VRAM, Power, Temp, NVLink)');
      addLog('output', '  quantize moe [--precision <fp8|int4>]          - Calibrate weight quantization with perplexity check');
      addLog('output', '  eval loss --dataset <fineweb|wikitext>         - Compute validation perplexity convergence');
      addLog('output', '  clear                                          - Clear current terminal console window');
      return;
    }

    if (cmd === 'cluster') {
      addLog('output', '===================== CLUSTER HEALTH: H100-NODE-ALPHA =====================');
      addLog('output', 'GPU 0-7: 8x NVIDIA H100 80GB HBM3 | NVLink 4.0: 900 GB/s bidirectional');
      addLog('output', 'Average Temp: 48°C | Fan Speed: 62% | Power Draw: 382W / 700W TDP');
      addLog('output', 'Memory Allocation: 44.2 GB / 80.0 GB per GPU (Total: 353.6 GB allocated)');
      addLog('output', 'PCIe Status: Gen5 x16 (64 GB/s) | InfiniBand: 400 Gb/s NDR ACTIVE');
      addLog('success', 'STATUS: All 8 GPUs healthy, zero ECC single-bit/double-bit errors recorded.');
      return;
    }

    if (cmd === 'inspect') {
      addLog('output', 'FETCHING KERNEL SPECIFICATIONS: [FlashKernel-v4]');
      addLog('output', '  SRAM Tile Geometry:       BLOCK_M=128, BLOCK_N=64, BLOCK_D=128');
      addLog('output', '  Register Allocation:      112 regs/thread (Maximum warp occupancy)');
      addLog('output', '  Hardware Acceleration:    Hopper TMA + WGMMA 64x128x16 FP8 instructions');
      addLog('output', '  Shared Memory Footprint:  98,304 bytes / 228 KB available');
      addLog('output', '  Memory Pipeline:          4-stage software pipeline with async mbarrier');
      addLog('success', 'OPTIMIZATION: Bank conflict elimination verified. Achieved 94.2% MFU.');
      return;
    }

    if (cmd === 'run' || cmd === 'benchmark') {
      addLog('output', 'STARTING HARDWARE BENCHMARK PIPELINE...');
      addLog('output', 'Model: KineticMoE-64B (W4A8) | Prompt: 4,096 tokens | Generation: 512 tokens');
      addLog('output', 'Pre-filling KV-cache in Paged FP8 memory space...');
      addLog('metric', 'TTFT (Time-To-First-Token): 1.82 ms (P99)');
      addLog('metric', 'Decoding Throughput: 1,424 tokens/sec on 8x H100 SXM5');
      addLog('metric', 'Speculative Acceptance Rate: 3.84 tokens / verification step');
      addLog('success', 'BENCHMARK COMPLETE: 4.8× acceleration over vanilla baseline achieved.');
      return;
    }

    if (cmd === 'quantize') {
      addLog('output', 'CALIBRATING FP8 (E4M3 / E5M2) ACTIVATION & WEIGHT SCALES...');
      addLog('output', 'Processing 10,000 sequences from FineWeb-Edu dataset...');
      addLog('output', 'Per-channel scaling vectors computed. Outlier threshold = 3.2σ');
      addLog('metric', 'FP16 Baseline Perplexity: 4.412');
      addLog('metric', 'FP8 Quantized Perplexity: 4.418 (Degradation: +0.006 delta)');
      addLog('success', 'SUCCESS: Quantization is lossless within 0.14% relative error margin.');
      return;
    }

    if (cmd === 'eval') {
      addLog('output', 'EVALUATING MODEL LOSS ON FINEWEB-EDU VALIDATION SPLIT...');
      addLog('metric', 'Cross-Entropy Loss: 1.4842 nats/token');
      addLog('metric', 'Effective Perplexity: 4.41');
      addLog('success', 'CONVERGENCE VERIFIED: Reached state-of-the-art scaling efficiency.');
      return;
    }

    // Default response
    addLog('error', `Command not recognized: "${raw}". Type "help" for a list of valid commands.`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <section className="py-12 lg:py-20" id="terminal">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold font-mono tracking-[0.14em] uppercase text-[#06B6D4]">
              INTERACTIVE INFERENCE SHELL
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans'] tracking-tight">
            Low-Level Execution Console & Hardware Profiler
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mt-2">
            Execute real diagnostic routines, trigger simulated kernel benchmarks, and inspect multi-node GPU telemetry in real time.
          </p>
        </div>

        {/* Quick Launch Preset Actions */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-mono text-[#64748B] mr-1 hidden sm:inline">
            PRESETS:
          </span>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => executeCommand(preset.cmd)}
              disabled={isProcessing}
              className="px-3 py-1.5 text-xs font-mono text-[#F8FAFC] bg-[#0A0E1A]/80 hover:bg-[#1E293B] border border-[#8B5CF6]/20 hover:border-[#06B6D4]/50 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Play className="w-3 h-3 text-[#06B6D4]" />
              <span>{preset.label}</span>
            </button>
          ))}
          
          <button
            onClick={() => setLogs([])}
            className="ml-auto px-2.5 py-1.5 text-xs font-mono text-[#94A3B8] hover:text-[#EF4444] bg-[#060913] border border-[#94A3B8]/20 rounded-lg transition-colors flex items-center gap-1"
            title="Clear Console"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

        {/* Main Terminal Shell Container */}
        <div className="rounded-2xl bg-[#060913] border border-[#8B5CF6]/30 shadow-2xl overflow-hidden font-mono text-xs">
          {/* macOS-style Header Controls */}
          <div className="bg-[#0A0E1A] px-4 py-3 border-b border-[#8B5CF6]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#EF4444]/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#F59E0B]/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#10B981]/80 inline-block" />
              <span className="ml-3 text-[11px] text-[#94A3B8] font-mono hidden sm:inline">
                kinetic@h100-cluster-04: /opt/kinetic/kernels
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
              <span className="flex items-center gap-1 text-[#06B6D4]">
                <Cpu className="w-3.5 h-3.5" />
                <span>CUDA 12.4</span>
              </span>
              <span className="hidden md:inline">·</span>
              <span className="hidden md:inline text-[#10B981]">ONLINE</span>
            </div>
          </div>

          {/* Terminal Output Area */}
          <div className="p-5 sm:p-6 min-h-[360px] max-h-[460px] overflow-y-auto space-y-2.5 bg-[#060913]/95">
            {logs.map((log) => {
              if (log.type === 'command') {
                return (
                  <div key={log.id} className="flex items-start gap-2 text-[#F8FAFC]">
                    <span className="text-[#06B6D4] font-bold select-none">
                      kinetic@cluster:~$
                    </span>
                    <span className="text-[#F8FAFC] font-semibold">{log.text}</span>
                  </div>
                );
              }

              if (log.type === 'success') {
                return (
                  <div key={log.id} className="flex items-start gap-2 text-[#10B981] pl-2 border-l border-[#10B981]/40">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#10B981]" />
                    <span className="leading-relaxed">{log.text}</span>
                  </div>
                );
              }

              if (log.type === 'metric') {
                return (
                  <div key={log.id} className="flex items-start gap-2 text-[#4CD7F6] pl-2 border-l border-[#4CD7F6]/40">
                    <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#4CD7F6]" />
                    <span className="font-semibold tabular-nums leading-relaxed">{log.text}</span>
                  </div>
                );
              }

              if (log.type === 'error') {
                return (
                  <div key={log.id} className="text-[#FFB4AB] pl-2 border-l border-[#EF4444]/40 leading-relaxed">
                    [ERROR] {log.text}
                  </div>
                );
              }

              return (
                <div key={log.id} className="text-[#94A3B8] leading-relaxed">
                  {log.text}
                </div>
              );
            })}

            {isProcessing && (
              <div className="flex items-center gap-2 text-[#06B6D4] animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                <span>Executing kernel pipeline in GPU memory...</span>
              </div>
            )}

            <div ref={logsEndRef} />
          </div>

          {/* Interactive Input Line */}
          <div className="bg-[#0A0E1A]/90 p-3 sm:p-4 border-t border-[#8B5CF6]/20 flex items-center gap-3">
            <span className="text-[#06B6D4] font-bold select-none flex items-center gap-1">
              <span>kinetic@cluster:~$</span>
            </span>

            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Type a command (e.g. "help", "cluster status", "run benchmark")...'
              disabled={isProcessing}
              className="flex-1 bg-transparent text-[#F8FAFC] placeholder-[#64748B] focus:outline-none font-mono text-xs sm:text-sm"
              autoFocus
            />

            <button
              onClick={() => executeCommand(inputVal)}
              disabled={isProcessing || !inputVal.trim()}
              className="px-3 py-1.5 bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/40 text-[#D0BCFF] border border-[#8B5CF6]/30 rounded-md transition-colors flex items-center gap-1 font-mono text-xs disabled:opacity-40"
            >
              <span>Execute</span>
              <CornerDownLeft className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
