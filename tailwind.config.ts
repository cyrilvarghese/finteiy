import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ── shadcn base colors ── */
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        /* ── Finteiy game colors ── */
        cash: "#22C55E",
        danger: "#EF4444",
        social: "#38BDF8",
        energy: "#FACC15",
        split: "#FB923C",
        callout: "#7DD3FC",

        /* ── Text scale ── */
        "text-primary": "#F1F5F9",
        "text-secondary": "#94A3B8",
        "text-muted": "#64748B",

        /* ── Grade colors ── */
        grade: {
          A: "#22c55e",
          B: "#86efac",
          C: "#facc15",
          D: "#fb923c",
          F: "#ef4444",
        },

        /* ── Rarity colors ── */
        rarity: {
          epic: "#00f5ff",
          rare: "#b866ff",
          legendary: "#ff6600",
          mythic: "#ffd700",
        },

        /* ── Surface colors ── */
        surface: {
          card: "rgba(255, 255, 255, 0.03)",
          "card-border": "rgba(255, 255, 255, 0.06)",
          "card-hover": "rgba(255, 255, 255, 0.06)",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      /* ── Font families ── */
      fontFamily: {
        sora: ["var(--font-sora)", "system-ui", "sans-serif"],
        "dm-sans": ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        "space-mono": ["var(--font-space-mono)", "monospace"],
      },

      /* ── Animations ── */
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "holo-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease both",
        "slide-up": "slideUp 0.6s ease both",
        pulse: "pulse 1s ease-in-out infinite",
        shimmer: "shimmer 5s ease-in-out infinite",
        "holo-shift": "holoShift 3s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "badge-shine": "badgeShine 4s ease-in-out infinite",
        "rep-glow": "repGlow 3s ease-in-out infinite",
      },

      /* ── Max width ── */
      maxWidth: {
        game: "420px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
