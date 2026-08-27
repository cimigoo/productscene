export type SceneCategory =
  | "Solid"
  | "Lifestyle"
  | "Texture"
  | "Seasonal";

export interface Scene {
  id: string;
  name: string;
  category: SceneCategory;
  emoji: string;
  /** Prompt fragment sent to the image model to describe the scene/background. */
  prompt: string;
}

export const SCENES: Scene[] = [
  // Solid / White
  {
    id: "white_clean",
    name: "Pure White Studio",
    category: "Solid",
    emoji: "⬜",
    prompt:
      "pure white seamless background, professional studio lighting, soft contact shadow, e-commerce main image, photorealistic",
  },
  {
    id: "light_gray",
    name: "Soft Light Gray",
    category: "Solid",
    emoji: "◻️",
    prompt:
      "light gray seamless backdrop, soft diffused lighting, gentle shadow beneath the product, clean minimal product photography",
  },
  {
    id: "gradient",
    name: "Modern Gradient",
    category: "Solid",
    emoji: "🌈",
    prompt:
      "smooth pastel gradient background, modern studio, soft top light, product centered, high-end commercial photography",
  },
  {
    id: "minimal",
    name: "Minimalist",
    category: "Solid",
    emoji: "⚪",
    prompt:
      "minimalist composition with generous negative space, neutral tones, soft natural window light, premium product shot",
  },

  // Lifestyle
  {
    id: "cafe",
    name: "Cozy Café Table",
    category: "Lifestyle",
    emoji: "☕",
    prompt:
      "café wooden table, blurred bokeh café background, warm afternoon light, shallow depth of field, lifestyle product photography",
  },
  {
    id: "desk",
    name: "Modern Workspace",
    category: "Lifestyle",
    emoji: "🖥️",
    prompt:
      "modern minimalist desk with a small potted plant and notebook, natural daylight, clean organized workspace, lifestyle product photo",
  },
  {
    id: "nature",
    name: "Outdoor Sunlight",
    category: "Lifestyle",
    emoji: "🌿",
    prompt:
      "outdoor natural setting, green foliage background, golden hour sunlight, soft shadows, organic lifestyle photography",
  },
  {
    id: "kitchen",
    name: "Modern Kitchen",
    category: "Lifestyle",
    emoji: "🍳",
    prompt:
      "bright modern kitchen countertop, marble surface, soft daylight from a window, clean and airy, kitchen product photography",
  },
  {
    id: "bathroom",
    name: "Spa Bathroom",
    category: "Lifestyle",
    emoji: "🛁",
    prompt:
      "elegant bathroom vanity, soft towels, eucalyptus, bright spa-like atmosphere, natural light, beauty product photography",
  },
  {
    id: "plants",
    name: "Indoor Plants",
    category: "Lifestyle",
    emoji: "🪴",
    prompt:
      "lush indoor plants surrounding a neutral surface, fresh and airy, soft natural light, botanical lifestyle product shot",
  },
  {
    id: "beach",
    name: "Beach Getaway",
    category: "Lifestyle",
    emoji: "🏖️",
    prompt:
      "sandy beach surface, soft turquoise ocean blurred in background, warm sunlight, vacation vibe, summer product photography",
  },

  // Texture
  {
    id: "marble",
    name: "White Marble",
    category: "Texture",
    emoji: "🪨",
    prompt:
      "white marble surface with subtle grey veining, elegant natural light and shadow, premium luxury product photography",
  },
  {
    id: "wood",
    name: "Natural Wood",
    category: "Texture",
    emoji: "🪵",
    prompt:
      "natural oak wood tabletop, warm soft lighting, rustic yet modern texture, authentic product photography",
  },
  {
    id: "fabric",
    name: "Velvet Fabric",
    category: "Texture",
    emoji: "🧶",
    prompt:
      "deep velvet fabric drape, rich tactile texture, soft directional lighting, high-end luxury product photography",
  },
  {
    id: "metal",
    name: "Brushed Metal",
    category: "Texture",
    emoji: "⚙️",
    prompt:
      "brushed dark metal surface, cool studio lighting with subtle reflections, sleek modern tech product photography",
  },
  {
    id: "rustic",
    name: "Rustic Vintage",
    category: "Texture",
    emoji: "🏚️",
    prompt:
      "weathered rustic wooden surface, vintage styling, warm earthy tones, nostalgic farmhouse product photography",
  },
  {
    id: "luxury",
    name: "Luxury Gold",
    category: "Texture",
    emoji: "✨",
    prompt:
      "luxurious dark surface with gold accents, dramatic studio lighting, reflections, premium high-end product photography",
  },

  // Seasonal
  {
    id: "christmas",
    name: "Christmas",
    category: "Seasonal",
    emoji: "🎄",
    prompt:
      "festive Christmas scene, warm string lights, pine branches and red ornaments in soft-focus background, cozy warm lighting",
  },
  {
    id: "valentine",
    name: "Valentine's Day",
    category: "Seasonal",
    emoji: "💝",
    prompt:
      "romantic Valentine's Day setting, soft pink and red tones, rose petals, gentle bokeh hearts, warm dreamy lighting",
  },
  {
    id: "newyear",
    name: "New Year",
    category: "Seasonal",
    emoji: "🎆",
    prompt:
      "New Year celebration scene, golden confetti and sparkles, dark elegant background with bokeh lights, festive glamorous lighting",
  },
];

export interface PlatformSize {
  id: string;
  name: string;
  ratio: string;
  width: number;
  height: number;
  hint: string;
}

export const PLATFORM_SIZES: PlatformSize[] = [
  { id: "amazon_main", name: "Amazon Main", ratio: "1:1", width: 1024, height: 1024, hint: "Pure white, full frame" },
  { id: "amazon_sub", name: "Amazon Sub", ratio: "1:1", width: 1024, height: 1024, hint: "Lifestyle allowed" },
  { id: "etsy", name: "Etsy Listing", ratio: "4:5", width: 1000, height: 1250, hint: "Recommended 4:5" },
  { id: "instagram", name: "Instagram", ratio: "4:5", width: 1080, height: 1350, hint: "Portrait feed" },
  { id: "shopify", name: "Shopify", ratio: "1:1", width: 1024, height: 1024, hint: "Square product" },
  { id: "tiktok", name: "TikTok", ratio: "9:16", width: 1080, height: 1920, hint: "Vertical video cover" },
];

export function getSceneById(id: string): Scene | undefined {
  return SCENES.find((s) => s.id === id);
}
