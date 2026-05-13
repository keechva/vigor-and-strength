import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1d1d1f",
        "ink-soft": "#4a4a4f",
        paper: "#f4f1ec",
        "paper-cool": "#eef0f3",
        "warm-bg": "#e9ddc8",
        "warm-deep": "#b88a4a",
        "warm-text": "#3a2a16",
        "cool-bg": "#d9dde4",
        "cool-deep": "#3d4a5e",
        "cool-text": "#1c2331",
        "neutral-bg": "#1d1d1f",
        "neutral-fg": "#f3eee5",
        bridge: "#d6c9b5",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
