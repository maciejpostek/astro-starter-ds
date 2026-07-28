export const serviceExamples = [{
  name: "System discovery",
  eyebrow: "Start here",
  description: "Audit the current interface and define the reusable system direction.",
  includes: ["Interface audit", "Architecture", "Delivery plan"],
  tools: [{ abbr: "A", name: "Astro" }, { abbr: "M", name: "Markdown" }]
}];

export const projectExamples = [{
  id: "example-project",
  slug: "example-project",
  title: "Example product system",
  type: "case-study" as const,
  scope: "Strategy · UI system · Astro",
  industry: "B2B SaaS",
  summary: "A neutral example showing structured project content.",
  problem: "Repeated interface decisions had no shared contract.",
  solution: "A token-backed component system and documented usage rules.",
  architecture: ["Tokens", "Components", "Documentation"],
  outputs: ["Component library", "Implementation rules"],
  stack: ["Astro", "TypeScript", "CSS"],
  date: "2026",
  liveUrl: "https://example.com",
  image: "/images/project-placeholder.svg",
  imageAlt: "Abstract project placeholder"
}];

export const stageExamples = [{
  id: "discovery",
  number: "1.0",
  name: "Discovery",
  category: "Planning",
  detailedDescription: "Audit the current system and agree on the implementation direction.",
  startWeek: 1,
  durationWeeks: 1,
  estimatedDays: 5,
  owner: "Project team",
  substeps: ["Inventory", "Audit", "Decision record"],
  goals: ["Define scope", "Remove ambiguity"],
  activities: ["Review", "Workshop"],
  deliverables: ["Audit", "Architecture plan"]
}];
