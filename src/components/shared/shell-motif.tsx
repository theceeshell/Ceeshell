import { cn } from "@/lib/utils";

function buildSpiralPath(turns: number, growth: number, points = 160) {
  const coords: string[] = [];
  const maxTheta = turns * Math.PI * 2;
  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * maxTheta;
    const r = 4 * Math.exp(growth * theta);
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    coords.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return coords.join(" ");
}

const SPIRAL_PATH = buildSpiralPath(3.3, 0.19);

interface ShellMotifProps {
  className?: string;
  strokeWidth?: number;
  size?: number;
}

/**
 * Decorative nautilus-inspired spiral. Purely ornamental background texture —
 * used sparingly, never as a focal element.
 */
export function ShellMotif({ className, strokeWidth = 1, size = 640 }: ShellMotifProps) {
  const viewBoxHalf = 260;
  return (
    <svg
      viewBox={`-${viewBoxHalf} -${viewBoxHalf} ${viewBoxHalf * 2} ${viewBoxHalf * 2}`}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none select-none", className)}
    >
      <path
        d={SPIRAL_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
