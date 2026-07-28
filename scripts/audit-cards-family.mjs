import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const projectRoot = resolve(process.argv[2] ?? ".");
const errors = [];
const read = (relativePath) => {
  const path = join(projectRoot, relativePath);
  if (!existsSync(path)) {
    errors.push(`Missing required file: ${relativePath}`);
    return "";
  }
  return readFileSync(path, "utf8");
};
const requireContract = (source, contract, context) => {
  if (!source.includes(contract)) errors.push(`${context} is missing: ${contract}`);
};

const migratedCards = {
  FieldCard: {
    path: "src/components/molecules/cards/FieldCard.astro",
    layer: "molecule",
    props: [
      "title",
      "description",
      "items",
      "visualVariant",
      "visualLabel",
      "headingLevel",
      "componentName"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-preview-target"
    ],
    contracts: [
      "FieldCard requires a non-empty title.",
      "FieldCard requires a non-empty description.",
      "FieldCard requires at least one scope item.",
      'data-component-family="cards"',
      'data-card-state="default"',
      "<HeadingTag",
      "<Tag>",
      "<PanelPatternVisualSystem",
      "--field-card-min-height",
    ]
  },
  FeatureCard: {
    path: "src/components/molecules/cards/FeatureCard.astro",
    layer: "molecule",
    props: [
      "title",
      "description",
      "variant",
      "eyebrow",
      "number",
      "actionLabel",
      "actionHref",
      "visualLabel",
      "visualRatio",
      "headingLevel",
      "componentName",
      "visual slot",
      "native article attributes"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-card-variant",
      "data-preview-target"
    ],
    contracts: [
      'export type FeatureCardVariant = "icon" | "media" | "numbered"',
      "FeatureCard requires non-empty title and description values.",
      "FeatureCard actionLabel and actionHref must be provided together.",
      "FeatureCard requires a real non-placeholder actionHref.",
      "FeatureCard Icon requires the visual slot.",
      "FeatureCard Numbered requires a non-empty number.",
      "FeatureCard Numbered does not accept the visual slot.",
      'data-component-family="cards"',
      'data-card-state={hasAction ? "actionable" : "static"}',
      "data-card-variant={variant}",
      '<slot name="visual" />',
      "<ContentBlock",
      "<MediaRatio",
      "@media (width < 40rem)"
    ]
  },
  UseCaseCard: {
    path: "src/components/molecules/cards/UseCaseCard.astro",
    layer: "molecule",
    props: [
      "context",
      "title",
      "description",
      "variant",
      "actionLabel",
      "actionHref",
      "headingLevel",
      "componentName",
      "native article attributes"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-card-variant",
      "data-preview-target"
    ],
    contracts: [
      'export type UseCaseCardVariant = "role" | "industry" | "scenario"',
      "UseCaseCard requires non-empty context, title, and description values.",
      "UseCaseCard actionLabel and actionHref must be provided together.",
      "UseCaseCard requires a real non-placeholder actionHref.",
      'data-component-family="cards"',
      'data-card-state={hasAction ? "actionable" : "static"}',
      "data-card-variant={variant}",
      "<ContentBlock",
      "@media (width < 40rem)"
    ]
  },
  IntegrationCard: {
    path: "src/components/molecules/cards/IntegrationCard.astro",
    layer: "molecule",
    props: [
      "name",
      "category",
      "href",
      "logoLabel",
      "variant",
      "description",
      "status",
      "headingLevel",
      "componentName",
      "logo slot",
      "native article attributes"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-card-variant",
      "data-preview-target"
    ],
    contracts: [
      'export type IntegrationCardVariant = "compact" | "detailed"',
      "IntegrationCard requires non-empty name, category, href, and logoLabel strings.",
      "IntegrationCard requires a safe supplied href.",
      "IntegrationCard requires project-owned artwork in the logo slot.",
      "IntegrationCard does not expose a default slot.",
      "IntegrationCard Detailed requires a non-empty description.",
      "IntegrationCard description is supported only by Detailed.",
      'data-component-family="cards"',
      'data-card-state="actionable"',
      "data-card-variant={variant}",
      '<slot name="logo" />',
      "<Logo",
      "<Tag",
      ":focus-visible",
      "@media (width < 40rem)"
    ]
  },
  TeamMemberCard: {
    path: "src/components/molecules/cards/TeamMemberCard.astro",
    layer: "molecule",
    props: [
      "name",
      "role",
      "variant",
      "description",
      "avatarSrc",
      "avatarAlt",
      "href",
      "headingLevel",
      "componentName",
      "native article attributes"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-card-variant",
      "data-preview-target"
    ],
    contracts: [
      'export type TeamMemberCardVariant = "compact" | "profile"',
      "TeamMemberCard requires non-empty name and role values.",
      "TeamMemberCard Profile requires a non-empty description.",
      "TeamMemberCard description is supported only by Profile.",
      "TeamMemberCard requires a safe supplied href.",
      "TeamMemberCard does not expose a default slot.",
      'data-component-family="cards"',
      'data-card-state={state}',
      'data-card-variant={variant}',
      "<Avatar",
      'shape="circle"',
      "var(--text-style-heading-h5-font-family)"
    ]
  },
  JobCard: {
    path: "src/components/molecules/cards/JobCard.astro",
    layer: "molecule",
    props: [
      "title",
      "department",
      "location",
      "employmentType",
      "href",
      "variant",
      "description",
      "actionLabel",
      "headingLevel",
      "componentName",
      "native article attributes"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-card-variant",
      "data-job-metadata",
      "data-preview-target"
    ],
    contracts: [
      'export type JobCardVariant = "compact" | "detailed"',
      "JobCard requires non-empty title, department, location, and employmentType values.",
      "JobCard requires a safe HTTPS or root-relative href.",
      "JobCard requires a non-empty actionLabel.",
      "JobCard Detailed requires a non-empty description.",
      "JobCard description is supported only by Detailed.",
      "JobCard does not expose a default slot.",
      'data-component-family="cards"',
      'data-card-state="actionable"',
      "data-card-variant={variant}",
      "data-job-metadata={metadata.length}",
      "<ul",
      "<Tag",
      "<Button",
      "@media (width < 40rem)"
    ]
  },
  ArticleCard: {
    path: "src/components/molecules/cards/ArticleCard.astro",
    layer: "molecule",
    props: [
      "title",
      "category",
      "href",
      "publishedDate",
      "dateLabel",
      "variant",
      "excerpt",
      "readingTime",
      "actionLabel",
      "visualLabel",
      "visualRatio",
      "headingLevel",
      "componentName",
      "media slot",
      "native article attributes"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-card-variant",
      "data-article-date",
      "data-preview-target"
    ],
    contracts: [
      'export type ArticleCardVariant = "featured" | "standard" | "compact"',
      "ArticleCard requires non-empty title, category, publishedDate, and dateLabel values.",
      "ArticleCard requires a safe HTTPS or root-relative href.",
      "ArticleCard publishedDate must be a valid YYYY-MM-DD date.",
      "ArticleCard Featured and Standard require a non-empty excerpt.",
      "ArticleCard Compact does not accept an excerpt.",
      "ArticleCard Compact does not accept the media slot.",
      "ArticleCard does not expose a default slot.",
      'data-component-family="cards"',
      'data-card-state="actionable"',
      "data-card-variant={variant}",
      "data-article-date={normalizedPublishedDate}",
      "<MediaRatio",
      "<Tag",
      "<time",
      ":focus-visible",
      "@media (width < 64rem)",
      "@media (width < 40rem)"
    ]
  },
  ResourceCard: {
    path: "src/components/molecules/cards/ResourceCard.astro",
    layer: "molecule",
    props: [
      "title",
      "description",
      "href",
      "variant",
      "metadata",
      "actionLabel",
      "visualLabel",
      "visualRatio",
      "headingLevel",
      "componentName",
      "media slot",
      "native article attributes"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-card-variant",
      "data-resource-kind",
      "data-preview-target"
    ],
    contracts: [
      'export type ResourceCardVariant = "guide" | "ebook" | "webinar"',
      "ResourceCard requires non-empty title and description values.",
      "ResourceCard requires a safe HTTPS or root-relative href.",
      "ResourceCard metadata must be non-empty when provided.",
      "ResourceCard does not expose a default slot.",
      'data-component-family="cards"',
      'data-card-state="actionable"',
      "data-card-variant={variant}",
      "data-resource-kind={variant}",
      "<MediaRatio",
      "<Tag",
      ":focus-visible",
      "@media (width < 64rem)",
      "@media (width < 40rem)"
    ]
  },
  ProjectCard: {
    path: "src/components/molecules/cards/ProjectCard.astro",
    layer: "molecule",
    props: [
      "project",
      "slug",
      "title",
      "labels",
      "visualLabel",
      "visualRatio",
      "linkLabel",
      "headingLevel",
      "componentName"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-preview-target",
      "data-open-case"
    ],
    contracts: [
      "ProjectCard requires a non-empty title or project.title.",
      "ProjectCard slug must be a real non-placeholder identifier.",
      "ProjectCard requires a non-empty linkLabel when slug is present.",
      'data-component-family="cards"',
      'data-card-state={slug ? "actionable" : "static"}',
      "<HeadingTag",
      "<MediaRatio",
      "<Tag>",
      "<Button",
      "button.project-card__visual:focus-visible"
    ]
  },
  CaseStudyCard: {
    path: "src/components/molecules/cards/CaseStudyCard.astro",
    layer: "molecule",
    props: [
      "title",
      "summary",
      "client",
      "href",
      "actionLabel",
      "tags",
      "visualLabel",
      "visualRatio",
      "metric",
      "variant",
      "headingLevel",
      "componentName",
      "media slot",
      "native article attributes"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-card-variant",
      "data-preview-target"
    ],
    contracts: [
      'export type CaseStudyCardVariant = "standard" | "highlight"',
      "CaseStudyCard requires non-empty title, summary, and client values.",
      "CaseStudyCard requires a real non-placeholder href.",
      "CaseStudyCard requires a non-empty actionLabel.",
      "CaseStudyCard tags must be non-empty strings.",
      "CaseStudyCard tags must be unique.",
      'data-component-family="cards"',
      'data-card-state="actionable"',
      "data-card-variant={variant}",
      '<slot name="media" />',
      "<HeadingTag",
      "<MediaRatio",
      "<Tag>",
      "<StatCard",
      "<Button",
      "@media (width < 64rem)",
      "@media (width < 40rem)"
    ]
  },
  ServiceCard: {
    path: "src/components/molecules/cards/ServiceCard.astro",
    layer: "molecule",
    props: ["service", "index", "href", "headingLevel", "componentName"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-preview-target"
    ],
    contracts: [
      "href: string",
      "ServiceCard requires at least one included item.",
      "ServiceCard index must be a non-negative safe integer.",
      "ServiceCard requires a real non-placeholder href.",
      'data-component-family="cards"',
      'data-card-state="default"',
      '<Label variant="metric">',
      "<HeadingTag",
      "<Tag",
      "<BulletPoint",
      "<IconButton",
      "--service-card-includes-min-width"
    ]
  },
  CalloutCard: {
    path: "src/components/organisms/cards/CalloutCard.astro",
    layer: "organism",
    props: [
      "eyebrow",
      "title",
      "action",
      "href",
      "visualLabel",
      "visualRatio",
      "visualVariant",
      "headingLevel",
      "componentName"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-preview-target"
    ],
    contracts: [
      "CalloutCard requires non-empty eyebrow, title, and action values.",
      "CalloutCard requires a real non-placeholder href.",
      'data-component-family="cards"',
      'data-card-state="default"',
      "<HeadingTag",
      "<Eyebrow",
      "<Button",
      "<MediaRatio",
      "<PanelPatternVisualSystem",
      "--callout-content-max-width"
    ]
  },
  PricingCard: {
    path: "src/components/organisms/cards/PricingCard.astro",
    layer: "organism",
    props: [
      "name",
      "bestFor",
      "description",
      "points",
      "price",
      "priceSuffix",
      "featured",
      "featuredLabel",
      "headingLevel",
      "componentName"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-preview-target"
    ],
    contracts: [
      "PricingCard requires non-empty name, bestFor, and description values.",
      "PricingCard requires at least one point.",
      "PricingCard price must be non-empty when provided.",
      "PricingCard priceSuffix requires price.",
      "PricingCard requires a non-empty featuredLabel when featured.",
      'data-component-family="cards"',
      'data-card-state={featured ? "featured" : "default"}',
      '<Label variant="metric">',
      "<HeadingTag",
      "<Tag",
      "<BulletPoint",
      "pricing-card__price",
      "calc(var(--size-320) + var(--size-64) + var(--size-6))"
    ]
  },
  TestimonialCard: {
    path: "src/components/molecules/cards/TestimonialCard.astro",
    layer: "molecule",
    props: [
      "quote",
      "client",
      "person",
      "role",
      "avatarSrc",
      "avatarAlt",
      "componentName"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-preview-target"
    ],
    contracts: [
      "TestimonialCard requires non-empty quote, client, person, and role values.",
      "TestimonialCard avatarSrc must be non-empty when provided.",
      'data-component-family="cards"',
      'data-card-state="default"',
      "<blockquote>",
      "<footer>",
      "<Avatar",
      "var(--size-320)",
      "overflow-wrap: anywhere"
    ]
  },
  AgencyPartnerCard: {
    path: "src/components/molecules/cards/AgencyPartnerCard.astro",
    layer: "molecule",
    props: ["name", "index", "current", "currentLabel", "componentName"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-partner-state",
      "data-preview-target"
    ],
    contracts: [
      "AgencyPartnerCard requires a non-empty name.",
      "AgencyPartnerCard index must be a non-negative safe integer.",
      "AgencyPartnerCard requires a non-empty currentLabel when current.",
      'data-component-family="cards"',
      'data-card-state={current ? "current" : "default"}',
      "<Tag",
      "overflow-wrap: anywhere"
    ]
  },
  ProjectRowCard: {
    path: "src/components/molecules/cards/ProjectRowCard.astro",
    layer: "molecule",
    props: ["project", "headingLevel", "componentName"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-preview-target"
    ],
    contracts: [
      "ProjectRowCard requires non-empty slug, title, date, summary, scope, and industry values.",
      "ProjectRowCard liveUrl must be a real non-placeholder URL.",
      'data-card-state={resolvedProject.liveUrl ? "actionable" : "static"}',
      'data-component-family="cards"',
      "<HeadingTag",
      "<Tag>",
      "<IconButton",
      "var(--component-size-small-min-height)",
      '.project-row-card[data-card-state="static"]'
    ]
  },
  UiKitCard: {
    path: "src/components/molecules/cards/UiKitCard.astro",
    layer: "molecule",
    props: [
      "eyebrow",
      "title",
      "description",
      "items",
      "action",
      "href",
      "headingLevel",
      "componentName"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-preview-target"
    ],
    contracts: [
      "UiKitCard requires non-empty eyebrow, title, description, and action values.",
      "UiKitCard requires at least one item.",
      "UiKitCard requires a real non-placeholder href.",
      'data-component-family="cards"',
      'data-card-state="default"',
      '<Label variant="metric">',
      "<HeadingTag",
      "<Button",
      "grid-auto-rows: minmax(var(--size-96), 1fr)"
    ]
  },
  StatCard: {
    path: "src/components/molecules/cards/StatCard.astro",
    layer: "molecule",
    props: [
      "label",
      "value",
      "change",
      "changeDirection",
      "changeLabel",
      "description",
      "componentName"
    ],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-change-direction",
      "data-preview-target"
    ],
    contracts: [
      "StatCard requires non-empty label and value strings.",
      "StatCard change must be non-empty when provided.",
      "StatCard requires change when changeDirection is up or down.",
      "StatCard requires a non-empty changeLabel when change is shown.",
      'data-component-family="cards"',
      'data-card-state={resolvedChange ? "with-change" : "without-change"}',
      "directionOptions.map",
      'class="visually-hidden stat-card__direction-label"',
      'class="stat-card__direction-icon"',
      "var(--text-style-heading-h3-font-family)"
    ]
  },
  BulletPointCard: {
    path: "src/components/molecules/cards/BulletPointCard.astro",
    layer: "molecule",
    props: ["title", "description", "items", "headingLevel", "componentName"],
    attributes: [
      "data-component-name",
      "data-component-family",
      "data-card-state",
      "data-preview-target"
    ],
    contracts: [
      "BulletPointCard requires a non-empty title.",
      "BulletPointCard requires at least one item.",
      "BulletPointCard items must be non-empty strings.",
      'data-component-family="cards"',
      'data-card-state={resolvedDescription ? "with-description" : "without-description"}',
      "<HeadingTag>",
      "<ul>",
      "<li>",
      "<BulletPoint",
      "var(--text-style-heading-h5-font-family)"
    ]
  }
};

