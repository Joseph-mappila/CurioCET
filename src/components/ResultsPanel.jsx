import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  Layers,
  FileText,
  Search,
  MessageSquare,
  Edit3,
  CheckCircle2,
  RefreshCw,
  GitCompare,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ConversionMetrics from './ConversionMetrics';
import SeoCard from './SeoCard';
import SocialSnippets from './SocialSnippets';

export default function ResultsPanel({
  result,
  setResult,
  brandName,
  tone,
  isLoading,
  onRegenerate,
}) {
  const [activeTab, setActiveTab] = useState('copy'); // copy, seo, social, abtest
  const [copiedSection, setCopiedSection] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleCopy = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopyAll = () => {
    if (!result) return;
    const fullText = `# ${result.title}\n\n*${result.tagline}*\n\n${result.narrative}\n\n### Key Benefits:\n${result.benefits.map((b) => `- ${b}`).join('\n')}\n\n### SEO Meta:\nTitle: ${result.seo?.metaTitle}\nDescription: ${result.seo?.metaDescription}`;
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

  const exportFile = (type) => {
    if (!result) return;
    let content = '';
    let mimeType = 'text/plain';
    let filename = `${brandName || 'product'}-description.${type}`;

    if (type === 'json') {
      content = JSON.stringify(result, null, 2);
      mimeType = 'application/json';
    } else if (type === 'md') {
      content = `# ${result.title}\n\n> ${result.tagline}\n\n${result.narrative}\n\n## Key Benefits & Features\n\n${result.benefits.map((b) => `- ${b}`).join('\n')}\n\n---\n\n### SEO\n- **Title:** ${result.seo?.metaTitle}\n- **Meta Description:** ${result.seo?.metaDescription}\n- **Keywords:** ${result.seo?.keywords?.join(', ')}`;
      mimeType = 'text/markdown';
    } else if (type === 'html') {
      content = `<!DOCTYPE html><html><head><title>${result.title}</title></head><body><h1>${result.title}</h1><p><em>${result.tagline}</em></p><p>${result.narrative.replace(/\n\n/g, '</p><p>')}</p><ul>${result.benefits.map((b) => `<li>${b}</li>`).join('')}</ul></body></html>`;
      mimeType = 'text/html';
    } else {
      content = `${result.title}\n\n${result.tagline}\n\n${result.narrative}\n\nKey Benefits:\n${result.benefits.map((b) => `• ${b}`).join('\n')}`;
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

  if (!result && !isLoading) {
    return (
      <div className="h-full min-h-[460px] rounded-3xl border border-slate-800 bg-slate-900/40 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 shadow-inner">
          <Sparkles className="w-8 h-8 animate-pulse-subtle" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          Your Conversion Copy Awaits
        </h3>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          Upload any product image and enter the brand name on the left. Gemini will analyze materials, design, and aesthetics to write persona-tailored sales copy.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left w-full max-w-lg">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-indigo-400 font-semibold text-xs block mb-1">1. Multimodal</span>
            <span className="text-[11px] text-slate-400">Detects textures, colors, and subtle premium cues</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-cyan-400 font-semibold text-xs block mb-1">2. Psychology</span>
            <span className="text-[11px] text-slate-400">Feature-to-benefit transformation formulas</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-emerald-400 font-semibold text-xs block mb-1">3. SEO Ready</span>
            <span className="text-[11px] text-slate-400">Google SERP previews & high-intent keywords</span>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full min-h-[460px] rounded-3xl border border-indigo-500/30 bg-slate-900/60 p-8 flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin flex items-center justify-center" />
          <Sparkles className="w-8 h-8 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          Crafting Conversion-Engineered Copy...
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-4">
          Running vision analysis on product geometry, extracting value drivers, and tuning emotional hooks for <span className="text-indigo-300 font-semibold">"{brandName || 'your brand'}"</span>.
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
          <span>Applying PAS (Problem-Agitation-Solution) Sales Framework</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0E1320]/90 shadow-2xl backdrop-blur-xl p-5 sm:p-6 space-y-5">
      {/* Top Bar with Tabs and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveTab('copy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'copy'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Sales Copy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'social'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Social & Ads</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('abtest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'abtest'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>A/B Split</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
              isEditing
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-300 border-slate-700/80 hover:bg-slate-800'
            }`}
            title="Toggle inline text editing"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isEditing ? 'Done Editing' : 'Edit Copy'}</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-slate-300 border border-slate-700/80 hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
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
                  HTML Format (.html)
                </button>
                <button
                  onClick={() => exportFile('json')}
                  className="w-full px-3 py-1.5 text-left text-xs text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  Raw JSON (.json)
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
                <Check className="w-3.5 h-3.5 text-white" />
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

      {/* Conversion Scorecard */}
      <ConversionMetrics metrics={result.metrics} />

      {/* Tab 1: Sales Copy */}
      {activeTab === 'copy' && (
        <div className="space-y-5">
          {/* Product Title */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                Product Title (High-Converting & SEO-Packed)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(result.title, 'title')}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
              >
                {copiedSection === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {isEditing ? (
              <textarea
                value={result.title}
                onChange={(e) => setResult({ ...result, title: e.target.value })}
                className="w-full bg-slate-950 p-2 rounded-lg text-base font-bold text-white border border-slate-700 focus:outline-none"
                rows={2}
              />
            ) : (
              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug tracking-tight">
                {result.title}
              </h2>
            )}
          </div>

          {/* Tagline / Hook */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                Emotional Slogan / Hook
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={result.tagline}
                  onChange={(e) => setResult({ ...result, tagline: e.target.value })}
                  className="w-full bg-slate-950 p-1.5 rounded text-sm text-cyan-300 font-medium border border-slate-700"
                />
              ) : (
                <p className="text-sm font-medium text-cyan-300 italic">
                  "{result.tagline}"
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(result.tagline, 'tagline')}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 flex-shrink-0"
            >
              {copiedSection === 'tagline' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Persuasive Sales Narrative */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 relative">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Persuasive Product Narrative
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                  {tone} tone
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(result.narrative, 'narrative')}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
              >
                {copiedSection === 'narrative' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {isEditing ? (
              <textarea
                value={result.narrative}
                onChange={(e) => setResult({ ...result, narrative: e.target.value })}
                className="w-full bg-slate-950 p-3 rounded-lg text-xs sm:text-sm text-slate-200 border border-slate-700 focus:outline-none leading-relaxed font-sans"
                rows={6}
              />
            ) : (
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 font-sans">
                {result.narrative.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>

          {/* Benefit-Driven Bullets */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                High-Conversion Benefit Bullets (Feature → Outcome)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(result.benefits.map((b) => `• ${b}`).join('\n'), 'benefits')}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
              >
                {copiedSection === 'benefits' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <ul className="space-y-2.5">
              {result.benefits.map((benefit, index) => {
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
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => {
                          const newBenefits = [...result.benefits];
                          newBenefits[index] = e.target.value;
                          setResult({ ...result, benefits: newBenefits });
                        }}
                        className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-slate-200 border border-slate-700"
                      />
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
          </div>
        </div>
      )}

      {/* Tab 2: SEO */}
      {activeTab === 'seo' && (
        <SeoCard
          seo={result.seo}
          brandName={brandName}
          onCopy={handleCopy}
          copiedSection={copiedSection}
        />
      )}

      {/* Tab 3: Social & Ads */}
      {activeTab === 'social' && (
        <SocialSnippets
          social={result.social}
          onCopy={handleCopy}
          copiedSection={copiedSection}
        />
      )}

      {/* Tab 4: A/B Split Testing Comparison */}
      {activeTab === 'abtest' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>
              <strong>Conversion Rate Optimization (CRO) A/B Testing:</strong> Compare an Emotion-First variant against a Feature-Led variant to maximize click-to-buy conversions.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Variant A (Active) */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Variant A: Story & Emotion Led
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">96% CRO Score</span>
              </div>
              <h4 className="font-bold text-sm text-white">{result.title}</h4>
              <p className="text-xs text-cyan-300 italic">"{result.tagline}"</p>
              <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed">{result.narrative}</p>
              <button
                type="button"
                onClick={() => handleCopy(result.narrative, 'va')}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition-colors"
              >
                {copiedSection === 'va' ? 'Copied Variant A' : 'Copy Variant A'}
              </button>
            </div>

            {/* Variant B (Feature & Spec Led) */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Variant B: Direct Spec & Urgency Led
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">93% CRO Score</span>
              </div>
              <h4 className="font-bold text-sm text-white">
                {brandName} Essential: High-Performance Solution for {result.seo?.keywords?.[0] || 'Everyday Use'}
              </h4>
              <p className="text-xs text-amber-300 font-medium">
                ⚡ Certified Professional Grade • Ships within 24 Hours
              </p>
              <ul className="text-xs text-slate-300 space-y-1">
                {result.benefits.slice(0, 3).map((b, i) => (
                  <li key={i} className="line-clamp-1 text-slate-400">
                    • {b}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `${brandName} Essential: High-Performance Solution\n${result.benefits.join('\n')}`,
                    'vb'
                  )
                }
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition-colors"
              >
                {copiedSection === 'vb' ? 'Copied Variant B' : 'Copy Variant B'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
