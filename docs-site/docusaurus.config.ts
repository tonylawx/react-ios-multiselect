import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "react-ios-multiselect",
  tagline: "A native iOS-feeling React select — single & multi, keyboard-aware, virtualized, zero deps.",
  favicon: "img/favicon.ico",

  // GitHub Pages: served from <user>.github.io/<repo>/, so base must include
  // the repo name. For local dev this is fine too (Docusaurus serves at /).
  url: "https://tonylawx.github.io",
  baseUrl: "/react-ios-multiselect/",
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh-CN"],
    localeConfigs: {
      en: { label: "English", htmlLang: "en" },
      "zh-CN": { label: "简体中文", htmlLang: "zh-CN" },
    },
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/tonylawx/react-ios-multiselect/edit/main/docs-site/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.ThemeConfig,
    ] satisfies Preset.PresetEntry,
  ],

  themeConfig: {
    colorMode: { defaultMode: "light", respectPrefersColorScheme: true },
    navbar: {
      title: "react-ios-multiselect",
      items: [
        { type: "docSidebar", sidebarId: "docs", position: "left", label: "Docs" },
        { to: "/playground", label: "Playground", position: "left" },
        {
          href: "https://github.com/tonylawx/react-ios-multiselect",
          label: "GitHub",
          position: "right",
        },
        { type: "localeDropdown", position: "right" },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "css"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
