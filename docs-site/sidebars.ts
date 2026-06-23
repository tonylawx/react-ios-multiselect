import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    "intro",
    {
      label: "Guide",
      type: "category",
      items: ["getting-started", "usage", "theming"],
    },
    {
      label: "For AI agents",
      type: "category",
      items: ["agent-guide", "testing", "data-attributes"],
    },
    {
      label: "Reference",
      type: "category",
      items: ["props", "contributing"],
    },
  ],
};

export default sidebars;