for (const definition of Object.values(migratedCards)) {
  const source = read(definition.path);
  for (const contract of definition.contracts) {
    requireContract(source, contract, definition.path);
  }
}

const labelPath = "src/components/atoms/forms/Label.astro";
const label = read(labelPath);
for (const contract of [
  'const Element = variant === "field" ? "label" : "span"',
  'for={variant === "field" ? htmlFor : undefined}'
]) {
  requireContract(label, contract, labelPath);
}

const registryPath = "src/data/design-system/componentArchitecture.json";
const registry = JSON.parse(read(registryPath));
const cardRecords = registry.components.filter((entry) => entry.family === "cards");
if (cardRecords.length !== 19) {
  errors.push(`Expected exactly 19 public Cards registry records, found ${cardRecords.length}.`);
}

for (const [name, expected] of Object.entries(migratedCards)) {
  const record = registry.components.find((entry) => entry.name === name);
  if (!record) {
    errors.push(`Missing Cards registry record: ${name}`);
    continue;
  }
  if (
    record.family !== "cards" ||
    record.layer !== expected.layer ||
    record.status !== "ready" ||
    record.sourcePath !== expected.path
  ) {
    errors.push(`${name} registry identity or readiness drifted.`);
  }
  for (const prop of expected.props) {
    if (!record.props?.includes(prop)) errors.push(`${name} is missing prop: ${prop}`);
  }
  for (const attribute of expected.attributes) {
    if (!record.attributes?.includes(attribute)) {
      errors.push(`${name} is missing attribute: ${attribute}`);
    }
  }
}

