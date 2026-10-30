import React from 'react';
import { TrendingUp, Zap, Award, Target, CheckCircle } from 'lucide-react';

export default function ConversionMetrics({ metrics }) {
  if (!metrics) return null;

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 via-slate-900/60 to-slate-950/80 p-4 mb-4">
      <div className="flex items-center justify-between mb-3 border-b border-indigo-500/10 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">
            Conversion Potential Scorecard
          </span>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
          {metrics.conversionBoost || '+32% Estimated Sales Lift'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
            <Target className="w-3 h-3 text-indigo-400" />
            Conversion Score
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-white">{metrics.score || 95}</span>
            <span className="text-xs text-slate-500">/100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
              style={{ width: `${metrics.score || 95}%` }}
            />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            Readability
          </div>
          <div className="text-xs font-bold text-slate-200 mt-1 truncate">
            {metrics.readability || 'Grade 8 (Optimal)'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Effortless customer scan</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Urgency & Pull
          </div>
          <div className="text-xs font-bold text-amber-300 mt-1">
            {metrics.urgencyScore || 'High Response'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Action-driving psychology</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
            <Award className="w-3 h-3 text-purple-400" />
            Power Triggers
          </div>
          <div className="text-xs font-bold text-purple-300 mt-1">
            {metrics.powerWordsCount || 14} Words
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Sensory & value anchors</div>
        </div>
      </div>
    </div>
  );
}
