import React from 'react';
import { useNutrition } from '../context/NutritionContext.jsx';
import { Activity, Footprints, Flame, Heart, RefreshCw, Smartphone, CheckCircle, ExternalLink } from 'lucide-react';

export function GoogleFitCard({ onOpenFitModal }) {
  const { googleFit, syncGoogleFit, selectedDate } = useNutrition();

  const isConnected = googleFit.isConnected;
  const isSyncing = googleFit.isSyncing;
  const metrics = googleFit.metrics || {
    steps: 0,
    stepTarget: 10000,
    caloriesBurned: 0,
    heartMinutes: 0,
    distanceKm: 0,
  };

  const stepPct = Number(Math.min(100, (metrics.steps / (metrics.stepTarget || 10000)) * 100).toFixed(2));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 relative overflow-hidden transition-all duration-200">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {/* Google Fit Heart Icon with Google Color accents */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500 p-0.5 shadow-sm shadow-blue-500/10">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Google Fit Activity Sync
              </h3>
              {isConnected ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {googleFit.isDemo ? 'Sandbox Demo Sync' : 'Live Connected'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  Not Connected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {googleFit.lastSyncedAt
                ? `Last synchronized at ${googleFit.lastSyncedAt}`
                : 'Sync your daily steps, active burn, and heart points'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isConnected && (
            <button
              onClick={() => syncGoogleFit(selectedDate)}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition disabled:opacity-50"
              title="Sync latest data from Google Fit"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-500 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          )}

          <button
            onClick={onOpenFitModal}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              isConnected
                ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isConnected ? 'Fit Settings' : 'Connect Google Fit'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {/* Steps */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Footprints className="w-3.5 h-3.5 text-blue-500" />
              Daily Steps
            </span>
            <span className="font-bold text-slate-600 dark:text-slate-300">
              {stepPct.toFixed(2)}%
            </span>
          </div>

          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {metrics.steps.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400">
              / {(metrics.stepTarget || 10000).toLocaleString()}
            </span>
          </div>

          <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${stepPct}%` }}
            />
          </div>
        </div>

        {/* Fit Active Calorie Burn */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Fit Active Burn</span>
          </div>

          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-black text-rose-600 dark:text-rose-400">
              +{metrics.caloriesBurned}
            </span>
            <span className="text-[11px] text-slate-400">kcal</span>
          </div>

          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            Automatically added to budget
          </p>
        </div>

        {/* Heart Points / Active Minutes */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Heart className="w-3.5 h-3.5 text-red-500" />
            <span>Heart Points</span>
          </div>

          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {metrics.heartMinutes}
            </span>
            <span className="text-[11px] text-slate-400">pts / mins</span>
          </div>

          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            AHA/WHO Goal: 30+ pts/day
          </p>
        </div>

        {/* Distance */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Distance</span>
          </div>

          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {metrics.distanceKm ? metrics.distanceKm.toFixed(2) : '0.00'}
            </span>
            <span className="text-[11px] text-slate-400">km</span>
          </div>

          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            Tracked via GPS & WearOS
          </p>
        </div>
      </div>
    </div>
  );
}
