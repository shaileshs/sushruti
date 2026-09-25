// Stand-in for a clinical photo. Draws a lesion whose size follows the measured size.
export function LesionImage({ sizeMm, seed = 1, className = "" }: { sizeMm: number; seed?: number; className?: string }) {
  const r = 8 + sizeMm * 0.85; // radius in a 120-unit box
  const wob = (i: number) => 1 + 0.12 * Math.sin(seed * 3.1 + i * 1.7);
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    // Rounded so server and browser print identical numbers (avoids a hydration mismatch).
    return `${(60 + Math.cos(a) * r * wob(i)).toFixed(1)},${(60 + Math.sin(a) * r * 0.8 * wob(i + 3)).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={`Illustration of a ${sizeMm} mm lesion`} className={className}>
      <rect width="120" height="120" fill="#e9a3a0" />
      <circle cx="30" cy="30" r="50" fill="#f0b4b0" opacity="0.6" />
      <polygon points={pts} fill="#b9484f" stroke="#8f2f38" strokeWidth="2" strokeLinejoin="round" />
      <polygon points={pts} fill="#e8c7a0" opacity="0.5" transform="translate(60 60) scale(0.55) translate(-60 -60)" />
    </svg>
  );
}
