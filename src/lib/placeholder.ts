/**
 * Placeholder image generator — used when FAL_KEY is not configured
 * or the upstream API fails. Produces a branded SVG data URL so the
 * full front-end flow (upload → scene → size → generate → download)
 * remains demonstrable end-to-end without an external AI service.
 */

const GRADIENTS: Record<string, [string, string]> = {
  Solid: ["#f8fafc", "#e2e8f0"],
  Lifestyle: ["#ede9fe", "#fbcfe8"],
  Texture: ["#fef3c7", "#fde68a"],
  Seasonal: ["#fce7f3", "#fecaca"],
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function makePlaceholder(opts: {
  sceneName: string;
  category: string;
  width: number;
  height: number;
  seed: number;
  watermark?: boolean;
}): string {
  const { sceneName, category, width, height, seed, watermark = true } = opts;
  const [c1, c2] = GRADIENTS[category] || ["#eef2ff", "#c7d2fe"];

  // Deterministic decorative shapes from seed
  const shapes: string[] = [];
  const rng = mulberry32(seed);
  for (let i = 0; i < 6; i++) {
    const cx = Math.floor(rng() * width);
    const cy = Math.floor(rng() * height);
    const r = Math.floor(40 + rng() * 120);
    const opacity = (0.06 + rng() * 0.08).toFixed(3);
    shapes.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" opacity="${opacity}"/>`
    );
  }

  const wm = watermark
    ? `
    <g transform="translate(${width / 2},${height - 48})">
      <rect x="-90" y="-22" width="180" height="44" rx="22" fill="rgba(15,23,42,0.72)"/>
      <text x="0" y="6" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="600" fill="white" text-anchor="middle" letter-spacing="1.5">PRODUCTSCENE</text>
    </g>`
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="spot" cx="50%" cy="38%" r="55%">
      <stop offset="0%" stop-color="white" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#spot)"/>
  ${shapes.join("\n  ")}
  <g transform="translate(${width / 2},${height / 2 - 30})">
    <rect x="-110" y="-110" width="220" height="220" rx="28" fill="white" opacity="0.85"/>
    <text x="0" y="6" font-family="Inter, Arial, sans-serif" font-size="64" text-anchor="middle">📦</text>
  </g>
  <text x="${width / 2}" y="${height / 2 + 130}" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700" fill="#334155" text-anchor="middle">${escapeXml(sceneName)}</text>
  <text x="${width / 2}" y="${height / 2 + 166}" font-family="Inter, Arial, sans-serif" font-size="16" fill="#64748b" text-anchor="middle">${width} × ${height} • variant #${seed}</text>
  ${wm}
</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// Small deterministic PRNG so variants differ but remain stable per seed.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
