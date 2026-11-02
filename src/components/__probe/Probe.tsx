import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PROBE_LABEL } from './probe-label';

export function Probe() {
  return (
    <span hidden data-probe={PROBE_LABEL} className={twMerge(clsx('px-2 bg-[#123456]', 'px-4 text-dvprobe'))}>
      <svg aria-hidden viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}
