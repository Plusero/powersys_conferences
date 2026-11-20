import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: "https://example.github.io",
  base: "/powersys_conferences",
  output: "static",
  build: {
    assets: "_assets",
    // Single page with ~18 KB of CSS: inline it instead of a render-blocking request.
    inlineStylesheets: "always",
  },
  // Flag images are downloaded and optimized at build time, so visitors'
  // browsers never contact flagcdn.com.
  image: {
    domains: ["flagcdn.com"],
  },
  // Web fonts are downloaded from Google at build time and served from this
  // site, so visitors' browsers never contact Google. The opsz axis keeps the
  // optical sizing the design relies on (e.g. the large Fraunces heading).
  fonts: [
    {
      provider: fontProviders.google(),
      name: "DM Sans",
      cssVariable: "--font-dm-sans",
      weights: ["400 600"],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      fallbacks: ["system-ui", "sans-serif"],
      options: { experimental: { variableAxis: { opsz: [["9", "40"]] } } },
    },
    {
      provider: fontProviders.google(),
      name: "Fraunces",
      cssVariable: "--font-fraunces",
      weights: [600],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      fallbacks: ["Georgia", "serif"],
      options: { experimental: { variableAxis: { opsz: [["9", "144"]] } } },
    },
  ],
});
