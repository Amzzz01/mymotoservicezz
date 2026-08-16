import React from 'react';

interface LoadingScreenProps {
  fadeOut?: boolean;
}

// Ring geometry: viewBox 120x120, r=51, stroke-width 3 (kept in sync with the
// stroke-dashoffset keyframes in index.css, which hardcode the same circumference).
const RING_RADIUS = 51;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Slightly different speeds per column so the columns don't look mechanically synced
const DIGIT_COLUMN_DURATIONS = ['0.7s', '0.55s', '0.85s'];
const DIGIT_SEQUENCE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // trailing 0 makes the loop seamless

const LoadingScreen: React.FC<LoadingScreenProps> = ({ fadeOut = false }) => (
  <div
    className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 transition-opacity duration-300 ${
      fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}
  >
    {/* Logo with drawing progress ring */}
    <div className="relative w-[120px] h-[120px] flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          className="stroke-cyan-400 animate-loading-ring"
        />
      </svg>
      <img
        src="/icons/icon-512x512.png"
        alt="MyMotoLog"
        className="w-[104px] h-[104px] rounded-full object-cover animate-logo-breathe"
      />
    </div>

    {/* Wordmark */}
    <div className="mt-5 text-center">
      <p className="text-xl font-medium text-slate-800 dark:text-slate-100">MyMotoLog</p>
      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
        Every ride, every service, tracked
      </p>
    </div>

    {/* Odometer-style decorative loading indicator */}
    <div className="mt-6 flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 shadow-sm">
      <div className="flex items-center gap-0.5">
        {DIGIT_COLUMN_DURATIONS.map((duration, i) => (
          <div key={i} className="w-[11px] h-[15px] overflow-hidden">
            <div className="animate-odometer-spin" style={{ animationDuration: duration }}>
              {DIGIT_SEQUENCE.map((digit, j) => (
                <span
                  key={j}
                  className="block h-[15px] leading-[15px] text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 text-center"
                >
                  {digit}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400">km loaded</span>
    </div>
  </div>
);

export default LoadingScreen;
