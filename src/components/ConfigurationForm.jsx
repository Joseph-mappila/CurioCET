import React, { useState } from 'react';
import { TONES, AUDIENCES } from '../data/presets';
import { Tag, Volume2, Users, ChevronDown, ChevronUp, Sparkles, Loader2, ArrowRight } from 'lucide-react';

export default function ConfigurationForm({
  brandName,
  setBrandName,
  tone,
  setTone,
  audience,
  setAudience,
  highlights,
  setHighlights,
  keywords,
  setKeywords,
  onSubmit,
  isLoading,
  canSubmit,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit && !isLoading) onSubmit();
      }}
      className="space-y-4"
    >
      {/* Brand Name Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-1.5">
          Brand Name <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g. NovaSound, Terra & Kiln, Aerostride"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
          />
          <div className="absolute right-3 top-2.5 text-xs text-slate-500">
            Personalizes copy
          </div>
        </div>
      </div>

      {/* Tone of Voice Selector */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-indigo-400" />
            Tone of Voice
          </span>
          <span className="text-[11px] text-slate-400">Controls persuasion style</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TONES.map((t) => {
            const isSelected = tone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200 shadow-sm shadow-indigo-500/20'
                    : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <div className="font-semibold text-xs leading-tight mb-1">{t.label}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1 leading-snug">{t.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Audience Dropdown */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-cyan-400" />
          Target Audience
        </label>
        <select
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          {AUDIENCES.map((a) => (
            <option key={a.id} value={a.id} className="bg-slate-900 text-slate-200">
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {/* Optional Advanced SEO & Highlights Collapsible */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/30">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-medium text-slate-300 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            Additional Specifications & SEO Keywords (Optional)
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Key Features / Specs (comma-separated)
              </label>
              <input
                type="text"
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                placeholder="e.g. 40hr battery, water resistant, organic cotton, titanium build"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target SEO Search Keywords
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. wireless earbuds, noise cancelling headphones, travel audio"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Big Action Submit Button */}
      <button
        type="submit"
        disabled={!canSubmit || isLoading}
        className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all duration-200 ${
          canSubmit && !isLoading
            ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-500/25 cursor-pointer transform hover:-translate-y-0.5'
            : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Analyzing Image & Synthesizing Copy...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Generate High-Converting Description</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