const docsPath = "src/pages/design-system/components.astro";
const docs = read(docsPath);
for (const contract of [
  'id="components-cards-field-card"',
  'figmaNodeId="390:213"',
  'role="Present one expertise or capability area',
  "The parent owns grid columns",
  'id="components-cards-feature-card"',
  'figmaNodeId="723:399"',
  "FeatureCard",
  'variant="icon"',
  'variant="media"',
  'variant="numbered"',
  "visual is the only slot",
  "Number is a project-supplied editorial marker",
  'id="components-cards-use-case-card"',
  'figmaNodeId="755:431"',
  "UseCaseCard",
  'variant="role"',
  'variant="industry"',
  'variant="scenario"',
  "no public slots are exposed",
  "Audience definitions, claims, outcomes, destinations and approval remain project-owned.",
  'id="components-cards-integration-card"',
  'figmaNodeId="788:425"',
  "IntegrationCard",
  'variant="compact"',
  'variant="detailed"',
  "logo slot is required; default slot is rejected",
  "The card is one native anchor inside an article",
  'id="components-cards-team-member-card"',
  'figmaNodeId="854:425"',
  "TeamMemberCard",
  'variant="compact"',
  'variant="profile"',
  "no public slots are exposed",
  "Always compose the canonical Avatar with a circle shape.",
  'id="components-cards-job-card"',
  'figmaNodeId="873:5438"',
  "JobCard",
  'department="Product"',
  'employmentType="Full time"',
  'variant="detailed"',
  "Detailed requires description; Compact rejects it",
  "Department, location and employment type compose canonical Tag instances inside one native metadata list.",
  'id="components-cards-article-card"',
  'figmaNodeId="881:516"',
  "ArticleCard",
  'variant="featured"',
  'variant="standard"',
  'variant="compact"',
  "Featured and Standard require excerpt and accept the named media slot",
  "Compact rejects excerpt and the media slot",
  "publication metadata uses native time semantics",
  'id="components-cards-resource-card"',
  'figmaNodeId="892:472"',
  "ResourceCard",
  'variant="guide"',
  'variant="ebook"',
  'variant="webinar"',
  "Every variant composes canonical MediaRatio and Tag.",
  "Guide, Ebook, and Webinar communicate resource kind rather than access",
  'id="components-cards-project-card"',
  'figmaNodeId="390:90"',
  '<ProjectCard slot="preview" project={projectExamples[0]} />',
  "The consuming ProjectDrawer owns opening",
  'id="components-cards-case-study-card"',
  'figmaNodeId="710:366"',
  "CaseStudyCard",
  'variant="standard"',
  'variant="highlight"',
  "media is the only slot",
  "Do not add ProjectDrawer slug or data-open-case behavior.",
  'id="components-cards-service-card"',
  'figmaNodeId="390:212"',
  'href="/contact"',
  "Metric Label renders non-form span semantics.",
  'id="components-cards-callout-card"',
  'figmaNodeId="391:252"',
  "The parent owns outer margin and placement.",
  'id="components-cards-pricing-card"',
  'figmaNodeId="391:349"',
  "featuredLabel defaults to Recommended",
  'id="components-cards-testimonial-card"',
  'figmaNodeId="389:42"',
  "The quote and attribution remain inside one blockquote.",
  'id="components-cards-agency-partner-card"',
  'figmaNodeId="389:10"',
  "The visible current label composes Tag",
  'id="components-cards-project-row-card"',
  'figmaNodeId="390:89"',
  "static rows contain no false action",
  'id="components-cards-ui-kit-card"',
  'figmaNodeId="390:299"',
  "Items remain data-driven and may contain any positive count.",
  'id="components-cards-stat-card"',
  'figmaNodeId="389:41"',
  "hidden text communicates the direction to assistive technology",
  'id="components-cards-bullet-point-card"',
  'figmaNodeId="389:55"',
  "semantic ul/li list",
  'agenticRulePath=".agentic-rules/components/cards.md"'
]) {
  requireContract(docs, contract, docsPath);
}

