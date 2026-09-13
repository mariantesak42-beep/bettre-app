export default function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 51 48" className={className} fill="currentColor" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round">
      <path d="M25.5 0 L31 17.5 L49 17.5 L34.5 28.5 L40 46 L25.5 35 L11 46 L16.5 28.5 L2 17.5 L20 17.5 Z" />
    </svg>
  );
}
