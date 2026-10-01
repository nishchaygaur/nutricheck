import React, { useState } from 'react';
import { useNutrition } from '../context/NutritionContext.jsx';
import {
  Activity,
  X,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Key,
  Shield,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export function GoogleFitModal({ isOpen, onClose }) {
  const {
    googleFit,
    connectGoogleFitLive,
    connectGoogleFitDemo,
    disconnectGoogleFit,
    syncGoogleFit,
    selectedDate,
  } = useNutrition();

  const [activeTab, setActiveTab] = useState('demo'); // 'demo' | 'live'
  const [clientId, setClientId] = useState(googleFit.clientId || '');
  const [showGuide, setShowGuide] = useState(false);

  if (!isOpen) return null;

  const handleConnectLive = (e) => {
    e.preventDefault();
    if (!clientId.trim()) return;
    connectGoogleFitLive(clientId.trim());
  };

  const handleDisconnect = () => {
    disconnectGoogleFit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500 p-0.5">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Google Fit Integration</span>
                {googleFit.isConnected && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-semibold border border-emerald-300 dark:border-emerald-800">
                    Connected
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% Client-Side OAuth 2.0 & Google Fitness REST API
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'demo'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Instant Sandbox / Demo Sync
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'live'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Live Google Cloud OAuth
            </button>
          </div>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Setup Guide</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Error Message if any */}
          {googleFit.error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong>Authentication Notice:</strong> {googleFit.error}
              </div>
            </div>
          )}

          {/* Setup Guide Accordion */}
          {showGuide && (
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-2 animate-in fade-in duration-150">
              <h4 className="font-bold flex items-center gap-1.5 text-blue-950 dark:text-blue-100">
                <Shield className="w-4 h-4 text-blue-500" />
                How to set up Live Google Fit OAuth (Zero Backend):
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700 dark:text-slate-300 pl-1 leading-relaxed">
                <li>
                  Open the{' '}
                  <a
                    href="https://console.cloud.google.com/apis/library/fitness.googleapis.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline font-semibold inline-flex items-center gap-0.5"
                  >
                    Google Cloud Console <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  and enable the <strong>Fitness API</strong>.
                </li>
                <li>
                  Go to <strong>APIs & Services &gt; Credentials</strong> and create an{' '}
                  <strong>OAuth 2.0 Client ID</strong> (Application Type: <em>Web Application</em>).
                </li>
                <li>
                  Under <em>Authorized JavaScript origins</em>, add your URL:{' '}
                  <code className="bg-white/80 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px]">
                    http://localhost:5173
                  </code>
                </li>
                <li>Copy your Client ID, paste it into the Live tab, and click Connect!</li>
              </ol>
            </div>
          )}

          {activeTab === 'demo' ? (
            /* Demo / Sandbox Sync Mode */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Instant Sandbox Testing Mode
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  No Google Cloud Console setup required! Test the full synchronization pipeline
                  immediately with realistic Google Fit activity streams for steps, active calories,
                  heart points, and hydration.
                </p>
              </div>

              {/* Current Synced Metrics Preview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Steps Logged</span>
                  <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
                    {googleFit.metrics.steps.toLocaleString()}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Active Burn Imported</span>
                  <p className="text-lg font-black text-rose-600 dark:text-rose-400 mt-0.5">
                    +{googleFit.metrics.caloriesBurned} kcal
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    connectGoogleFitDemo();
                  }}
                  disabled={googleFit.isSyncing}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${googleFit.isSyncing ? 'animate-spin' : ''}`} />
                  <span>{googleFit.isSyncing ? 'Syncing...' : 'Fetch / Refresh Fit Activity'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Live Google Cloud OAuth Tab */
            <form onSubmit={handleConnectLive} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Key className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  Enter your Google Cloud OAuth 2.0 Web Client ID to authorize direct client-side
                  access to your live Google Fit health metrics.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Google OAuth Client ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123456789-abcdef.apps.googleusercontent.com"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={googleFit.isSyncing || !clientId.trim()}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
                >
                  <Activity className="w-4 h-4" />
                  <span>Authorize & Connect with Google</span>
                </button>

                {googleFit.isConnected && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Your Google access token is stored strictly in your browser session and is never sent to any external server.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