const agenticRulePath = ".agentic-rules/components/cards.md";
const agenticRule = read(agenticRulePath);
for (const contract of [
  "FieldCard Decision Rules",
  "FeatureCard Decision Rules",
  "UseCaseCard Decision Rules",
  "IntegrationCard Decision Rules",
  "TeamMemberCard Decision Rules",
  "JobCard Decision Rules",
  "ArticleCard Decision Rules",
  "ResourceCard Decision Rules",
  "ProjectCard Decision Rules",
  "CaseStudyCard Decision Rules",
  "ServiceCard Decision Rules",
  "CalloutCard Decision Rules",
  "PricingCard Decision Rules",
  "TestimonialCard Decision Rules",
  "AgencyPartnerCard Decision Rules",
  "ProjectRowCard Decision Rules",
  "UiKitCard Decision Rules",
  "StatCard Decision Rules",
  "BulletPointCard Decision Rules",
  "The parent owns the grid",
  "Icon requires the single `visual` slot",
  "Do not infer numbers from array order",
  "Role identifies a job function or team",
  "Compact is the scan-efficient directory treatment",
  "Project-owned artwork is mandatory through the named `logo` slot",
  "one native anchor inside an article",
  "Compact is the scan-efficient",
  "Always compose canonical Avatar with a circle shape",
  "Use JobCard for one approved open role",
  "Department, location, and employment type form one native metadata list",
  "Compact is the scan-efficient listing row and rejects `description`.",
  "Use ArticleCard for one approved editorial article",
  "Featured is the deliberately emphasized editorial treatment",
  "Compact is the scan-efficient text-only treatment",
  "`publishedDate` remains a machine-readable",
  "Use ResourceCard for one approved guide, ebook, or webinar",
  "Guide and Webinar",
  "The parent owns grid placement, ordering, filtering, pagination",
  "The parent owns ordering, grid columns and inter-card gaps.",
  "`ProjectDrawer`",
  "Standard is the repeated grid treatment",
  "MediaRatio owns the ratio and contains the optional `media` slot",
  "Do not add ProjectDrawer slug behavior",
  "`href` is mandatory",
  "`Label.Metric` is non-form metadata",
  "The parent owns outer margin and placement.",
  "`featured` means the model is genuinely recommended",
  "`price` is optional",
  "`priceSuffix` is optional",
  "same `blockquote`",
  "`liveUrl` is optional",
  "Never force exactly four items",
  "`changeLabel` defaults to",
  "semantic `ul`/`li` list",
  'data-component-family="cards"'
]) {
  requireContract(agenticRule, contract, agenticRulePath);
}

