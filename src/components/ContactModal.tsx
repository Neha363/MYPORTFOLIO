import React, { useState } from 'react';
import { X, Send, CheckCircle2, ShieldCheck, Mail, Building, MessageSquare } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    topic: 'Consulting & Inference Optimization',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-2xl glass-modal p-6 sm:p-8 border border-[#8B5CF6]/40 text-[#F8FAFC]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-5 border-b border-[#94A3B8]/15">
          <div>
            <span className="text-[11px] font-bold font-mono tracking-wider uppercase text-[#06B6D4] block mb-1">
              DIRECT TECHNICAL INQUIRY
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-[#F8FAFC]">
              Request Technical Consultation
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0A0E1A] hover:bg-[#1E293B] border border-[#8B5CF6]/20 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center mx-auto text-[#10B981]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#F8FAFC] font-['Plus_Jakarta_Sans']">
              Inquiry Dispatched to Kernel Team
            </h4>
            <p className="text-sm text-[#94A3B8] max-w-md mx-auto">
              Thank you for reaching out. A detailed technical response and calendar link will be transmitted to <span className="text-[#06B6D4]">{formData.email}</span> within 24 hours.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="btn-hyper-gradient px-5 py-2.5 text-xs font-semibold rounded-lg text-white mt-4"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[#94A3B8] mb-1.5 uppercase text-[11px]">
                Full Name & Title
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Jordan Hayes, VP of Foundation Models"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#060913]/90 border border-[#94A3B8]/20 text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#94A3B8] mb-1.5 uppercase text-[11px]">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jordan@lab.ai"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#060913]/90 border border-[#94A3B8]/20 text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition-all"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1.5 uppercase text-[11px]">
                  Company / Organization
                </label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="HyperScale Compute Corp"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#060913]/90 border border-[#94A3B8]/20 text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#94A3B8] mb-1.5 uppercase text-[11px]">
                Collaboration Domain
              </label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#060913] border border-[#94A3B8]/20 text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition-all"
              >
                <option value="Consulting & Inference Optimization">Consulting & Inference Latency Reduction</option>
                <option value="Custom CUDA & Triton Kernel Development">Custom CUDA & Triton Kernel Development</option>
                <option value="Sparse MoE Scaling Architecture">Sparse MoE Scaling & Distributed Training</option>
                <option value="Edge Silicon & Robotics Quantization">Edge Silicon & Robotics Model Quantization</option>
                <option value="Research Fellow / Advisory Invitation">Research Fellow / Advisory Invitation</option>
              </select>
            </div>

            <div>
              <label className="block text-[#94A3B8] mb-1.5 uppercase text-[11px]">
                Architecture Brief / Invariants
              </label>
              <textarea
                rows={3}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe target cluster (e.g. 128x H100), sequence lengths, memory constraints, or desired throughput targets..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#060913]/90 border border-[#94A3B8]/20 text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition-all resize-none font-sans text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-[#64748B] flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>NDA & Confidentiality Respected</span>
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-hyper-gradient px-5 py-2.5 rounded-lg text-white font-semibold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Transmitting...' : 'Dispatch Request'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
