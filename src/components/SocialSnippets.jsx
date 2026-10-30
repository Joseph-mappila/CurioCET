import React from 'react';
import { Copy, Check, Instagram, Video, ShoppingBag } from 'lucide-react';

export default function SocialSnippets({ social, onCopy, copiedSection }) {
  if (!social) return null;

  return (
    <div className="space-y-4">
      {/* Instagram Caption */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Instagram className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">
              Instagram Launch Post & Caption
            </span>
          </div>
          <button
            type="button"
            onClick={() => onCopy(social.instagram, 'social-ig')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            {copiedSection === 'social-ig' ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Caption</span>
              </>
            )}
          </button>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
          {social.instagram}
        </div>
      </div>

      {/* TikTok Hook */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Video className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">
              TikTok / Reels 15-Sec Video Hook Script
            </span>
          </div>
          <button
            type="button"
            onClick={() => onCopy(social.tiktok, 'social-tt')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            {copiedSection === 'social-tt' ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Hook</span>
              </>
            )}
          </button>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
          {social.tiktok}
        </div>
      </div>

      {/* Shopify / Marketplace Specification */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-slate-200">
              Shopify & Amazon Bullet Specifications
            </span>
          </div>
          <button
            type="button"
            onClick={() => onCopy(social.shopifyBullet, 'social-shopify')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            {copiedSection === 'social-shopify' ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Specs</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-emerald-300/90 font-mono whitespace-pre-wrap leading-relaxed">
          {social.shopifyBullet}
        </pre>
      </div>
    </div>
  );
}