const figmaRulePath = "Figma2Astro Agentic Rules/16-cards-components.md";
const figmaRule = read(figmaRulePath);
for (const contract of [
  "Code, semantic HTML, CSS Variables and browser behavior remain the source of",
  "exactly 19 public masters",
  "723:399",
  "723:326",
  "723:361",
  "723:381",
  "29 of 29 visible paint fields",
  "11 of 11 visible text nodes",
  "FeatureCard has exactly Icon, Media and Numbered variants",
  "755:431",
  "755:371",
  "755:391",
  "755:411",
  "All 9 of 9 direct variant fill and stroke fields",
  "UseCaseCard has exactly Role, Industry and Scenario variants",
  "788:425",
  "788:395",
  "788:408",
  "11 of 11 direct paint fields",
  "3 of 3 visible text",
  "IntegrationCard has exactly Compact and Detailed variants",
  "854:425",
  "854:408",
  "854:416",
  "9 of 9 direct fill and stroke fields",
  "5 of 5 visible text nodes",
  "TeamMemberCard has exactly Compact and Profile variants",
  "873:5438",
  "872:414",
  "872:419",
  "7 of 7 direct fill and stroke fields",
  "all 3",
  "JobCard has exactly Compact and Detailed variants",
  "881:516",
  "881:490",
  "881:499",
  "881:508",
  "882:5555",
  "882:5559",
  "881:494",
  "881:503",
  "881:512",
  "14 of 14 direct fill and stroke fields",
  "all 8",
  "ArticleCard has exactly Featured, Standard, and Compact variants",
  "892:472",
  "892:439",
  "892:450",
  "892:461",
  "892:440",
  "892:451",
  "892:462",
  "892:445",
  "892:456",
  "892:467",
  "6 of 6 direct fill and stroke fields",
  "All 15 visible text nodes",
  "ResourceCard has exactly Guide, Webinar, and Ebook variants",
  "Price#777:9",
  "Price Suffix#777:12",
  "Show Price#777:15",
  "777:3",
  "777:6",
  "Price frames",
  "710:366",
  "710:308",
  "710:337",
  "28 of 28 visible paint fields",
  "12 of 12 visible text nodes",
  "CaseStudyCard has exactly Standard and Highlight variants",
  "390:90",
  "390:212",
  "390:213",
  "389:41",
  "389:55",
  "`Viewport=Desktop|Tablet|Mobile` is a Figma adapter",
  "FieldCard owns no parent grid placement",
  'ServiceCard has no public viewport prop and never uses `href="#"`',
  "StatCard has no directional state without a real comparison",
  "BulletPointCard owns a semantic list"
]) {
  requireContract(figmaRule, contract, figmaRulePath);
}

const navigationPath = "src/data/designSystemNavigation.ts";
const navigation = read(navigationPath);
for (const name of Object.keys(migratedCards)) {
  requireContract(navigation, `label: "${name}"`, navigationPath);
}

const polishPattern =
  /[ąćęłńóśźż]|\b(?:oraz|dla|jest|należy|brakuje|istnieje|użyj|kiedy|komponentów|stron|systemu|kolorów|gotowy)\b/iu;
for (const path of [agenticRulePath, figmaRulePath]) {
  if (polishPattern.test(read(path))) errors.push(`${path} contains authored Polish.`);
}

if (errors.length) {
  console.error("Cards family audit failed:");
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(
  "Cards family checkpoint passed: all 19 public registry records align across code, registry, documentation, AI rules and Figma adapters."
);
