
const styles = `
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: .6; }
    70%  { transform: scale(1.9); opacity: 0;  }
    100% { transform: scale(1.9); opacity: 0;  }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes ticker {
    0%   { transform: translateY(0); }
    33%  { transform: translateY(-100%); }
    66%  { transform: translateY(-200%); }
    100% { transform: translateY(0); }
  }
  .soon-shimmer {
    background: linear-gradient(90deg, #a3a3a3 25%, #fff 50%, #a3a3a3 75%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 2.4s linear infinite;
  }
  .dark .soon-shimmer {
    background: linear-gradient(90deg, #525252 25%, #e5e5e5 50%, #525252 75%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 2.4s linear infinite;
  }
`;

export function SoonV1() {
  return (
    <>
      <style>{styles}</style>
      <span className="relative left-1 -top-2 inline-flex items-center px-2.5 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 font-mono text-[10px] tracking-[0.2em] uppercase select-none">
        <span className="soon-shimmer font-bold">soon</span>
      </span>
    </>
  );
}

export function ComingSoon() {
  return (
    <>
      <style>{styles}</style>
      <span className="relative left-1 -top-2 inline-flex items-center px-5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 font-mono text-[10px] tracking-[0.2em] uppercase select-none">
        <span className="soon-shimmer font-bold">coming soon</span>
      </span>
    </>
  );
}

