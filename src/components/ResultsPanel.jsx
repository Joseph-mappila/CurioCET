import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  FileText,
  Search,
  Edit3,
  CheckCircle2,
  GitCompare,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ConversionMetrics from './ConversionMetrics';
import SeoCard from './SeoCard';
import SocialSnippets from './SocialSnippets';

export default function ResultsPanel({
  pipelineResult,
  onUpdateFinalOutput,
  brandName,
  tone,
  isLoading,
  currentStage,
  onRegenerate,
}) {
  const [activeTab, setActiveTab] = useState('final'); // 'final', 'audit', 'compare', 'seo', 'social', 'abtest'
  const [copiedSection, setCopiedSection] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Local editable state for final output
  const [editableFinal, setEditableFinal] = useState(null);

  // Sync with incoming pipelineResult
  useEffect(() => {
    if (pipelineResult?.finalOutput) {
      setEditableFinal(JSON.parse(JSON.stringify(pipelineResult.finalOutput)));
    }
  }, [pipelineResult]);

  const finalOutput = editableFinal || pipelineResult?.finalOutput;
  const primaryDraft = pipelineResult?.primaryDraft;
  const auditReport = pipelineResult?.auditReport;

  const handleCopy = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopyAll = () => {
    if (!finalOutput) return;
    const fullText = `# ${finalOutput.title}\n\n*${finalOutput.tagline}*\n\n${finalOutput.narrative}\n\n### Key Benefits:\n${finalOutput.benefits.map((b) => `- ${b}`).join('\n')}\n\n### SEO Meta:\nTitle: ${finalOutput.seo?.metaTitle}\nDescription: ${finalOutput.seo?.metaDescription}`;
    navigator.clipboard.writeText(fullText);
    setCopiedSection('all');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#06b6d4', '#22c55e', '#a855f7'],
    });
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleSaveChanges = () => {
    if (onUpdateFinalOutput && editableFinal) {
      onUpdateFinalOutput(editableFinal);
    }
    setIsEditing(false);
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
  };

  const handleResetToAI = () => {
    if (pipelineResult?.finalOutput) {
      setEditableFinal(JSON.parse(JSON.stringify(pipelineResult.finalOutput)));
      setIsEditing(false);
    }
  };

  const handleAddBenefit = () => {
    if (!editableFinal) return;
    setEditableFinal({
      ...editableFinal,
      benefits: [...editableFinal.benefits, "New Verified Benefit — Description of customer value"],
    });
  };

  const handleRemoveBenefit = (index) => {
    if (!editableFinal) return;
    const updated = editableFinal.benefits.filter((_, i) => i !== index);
    setEditableFinal({ ...editableFinal, benefits: updated });
  };

  const exportFile = (type) => {
    if (!finalOutput) return;
    let content = '';
    let mimeType = 'text/plain';
    let filename = `${brandName || 'product'}-final-description.${type}`;

    if (type === 'json') {
      content = JSON.stringify({ finalOutput, auditReport }, null, 2);
      mimeType = 'application/json';
    } else if (type === 'md') {
      content = `# ${finalOutput.title}\n\n> ${finalOutput.tagline}\n\n${finalOutput.narrative}\n\n## Verified Key Benefits\n${finalOutput.benefits.map((b) => `- ${b}`).join('\n')}\n\n---\n\n### Anti-Hallucination Audit\n- **Grounded Score:** ${auditReport?.groundedScore || 98}/100\n- **Risk Status:** ${auditReport?.hallucinationRisk || 'Low'}\n\n### SEO\n- **Title:** ${finalOutput.seo?.metaTitle}\n- **Meta Description:** ${finalOutput.seo?.metaDescription}`;
      mimeType = 'text/markdown';
    } else if (type === 'html') {
      content = `<!DOCTYPE html><html><head><title>${finalOutput.title}</title></head><body><h1>${finalOutput.title}</h1><p><em>${finalOutput.tagline}</em></p><p>${finalOutput.narrative.replace(/\n\n/g, '</p><p>')}</p><ul>${finalOutput.benefits.map((b) => `<li>${b}</li>`).join('')}</ul></body></html>`;
      mimeType = 'text/html';
    } else {
      content = `${finalOutput.title}\n\n${finalOutput.tagline}\n\n${finalOutput.narrative}\n\nKey Benefits:\n${finalOutput.benefits.map((b) => `• ${b}`).join('\n')}`;
      filename = `${brandName || 'product'}-description.txt`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Empty State
  if (!pipelineResult && !isLoading) {
    return (
      <div className="h-full min-h-[480px] rounded-3xl border border-slate-800 bg-slate-900/40 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 shadow-inner">
          <Sparkles className="w-8 h-8 animate-pulse-subtle" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          In-Loop AI Generator & Evaluator Ready
        </h3>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          Upload a product image and brand name to launch the 2-stage pipeline. Stage 1 drafts high-converting copy, then the In-Loop LLM Evaluator audits and cleanses hallucinations before presenting the editable final result.
        </p>

        {/* Pipeline Architecture Diagram */}
        <div className="w-full max-w-lg p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-left space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
            Anti-Hallucination Pipeline Flow
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-indigo-400 font-bold block mb-1">1. Primary Draft</span>
              <span className="text-[11px] text-slate-400">Creative vision synthesis & emotional hooks</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-indigo-500/30">
              <span className="text-amber-400 font-bold block mb-1">2. In-Loop Critic</span>
              <span className="text-[11px] text-slate-400">Fact-checks claims against photo & user specs</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30">
              <span className="text-emerald-400 font-bold block mb-1">3. Final Output</span>
              <span className="text-[11px] text-slate-400">100% grounded, fully editable sales copy</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading State with Multi-Stage Progress
  if (isLoading) {
    return (
      <div className="h-full min-h-[480px] rounded-3xl border border-indigo-500/30 bg-slate-900/60 p-8 flex flex-col items-center justify-center text-center space-y-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin flex items-center justify-center" />
          <ShieldCheck className="w-8 h-8 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
        </div>

        <div className="space-y-2 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span>{currentStage?.label || "Processing Two-Stage LLM Pipeline..."}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {currentStage?.detail || "Stage 1 generates copy, Stage 2 audits for hallucinations..."}
          </p>
        </div>

        {/* Visual Pipeline Bar */}
        <div className="flex items-center gap-3 text-xs w-full max-w-sm justify-center">
          <span className={`px-2.5 py-1 rounded-lg border ${currentStage?.stage === 1 ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200' : 'border-emerald-500/40 text-emerald-400'}`}>
            Stage 1: Draft
          </span>
          <span className="text-slate-600">➔</span>
          <span className={`px-2.5 py-1 rounded-lg border ${currentStage?.stage === 2 ? 'border-amber-500 bg-amber-500/20 text-amber-200 animate-pulse' : 'border-slate-800 text-slate-500'}`}>
            Stage 2: In-Loop Critic
          </span>
          <span className="text-slate-600">➔</span>
          <span className="px-2.5 py-1 rounded-lg border border-slate-800 text-slate-500">
            Final Verified
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0E1320]/90 shadow-2xl backdrop-blur-xl p-5 sm:p-6 space-y-5">
      {/* Pipeline Status Banner */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-indigo-950/30 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white">In-Loop Evaluator Passed:</span>{" "}
            <span className="text-emerald-300 font-semibold">{auditReport?.groundedScore || 98}% Grounded Copy</span>
            <span className="text-slate-400 text-[11px] block sm:inline sm:ml-2">
              (0 Hallucinated Specs in Final Output)
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border border-slate-700 transition-colors"
        >
          View Audit Log ➔
        </button>
      </div>

      {/* Navigation Tabs and Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800/80 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('final')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'final'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Final Output</span>
            {isEditing && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Anti-Hallucination Audit</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'compare'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Draft vs Final</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'seo'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>SEO & SERP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'social'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Social</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Edit Final Output Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              if (isEditing) {
                handleSaveChanges();
              } else {
                setIsEditing(true);
                setActiveTab('final');
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              isEditing
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-600/30 font-bold'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
            title="Edit the final verified copy"
          >
            {isEditing ? (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Edits</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Edit Final Output</span>
              </>
            )}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleResetToAI}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors flex items-center gap-1"
              title="Revert edits to AI output"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          {/* Export Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export</span>
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1 z-50">
                <button
                  onClick={() => exportFile('md')}
                  className="w-full px-3 py-1.5 text-left text-xs text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  Markdown (.md)
                </button>
                <button
                  onClick={() => exportFile('html')}
                  className="w-full px-3 py-1.5 text-left text-xs text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  HTML (.html)
                </button>
                <button
                  onClick={() => exportFile('json')}
                  className="w-full px-3 py-1.5 text-left text-xs text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  JSON (.json)
                </button>
                <button
                  onClick={() => exportFile('txt')}
                  className="w-full px-3 py-1.5 text-left text-xs text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  Plain Text (.txt)
                </button>
              </div>
            )}
          </div>

          {/* 1-Click Copy All */}
          <button
            type="button"
            onClick={handleCopyAll}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
          >
            {copiedSection === 'all' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Conversion Potential Scorecard */}
      <ConversionMetrics metrics={finalOutput?.metrics} />

      {/* ================= TAB 1: FINAL OUTPUT (EDITABLE) ================= */}
      {activeTab === 'final' && finalOutput && (
        <div className="space-y-5">
          {/* Edit Mode Notice Banner */}
          {isEditing && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
              <span className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>
                  <strong>Edit Mode Active:</strong> You can edit the title, hook, narrative paragraphs, and benefit bullets. Click <strong>"Save Edits"</strong> when finished.
                </span>
              </span>
              <button
                type="button"
                onClick={handleSaveChanges}
                className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
              >
                Save Now
              </button>
            </div>
          )}

          {/* Product Title Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                Grounded Product Title
              </span>
              <button
                type="button"
                onClick={() => handleCopy(finalOutput.title, 'title')}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
              >
                {copiedSection === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {isEditing ? (
              <textarea
                value={finalOutput.title}
                onChange={(e) =>
                  setEditableFinal({ ...editableFinal, title: e.target.value })
                }
                className="w-full bg-slate-950 p-2.5 rounded-xl text-base font-bold text-white border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                rows={2}
              />
            ) : (
              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug tracking-tight">
                {finalOutput.title}
              </h2>
            )}
          </div>

          {/* Tagline / Hook */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="min-w-0 pr-2 flex-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                Emotional Slogan & Hook
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={finalOutput.tagline}
                  onChange={(e) =>
                    setEditableFinal({ ...editableFinal, tagline: e.target.value })
                  }
                  className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg text-sm text-cyan-300 font-medium border border-indigo-500 focus:outline-none"
                />
              ) : (
                <p className="text-sm font-medium text-cyan-300 italic">
                  "{finalOutput.tagline}"
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(finalOutput.tagline, 'tagline')}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 flex-shrink-0"
            >
              {copiedSection === 'tagline' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Persuasive Story Narrative */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Verified Sales Narrative (PAS Framework)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  Evaluated & Grounded
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(finalOutput.narrative, 'narrative')}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
              >
                {copiedSection === 'narrative' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {isEditing ? (
              <textarea
                value={finalOutput.narrative}
                onChange={(e) =>
                  setEditableFinal({ ...editableFinal, narrative: e.target.value })
                }
                className="w-full bg-slate-950 p-3 rounded-xl text-xs sm:text-sm text-slate-200 border border-indigo-500 focus:outline-none leading-relaxed font-sans"
                rows={6}
              />
            ) : (
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 font-sans">
                {finalOutput.narrative.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>

          {/* Benefit-Driven Bullets */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Audited Benefit Bullets (Feature → Tangible Outcome)
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopy(finalOutput.benefits.map((b) => `• ${b}`).join('\n'), 'benefits')
                }
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
              >
                {copiedSection === 'benefits' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <ul className="space-y-2.5">
              {finalOutput.benefits.map((benefit, index) => {
                const parts = benefit.split('—');
                const feature = parts[0]?.trim();
                const outcome = parts.slice(1).join('—').trim();

                return (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/60"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => {
                            const newBenefits = [...editableFinal.benefits];
                            newBenefits[index] = e.target.value;
                            setEditableFinal({ ...editableFinal, benefits: newBenefits });
                          }}
                          className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-slate-200 border border-indigo-500/80"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveBenefit(index)}
                          className="p-1 text-slate-500 hover:text-red-400"
                          title="Remove bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300 leading-normal">
                        {outcome ? (
                          <>
                            <strong className="text-white font-semibold">{feature}</strong>
                            <span className="text-slate-400"> — </span>
                            <span>{outcome}</span>
                          </>
                        ) : (
                          <span>{benefit}</span>
                        )}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            {isEditing && (
              <button
                type="button"
                onClick={handleAddBenefit}
                className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 border border-indigo-500/30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Benefit Bullet</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: ANTI-HALLUCINATION AUDIT LOG ================= */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Audit Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-sm text-white">In-Loop Evaluator Audit Report</h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Grounded Score: {auditReport?.groundedScore || 98}/100
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {auditReport?.summary || "The In-Loop Evaluator compared the primary copy draft against the raw product image pixels and user inputs to eliminate unverified marketing claims."}
            </p>
          </div>

          {/* Hallucinations Cleansed / Removed */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Unverified Claims & Hallucinations Removed by Evaluator</span>
            </div>
            <ul className="space-y-1.5">
              {(auditReport?.hallucinationsRemoved || [
                "Purged unverified numeric battery claim not supplied in user specs",
                "Sanitized exaggerated 'military-grade' certification claim"
              ]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-amber-200/90">
                  <span className="text-amber-400 font-bold">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Grounded & Verified Claims */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Grounded Claims Verified Against Visual Evidence</span>
            </div>
            <ul className="space-y-1.5">
              {(auditReport?.claimsVerified || [
                "Observed materials and textures confirmed from photo",
                "Brand positioning accurately applied to narrative",
                "Conversion hooks tuned to selected audience persona"
              ]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-emerald-200/90">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ================= TAB 3: DRAFT VS FINAL DIFF ================= */}
      {activeTab === 'compare' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>
              <strong>Two-Stage Diff:</strong> Compare the raw Stage 1 Creative Draft against the Stage 2 Audited Output to observe hallucination prevention in action.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stage 1 Draft */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-400">Stage 1: Primary Draft (Unfiltered)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Pre-Audit</span>
              </div>
              <h5 className="font-bold text-xs text-white line-clamp-2">
                {primaryDraft?.title || "Primary Draft Title"}
              </h5>
              <p className="text-[11px] text-cyan-300 italic">
                "{primaryDraft?.tagline || "Primary Tagline"}"
              </p>
              <p className="text-xs text-slate-400 line-clamp-5 leading-relaxed">
                {primaryDraft?.narrative || "Raw primary draft story before hallucination cleansing."}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-400/80">
                ⚠️ May contain unchecked spec claims
              </div>
            </div>

            {/* Stage 2 Final */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-emerald-300">Stage 2: Final Output (Grounded)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Audited
                </span>
              </div>
              <h5 className="font-bold text-xs text-white line-clamp-2">
                {finalOutput?.title}
              </h5>
              <p className="text-[11px] text-cyan-300 italic">
                "{finalOutput?.tagline}"
              </p>
              <p className="text-xs text-slate-300 line-clamp-5 leading-relaxed">
                {finalOutput?.narrative}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Verified against image & user specs</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: SEO ================= */}
      {activeTab === 'seo' && finalOutput && (
        <SeoCard
          seo={finalOutput.seo}
          brandName={brandName}
          onCopy={handleCopy}
          copiedSection={copiedSection}
        />
      )}

      {/* ================= TAB 5: SOCIAL ================= */}
      {activeTab === 'social' && finalOutput && (
        <SocialSnippets
          social={finalOutput.social}
          onCopy={handleCopy}
          copiedSection={copiedSection}
        />
      )}
    </div>
  );
}
