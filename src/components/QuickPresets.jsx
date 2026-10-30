import React from 'react';
import { SAMPLE_PRESETS } from '../data/presets';
import { Sparkles } from 'lucide-react';

export default function QuickPresets({ onSelectPreset, currentBrand }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-medium text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Quick Test Presets (1-Click Demo)
        </span>
        <span className="text-[11px] text-slate-500">Instant judge preview</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SAMPLE_PRESETS.map((preset) => {
          const isSelected = currentBrand.toLowerCase() === preset.brandName.toLowerCase();
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-sm shadow-indigo-500/20'
                  : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <img
                src={preset.imageUrl}
                alt={preset.name}
                className="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-slate-950"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{preset.brandName}</p>
                <p className="text-[10px] text-slate-400 truncate">{preset.name}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
