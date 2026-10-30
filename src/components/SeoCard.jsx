import React, { useState } from 'react';
import { Search, Globe, Copy, Check, ExternalLink } from 'lucide-react';

export default function SeoCard({ seo, brandName, onCopy, copiedSection }) {
  if (!seo) return null;

  const [metaTitle, setMetaTitle] = useState(seo.metaTitle || '');
  const [metaDesc, setMetaDesc] = useState(seo.metaDescription || '');

  const titleLength = metaTitle.length;
  const descLength = metaDesc.length;

  return (
    <div className="space-y-4">
      {/* Google SERP Snippet Preview */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1 border-b border-slate-800/80 pb-2">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            Google Search SERP Preview
          </span>
          <span className="text-[11px] text-slate-500">Live search result simulation</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
              🌐
            </span>
            <span>https://store.{(brandName || 'brand').toLowerCase().replace(/\s+/g, '')}.com</span>
            <span className="text-slate-600">› products</span>
          </div>

          <h3 className="text-base sm:text-lg font-medium text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
            {metaTitle || 'Product Title Placeholder'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {metaDesc || 'Product meta description placeholder highlighting benefits and fast delivery.'}
          </p>
        </div>
      </div>

      {/* Editable Fields & Character Counters */}
      <div className="grid grid-cols-1 gap-3.5">
        {/* Meta Title Field */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">SEO Meta Title</label>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono ${titleLength > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {titleLength}/60 chars
              </span>
              <button
                type="button"
                onClick={() => onCopy(metaTitle, 'seo-title')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'seo-title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Meta Description Field */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">SEO Meta Description</label>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono ${descLength > 160 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {descLength}/160 chars
              </span>
              <button
                type="button"
                onClick={() => onCopy(metaDesc, 'seo-desc')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'seo-desc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
          <textarea
            rows={2}
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* High-Impact Keyword Tags */}
        {seo.keywords && seo.keywords.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
            <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Search className="w-3 h-3 text-indigo-400" />
              Target Search Keywords for E-commerce Ranking
            </div>
            <div className="flex flex-wrap gap-1.5">
              {seo.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-1.5"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
