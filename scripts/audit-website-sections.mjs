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

const sourcePath =
  "src/components/organisms/sections/global-shell/AnnouncementBarSection.astro";
const source = read(sourcePath);
for (const contract of [
  'import NavBanner from "../../navigation/NavBanner.astro"',
  'export type AnnouncementBarSectionVariant = "neutral" | "accent"',
  "requires non-empty title, ariaLabel, and componentName values",
  "sectionId must be non-empty when provided",
  "href must be a real non-placeholder URL",
  "requires a non-empty actionLabel when href is set",
  'class:list={["l-section", "announcement-bar-section", className]}',
  'data-padding="none"',
  'data-component-family="sections"',
  'data-section-family="global-shell"',
  'data-section-type="announcement-bar"',
  "data-section-variant={variant}",
  'data-container="full"',
  "tone={variant}",
  'componentName={`${normalizedComponentName}.Banner`}'
]) {
  requireContract(source, contract, sourcePath);
}
if (source.includes("<slot")) {
  errors.push(`${sourcePath} must not expose unplanned actions or media slots.`);
}

const marketingSourcePath =
  "src/components/organisms/sections/global-shell/MarketingNavigationSection.astro";
const marketingSource = read(marketingSourcePath);
for (const contract of [
  'import MarketingNavbar from "../../navigation/MarketingNavbar.astro"',
  'export type MarketingNavigationSectionVariant = "simple" | "centered" | "mega-enabled"',
  "MarketingNavigationSection requires a structured content object",
  "requires non-empty ariaLabel and componentName values",
  "sectionId must be non-empty when provided",
  'variant === "mega-enabled" ? "mega-menu" : variant',
  'class:list={["l-section", "marketing-navigation-section", className]}',
  'data-padding="none"',
  'data-component-family="sections"',
  'data-section-family="global-shell"',
  'data-section-type="marketing-navigation"',
  "data-section-variant={variant}",
  "<MarketingNavbar {...navbarProps}>",
  "<MarketingNavbar {...navbarProps} />",
  '<Fragment slot="brand">',
  'componentName: `${normalizedComponentName}.Navbar`'
]) {
  requireContract(marketingSource, contract, marketingSourcePath);
}
for (const forbidden of [
  'slot name="actions"',
  'slot name="media"',
  "mobileItems"
]) {
  if (marketingSource.includes(forbidden)) {
    errors.push(`${marketingSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const subnavigationSourcePath =
  "src/components/organisms/sections/global-shell/SubnavigationSection.astro";
const subnavigationSource = read(subnavigationSourcePath);
for (const contract of [
  'import Subnavigation from "../../../molecules/navigation/Subnavigation.astro"',
  "export interface SubnavigationSectionContent",
  "SubnavigationSection requires a structured content object",
  "requires non-empty ariaLabel and componentName values",
  "sectionId must be non-empty when provided",
  'class:list={["l-section", "subnavigation-section", className]}',
  'data-padding="none"',
  'data-component-family="sections"',
  'data-section-family="global-shell"',
  'data-section-type="subnavigation"',
  "data-section-variant={variant}",
  "<Subnavigation",
  "id={content.id}",
  "items={content.items}",
  "variant={variant}",
  'componentName={`${normalizedComponentName}.Navigation`}'
]) {
  requireContract(
    subnavigationSource,
    contract,
    subnavigationSourcePath
  );
}
if (subnavigationSource.includes("<slot")) {
  errors.push(`${subnavigationSourcePath} must not expose any slots.`);
}

const footerSourcePath =
  "src/components/organisms/sections/global-shell/FooterSection.astro";
const footerSource = read(footerSourcePath);
for (const contract of [
  'import Footer from "../../navigation/Footer.astro"',
  "export interface FooterSectionContent extends FooterContent",
  "FooterSection requires a structured content object",
  "requires non-empty ariaLabel and componentName values",
  "sectionId must be non-empty when provided",
  "const footerProps =",
  '"data-section-family": "global-shell"',
  '"data-section-type": "footer"',
  '"data-section-variant": variant',
  "<Footer {...footerProps}>",
  "<Footer {...footerProps} />",
  '<Fragment slot="brand">'
]) {
  requireContract(footerSource, contract, footerSourcePath);
}
for (const forbidden of [
  'slot name="actions"',
  'slot name="media"',
  'slot name="default"',
  'slot name="groups"',
  'slot name="links"',
  "<section"
]) {
  if (footerSource.includes(forbidden)) {
    errors.push(`${footerSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const cookieConsentSourcePath =
  "src/components/organisms/sections/global-shell/CookieConsentSection.astro";
const cookieConsentSource = read(cookieConsentSourcePath);
for (const contract of [
  'import Button from "../../../atoms/actions/Button.astro"',
  'import ButtonGroup from "../../../molecules/actions/ButtonGroup.astro"',
  'export type CookieConsentSectionVariant = "banner" | "modal"',
  'export type CookieConsentChoice = "accept-all" | "reject-nonessential"',
  "CookieConsentSection requires a structured content object",
  "requires non-empty title, description, acceptLabel, and rejectLabel values",
  "policyLabel and policyHref must be provided together",
  "policyHref must be a real non-placeholder URL",
  "preferencesLabel and preferencesHref must be provided together",
  "preferencesHref must be a real non-placeholder URL",
  'class:list={["l-section", "cookie-consent-section", className]}',
  'data-component-family="sections"',
  'data-section-family="global-shell"',
  'data-section-type="cookie-consent"',
  "data-section-variant={variant}",
  "data-cookie-consent-state={open ?",
  'role={variant === "modal" ? "dialog" : undefined}',
  'aria-modal={variant === "modal" && !preview ? "true" : undefined}',
  "<ButtonGroup",
  "<Button",
  'data-cookie-consent-choice="accept-all"',
  'data-cookie-consent-choice="reject-nonessential"',
  "__astroDsCookieConsentRuntime",
  'new CustomEvent("cookie-consent-choice"',
  "document.body.toggleAttribute",
  'event.key !== "Tab"',
  "@media (width < 64rem)"
]) {
  requireContract(cookieConsentSource, contract, cookieConsentSourcePath);
}
for (const forbidden of [
  "IconButton",
  "<slot",
  'event.key === "Escape"',
  "localStorage",
  "sessionStorage"
]) {
  if (cookieConsentSource.includes(forbidden)) {
    errors.push(
      `${cookieConsentSourcePath} contains forbidden contract: ${forbidden}`
    );
  }
}

const heroSourcePath =
  "src/components/organisms/sections/hero-headers/HeroSection.astro";
const heroSource = read(heroSourcePath);
for (const contract of [
  'import Button from "../../../atoms/actions/Button.astro"',
  'import Eyebrow from "../../../atoms/text/Eyebrow.astro"',
  'import MediaRatio from "../../../atoms/media/MediaRatio.astro"',
  'import ButtonGroup from "../../../molecules/actions/ButtonGroup.astro"',
  'export type HeroSectionVariant = "centered" | "split" | "product-mockup" | "media" | "lead-capture" | "launch-event"',
  "HeroSection id must be selector-safe and start with a letter",
  "HeroSection requires a structured content object",
  "HeroSection requires non-empty title and description values",
  "HeroSection supports at most two actions",
  "HeroSection action URLs must be unique",
  "HeroSection supports at most one primary action",
  'requiresMedia ? "requires" : "does not accept"',
  '(variant === "lead-capture") !== hasForm',
  '(variant === "launch-event") !==',
  "lead-capture delegates conversion actions to its form",
  'class:list={["l-section", "hero-section", className]}',
  'data-padding="hero-top"',
  'data-component-family="sections"',
  'data-section-family="hero-headers"',
  'data-section-type="hero"',
  "data-section-variant={variant}",
  "<h1 id={titleId}>",
  "<Eyebrow",
  "<ButtonGroup",
  "<Button",
  "<MediaRatio",
  '<slot name="media"',
  '<slot name="form"',
  "@media (width < 64rem)",
  "@media (width < 40rem)"
]) {
  requireContract(heroSource, contract, heroSourcePath);
}
for (const forbidden of [
  "ContentBlock",
  '<slot />',
  'slot name="actions"',
  'slot name="default"'
]) {
  if (heroSource.includes(forbidden)) {
    errors.push(`${heroSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const pageHeaderSourcePath =
  "src/components/organisms/sections/hero-headers/PageHeaderSection.astro";
const pageHeaderSource = read(pageHeaderSourcePath);
for (const contract of [
  'import Breadcrumbs from "../../../molecules/navigation/Breadcrumbs.astro"',
  'import PageHeader from "../../../molecules/text/PageHeader.astro"',
  "PageHeaderSection requires a structured content object",
  "PageHeaderSection requires non-empty eyebrow, title, and description values",
  "PageHeaderSection sectionId must be selector-safe and start with a letter",
  "PageHeaderSection breadcrumbs must contain at least one item when provided",
  "PageHeaderSection breadcrumbsLabel must be non-empty when provided",
  'class:list={["l-section", "page-header-section", className]}',
  'data-padding="medium"',
  'data-component-family="sections"',
  'data-section-family="hero-headers"',
  'data-section-type="page-header"',
  'data-section-variant={hasBreadcrumbs ? "breadcrumbs" : "standard"}',
  'data-container="main"',
  "hasBreadcrumbs &&",
  "<Breadcrumbs",
  "<PageHeader",
  '<slot name="support"',
]) {
  requireContract(pageHeaderSource, contract, pageHeaderSourcePath);
}
for (const forbidden of [
  "variant?:",
  '<slot />',
  'slot name="actions"',
  'slot name="media"',
  'slot name="default"',
]) {
  if (pageHeaderSource.includes(forbidden)) {
    errors.push(`${pageHeaderSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const logoCloudSourcePath =
  "src/components/organisms/sections/brand-social-proof/LogoCloudSection.astro";
const logoCloudSource = read(logoCloudSourcePath);
for (const contract of [
  'import Logo from "../../../atoms/media/Logo.astro"',
  'import Carousel from "../../media/Carousel.astro"',
  'export type LogoCloudSectionVariant = "static" | "carousel"',
  "LogoCloudSection id must be selector-safe and start with a letter",
  "LogoCloudSection requires a structured content object",
  "LogoCloudSection requires a non-empty title",
  "LogoCloudSection requires at least two approved logo items",
  "requires a selector-safe id that starts with a letter",
  "requires a non-empty accessible label",
  "requires approved image artwork",
  "requires a real non-placeholder href",
  'class:list={["l-section", "logo-cloud-section", className]}',
  'data-padding="medium"',
  'data-component-family="sections"',
  'data-section-family="brand-social-proof"',
  'data-section-type="logo-cloud"',
  "data-section-variant={variant}",
  'data-container="main"',
  'variant === "static"',
  '<ul class="logo-cloud-section__list">',
  "<Logo",
  "<Carousel",
  'variant="logos"',
  "@media (width < 40rem)",
]) {
  requireContract(logoCloudSource, contract, logoCloudSourcePath);
}
for (const forbidden of [
  "<slot",
  "autoplay",
  "infinite",
  'variant?: "desktop"',
  'variant?: "mobile"',
]) {
  if (logoCloudSource.includes(forbidden)) {
    errors.push(`${logoCloudSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const trustSignalsSourcePath =
  "src/components/organisms/sections/brand-social-proof/TrustSignalsSection.astro";
const trustSignalsSource = read(trustSignalsSourcePath);
for (const contract of [
  'import TrustBadge from "../../../atoms/data-display/TrustBadge.astro"',
  'import Rating from "../../../molecules/data-display/Rating.astro"',
  'export type TrustSignalsSectionVariant = "ratings" | "badges" | "awards"',
  "TrustSignalsSection id must be selector-safe and start with a letter",
  "TrustSignalsSection requires a structured content object",
  "TrustSignalsSection requires a non-empty title",
  "TrustSignalsSection requires at least two verified items",
  "requires a selector-safe id that starts with a letter",
  "value must be between zero and five",
  'requires kind="security|compliance"',
  "must not define a security or compliance kind",
  'class:list={["l-section", "trust-signals-section", className]}',
  'data-component-family="sections"',
  'data-section-family="brand-social-proof"',
  'data-section-type="trust-signals"',
  "data-section-variant={variant}",
  '<ul class="trust-signals-section__list">',
  "<Rating",
  "<TrustBadge",
  'class="trust-signals-section__rating"',
  "flex-wrap: wrap",
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(trustSignalsSource, contract, trustSignalsSourcePath);
}
for (const forbidden of [
  "<slot",
  "official-seal",
  'variant?: "desktop"',
  'variant?: "mobile"',
]) {
  if (trustSignalsSource.includes(forbidden)) {
    errors.push(`${trustSignalsSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const testimonialSourcePath =
  "src/components/organisms/sections/brand-social-proof/TestimonialSection.astro";
const testimonialSource = read(testimonialSourcePath);
for (const contract of [
  'import TestimonialCard from "../../../molecules/cards/TestimonialCard.astro"',
  'import StatCard from "../../../molecules/cards/StatCard.astro"',
  'import Carousel from "../../media/Carousel.astro"',
  '"single" | "grid" | "carousel" | "customer-results"',
  "TestimonialSection id must be selector-safe and start with a letter",
  "TestimonialSection requires a structured content object",
  "TestimonialSection requires a non-empty title",
  "requires exactly one testimonial item",
  "requires at least two testimonial items",
  "customer-results requires two to four verified results",
  "must not define customer results",
  "requires non-empty quote, client, person, and role values",
  "must not define avatar data because canonical Carousel does not render TestimonialCard",
  "requires change when direction is",
  'class:list={["l-section", "testimonial-section", className]}',
  'data-component-family="sections"',
  'data-section-family="brand-social-proof"',
  'data-section-type="testimonials"',
  "data-section-variant={variant}",
  'variant="multi-item"',
  "<TestimonialCard",
  "<StatCard",
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(testimonialSource, contract, testimonialSourcePath);
}
for (const forbidden of [
  "<slot",
  "autoplay",
  "infinite",
  'variant?: "desktop"',
  'variant?: "mobile"',
]) {
  if (testimonialSource.includes(forbidden)) {
    errors.push(`${testimonialSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const caseStudySourcePath =
  "src/components/organisms/sections/brand-social-proof/CaseStudySection.astro";
const caseStudySource = read(caseStudySourcePath);
for (const contract of [
  'import Button from "../../../atoms/actions/Button.astro"',
  'import CaseStudyCard from "../../../molecules/cards/CaseStudyCard.astro"',
  'export type CaseStudySectionVariant = "highlight" | "grid"',
  "CaseStudySection id must be selector-safe and start with a letter",
  "CaseStudySection requires a structured content object",
  "CaseStudySection requires a non-empty title",
  "highlight requires exactly one case-study item",
  "grid requires at least two case-study items",
  "action requires a non-empty label and real non-placeholder href",
  "requires a selector-safe id that starts with a letter",
  "requires non-empty title, summary, client, and a real href",
  "mediaSrc and mediaAlt must be provided together",
  'class:list={["l-section", "case-study-section", className]}',
  'data-component-family="sections"',
  'data-section-family="brand-social-proof"',
  'data-section-type="case-studies"',
  "data-section-variant={variant}",
  '<ul class="case-study-section__items">',
  "<CaseStudyCard",
  "<Button",
  "variant === \"highlight\" ? \"highlight\" : \"standard\"",
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(caseStudySource, contract, caseStudySourcePath);
}
for (const forbidden of [
  'data-open-case',
  '<slot name="actions"',
  '<slot name="cards"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
]) {
  if (caseStudySource.includes(forbidden)) {
    errors.push(`${caseStudySourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const featureSourcePath =
  "src/components/organisms/sections/features-product-demo/FeatureSection.astro";
const featureSource = read(featureSourcePath);
for (const contract of [
  'import FeatureCard from "../../../molecules/cards/FeatureCard.astro"',
  'import Tabs from "../../disclosure/Tabs.astro"',
  'import ComparisonTable from "../../data-display/ComparisonTable.astro"',
  'export type FeatureSectionVariant = "grid" | "list" | "alternating" | "bento" | "tabs" | "comparison"',
  "FeatureSection id must be selector-safe and start with a letter",
  "FeatureSection requires a structured content object",
  "FeatureSection requires a non-empty title",
  "non-comparison variants require at least two feature items",
  "Comparison requires comparison content",
  "requires a selector-safe id that starts with a letter",
  "requires non-empty title and description values",
  "actionLabel and actionHref must be provided together",
  "mediaSrc and mediaAlt must be provided together",
  "supports only id, title, description, and disabled",
  "Tabs requires at least one enabled item",
  "Comparison requires at least two columns",
  "Comparison requires at least one row",
  'class:list={["l-section", "feature-section", className]}',
  'data-component-family="sections"',
  'data-section-family="features-product-demo"',
  'data-section-type="features"',
  "data-section-variant={variant}",
  "<FeatureCard",
  "<Tabs",
  "<ComparisonTable",
  "@media (width < 64rem)",
  "@media (width < 48rem)",
  "@media (width < 40rem)",
]) {
  requireContract(featureSource, contract, featureSourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
]) {
  if (featureSource.includes(forbidden)) {
    errors.push(`${featureSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const productDemoSourcePath =
  "src/components/organisms/sections/features-product-demo/ProductDemoSection.astro";
const productDemoSource = read(productDemoSourcePath);
for (const contract of [
  'import MediaRatio from "../../../atoms/media/MediaRatio.astro"',
  'import VideoPlayer from "../../../molecules/media/VideoPlayer.astro"',
  'import BeforeAfterSlider from "../../media/BeforeAfterSlider.astro"',
  'export type ProductDemoSectionVariant = "screenshot" | "interactive" | "video" | "before-after"',
  "ProductDemoSection id must be selector-safe and start with a letter",
  "ProductDemoSection requires a structured content object",
  "ProductDemoSection requires a non-empty title",
  "media slot is supported only by Interactive",
  "Interactive requires the media slot",
  "must not define content",
  "Screenshot requires non-empty src and alt values",
  "Interactive requires a non-empty accessible label",
  "Video requires non-empty src and title values",
  "Video autoplay requires muted=true",
  "Before After requires non-empty sources and alternative text",
  'class:list={["l-section", "product-demo-section", className]}',
  'data-component-family="sections"',
  'data-section-family="features-product-demo"',
  'data-section-type="product-demo"',
  "data-section-variant={variant}",
  "<MediaRatio",
  "<VideoPlayer",
  "<BeforeAfterSlider",
  '<slot name="media"',
  "@media (width < 40rem)",
]) {
  requireContract(productDemoSource, contract, productDemoSourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="default"',
  '<slot name="video"',
  '<slot name="screenshot"',
  'variant?: "desktop"',
  'variant?: "mobile"',
]) {
  if (productDemoSource.includes(forbidden)) {
    errors.push(`${productDemoSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const processSourcePath =
  "src/components/organisms/sections/how-it-works-use-cases/ProcessSection.astro";
const processSource = read(processSourcePath);
for (const contract of [
  'import Eyebrow from "../../../atoms/text/Eyebrow.astro"',
  'import PanelPatternVisualSystem from "../../visual/PanelPatternVisualSystem.astro"',
  'export type ProcessSectionVariant = "numbered-steps" | "cards" | "timeline" | "sticky" | "workflow-diagram"',
  "ProcessSection id must be selector-safe and start with a letter",
  "ProcessSection requires a structured content object",
  "ProcessSection requires a non-empty title",
  "ProcessSection requires at least two process steps",
  "ProcessSection supports at most six process steps",
  "ProcessSection does not expose public slots",
  "requires a selector-safe id that starts with a letter",
  "requires non-empty title and description values",
  'class:list={["l-section", "process-section", className]}',
  'data-component-family="sections"',
  'data-section-family="how-it-works-use-cases"',
  'data-section-type="process"',
  "data-section-variant={variant}",
  '<ol class="process-section__steps">',
  "data-process-step={step.id}",
  "<PanelPatternVisualSystem",
  'variant="heroPrimary"',
  'position: sticky',
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(processSource, contract, processSourcePath);
}
for (const forbidden of [
  "<FeatureCard",
  "<Timeline",
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
]) {
  if (processSource.includes(forbidden)) {
    errors.push(`${processSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const useCasesSourcePath =
  "src/components/organisms/sections/how-it-works-use-cases/UseCasesSection.astro";
const useCasesSource = read(useCasesSourcePath);
for (const contract of [
  'import UseCaseCard from "../../../molecules/cards/UseCaseCard.astro"',
  'import Tabs from "../../disclosure/Tabs.astro"',
  'export type UseCasesSectionVariant = "role-based" | "industry" | "scenario-tabs"',
  "UseCasesSection id must be selector-safe and start with a letter",
  "UseCasesSection requires a structured content object",
  "UseCasesSection requires a non-empty title",
  "UseCasesSection requires at least two use-case items",
  "UseCasesSection supports at most six use-case items",
  "UseCasesSection does not expose public slots",
  "Scenario Tabs requires at least one enabled item",
  "Scenario Tabs item",
  "does not support item actions",
  'class:list={["l-section", "use-cases-section", className]}',
  'data-component-family="sections"',
  'data-section-family="how-it-works-use-cases"',
  'data-section-type="use-cases"',
  "data-section-variant={variant}",
  '<ul class="use-cases-section__grid">',
  "data-use-case-item={item.id}",
  "<UseCaseCard",
  "<Tabs",
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(useCasesSource, contract, useCasesSourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
]) {
  if (useCasesSource.includes(forbidden)) {
    errors.push(`${useCasesSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const statsSourcePath =
  "src/components/organisms/sections/stats-customer-proof/StatsSection.astro";
const statsSource = read(statsSourcePath);
for (const contract of [
  'import StatCard from "../../../molecules/cards/StatCard.astro"',
  'export type StatsSectionVariant =',
  '"kpi-band" | "grid" | "metric-cards" | "milestones"',
  "StatsSection id must be selector-safe and start with a letter",
  "StatsSection requires a structured content object",
  "StatsSection requires a non-empty title",
  "StatsSection requires at least two metric items",
  "StatsSection supports at most six metric items",
  "StatsSection does not expose public slots",
  "requires non-empty label and value strings",
  'class:list={["l-section", "stats-section", className]}',
  'data-component-family="sections"',
  'data-section-family="stats-customer-proof"',
  'data-section-type="stats"',
  "data-section-variant={variant}",
  'data-stat-metric={metric.id}',
  '<ol class="stats-section__metrics">',
  '<ul class="stats-section__metrics">',
  "<StatCard",
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(statsSource, contract, statsSourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
]) {
  if (statsSource.includes(forbidden)) {
    errors.push(`${statsSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const dataStorySourcePath =
  "src/components/organisms/sections/stats-customer-proof/DataStorySection.astro";
const dataStorySource = read(dataStorySourcePath);
for (const contract of [
  'import StatCard from "../../../molecules/cards/StatCard.astro"',
  'import ComparisonTable from "../../data-display/ComparisonTable.astro"',
  'export type DataStorySectionVariant =',
  '"benchmark" | "data-story" | "customer-results" | "roi-result"',
  "DataStorySection id must be selector-safe and start with a letter",
  "DataStorySection requires a structured content object",
  "DataStorySection requires a non-empty title",
  "DataStorySection does not expose public slots",
  "requires a visible evidenceNote",
  "Benchmark requires a comparison with a non-empty caption",
  "Benchmark requires two to four comparison columns",
  "requires at least two metric items",
  "supports at most four metric items",
  'class:list={["l-section", "data-story-section", className]}',
  'data-component-family="sections"',
  'data-section-family="stats-customer-proof"',
  'data-section-type="data-story"',
  "data-section-variant={variant}",
  'data-data-story-metric={metric.id}',
  "<ComparisonTable",
  "<StatCard",
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(dataStorySource, contract, dataStorySourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
]) {
  if (dataStorySource.includes(forbidden)) {
    errors.push(`${dataStorySourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const pricingSourcePath =
  "src/components/organisms/sections/pricing-comparison/PricingSection.astro";
const pricingSource = read(pricingSourcePath);
for (const contract of [
  'import SwitchButton from "../../../atoms/actions/SwitchButton.astro"',
  'import PricingCard from "../../cards/PricingCard.astro"',
  'export type PricingSectionVariant = "tiers" | "toggle" | "usage-based"',
  "PricingSection id must be selector-safe and start with a letter",
  "PricingSection requires a structured content object",
  "PricingSection requires a non-empty title",
  "PricingSection requires at least two plans",
  "PricingSection supports at most four plans",
  "PricingSection supports at most one featured plan",
  "PricingSection Toggle requires alternatePrice for every plan",
  "PricingSection Usage Based requires priceSuffix for every plan",
  "PricingSection does not expose public slots",
  'class:list={["l-section", "pricing-section", className]}',
  'data-component-family="sections"',
  'data-section-family="pricing-comparison"',
  'data-section-type="pricing"',
  "data-section-variant={variant}",
  'data-pricing-period-active={defaultAlternate ? "alternate" : "primary"}',
  'data-pricing-period="primary"',
  'data-pricing-period="alternate"',
  "data-pricing-plan={plan.id}",
  "<PricingCard",
  "<SwitchButton",
  'document.addEventListener("switch-change"',
  'aria-live="polite"',
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(pricingSource, contract, pricingSourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
]) {
  if (pricingSource.includes(forbidden)) {
    errors.push(`${pricingSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const pricingComparisonSourcePath =
  "src/components/organisms/sections/pricing-comparison/PricingComparisonSection.astro";
const pricingComparisonSource = read(pricingComparisonSourcePath);
for (const contract of [
  'import Button from "../../../atoms/actions/Button.astro"',
  'import PricingCard from "../../cards/PricingCard.astro"',
  'import ComparisonTable from "../../data-display/ComparisonTable.astro"',
  "export type PricingComparisonSectionVariant",
  '"feature-matrix" | "add-ons" | "enterprise-cta"',
  "PricingComparisonSection id must be selector-safe and start with a letter",
  "PricingComparisonSection requires a structured content object",
  "PricingComparisonSection requires a non-empty title",
  "PricingComparisonSection Feature Matrix requires two to four columns",
  "PricingComparisonSection Feature Matrix requires one to twelve rows",
  "PricingComparisonSection Feature Matrix supports at most one highlighted column",
  "PricingComparisonSection Add Ons requires at least two plans",
  "PricingComparisonSection Add Ons supports at most four plans",
  "PricingComparisonSection Add Ons supports at most one featured plan",
  "PricingComparisonSection Enterprise CTA requires enterprise content",
  "PricingComparisonSection Enterprise CTA requires a non-empty action label and a safe supplied href",
  "PricingComparisonSection does not expose public slots",
  'class:list={["l-section", "pricing-comparison-section", className]}',
  'data-component-family="sections"',
  'data-section-family="pricing-comparison"',
  'data-section-type="pricing-comparison"',
  "data-section-variant={variant}",
  "data-pricing-comparison-plan={plan.id}",
  "<ComparisonTable",
  "<PricingCard",
  "<Button",
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(
    pricingComparisonSource,
    contract,
    pricingComparisonSourcePath,
  );
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
]) {
  if (pricingComparisonSource.includes(forbidden)) {
    errors.push(
      `${pricingComparisonSourcePath} contains forbidden contract: ${forbidden}`,
    );
  }
}

const pricingFaqSourcePath =
  "src/components/organisms/sections/pricing-comparison/PricingFaqSection.astro";
const pricingFaqSource = read(pricingFaqSourcePath);
for (const contract of [
  'import Accordion from "../../../molecules/disclosure/Accordion.astro"',
  "PricingFaqSection id must be selector-safe and start with a letter",
  "PricingFaqSection requires a structured content object",
  "PricingFaqSection requires a non-empty title",
  "PricingFaqSection requires at least two FAQ items",
  "PricingFaqSection supports at most eight FAQ items",
  "PricingFaqSection with closeSiblings=true supports at most one initially open item",
  "PricingFaqSection does not expose public slots",
  'class:list={["l-section", "pricing-faq-section", className]}',
  'data-component-family="sections"',
  'data-section-family="pricing-comparison"',
  'data-section-type="pricing-faq"',
  'data-section-variant="accordion"',
  "<Accordion",
  "items={normalizedItems}",
  "closeSiblings={closeSiblings}",
  "headingLevel={accordionHeadingLevel}",
]) {
  requireContract(pricingFaqSource, contract, pricingFaqSourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  "variant:",
  'variant?: "desktop"',
  'variant?: "mobile"',
]) {
  if (pricingFaqSource.includes(forbidden)) {
    errors.push(`${pricingFaqSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const integrationsSourcePath =
  "src/components/organisms/sections/integrations-security/IntegrationsSection.astro";
const integrationsSource = read(integrationsSourcePath);
for (const contract of [
  'import Logo from "../../../atoms/media/Logo.astro"',
  'import IntegrationCard from "../../../molecules/cards/IntegrationCard.astro"',
  'import SearchInput from "../../../molecules/forms/SearchInput.astro"',
  "export type IntegrationsSectionVariant",
  '"grid" | "directory" | "detail" | "ecosystem"',
  "IntegrationsSection id must be selector-safe and start with a letter",
  "IntegrationsSection requires a structured content object",
  "IntegrationsSection requires a non-empty title",
  "IntegrationsSection requires at least two integration items",
  "IntegrationsSection supports at most twelve integration items",
  "IntegrationsSection Directory requires at least three items",
  "IntegrationsSection Ecosystem requires at least three items",
  "IntegrationsSection Directory requires non-empty search label, placeholder, and emptyMessage values",
  "IntegrationsSection Detail requires featuredIntegrationId",
  "IntegrationsSection featuredIntegrationId must reference an existing item",
  "IntegrationsSection Ecosystem requires a non-empty ecosystem label, logo src, and logo label",
  "IntegrationsSection Grid requires a description for every item",
  "IntegrationsSection Detail requires a description for the featured item",
  "IntegrationsSection does not expose public slots",
  'class:list={["l-section", "integrations-section", className]}',
  'data-component-family="sections"',
  'data-section-family="integrations-security"',
  'data-section-type="integrations"',
  "data-section-variant={variant}",
  "data-integration-item={item.id}",
  'data-integration-role={isFeatured ? "featured" : "standard"}',
  "<IntegrationCard",
  "<SearchInput",
  "<Logo",
  "[data-integrations-directory]",
  "[data-integrations-results-status]",
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(integrationsSource, contract, integrationsSourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
  "InstallButton",
  "Authentication",
]) {
  if (integrationsSource.includes(forbidden)) {
    errors.push(
      `${integrationsSourcePath} contains forbidden contract: ${forbidden}`,
    );
  }
}

const developerSourcePath =
  "src/components/organisms/sections/integrations-security/DeveloperSection.astro";
const developerSource = read(developerSourcePath);
for (const contract of [
  'import ContentBlock from "../../../molecules/content/ContentBlock.astro"',
  'export type DeveloperSectionVariant = "api" | "developer"',
  '"GET" | "POST" | "PUT" | "PATCH" | "DELETE"',
  "DeveloperSection id must be selector-safe and start with a letter",
  "DeveloperSection requires a structured content object",
  "DeveloperSection requires non-empty title and description values",
  "DeveloperSection action requires a non-empty label and safe supplied href",
  "DeveloperSection API requires a supported method and non-empty endpoint path",
  "DeveloperSection API requires one complete code example",
  "DeveloperSection API does not accept developer steps",
  "DeveloperSection Developer requires at least two steps",
  "DeveloperSection Developer supports at most four steps",
  "DeveloperSection contains duplicate step id",
  "DeveloperSection does not expose public slots",
  'class:list={["l-section", "developer-section", className]}',
  'data-component-family="sections"',
  'data-section-family="integrations-security"',
  'data-section-type="developer"',
  "data-section-variant={variant}",
  "data-developer-step={step.id}",
  "data-code-language={normalizedCode.language}",
  "<ContentBlock",
  "<ol",
  "<pre",
  "<code>",
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(developerSource, contract, developerSourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
  "DsCodeSnippet",
  "ApiConsole",
]) {
  if (developerSource.includes(forbidden)) {
    errors.push(
      `${developerSourcePath} contains forbidden contract: ${forbidden}`,
    );
  }
}

const trustSourcePath =
  "src/components/organisms/sections/integrations-security/TrustSection.astro";
const trustSource = read(trustSourcePath);
for (const contract of [
  'import TrustBadge from "../../../atoms/data-display/TrustBadge.astro"',
  'import ComparisonTable from "../../data-display/ComparisonTable.astro"',
  "export type TrustSectionVariant",
  '"security" | "compliance" | "trust-center" | "architecture"',
  "TrustSection id must be selector-safe and start with a letter",
  "TrustSection requires a structured content object",
  "TrustSection requires non-empty title and description values",
  "TrustSection requires a non-empty evidenceNote",
  "TrustSection Security and Compliance require at least two evidence-backed claims",
  "TrustSection Security and Compliance support at most six claims",
  "TrustSection Security and Compliance reject comparison content",
  "TrustSection Trust Center and Architecture require comparison content",
  "TrustSection Trust Center and Architecture reject claim-list content",
  "TrustSection Architecture requires two to four comparison columns",
  "TrustSection Trust Center requires one to four comparison columns",
  "TrustSection comparison requires two to ten rows",
  "TrustSection comparison supports at most one highlighted column",
  "TrustSection does not expose public slots",
  'class:list={["l-section", "trust-section", className]}',
  'data-section-family="integrations-security"',
  'data-section-type="trust"',
  "data-section-variant={variant}",
  "data-trust-claim={claim.id}",
  "data-trust-comparison",
  "<TrustBadge",
  "<ComparisonTable",
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(trustSource, contract, trustSourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
  "OfficialSeal",
  "CertificationLogo",
]) {
  if (trustSource.includes(forbidden)) {
    errors.push(`${trustSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const ctaSourcePath =
  "src/components/organisms/sections/conversion/CtaSection.astro";
const ctaSource = read(ctaSourcePath);
for (const contract of [
  'import Button from "../../../atoms/actions/Button.astro"',
  'import Eyebrow from "../../../atoms/text/Eyebrow.astro"',
  'import ButtonGroup from "../../../molecules/actions/ButtonGroup.astro"',
  'import CalloutCard from "../../cards/CalloutCard.astro"',
  "export type CtaSectionVariant",
  '"banner" | "card" | "split" | "full-bleed"',
  "CtaSection id must be selector-safe and start with a letter",
  "CtaSection requires a structured content object",
  "CtaSection requires a non-empty title",
  "CtaSection requires at least one action",
  "CtaSection supports at most two actions",
  "CtaSection contains duplicate action destination",
  "CtaSection supports at most one primary action",
  "CtaSection Split requires a non-empty eyebrow",
  "CtaSection Split rejects description",
  "CtaSection Split requires exactly one action",
  "CtaSection Banner, Card, and Full Bleed require a non-empty description",
  "CtaSection visual content is supported only by Split",
  "CtaSection does not expose public slots",
  'class:list={["l-section", "cta-section", className]}',
  'data-section-family="conversion"',
  'data-section-type="call-to-action"',
  "data-section-variant={variant}",
  "data-cta-actions",
  "<Eyebrow",
  "<ButtonGroup",
  "<Button",
  "<CalloutCard",
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(ctaSource, contract, ctaSourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
  "<form",
  "fetch(",
]) {
  if (ctaSource.includes(forbidden)) {
    errors.push(`${ctaSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const leadCaptureSourcePath =
  "src/components/organisms/sections/conversion/LeadCaptureSection.astro";
const leadCaptureSource = read(leadCaptureSourcePath);
for (const contract of [
  'import Button from "../../../atoms/actions/Button.astro"',
  'import Input from "../../../atoms/forms/Input.astro"',
  'import Eyebrow from "../../../atoms/text/Eyebrow.astro"',
  'import ButtonGroup from "../../../molecules/actions/ButtonGroup.astro"',
  'import ConsentField from "../../../molecules/forms/ConsentField.astro"',
  'import FormField from "../../../molecules/forms/FormField.astro"',
  'import CalComEmbed from "../../forms/CalComEmbed.astro"',
  'import Form from "../../forms/Form.astro"',
  "export type LeadCaptureSectionVariant",
  '"newsletter" | "lead-form" | "contact-form" | "demo-booking" | "waitlist" | "app-download"',
  "LeadCaptureSection id must be selector-safe and start with a letter",
  "LeadCaptureSection requires a structured content object",
  "LeadCaptureSection requires non-empty title and description values",
  "LeadCaptureSection form variants require structured form content",
  "LeadCaptureSection form variants reject scheduling and download content",
  "LeadCaptureSection Demo Booking requires scheduling content",
  "LeadCaptureSection App Download requires one or two download actions",
  "LeadCaptureSection form action must be a supplied HTTPS or root-relative URL",
  "LeadCaptureSection form variants require exactly one email field",
  "LeadCaptureSection Newsletter requires one email field",
  "LeadCaptureSection Contact Form requires one textarea field",
  "LeadCaptureSection consent identity must not duplicate a form field",
  "LeadCaptureSection Demo Booking requires a valid supplied Cal.com link",
  "LeadCaptureSection contains duplicate download destination",
  "LeadCaptureSection does not expose public slots",
  'class:list={["l-section", "lead-capture-section", className]}',
  'data-section-family="conversion"',
  'data-section-type="lead-capture"',
  "data-section-variant={variant}",
  "data-lead-capture-actions",
  "<Form",
  "<FormField",
  "<Input",
  "<ConsentField",
  "<CalComEmbed",
  "<Button",
  "<ButtonGroup",
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(leadCaptureSource, contract, leadCaptureSourcePath);
}
for (const forbidden of [
  '<slot name="form"',
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
  "fetch(",
  "localStorage",
]) {
  if (leadCaptureSource.includes(forbidden)) {
    errors.push(
      `${leadCaptureSourcePath} contains forbidden contract: ${forbidden}`,
    );
  }
}

const companyStorySourcePath =
  "src/components/organisms/sections/company/CompanyStorySection.astro";
const companyStorySource = read(companyStorySourcePath);
for (const contract of [
  'import ContentBlock from "../../../molecules/content/ContentBlock.astro"',
  "export type CompanyStorySectionVariant",
  '"about" | "mission" | "values" | "timeline"',
  "CompanyStorySection id must be selector-safe and start with a letter",
  "CompanyStorySection requires a structured content object",
  "CompanyStorySection requires non-empty title and description values",
  "CompanyStorySection does not expose public slots",
  "CompanyStorySection contains duplicate item id",
  "CompanyStorySection Timeline requires a supplied date or period label for every item",
  "CompanyStorySection Values does not accept item labels",
  'class:list={["l-section", "company-story-section", className]}',
  'data-section-family="company"',
  'data-section-type="company-story"',
  "data-section-variant={variant}",
  "data-company-story-items",
  "<ContentBlock",
  'variant === "about" || variant === "timeline" ? "ol" : "ul"',
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(companyStorySource, contract, companyStorySourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  "Timeline.astro",
  'variant?: "desktop"',
  'variant?: "mobile"',
  "fetch(",
  "localStorage",
]) {
  if (companyStorySource.includes(forbidden)) {
    errors.push(
      `${companyStorySourcePath} contains forbidden contract: ${forbidden}`,
    );
  }
}

const teamSourcePath =
  "src/components/organisms/sections/company/TeamSection.astro";
const teamSource = read(teamSourcePath);
for (const contract of [
  'import TeamMemberCard from "../../../molecules/cards/TeamMemberCard.astro"',
  'import ContentBlock from "../../../molecules/content/ContentBlock.astro"',
  "export type TeamSectionVariant",
  '"team" | "leadership"',
  "TeamSection id must be selector-safe and start with a letter",
  "TeamSection requires a structured content object",
  "TeamSection requires non-empty title and description values",
  "TeamSection does not expose public slots",
  "TeamSection contains duplicate member id",
  "TeamSection Leadership requires a supplied description for every member",
  "TeamSection Team does not accept member descriptions",
  "TeamSection member",
  "requires a safe supplied href",
  'class:list={["l-section", "team-section", className]}',
  'data-section-family="company"',
  'data-section-type="team"',
  "data-section-variant={variant}",
  "data-team-members",
  "<ContentBlock",
  "<TeamMemberCard",
  '<ul class="team-section__members">',
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(teamSource, contract, teamSourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  '"culture"',
  'variant?: "desktop"',
  'variant?: "mobile"',
  "fetch(",
  "localStorage",
]) {
  if (teamSource.includes(forbidden)) {
    errors.push(`${teamSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const careersSourcePath =
  "src/components/organisms/sections/company/CareersSection.astro";
const careersSource = read(careersSourcePath);
for (const contract of [
  'import JobCard from "../../../molecules/cards/JobCard.astro"',
  'import ContentBlock from "../../../molecules/content/ContentBlock.astro"',
  'export type CareersSectionVariant = "overview" | "job-list"',
  "CareersSection id must be selector-safe and start with a letter",
  "CareersSection requires a structured content object",
  "CareersSection requires non-empty title and description values",
  "CareersSection does not expose public slots",
  "CareersSection contains duplicate job id",
  "CareersSection contains duplicate job destination",
  "CareersSection Overview requires a supplied description for every job",
  "CareersSection Job List does not accept job descriptions",
  "requires a safe HTTPS or root-relative href",
  'class:list={["l-section", "careers-section", className]}',
  'data-section-family="company"',
  'data-section-type="careers"',
  "data-section-variant={variant}",
  "data-careers-jobs",
  "<ContentBlock",
  "<JobCard",
  '<ul class="careers-section__jobs">',
  '@media (width < 64rem)',
  '@media (width < 40rem)',
]) {
  requireContract(careersSource, contract, careersSourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
  "fetch(",
  "localStorage",
  "<form",
]) {
  if (careersSource.includes(forbidden)) {
    errors.push(
      `${careersSourcePath} contains forbidden contract: ${forbidden}`,
    );
  }
}

const companyContactSourcePath =
  "src/components/organisms/sections/company/CompanyContactSection.astro";
const companyContactSource = read(companyContactSourcePath);
for (const contract of [
  'import ContentBlock from "../../../molecules/content/ContentBlock.astro"',
  "export type CompanyContactSectionVariant",
  '"locations" | "contact" | "press"',
  "CompanyContactSection id must be selector-safe and start with a letter",
  "CompanyContactSection requires a structured content object",
  "CompanyContactSection requires non-empty title and description values",
  "CompanyContactSection Contact requires one canonical Form in the form slot",
  "CompanyContactSection form slot is supported only by Contact",
  "CompanyContactSection Locations require one to four address lines per item",
  "CompanyContactSection address content is supported only by Locations",
  "CompanyContactSection contains duplicate item id",
  "CompanyContactSection item",
  "requires a non-empty label and safe supplied href",
  "contains a duplicate destination",
  'class:list={["l-section", "company-contact-section", className]}',
  'data-section-family="company"',
  'data-section-type="company-contact"',
  "data-section-variant={variant}",
  "data-company-contact-item",
  "data-company-contact-form",
  "<ContentBlock",
  "<address>",
  '<slot name="form"',
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(companyContactSource, contract, companyContactSourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
  "fetch(",
  "localStorage",
  "<form",
]) {
  if (companyContactSource.includes(forbidden)) {
    errors.push(
      `${companyContactSourcePath} contains forbidden contract: ${forbidden}`,
    );
  }
}

const faqSourcePath =
  "src/components/organisms/sections/content-resources/FaqSection.astro";
const faqSource = read(faqSourcePath);
for (const contract of [
  'import Accordion from "../../../molecules/disclosure/Accordion.astro"',
  'import ContentBlock from "../../../molecules/content/ContentBlock.astro"',
  "export type FaqSectionVariant",
  '"stacked" | "split"',
  "FaqSection id must be selector-safe and start with a letter",
  "FaqSection requires a structured content object",
  "FaqSection requires non-empty title and description values",
  "FaqSection requires at least two FAQ items",
  "FaqSection supports at most twelve FAQ items",
  "FaqSection contains duplicate item id",
  "requires non-empty question and answer strings",
  "cannot be disabled and initially open",
  "FaqSection with closeSiblings=true supports at most one initially open item",
  "FaqSection does not expose public slots",
  'class:list={["l-section", "faq-section", className]}',
  'data-section-family="content-resources"',
  'data-section-type="faq"',
  "data-section-variant={variant}",
  "data-faq-items",
  "<ContentBlock",
  "<Accordion",
  "@media (width < 64rem)",
]) {
  requireContract(faqSource, contract, faqSourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
  "fetch(",
  "localStorage",
  "<button",
  'role="region"',
]) {
  if (faqSource.includes(forbidden)) {
    errors.push(`${faqSourcePath} contains forbidden contract: ${forbidden}`);
  }
}

const contentListingSourcePath =
  "src/components/organisms/sections/content-resources/ContentListingSection.astro";
const contentListingSource = read(contentListingSourcePath);
for (const contract of [
  'import ArticleCard from "../../../molecules/cards/ArticleCard.astro"',
  'import ContentBlock from "../../../molecules/content/ContentBlock.astro"',
  'import SearchInput from "../../../molecules/forms/SearchInput.astro"',
  'import Pagination from "../../../molecules/navigation/Pagination.astro"',
  "export type ContentListingSectionVariant",
  '"featured" | "grid" | "list" | "categories"',
  "ContentListingSection id must be selector-safe and start with a letter",
  "ContentListingSection requires a structured content object",
  "ContentListingSection requires non-empty title and description values",
  "ContentListingSection does not expose public slots",
  "ContentListingSection contains duplicate article id",
  "ContentListingSection contains duplicate article destination",
  "requires a safe HTTPS or root-relative href",
  "ContentListingSection Featured requires an excerpt for the first article",
  "ContentListingSection Featured accepts an excerpt only on the first article",
  "ContentListingSection Grid requires an excerpt for every article",
  "does not accept article excerpts",
  "ContentListingSection Categories requires two to six unique categories",
  "ContentListingSection Categories requires non-empty search label",
  "ContentListingSection pagination is supported only by Grid and List",
  'class:list={["l-section", "content-listing-section", className]}',
  'data-section-family="content-resources"',
  'data-section-type="content-listing"',
  "data-section-variant={variant}",
  "data-content-listing-articles",
  "<ContentBlock",
  "<ArticleCard",
  "<SearchInput",
  "<Pagination",
  '<ul class="content-listing-section__articles">',
  "data-content-listing-directory",
  "data-content-listing-empty",
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(
    contentListingSource,
    contract,
    contentListingSourcePath,
  );
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
  "fetch(",
  "localStorage",
  "sessionStorage",
]) {
  if (contentListingSource.includes(forbidden)) {
    errors.push(
      `${contentListingSourcePath} contains forbidden contract: ${forbidden}`,
    );
  }
}

const resourceLibrarySourcePath =
  "src/components/organisms/sections/content-resources/ResourceLibrarySection.astro";
const resourceLibrarySource = read(resourceLibrarySourcePath);
for (const contract of [
  'import ResourceCard from "../../../molecules/cards/ResourceCard.astro"',
  'import ContentBlock from "../../../molecules/content/ContentBlock.astro"',
  'import SearchInput from "../../../molecules/forms/SearchInput.astro"',
  'import Pagination from "../../../molecules/navigation/Pagination.astro"',
  "export type ResourceLibrarySectionVariant",
  '"library" | "guides" | "ebooks"',
  "ResourceLibrarySection id must be selector-safe and start with a letter",
  "ResourceLibrarySection requires a structured content object",
  "ResourceLibrarySection requires non-empty title and description values",
  "ResourceLibrarySection does not expose public slots",
  "ResourceLibrarySection contains duplicate resource id",
  "ResourceLibrarySection contains duplicate resource destination",
  "requires a safe HTTPS or root-relative href",
  "ResourceLibrarySection Guides accepts only guide resources",
  "ResourceLibrarySection Ebooks accepts only ebook resources",
  "ResourceLibrarySection Library requires non-empty search label",
  "ResourceLibrarySection search content is supported only by Library",
  "ResourceLibrarySection pagination is supported only by Guides and Ebooks",
  'class:list={["l-section", "resource-library-section", className]}',
  'data-section-family="content-resources"',
  'data-section-type="resource-library"',
  "data-section-variant={variant}",
  "data-resource-library-resources",
  "<ContentBlock",
  "<ResourceCard",
  "<SearchInput",
  "<Pagination",
  '<ul class="resource-library-section__resources">',
  "data-resource-library-directory",
  "data-resource-library-empty",
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(
    resourceLibrarySource,
    contract,
    resourceLibrarySourcePath,
  );
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
  "fetch(",
  "localStorage",
  "sessionStorage",
]) {
  if (resourceLibrarySource.includes(forbidden)) {
    errors.push(
      `${resourceLibrarySourcePath} contains forbidden contract: ${forbidden}`,
    );
  }
}

const eventsSourcePath =
  "src/components/organisms/sections/content-resources/EventsSection.astro";
const eventsSource = read(eventsSourcePath);
for (const contract of [
  'import ResourceCard from "../../../molecules/cards/ResourceCard.astro"',
  'import ContentBlock from "../../../molecules/content/ContentBlock.astro"',
  'import Carousel from "../../media/Carousel.astro"',
  "export type EventsSectionVariant",
  '"webinars" | "events" | "podcast"',
  "EventsSection id must be selector-safe and start with a letter",
  "EventsSection requires a structured content object",
  "EventsSection requires non-empty title and description values",
  "EventsSection does not expose public slots",
  "EventsSection Webinars does not accept collectionLabel",
  "EventsSection Events and Podcast require a non-empty collectionLabel",
  "EventsSection contains duplicate item id",
  "EventsSection contains duplicate item destination",
  "requires a safe HTTPS or root-relative href",
  'class:list={["l-section", "events-section", className]}',
  'data-section-family="content-resources"',
  'data-section-type="events"',
  "data-section-variant={variant}",
  "data-events-items",
  "<ContentBlock",
  "<ResourceCard",
  "<Carousel",
  '<ul class="events-section__webinars">',
  'variant={variant === "events" ? "multi-item" : "single"}',
  "@media (width < 48rem)",
  "@media (width < 40rem)",
]) {
  requireContract(eventsSource, contract, eventsSourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
  "fetch(",
  "localStorage",
  "sessionStorage",
]) {
  if (eventsSource.includes(forbidden)) {
    errors.push(
      `${eventsSourcePath} contains forbidden contract: ${forbidden}`,
    );
  }
}

const changelogSourcePath =
  "src/components/organisms/sections/content-resources/ChangelogSection.astro";
const changelogSource = read(changelogSourcePath);
for (const contract of [
  'import ArticleCard from "../../../molecules/cards/ArticleCard.astro"',
  'import ContentBlock from "../../../molecules/content/ContentBlock.astro"',
  'import Pagination from "../../../molecules/navigation/Pagination.astro"',
  "export type ChangelogSectionVariant",
  '"changelog" | "newsletter-archive"',
  "ChangelogSection id must be selector-safe and start with a letter",
  "ChangelogSection requires a structured content object",
  "ChangelogSection requires non-empty title and description values",
  "ChangelogSection does not expose public slots",
  "ChangelogSection contains duplicate entry id",
  "ChangelogSection contains duplicate entry destination",
  "requires a valid YYYY-MM-DD publishedDate",
  "entries must be ordered newest first by publishedDate",
  "ChangelogSection Changelog does not accept entry excerpts or media",
  "ChangelogSection Newsletter Archive requires an excerpt for every entry",
  "pagination requires a valid currentPage, totalPages of at least two, and safe basePath",
  'class:list={["l-section", "changelog-section", className]}',
  'data-section-family="content-resources"',
  'data-section-type="changelog"',
  "data-section-variant={variant}",
  "data-changelog-entries",
  "<ContentBlock",
  "<ArticleCard",
  "<Pagination",
  '<ul class="changelog-section__entries">',
  'variant="compact"',
  'variant="standard"',
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(changelogSource, contract, changelogSourcePath);
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
  "fetch(",
  "localStorage",
  "sessionStorage",
]) {
  if (changelogSource.includes(forbidden)) {
    errors.push(
      `${changelogSourcePath} contains forbidden contract: ${forbidden}`,
    );
  }
}

const productComparisonSourcePath =
  "src/components/organisms/sections/product-communication/ProductComparisonSection.astro";
const productComparisonSource = read(productComparisonSourcePath);
for (const contract of [
  'import Button from "../../../atoms/actions/Button.astro"',
  'import ContentBlock from "../../../molecules/content/ContentBlock.astro"',
  'import ComparisonTable from "../../data-display/ComparisonTable.astro"',
  "export type ProductComparisonSectionVariant",
  '"comparison" | "alternatives"',
  "ProductComparisonSection id must be selector-safe and start with a letter",
  "ProductComparisonSection requires a structured content object",
  "ProductComparisonSection requires non-empty title, description, and caption values",
  "ProductComparisonSection requires two to four comparison columns",
  "ProductComparisonSection requires two to twelve comparison rows",
  "ProductComparisonSection contains duplicate column key",
  "ProductComparisonSection supports at most one highlighted column",
  "ProductComparisonSection contains duplicate row label",
  "must define exactly one value for every column",
  "contains an empty text value",
  "one-to-eighteen-character label",
  "ProductComparisonSection does not expose public slots",
  'class:list={["l-section", "product-comparison-section", className]}',
  'data-section-family="product-communication"',
  'data-section-type="product-comparison"',
  "data-section-variant={variant}",
  "data-comparison-columns",
  "data-comparison-rows",
  "<ContentBlock",
  "<ComparisonTable",
  "<Button",
  'grid-template-columns: minmax(0, 1fr)',
  "@media (width < 64rem)",
  "@media (width < 40rem)",
]) {
  requireContract(
    productComparisonSource,
    contract,
    productComparisonSourcePath,
  );
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
  "fetch(",
  "localStorage",
  "<table",
  "<caption",
]) {
  if (productComparisonSource.includes(forbidden)) {
    errors.push(
      `${productComparisonSourcePath} contains forbidden contract: ${forbidden}`,
    );
  }
}

const productAnnouncementSourcePath =
  "src/components/organisms/sections/product-communication/ProductAnnouncementSection.astro";
const productAnnouncementSource = read(productAnnouncementSourcePath);
for (const contract of [
  'import Alert from "../../../molecules/data-display/Alert.astro"',
  'import CalloutCard from "../../cards/CalloutCard.astro"',
  'import NavBanner from "../../navigation/NavBanner.astro"',
  "export type ProductAnnouncementSectionVariant",
  '"launch" | "promotion" | "status"',
  "ProductAnnouncementSection id must be selector-safe and start with a letter",
  "ProductAnnouncementSection requires a structured content object",
  "ProductAnnouncementSection requires a non-empty title",
  "ProductAnnouncementSection does not expose public slots",
  "ProductAnnouncementSection action requires a one-to-eighteen-character label and safe supplied href",
  "ProductAnnouncementSection Launch requires a non-empty eyebrow and one action",
  "ProductAnnouncementSection Launch rejects description, dismissible, and statusTone content",
  "ProductAnnouncementSection Promotion rejects eyebrow, visual, and statusTone content",
  "ProductAnnouncementSection Status requires a non-empty description",
  "ProductAnnouncementSection Status rejects eyebrow, action, and visual content",
  'class:list={["l-section", "product-announcement-section", className]}',
  'data-section-family="product-communication"',
  'data-section-type="product-announcement"',
  "data-section-variant={variant}",
  "data-announcement-dismissible",
  "<CalloutCard",
  "<NavBanner",
  "<Alert",
  'variant="notification"',
]) {
  requireContract(
    productAnnouncementSource,
    contract,
    productAnnouncementSourcePath,
  );
}
for (const forbidden of [
  '<slot name="actions"',
  '<slot name="media"',
  '<slot name="default"',
  'variant?: "desktop"',
  'variant?: "mobile"',
  "fetch(",
  "localStorage",
]) {
  if (productAnnouncementSource.includes(forbidden)) {
    errors.push(
      `${productAnnouncementSourcePath} contains forbidden contract: ${forbidden}`,
    );
  }
}

const registryPath = "src/data/design-system/componentArchitecture.json";
const registry = JSON.parse(read(registryPath) || "{}");
const sectionRecords = (registry.components ?? []).filter(
  (entry) => entry.family === "sections"
);
if (sectionRecords.length !== 36) {
  errors.push(
    `Expected exactly thirty-six public Website Sections registry records, found ${sectionRecords.length}.`
  );
}
if (
  sectionRecords.filter((entry) => entry.status === "ready").length !== 35 ||
  sectionRecords.filter((entry) => entry.status === "review").length !== 1
) {
  errors.push(
    "Expected thirty-five ready Website Sections and exactly one review record.",
  );
}
const record = sectionRecords.find(
  (entry) => entry.name === "AnnouncementBarSection"
);
if (
  !record ||
  record.layer !== "organism" ||
  record.status !== "ready" ||
  record.sourcePath !== sourcePath ||
  record.docsAnchor !== "website-sections-global-shell-announcement-bar"
) {
  errors.push("AnnouncementBarSection registry identity or readiness drifted.");
}
for (const prop of [
  "title",
  "description",
  "href",
  "actionLabel",
  "dismissible",
  "variant",
  "sectionId",
  "ariaLabel",
  "componentName",
  "native section attributes"
]) {
  if (!record?.props?.includes(prop)) {
    errors.push(`AnnouncementBarSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-preview-target"
]) {
  if (!record?.attributes?.includes(attribute)) {
    errors.push(
      `AnnouncementBarSection registry record is missing attribute: ${attribute}`
    );
  }
}
if (
  record?.variants?.join("|") !== "neutral|accent" ||
  record?.uses?.join("|") !== "NavBanner"
) {
  errors.push("AnnouncementBarSection variants or dependency drifted.");
}

const marketingRecord = sectionRecords.find(
  (entry) => entry.name === "MarketingNavigationSection"
);
if (
  !marketingRecord ||
  marketingRecord.layer !== "organism" ||
  marketingRecord.status !== "ready" ||
  marketingRecord.sourcePath !== marketingSourcePath ||
  marketingRecord.docsAnchor !==
    "website-sections-global-shell-marketing-navigation"
) {
  errors.push("MarketingNavigationSection registry identity or readiness drifted.");
}
for (const prop of [
  "content",
  "variant",
  "sectionId",
  "ariaLabel",
  "componentName",
  "preview",
  "native section attributes",
  "brand slot"
]) {
  if (!marketingRecord?.props?.includes(prop)) {
    errors.push(
      `MarketingNavigationSection registry record is missing prop: ${prop}`
    );
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-preview-target"
]) {
  if (!marketingRecord?.attributes?.includes(attribute)) {
    errors.push(
      `MarketingNavigationSection registry record is missing attribute: ${attribute}`
    );
  }
}
if (
  marketingRecord?.variants?.join("|") !== "simple|centered|mega-enabled" ||
  marketingRecord?.uses?.join("|") !== "MarketingNavbar" ||
  marketingRecord?.slots?.join("|") !== "brand"
) {
  errors.push("MarketingNavigationSection variants, dependency, or slot drifted.");
}

const subnavigationRecord = sectionRecords.find(
  (entry) => entry.name === "SubnavigationSection"
);
if (
  !subnavigationRecord ||
  subnavigationRecord.layer !== "organism" ||
  subnavigationRecord.status !== "ready" ||
  subnavigationRecord.sourcePath !== subnavigationSourcePath ||
  subnavigationRecord.docsAnchor !==
    "website-sections-global-shell-subnavigation"
) {
  errors.push("SubnavigationSection registry identity or readiness drifted.");
}
for (const prop of [
  "content",
  "variant",
  "sectionId",
  "ariaLabel",
  "componentName",
  "native section attributes"
]) {
  if (!subnavigationRecord?.props?.includes(prop)) {
    errors.push(`SubnavigationSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-preview-target"
]) {
  if (!subnavigationRecord?.attributes?.includes(attribute)) {
    errors.push(
      `SubnavigationSection registry record is missing attribute: ${attribute}`
    );
  }
}
if (
  subnavigationRecord?.variants?.join("|") !== "underline|pills" ||
  subnavigationRecord?.uses?.join("|") !== "Subnavigation" ||
  (subnavigationRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("SubnavigationSection variants, dependency, or slot drifted.");
}

const footerRecord = sectionRecords.find(
  (entry) => entry.name === "FooterSection"
);
if (
  !footerRecord ||
  footerRecord.layer !== "organism" ||
  footerRecord.status !== "ready" ||
  footerRecord.sourcePath !== footerSourcePath ||
  footerRecord.docsAnchor !== "website-sections-global-shell-footer"
) {
  errors.push("FooterSection registry identity or readiness drifted.");
}
for (const prop of [
  "content",
  "variant",
  "sectionId",
  "ariaLabel",
  "componentName",
  "native footer attributes",
  "brand slot"
]) {
  if (!footerRecord?.props?.includes(prop)) {
    errors.push(`FooterSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-footer",
  "data-footer-variant",
  "data-preview-target"
]) {
  if (!footerRecord?.attributes?.includes(attribute)) {
    errors.push(`FooterSection registry record is missing attribute: ${attribute}`);
  }
}
if (
  footerRecord?.variants?.join("|") !== "simple|columns|cta|legal" ||
  footerRecord?.uses?.join("|") !== "Footer" ||
  footerRecord?.slots?.join("|") !== "brand"
) {
  errors.push("FooterSection variants, dependency, or slot drifted.");
}

const cookieConsentRecord = sectionRecords.find(
  (entry) => entry.name === "CookieConsentSection"
);
if (
  !cookieConsentRecord ||
  cookieConsentRecord.layer !== "organism" ||
  cookieConsentRecord.status !== "ready" ||
  cookieConsentRecord.sourcePath !== cookieConsentSourcePath ||
  cookieConsentRecord.docsAnchor !==
    "website-sections-global-shell-cookie-consent"
) {
  errors.push("CookieConsentSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "open",
  "preview",
  "ariaLabel",
  "componentName",
  "native section attributes"
]) {
  if (!cookieConsentRecord?.props?.includes(prop)) {
    errors.push(`CookieConsentSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-cookie-consent",
  "data-cookie-consent-preview",
  "data-cookie-consent-state",
  "data-cookie-consent-choice",
  "data-preview-target"
]) {
  if (!cookieConsentRecord?.attributes?.includes(attribute)) {
    errors.push(
      `CookieConsentSection registry record is missing attribute: ${attribute}`
    );
  }
}
if (
  cookieConsentRecord?.variants?.join("|") !== "banner|modal" ||
  cookieConsentRecord?.uses?.join("|") !== "Button|ButtonGroup" ||
  (cookieConsentRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("CookieConsentSection variants, dependencies, or slots drifted.");
}

const heroRecord = sectionRecords.find((entry) => entry.name === "HeroSection");
if (
  !heroRecord ||
  heroRecord.layer !== "organism" ||
  heroRecord.status !== "ready" ||
  heroRecord.sourcePath !== heroSourcePath ||
  heroRecord.docsAnchor !== "website-sections-hero-headers-hero"
) {
  errors.push("HeroSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "mediaRatio",
  "ariaLabel",
  "componentName",
  "native section attributes"
]) {
  if (!heroRecord?.props?.includes(prop)) {
    errors.push(`HeroSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-preview-target"
]) {
  if (!heroRecord?.attributes?.includes(attribute)) {
    errors.push(`HeroSection registry record is missing attribute: ${attribute}`);
  }
}
if (
  heroRecord?.variants?.join("|") !==
    "centered|split|product-mockup|media|lead-capture|launch-event" ||
  heroRecord?.uses?.join("|") !==
    "Eyebrow|Button|ButtonGroup|MediaRatio|Form" ||
  heroRecord?.slots?.join("|") !== "media|form"
) {
  errors.push("HeroSection variants, dependencies, or slots drifted.");
}

const pageHeaderRecord = sectionRecords.find(
  (entry) => entry.name === "PageHeaderSection"
);
if (
  !pageHeaderRecord ||
  pageHeaderRecord.layer !== "organism" ||
  pageHeaderRecord.status !== "ready" ||
  pageHeaderRecord.sourcePath !== pageHeaderSourcePath ||
  pageHeaderRecord.docsAnchor !== "website-sections-hero-headers-page-header"
) {
  errors.push("PageHeaderSection registry identity or readiness drifted.");
}
for (const prop of [
  "content",
  "sectionId",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!pageHeaderRecord?.props?.includes(prop)) {
    errors.push(`PageHeaderSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-preview-target",
]) {
  if (!pageHeaderRecord?.attributes?.includes(attribute)) {
    errors.push(`PageHeaderSection registry record is missing attribute: ${attribute}`);
  }
}
if (
  pageHeaderRecord?.variants?.join("|") !== "standard|breadcrumbs" ||
  pageHeaderRecord?.uses?.join("|") !== "PageHeader|Breadcrumbs" ||
  pageHeaderRecord?.slots?.join("|") !== "support"
) {
  errors.push("PageHeaderSection derived variants, dependencies, or slot drifted.");
}

const logoCloudRecord = sectionRecords.find(
  (entry) => entry.name === "LogoCloudSection"
);
if (
  !logoCloudRecord ||
  logoCloudRecord.layer !== "organism" ||
  logoCloudRecord.status !== "ready" ||
  logoCloudRecord.sourcePath !== logoCloudSourcePath ||
  logoCloudRecord.docsAnchor !==
    "website-sections-brand-social-proof-logo-cloud"
) {
  errors.push("LogoCloudSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!logoCloudRecord?.props?.includes(prop)) {
    errors.push(`LogoCloudSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-preview-target",
]) {
  if (!logoCloudRecord?.attributes?.includes(attribute)) {
    errors.push(`LogoCloudSection registry record is missing attribute: ${attribute}`);
  }
}
if (
  logoCloudRecord?.variants?.join("|") !== "static|carousel" ||
  logoCloudRecord?.uses?.join("|") !== "Logo|Carousel" ||
  (logoCloudRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("LogoCloudSection variants, dependencies, or slots drifted.");
}

const trustSignalsRecord = sectionRecords.find(
  (entry) => entry.name === "TrustSignalsSection"
);
if (
  !trustSignalsRecord ||
  trustSignalsRecord.layer !== "organism" ||
  trustSignalsRecord.status !== "ready" ||
  trustSignalsRecord.sourcePath !== trustSignalsSourcePath ||
  trustSignalsRecord.docsAnchor !==
    "website-sections-brand-social-proof-trust-signals"
) {
  errors.push("TrustSignalsSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!trustSignalsRecord?.props?.includes(prop)) {
    errors.push(`TrustSignalsSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-preview-target",
]) {
  if (!trustSignalsRecord?.attributes?.includes(attribute)) {
    errors.push(`TrustSignalsSection registry record is missing attribute: ${attribute}`);
  }
}
if (
  trustSignalsRecord?.variants?.join("|") !== "ratings|badges|awards" ||
  trustSignalsRecord?.uses?.join("|") !== "Rating|TrustBadge" ||
  (trustSignalsRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("TrustSignalsSection variants, dependencies, or slots drifted.");
}

const testimonialRecord = sectionRecords.find(
  (entry) => entry.name === "TestimonialSection"
);
if (
  !testimonialRecord ||
  testimonialRecord.layer !== "organism" ||
  testimonialRecord.status !== "ready" ||
  testimonialRecord.sourcePath !== testimonialSourcePath ||
  testimonialRecord.docsAnchor !==
    "website-sections-brand-social-proof-testimonials"
) {
  errors.push("TestimonialSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!testimonialRecord?.props?.includes(prop)) {
    errors.push(`TestimonialSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-preview-target",
]) {
  if (!testimonialRecord?.attributes?.includes(attribute)) {
    errors.push(`TestimonialSection registry record is missing attribute: ${attribute}`);
  }
}
if (
  testimonialRecord?.variants?.join("|") !==
    "single|grid|carousel|customer-results" ||
  testimonialRecord?.uses?.join("|") !==
    "TestimonialCard|Carousel|StatCard" ||
  (testimonialRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("TestimonialSection variants, dependencies, or slots drifted.");
}

const caseStudyRecord = sectionRecords.find(
  (entry) => entry.name === "CaseStudySection"
);
if (
  !caseStudyRecord ||
  caseStudyRecord.layer !== "organism" ||
  caseStudyRecord.status !== "ready" ||
  caseStudyRecord.sourcePath !== caseStudySourcePath ||
  caseStudyRecord.docsAnchor !==
    "website-sections-brand-social-proof-case-studies"
) {
  errors.push("CaseStudySection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!caseStudyRecord?.props?.includes(prop)) {
    errors.push(`CaseStudySection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-preview-target",
]) {
  if (!caseStudyRecord?.attributes?.includes(attribute)) {
    errors.push(`CaseStudySection registry record is missing attribute: ${attribute}`);
  }
}
if (
  caseStudyRecord?.variants?.join("|") !== "highlight|grid" ||
  caseStudyRecord?.uses?.join("|") !== "CaseStudyCard|Button" ||
  (caseStudyRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("CaseStudySection variants, dependencies, or slots drifted.");
}

const featureRecord = sectionRecords.find(
  (entry) => entry.name === "FeatureSection"
);
if (
  !featureRecord ||
  featureRecord.layer !== "organism" ||
  featureRecord.status !== "ready" ||
  featureRecord.sourcePath !== featureSourcePath ||
  featureRecord.docsAnchor !==
    "website-sections-features-product-demo-features"
) {
  errors.push("FeatureSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "tabsOrientation",
  "selectedItemId",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!featureRecord?.props?.includes(prop)) {
    errors.push(`FeatureSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-preview-target",
]) {
  if (!featureRecord?.attributes?.includes(attribute)) {
    errors.push(`FeatureSection registry record is missing attribute: ${attribute}`);
  }
}
if (
  featureRecord?.variants?.join("|") !==
    "grid|list|alternating|bento|tabs|comparison" ||
  featureRecord?.uses?.join("|") !==
    "FeatureCard|Tabs|ComparisonTable" ||
  (featureRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("FeatureSection variants, dependencies, or slots drifted.");
}

const productDemoRecord = sectionRecords.find(
  (entry) => entry.name === "ProductDemoSection"
);
if (
  !productDemoRecord ||
  productDemoRecord.layer !== "organism" ||
  productDemoRecord.status !== "ready" ||
  productDemoRecord.sourcePath !== productDemoSourcePath ||
  productDemoRecord.docsAnchor !==
    "website-sections-features-product-demo-product-demo"
) {
  errors.push("ProductDemoSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "ratio",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!productDemoRecord?.props?.includes(prop)) {
    errors.push(`ProductDemoSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-preview-target",
]) {
  if (!productDemoRecord?.attributes?.includes(attribute)) {
    errors.push(
      `ProductDemoSection registry record is missing attribute: ${attribute}`
    );
  }
}
if (
  productDemoRecord?.variants?.join("|") !==
    "screenshot|interactive|video|before-after" ||
  productDemoRecord?.uses?.join("|") !==
    "MediaRatio|VideoPlayer|BeforeAfterSlider" ||
  productDemoRecord?.slots?.join("|") !== "media"
) {
  errors.push("ProductDemoSection variants, dependencies, or slot drifted.");
}

const processRecord = sectionRecords.find(
  (entry) => entry.name === "ProcessSection"
);
if (
  !processRecord ||
  processRecord.layer !== "organism" ||
  processRecord.status !== "ready" ||
  processRecord.sourcePath !== processSourcePath ||
  processRecord.docsAnchor !==
    "website-sections-how-it-works-use-cases-process"
) {
  errors.push("ProcessSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!processRecord?.props?.includes(prop)) {
    errors.push(`ProcessSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-process-step",
  "data-preview-target",
]) {
  if (!processRecord?.attributes?.includes(attribute)) {
    errors.push(`ProcessSection registry record is missing attribute: ${attribute}`);
  }
}
if (
  processRecord?.variants?.join("|") !==
    "numbered-steps|cards|timeline|sticky|workflow-diagram" ||
  processRecord?.uses?.join("|") !==
    "Eyebrow|PanelPatternVisualSystem" ||
  (processRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("ProcessSection variants, dependencies, or slots drifted.");
}

const useCasesRecord = sectionRecords.find(
  (entry) => entry.name === "UseCasesSection"
);
if (
  !useCasesRecord ||
  useCasesRecord.layer !== "organism" ||
  useCasesRecord.status !== "ready" ||
  useCasesRecord.sourcePath !== useCasesSourcePath ||
  useCasesRecord.docsAnchor !==
    "website-sections-how-it-works-use-cases-use-cases"
) {
  errors.push("UseCasesSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "tabsOrientation",
  "selectedItemId",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!useCasesRecord?.props?.includes(prop)) {
    errors.push(`UseCasesSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-use-case-item",
  "data-preview-target",
]) {
  if (!useCasesRecord?.attributes?.includes(attribute)) {
    errors.push(`UseCasesSection registry record is missing attribute: ${attribute}`);
  }
}
if (
  useCasesRecord?.variants?.join("|") !==
    "role-based|industry|scenario-tabs" ||
  useCasesRecord?.uses?.join("|") !== "UseCaseCard|Tabs" ||
  (useCasesRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("UseCasesSection variants, dependencies, or slots drifted.");
}

const statsRecord = sectionRecords.find(
  (entry) => entry.name === "StatsSection"
);
if (
  !statsRecord ||
  statsRecord.layer !== "organism" ||
  statsRecord.status !== "ready" ||
  statsRecord.sourcePath !== statsSourcePath ||
  statsRecord.docsAnchor !== "website-sections-stats-customer-proof-stats"
) {
  errors.push("StatsSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!statsRecord?.props?.includes(prop)) {
    errors.push(`StatsSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-stat-metric",
  "data-preview-target",
]) {
  if (!statsRecord?.attributes?.includes(attribute)) {
    errors.push(`StatsSection registry record is missing attribute: ${attribute}`);
  }
}
if (
  statsRecord?.variants?.join("|") !==
    "kpi-band|grid|metric-cards|milestones" ||
  statsRecord?.uses?.join("|") !== "StatCard" ||
  (statsRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("StatsSection variants, dependencies, or slots drifted.");
}

const dataStoryRecord = sectionRecords.find(
  (entry) => entry.name === "DataStorySection"
);
if (
  !dataStoryRecord ||
  dataStoryRecord.layer !== "organism" ||
  dataStoryRecord.status !== "ready" ||
  dataStoryRecord.sourcePath !== dataStorySourcePath ||
  dataStoryRecord.docsAnchor !==
    "website-sections-stats-customer-proof-data-story"
) {
  errors.push("DataStorySection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!dataStoryRecord?.props?.includes(prop)) {
    errors.push(`DataStorySection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-data-story-metric",
  "data-preview-target",
]) {
  if (!dataStoryRecord?.attributes?.includes(attribute)) {
    errors.push(`DataStorySection registry record is missing attribute: ${attribute}`);
  }
}
if (
  dataStoryRecord?.variants?.join("|") !==
    "benchmark|data-story|customer-results|roi-result" ||
  dataStoryRecord?.uses?.join("|") !== "StatCard|ComparisonTable" ||
  (dataStoryRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("DataStorySection variants, dependencies, or slots drifted.");
}

const pricingRecord = sectionRecords.find(
  (entry) => entry.name === "PricingSection"
);
if (
  !pricingRecord ||
  pricingRecord.layer !== "organism" ||
  pricingRecord.status !== "ready" ||
  pricingRecord.sourcePath !== pricingSourcePath ||
  pricingRecord.docsAnchor !== "website-sections-pricing-comparison-pricing"
) {
  errors.push("PricingSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!pricingRecord?.props?.includes(prop)) {
    errors.push(`PricingSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-pricing-period-active",
  "data-pricing-period",
  "data-pricing-plan",
  "data-preview-target",
]) {
  if (!pricingRecord?.attributes?.includes(attribute)) {
    errors.push(`PricingSection registry record is missing attribute: ${attribute}`);
  }
}
if (
  pricingRecord?.variants?.join("|") !== "tiers|toggle|usage-based" ||
  pricingRecord?.uses?.join("|") !== "PricingCard|SwitchButton" ||
  (pricingRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("PricingSection variants, dependencies, or slots drifted.");
}

const pricingComparisonRecord = sectionRecords.find(
  (entry) => entry.name === "PricingComparisonSection"
);
if (
  !pricingComparisonRecord ||
  pricingComparisonRecord.layer !== "organism" ||
  pricingComparisonRecord.status !== "ready" ||
  pricingComparisonRecord.sourcePath !== pricingComparisonSourcePath ||
  pricingComparisonRecord.docsAnchor !==
    "website-sections-pricing-comparison-pricing-comparison"
) {
  errors.push("PricingComparisonSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!pricingComparisonRecord?.props?.includes(prop)) {
    errors.push(
      `PricingComparisonSection registry record is missing prop: ${prop}`,
    );
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-pricing-comparison-plan",
  "data-preview-target",
]) {
  if (!pricingComparisonRecord?.attributes?.includes(attribute)) {
    errors.push(
      `PricingComparisonSection registry record is missing attribute: ${attribute}`,
    );
  }
}
if (
  pricingComparisonRecord?.variants?.join("|") !==
    "feature-matrix|add-ons|enterprise-cta" ||
  pricingComparisonRecord?.uses?.join("|") !==
    "ComparisonTable|PricingCard|Button" ||
  (pricingComparisonRecord?.slots?.length ?? 0) !== 0
) {
  errors.push(
    "PricingComparisonSection variants, dependencies, or slots drifted.",
  );
}

const pricingFaqRecord = sectionRecords.find(
  (entry) => entry.name === "PricingFaqSection"
);
if (
  !pricingFaqRecord ||
  pricingFaqRecord.layer !== "organism" ||
  pricingFaqRecord.status !== "ready" ||
  pricingFaqRecord.sourcePath !== pricingFaqSourcePath ||
  pricingFaqRecord.docsAnchor !==
    "website-sections-pricing-comparison-pricing-faq"
) {
  errors.push("PricingFaqSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "closeSiblings",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!pricingFaqRecord?.props?.includes(prop)) {
    errors.push(`PricingFaqSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-preview-target",
]) {
  if (!pricingFaqRecord?.attributes?.includes(attribute)) {
    errors.push(
      `PricingFaqSection registry record is missing attribute: ${attribute}`,
    );
  }
}
if (
  (pricingFaqRecord?.variants?.length ?? 0) !== 0 ||
  pricingFaqRecord?.uses?.join("|") !== "Accordion" ||
  (pricingFaqRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("PricingFaqSection variants, dependencies, or slots drifted.");
}

const integrationsRecord = sectionRecords.find(
  (entry) => entry.name === "IntegrationsSection"
);
if (
  !integrationsRecord ||
  integrationsRecord.layer !== "organism" ||
  integrationsRecord.status !== "ready" ||
  integrationsRecord.sourcePath !== integrationsSourcePath ||
  integrationsRecord.docsAnchor !==
    "website-sections-integrations-security-integrations"
) {
  errors.push("IntegrationsSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!integrationsRecord?.props?.includes(prop)) {
    errors.push(`IntegrationsSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-integration-item",
  "data-integration-role",
  "data-integrations-results",
  "data-preview-target",
]) {
  if (!integrationsRecord?.attributes?.includes(attribute)) {
    errors.push(
      `IntegrationsSection registry record is missing attribute: ${attribute}`,
    );
  }
}
if (
  integrationsRecord?.variants?.join("|") !==
    "grid|directory|detail|ecosystem" ||
  integrationsRecord?.uses?.join("|") !==
    "IntegrationCard|SearchInput|Logo" ||
  (integrationsRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("IntegrationsSection variants, dependencies, or slots drifted.");
}

const developerRecord = sectionRecords.find(
  (entry) => entry.name === "DeveloperSection"
);
if (
  !developerRecord ||
  developerRecord.layer !== "organism" ||
  developerRecord.status !== "ready" ||
  developerRecord.sourcePath !== developerSourcePath ||
  developerRecord.docsAnchor !==
    "website-sections-integrations-security-developer"
) {
  errors.push("DeveloperSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!developerRecord?.props?.includes(prop)) {
    errors.push(`DeveloperSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-developer-step",
  "data-code-language",
  "data-preview-target",
]) {
  if (!developerRecord?.attributes?.includes(attribute)) {
    errors.push(
      `DeveloperSection registry record is missing attribute: ${attribute}`,
    );
  }
}
if (
  developerRecord?.variants?.join("|") !== "api|developer" ||
  developerRecord?.uses?.join("|") !== "ContentBlock" ||
  (developerRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("DeveloperSection variants, dependencies, or slots drifted.");
}

const trustRecord = sectionRecords.find(
  (entry) => entry.name === "TrustSection"
);
if (
  !trustRecord ||
  trustRecord.layer !== "organism" ||
  trustRecord.status !== "ready" ||
  trustRecord.sourcePath !== trustSourcePath ||
  trustRecord.docsAnchor !== "website-sections-integrations-security-trust"
) {
  errors.push("TrustSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!trustRecord?.props?.includes(prop)) {
    errors.push(`TrustSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-trust-claim",
  "data-trust-comparison",
  "data-preview-target",
]) {
  if (!trustRecord?.attributes?.includes(attribute)) {
    errors.push(`TrustSection registry record is missing attribute: ${attribute}`);
  }
}
if (
  trustRecord?.variants?.join("|") !==
    "security|compliance|trust-center|architecture" ||
  trustRecord?.uses?.join("|") !== "TrustBadge|ComparisonTable" ||
  (trustRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("TrustSection variants, dependencies, or slots drifted.");
}

const ctaRecord = sectionRecords.find((entry) => entry.name === "CtaSection");
if (
  !ctaRecord ||
  ctaRecord.layer !== "organism" ||
  ctaRecord.status !== "ready" ||
  ctaRecord.sourcePath !== ctaSourcePath ||
  ctaRecord.docsAnchor !== "website-sections-conversion-call-to-action"
) {
  errors.push("CtaSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!ctaRecord?.props?.includes(prop)) {
    errors.push(`CtaSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-cta-actions",
  "data-preview-target",
]) {
  if (!ctaRecord?.attributes?.includes(attribute)) {
    errors.push(`CtaSection registry record is missing attribute: ${attribute}`);
  }
}
if (
  ctaRecord?.variants?.join("|") !== "banner|card|split|full-bleed" ||
  ctaRecord?.uses?.join("|") !== "Eyebrow|ButtonGroup|Button|CalloutCard" ||
  (ctaRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("CtaSection variants, dependencies, or slots drifted.");
}

const leadCaptureRecord = sectionRecords.find(
  (entry) => entry.name === "LeadCaptureSection"
);
if (
  !leadCaptureRecord ||
  leadCaptureRecord.layer !== "organism" ||
  leadCaptureRecord.status !== "ready" ||
  leadCaptureRecord.sourcePath !== leadCaptureSourcePath ||
  leadCaptureRecord.docsAnchor !== "website-sections-conversion-lead-capture"
) {
  errors.push("LeadCaptureSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!leadCaptureRecord?.props?.includes(prop)) {
    errors.push(`LeadCaptureSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-lead-capture-actions",
  "data-preview-target",
]) {
  if (!leadCaptureRecord?.attributes?.includes(attribute)) {
    errors.push(
      `LeadCaptureSection registry record is missing attribute: ${attribute}`,
    );
  }
}
if (
  leadCaptureRecord?.variants?.join("|") !==
    "newsletter|lead-form|contact-form|demo-booking|waitlist|app-download" ||
  leadCaptureRecord?.uses?.join("|") !==
    "Eyebrow|Form|FormField|Input|ConsentField|CalComEmbed|Button|ButtonGroup" ||
  (leadCaptureRecord?.slots?.length ?? 0) !== 0
) {
  errors.push(
    "LeadCaptureSection variants, dependencies, or slots drifted.",
  );
}

const companyStoryRecord = sectionRecords.find(
  (entry) => entry.name === "CompanyStorySection"
);
if (
  !companyStoryRecord ||
  companyStoryRecord.layer !== "organism" ||
  companyStoryRecord.status !== "ready" ||
  companyStoryRecord.sourcePath !== companyStorySourcePath ||
  companyStoryRecord.docsAnchor !==
    "website-sections-company-company-story"
) {
  errors.push("CompanyStorySection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!companyStoryRecord?.props?.includes(prop)) {
    errors.push(`CompanyStorySection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-company-story-items",
  "data-preview-target",
]) {
  if (!companyStoryRecord?.attributes?.includes(attribute)) {
    errors.push(
      `CompanyStorySection registry record is missing attribute: ${attribute}`,
    );
  }
}
if (
  companyStoryRecord?.variants?.join("|") !==
    "about|mission|values|timeline" ||
  companyStoryRecord?.uses?.join("|") !== "ContentBlock" ||
  (companyStoryRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("CompanyStorySection variants, dependencies, or slots drifted.");
}

const teamRecord = sectionRecords.find(
  (entry) => entry.name === "TeamSection"
);
if (
  !teamRecord ||
  teamRecord.layer !== "organism" ||
  teamRecord.status !== "ready" ||
  teamRecord.sourcePath !== teamSourcePath ||
  teamRecord.docsAnchor !== "website-sections-company-team"
) {
  errors.push("TeamSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!teamRecord?.props?.includes(prop)) {
    errors.push(`TeamSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-team-members",
  "data-preview-target",
]) {
  if (!teamRecord?.attributes?.includes(attribute)) {
    errors.push(`TeamSection registry record is missing attribute: ${attribute}`);
  }
}
if (
  teamRecord?.variants?.join("|") !== "team|leadership" ||
  teamRecord?.uses?.join("|") !== "ContentBlock|TeamMemberCard" ||
  (teamRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("TeamSection variants, dependencies, or slots drifted.");
}

const careersRecord = sectionRecords.find(
  (entry) => entry.name === "CareersSection"
);
if (
  !careersRecord ||
  careersRecord.layer !== "organism" ||
  careersRecord.status !== "ready" ||
  careersRecord.sourcePath !== careersSourcePath ||
  careersRecord.docsAnchor !== "website-sections-company-careers"
) {
  errors.push("CareersSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!careersRecord?.props?.includes(prop)) {
    errors.push(`CareersSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-careers-jobs",
  "data-preview-target",
]) {
  if (!careersRecord?.attributes?.includes(attribute)) {
    errors.push(
      `CareersSection registry record is missing attribute: ${attribute}`,
    );
  }
}
if (
  careersRecord?.variants?.join("|") !== "overview|job-list" ||
  careersRecord?.uses?.join("|") !== "ContentBlock|JobCard" ||
  (careersRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("CareersSection variants, dependencies, or slots drifted.");
}

const companyContactRecord = sectionRecords.find(
  (entry) => entry.name === "CompanyContactSection"
);
if (
  !companyContactRecord ||
  companyContactRecord.layer !== "organism" ||
  companyContactRecord.status !== "ready" ||
  companyContactRecord.sourcePath !== companyContactSourcePath ||
  companyContactRecord.docsAnchor !==
    "website-sections-company-company-contact"
) {
  errors.push("CompanyContactSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!companyContactRecord?.props?.includes(prop)) {
    errors.push(
      `CompanyContactSection registry record is missing prop: ${prop}`,
    );
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-company-contact-item",
  "data-company-contact-form",
  "data-preview-target",
]) {
  if (!companyContactRecord?.attributes?.includes(attribute)) {
    errors.push(
      `CompanyContactSection registry record is missing attribute: ${attribute}`,
    );
  }
}
if (
  companyContactRecord?.variants?.join("|") !==
    "locations|contact|press" ||
  companyContactRecord?.uses?.join("|") !== "ContentBlock|Form" ||
  companyContactRecord?.slots?.join("|") !== "form"
) {
  errors.push(
    "CompanyContactSection variants, dependencies, or slots drifted.",
  );
}

const faqRecord = sectionRecords.find((entry) => entry.name === "FaqSection");
if (
  !faqRecord ||
  faqRecord.layer !== "organism" ||
  faqRecord.status !== "ready" ||
  faqRecord.sourcePath !== faqSourcePath ||
  faqRecord.docsAnchor !== "website-sections-content-resources-faq"
) {
  errors.push("FaqSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "closeSiblings",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!faqRecord?.props?.includes(prop)) {
    errors.push(`FaqSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-faq-items",
  "data-preview-target",
]) {
  if (!faqRecord?.attributes?.includes(attribute)) {
    errors.push(`FaqSection registry record is missing attribute: ${attribute}`);
  }
}
if (
  faqRecord?.variants?.join("|") !== "stacked|split" ||
  faqRecord?.uses?.join("|") !== "ContentBlock|Accordion" ||
  (faqRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("FaqSection variants, dependencies, or slots drifted.");
}

const contentListingRecord = sectionRecords.find(
  (entry) => entry.name === "ContentListingSection"
);
if (
  !contentListingRecord ||
  contentListingRecord.layer !== "organism" ||
  contentListingRecord.status !== "ready" ||
  contentListingRecord.sourcePath !== contentListingSourcePath ||
  contentListingRecord.docsAnchor !==
    "website-sections-content-resources-content-listing"
) {
  errors.push("ContentListingSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!contentListingRecord?.props?.includes(prop)) {
    errors.push(
      `ContentListingSection registry record is missing prop: ${prop}`,
    );
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-content-listing-articles",
  "data-preview-target",
]) {
  if (!contentListingRecord?.attributes?.includes(attribute)) {
    errors.push(
      `ContentListingSection registry record is missing attribute: ${attribute}`,
    );
  }
}
if (
  contentListingRecord?.variants?.join("|") !==
    "featured|grid|list|categories" ||
  contentListingRecord?.uses?.join("|") !==
    "ContentBlock|ArticleCard|SearchInput|Pagination" ||
  (contentListingRecord?.slots?.length ?? 0) !== 0
) {
  errors.push(
    "ContentListingSection variants, dependencies, or slots drifted.",
  );
}

const resourceLibraryRecord = sectionRecords.find(
  (entry) => entry.name === "ResourceLibrarySection"
);
if (
  !resourceLibraryRecord ||
  resourceLibraryRecord.layer !== "organism" ||
  resourceLibraryRecord.status !== "ready" ||
  resourceLibraryRecord.sourcePath !== resourceLibrarySourcePath ||
  resourceLibraryRecord.docsAnchor !==
    "website-sections-content-resources-resource-library"
) {
  errors.push("ResourceLibrarySection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!resourceLibraryRecord?.props?.includes(prop)) {
    errors.push(
      `ResourceLibrarySection registry record is missing prop: ${prop}`,
    );
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-resource-library-resources",
  "data-preview-target",
]) {
  if (!resourceLibraryRecord?.attributes?.includes(attribute)) {
    errors.push(
      `ResourceLibrarySection registry record is missing attribute: ${attribute}`,
    );
  }
}
if (
  resourceLibraryRecord?.variants?.join("|") !== "library|guides|ebooks" ||
  resourceLibraryRecord?.uses?.join("|") !==
    "ContentBlock|ResourceCard|SearchInput|Pagination" ||
  (resourceLibraryRecord?.slots?.length ?? 0) !== 0
) {
  errors.push(
    "ResourceLibrarySection variants, dependencies, or slots drifted.",
  );
}

const eventsRecord = sectionRecords.find(
  (entry) => entry.name === "EventsSection"
);
if (
  !eventsRecord ||
  eventsRecord.layer !== "organism" ||
  eventsRecord.status !== "ready" ||
  eventsRecord.sourcePath !== eventsSourcePath ||
  eventsRecord.docsAnchor !==
    "website-sections-content-resources-events"
) {
  errors.push("EventsSection registry identity or readiness drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!eventsRecord?.props?.includes(prop)) {
    errors.push(`EventsSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-events-items",
  "data-preview-target",
]) {
  if (!eventsRecord?.attributes?.includes(attribute)) {
    errors.push(
      `EventsSection registry record is missing attribute: ${attribute}`,
    );
  }
}
if (
  eventsRecord?.variants?.join("|") !== "webinars|events|podcast" ||
  eventsRecord?.uses?.join("|") !==
    "ContentBlock|ResourceCard|Carousel" ||
  (eventsRecord?.slots?.length ?? 0) !== 0
) {
  errors.push("EventsSection variants, dependencies, or slots drifted.");
}

const changelogRecord = sectionRecords.find(
  (entry) => entry.name === "ChangelogSection"
);
if (
  !changelogRecord ||
  changelogRecord.layer !== "organism" ||
  changelogRecord.status !== "review" ||
  changelogRecord.sourcePath !== changelogSourcePath ||
  changelogRecord.docsAnchor !==
    "website-sections-content-resources-changelog"
) {
  errors.push("ChangelogSection registry identity or review status drifted.");
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!changelogRecord?.props?.includes(prop)) {
    errors.push(`ChangelogSection registry record is missing prop: ${prop}`);
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-changelog-entries",
  "data-preview-target",
]) {
  if (!changelogRecord?.attributes?.includes(attribute)) {
    errors.push(
      `ChangelogSection registry record is missing attribute: ${attribute}`,
    );
  }
}
if (
  changelogRecord?.variants?.join("|") !==
    "changelog|newsletter-archive" ||
  changelogRecord?.uses?.join("|") !==
    "ContentBlock|ArticleCard|Pagination" ||
  (changelogRecord?.slots?.length ?? 0) !== 0
) {
  errors.push(
    "ChangelogSection variants, dependencies, or slots drifted.",
  );
}

const productComparisonRecord = sectionRecords.find(
  (entry) => entry.name === "ProductComparisonSection"
);
if (
  !productComparisonRecord ||
  productComparisonRecord.layer !== "organism" ||
  productComparisonRecord.status !== "ready" ||
  productComparisonRecord.sourcePath !== productComparisonSourcePath ||
  productComparisonRecord.docsAnchor !==
    "website-sections-product-communication-product-comparison"
) {
  errors.push(
    "ProductComparisonSection registry identity or readiness drifted.",
  );
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!productComparisonRecord?.props?.includes(prop)) {
    errors.push(
      `ProductComparisonSection registry record is missing prop: ${prop}`,
    );
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-comparison-columns",
  "data-comparison-rows",
  "data-preview-target",
]) {
  if (!productComparisonRecord?.attributes?.includes(attribute)) {
    errors.push(
      `ProductComparisonSection registry record is missing attribute: ${attribute}`,
    );
  }
}
if (
  productComparisonRecord?.variants?.join("|") !==
    "comparison|alternatives" ||
  productComparisonRecord?.uses?.join("|") !==
    "ContentBlock|ComparisonTable|Button" ||
  (productComparisonRecord?.slots?.length ?? 0) !== 0
) {
  errors.push(
    "ProductComparisonSection variants, dependencies, or slots drifted.",
  );
}

const productAnnouncementRecord = sectionRecords.find(
  (entry) => entry.name === "ProductAnnouncementSection"
);
if (
  !productAnnouncementRecord ||
  productAnnouncementRecord.layer !== "organism" ||
  productAnnouncementRecord.status !== "ready" ||
  productAnnouncementRecord.sourcePath !== productAnnouncementSourcePath ||
  productAnnouncementRecord.docsAnchor !==
    "website-sections-product-communication-product-announcement"
) {
  errors.push(
    "ProductAnnouncementSection registry identity or readiness drifted.",
  );
}
for (const prop of [
  "id",
  "content",
  "variant",
  "headingLevel",
  "ariaLabel",
  "componentName",
  "native section attributes",
]) {
  if (!productAnnouncementRecord?.props?.includes(prop)) {
    errors.push(
      `ProductAnnouncementSection registry record is missing prop: ${prop}`,
    );
  }
}
for (const attribute of [
  "data-component-name",
  "data-component-family",
  "data-section-family",
  "data-section-type",
  "data-section-variant",
  "data-announcement-dismissible",
  "data-preview-target",
]) {
  if (!productAnnouncementRecord?.attributes?.includes(attribute)) {
    errors.push(
      `ProductAnnouncementSection registry record is missing attribute: ${attribute}`,
    );
  }
}
if (
  productAnnouncementRecord?.variants?.join("|") !==
    "launch|promotion|status" ||
  productAnnouncementRecord?.uses?.join("|") !==
    "CalloutCard|NavBanner|Alert" ||
  (productAnnouncementRecord?.slots?.length ?? 0) !== 0
) {
  errors.push(
    "ProductAnnouncementSection variants, dependencies, or slots drifted.",
  );
}

const docsPath = "src/pages/design-system/sections.astro";
const docs = read(docsPath);
for (const contract of [
  'title="Website Sections"',
  'id="website-sections-architecture"',
  'id="website-sections-families"',
  'id="website-sections-global-shell"',
  'id="website-sections-global-shell-announcement-bar"',
  'figmaNodeId="623:45"',
  "AnnouncementBarSection",
  'data-content-scenario="default"',
  'data-content-scenario="short-content"',
  'data-content-scenario="long-content"',
  'data-content-scenario="missing-optional-content"',
  'href="/design-system/roadmap"',
  'id="website-sections-global-shell-marketing-navigation"',
  'figmaNodeId="659:173"',
  "MarketingNavigationSection",
  'variant="mega-enabled"',
  'variant="centered"',
  "The section adds placement and section identity only",
  "Do not maintain a separate mobile destination list.",
  "Status is semantic behavior, not a third visual variant.",
  "No actions or media slots are exposed.",
  'id="website-sections-global-shell-subnavigation"',
  'figmaNodeId="667:199"',
  "SubnavigationSection",
  'variant="underline"',
  'variant="pills"',
  "The section composes exactly one canonical Subnavigation",
  "Pills never gains role=tab",
  'id="website-sections-global-shell-footer"',
  'figmaNodeId="678:430"',
  "FooterSection",
  'variant="columns"',
  'variant="cta"',
  'variant="legal"',
  "renders exactly one canonical Footer as its root",
  "does not add a wrapping section",
  'id="website-sections-global-shell-cookie-consent"',
  'figmaNodeId="682:2750"',
  "CookieConsentSection",
  'variant="banner"',
  'variant="modal"',
  "cookie-consent-choice",
  "IconButton is deliberately not used",
  "No actions, media, category, or vendor slots are exposed.",
  'id="website-sections-hero-headers"',
  'id="website-sections-hero-headers-hero"',
  'figmaNodeId="685:624"',
  "HeroSection",
  'variant="centered"',
  'variant="split"',
  'variant="product-mockup"',
  'variant="media"',
  'variant="lead-capture"',
  'variant="launch-event"',
  "Split, Product Mockup, and Media require exactly one media slot.",
  "Lead Capture requires exactly one form slot",
  "Launch Event requires one to three structured details.",
  "one semantic h1",
  'id="website-sections-hero-headers-page-header"',
  'figmaNodeId="691:115"',
  "PageHeaderSection",
  "always composes exactly one canonical PageHeader",
  "Article and Pricing remain content contexts",
  "support is the only slot",
  'id="website-sections-brand-social-proof"',
  'id="website-sections-brand-social-proof-logo-cloud"',
  'figmaNodeId="694:155"',
  "LogoCloudSection",
  'variant="static"',
  'variant="carousel"',
  "Static renders a semantic list",
  "Carousel delegates controls",
  "no slots are exposed",
  "Starter placeholder artwork is documentation-only",
  'id="website-sections-brand-social-proof-trust-signals"',
  'figmaNodeId="698:257"',
  "TrustSignalsSection",
  'variant="ratings"',
  'variant="badges"',
  'variant="awards"',
  "Ratings composes canonical read-only Rating",
  "Badges and Awards compose canonical TrustBadge",
  "no slots are exposed",
  "Official certification and award seals are not reproduced",
  'id="website-sections-brand-social-proof-testimonials"',
  'figmaNodeId="703:390"',
  "TestimonialSection",
  'variant="single"',
  'variant="grid"',
  'variant="carousel"',
  'variant="customer-results"',
  "Single and Grid preserve canonical TestimonialCard",
  "Carousel delegates controls",
  "Customer Results composes one canonical TestimonialCard",
  "no slots are exposed",
  'id="website-sections-brand-social-proof-case-studies"',
  'figmaNodeId="714:636"',
  "CaseStudySection",
  'variant="highlight"',
  'variant="grid"',
  "Every item composes canonical CaseStudyCard",
  "The optional section action composes canonical Button",
  "no slots are exposed",
  'id="website-sections-features-product-demo"',
  'id="website-sections-features-product-demo-features"',
  "FeatureSection",
  'variant="alternating"',
  'variant="bento"',
  'variant="tabs"',
  'variant="comparison"',
  "Grid composes Icon FeatureCard",
  "Tabs delegates peer-panel semantics",
  "Comparison delegates table semantics",
  "no public slots are exposed",
  'id="website-sections-features-product-demo-product-demo"',
  'figmaNodeId="744:474"',
  "ProductDemoSection",
  'variant="screenshot"',
  'variant="interactive"',
  'variant="video"',
  'variant="before-after"',
  "Screenshot composes canonical MediaRatio",
  "Video delegates native playback",
  "Before After delegates range input",
  "media is the only slot",
  'id="website-sections-how-it-works-use-cases"',
  'id="website-sections-how-it-works-use-cases-process"',
  'figmaNodeId="751:138"',
  "ProcessSection",
  'variant="numbered-steps"',
  'variant="cards"',
  'variant="timeline"',
  'variant="sticky"',
  'variant="workflow-diagram"',
  "one semantic ordered list",
  "family-owned step structure",
  "Workflow Diagram composes canonical PanelPatternVisualSystem",
  "no public slots are exposed",
  'id="website-sections-how-it-works-use-cases-use-cases"',
  'figmaNodeId="762:202"',
  "UseCasesSection",
  'variant="role-based"',
  'variant="industry"',
  'variant="scenario-tabs"',
  "Role Based maps every item to canonical UseCaseCard Role",
  "Scenario Tabs composes canonical Tabs",
  "Scenario Tabs rejects item actions",
  'id="website-sections-stats-customer-proof"',
  'id="website-sections-stats-customer-proof-stats"',
  'figmaNodeId="770:170"',
  "StatsSection",
  'variant="kpi-band"',
  'variant="metric-cards"',
  'variant="milestones"',
  "Every metric composes one canonical StatCard",
  "Milestones renders the supplied source order as an ordered list",
  "Documentation values are fixtures only",
  'id="website-sections-stats-customer-proof-data-story"',
  'figmaNodeId="774:321"',
  "DataStorySection",
  'variant="benchmark"',
  'variant="data-story"',
  'variant="customer-results"',
  'variant="roi-result"',
  "Benchmark composes exactly one canonical ComparisonTable",
  "Every non-Benchmark metric composes exactly one canonical StatCard",
  "Documentation values are fixtures only",
  'id="website-sections-pricing-comparison"',
  'id="website-sections-pricing-comparison-pricing"',
  'figmaNodeId="780:4150"',
  "PricingSection",
  'variant="tiers"',
  'variant="toggle"',
  'variant="usage-based"',
  "Every visible offer composes one canonical PricingCard",
  "SwitchButton owns switch semantics and emits switch-change",
  "Documentation values are fixtures only and must never be published as an offer",
  'id="website-sections-pricing-comparison-pricing-comparison"',
  'figmaNodeId="783:4291"',
  "PricingComparisonSection",
  'variant="feature-matrix"',
  'variant="add-ons"',
  'variant="enterprise-cta"',
  "Feature Matrix composes one canonical ComparisonTable",
  "Every Add Ons plan and the Enterprise offer compose canonical PricingCard",
  "Enterprise CTA composes canonical Button",
  'id="website-sections-pricing-comparison-pricing-faq"',
  'figmaNodeId="785:510"',
  "PricingFaqSection",
  "The section composes exactly one canonical Accordion",
  "Accordion owns button, region, aria-expanded, aria-controls, aria-hidden",
  "data-section-variant is the fixed value accordion",
  'id="website-sections-integrations-security"',
  'id="website-sections-integrations-security-integrations"',
  'figmaNodeId="795:253"',
  "IntegrationsSection",
  'variant="grid"',
  'variant="directory"',
  'variant="detail"',
  'variant="ecosystem"',
  "Every integration item composes canonical IntegrationCard",
  "Directory alone composes canonical SearchInput",
  "Ecosystem composes one additional canonical Logo",
  'id="website-sections-integrations-security-developer"',
  'figmaNodeId="801:211"',
  "DeveloperSection",
  'variant="api"',
  'variant="developer"',
  "The section header and every Developer step compose canonical ContentBlock",
  "Code examples are supplied escaped text inside semantic pre/code markup",
  "API method is limited to GET, POST, PUT, PATCH, or DELETE",
  'id="website-sections-integrations-security-trust"',
  'figmaNodeId="810:255"',
  "TrustSection",
  'variant="security"',
  'variant="compliance"',
  'variant="trust-center"',
  'variant="architecture"',
  "Security maps every claim to canonical TrustBadge",
  "Trust Center and Architecture reject claim-list content",
  "ComparisonTable owns caption, column, row, boolean-label, and local overflow semantics",
  "TrustBadge styling and iconography do not verify a claim",
  "no public slots are exposed",
  'id="website-sections-conversion"',
  'id="website-sections-conversion-call-to-action"',
  'figmaNodeId="816:10"',
  "CtaSection",
  'variant="banner"',
  'variant="card"',
  'variant="split"',
  'variant="full-bleed"',
  "Split composes exactly one canonical CalloutCard",
  "Banner, Card, and Full Bleed compose canonical Eyebrow, ButtonGroup, and Button",
  "ButtonGroup owns action wrapping and Button owns link semantics",
  "no public slots are exposed",
  'id="website-sections-conversion-lead-capture"',
  'figmaNodeId="821:437"',
  "LeadCaptureSection",
  'variant="newsletter"',
  'variant="lead-form"',
  'variant="contact-form"',
  'variant="demo-booking"',
  'variant="waitlist"',
  'variant="app-download"',
  "Newsletter, Lead Form, Contact Form, and Waitlist require structured form content",
  "Contact Form supports two to six fields and requires one textarea",
  "ConsentField owns checkbox semantics and never preselects consent",
  "CalComEmbed owns iframe behavior and remote Cal.com presentation",
  "no public slots are exposed",
  'id="website-sections-company"',
  'id="website-sections-company-company-story"',
  'figmaNodeId="846:220"',
  "CompanyStorySection",
  'variant="about"',
  'variant="mission"',
  'variant="values"',
  'variant="timeline"',
  "About requires two to four ordered narrative items",
  "Mission requires one to three commitment items",
  "Values requires three to six items and rejects item labels",
  "Timeline requires two to eight ordered milestones",
  "ContentBlock owns the shared section introduction",
  "project-scheduling Timeline component is intentionally excluded",
  "no public slots are exposed",
  'id="website-sections-company-team"',
  'figmaNodeId="866:5569"',
  "TeamSection",
  'variant="team"',
  'variant="leadership"',
  "Team requires three to twelve members and rejects member descriptions",
  "Leadership requires two to six members and a non-empty description for every member",
  "TeamMemberCard owns portrait, identity, role, description",
  "Culture content maps to CompanyStorySection",
  "native unordered list",
  "no public slots are exposed",
  'id="website-sections-company-careers"',
  "CareersSection",
  'variant="overview"',
  'variant="job-list"',
  "Overview requires one to four jobs and a non-empty description for every job",
  "Job List requires one to twelve jobs and rejects job descriptions",
  "JobCard owns role metadata, native list semantics",
  "Overview maps to Detailed JobCard and Job List maps to Compact JobCard",
  "no public slots are exposed",
  'id="website-sections-company-company-contact"',
  'figmaNodeId="826:531"',
  "CompanyContactSection",
  'variant="locations"',
  'variant="contact"',
  'variant="press"',
  'slot="form"',
  "The shared section header composes canonical ContentBlock",
  "Locations preserve address semantics through native address elements",
  "Contact and Press channels remain native link lists",
  "The Contact form slot must contain one canonical Form",
  "LeadCaptureSection remains the conversion-focused choice",
  'id="website-sections-content-resources"',
  'id="website-sections-content-resources-faq"',
  'figmaNodeId="831:141"',
  "FaqSection",
  'variant="stacked"',
  'variant="split"',
  'closeSiblings={false}',
  "ContentBlock owns the shared section introduction",
  "Accordion owns button, region, aria-expanded, aria-controls, aria-hidden",
  "Stacked and Split are layout compositions over the same semantic order",
  "no public slots are exposed",
  'id="website-sections-content-resources-content-listing"',
  'figmaNodeId="887:336"',
  "ContentListingSection",
  'variant="featured"',
  'variant="grid"',
  'variant="list"',
  'variant="categories"',
  "Featured requires two to five articles",
  "Grid requires two to twelve articles",
  "List requires two to twenty articles",
  "Categories requires three to twenty articles",
  "ArticleCard owns article link, media ratio, category Tag",
  "SearchInput is used only by Categories",
  "Pagination owns page-link semantics",
  'id="website-sections-content-resources-resource-library"',
  'figmaNodeId="896:5916"',
  "ResourceLibrarySection",
  'variant="library"',
  'variant="guides"',
  'variant="ebooks"',
  "Library requires three to eighteen resources",
  "Guides requires two to twelve Guide resources",
  "Ebooks requires two to twelve Ebook resources",
  "ResourceCard owns resource-kind Tag, MediaRatio, complete-card destination",
  "SearchInput appears only in Library",
  "Pagination owns page-link semantics only for Guides and Ebooks",
  'id="website-sections-content-resources-events"',
  'figmaNodeId="901:650"',
  "EventsSection",
  'variant="webinars"',
  'variant="events"',
  'variant="podcast"',
  "Webinars requires two to twelve items",
  "Events requires two to eight items",
  "Podcast requires two to twelve items",
  "every item requires a unique selector-safe id",
  "Webinars composes canonical ResourceCard Webinar instances",
  "Events composes canonical Carousel Multi Item",
  "Podcast composes canonical Carousel Single",
  "Carousel owns ordered slide semantics",
  'id="website-sections-content-resources-changelog"',
  "ChangelogSection",
  'variant="changelog"',
  'variant="newsletter-archive"',
  "Changelog requires two to twenty entries",
  "Newsletter Archive requires two to twelve entries",
  "entries must be supplied newest first by publishedDate",
  "Changelog composes canonical Compact ArticleCards",
  "Newsletter Archive composes canonical Standard ArticleCards",
  "Pagination owns page-link semantics",
  'id="website-sections-product-communication"',
  'id="website-sections-product-communication-product-comparison"',
  'figmaNodeId="834:271"',
  "ProductComparisonSection",
  'variant="comparison"',
  'variant="alternatives"',
  "two to four unique selector-safe columns",
  "two to twelve uniquely labelled rows",
  "one-to-eighteen-character label",
  "ComparisonTable owns table, caption, header, row, boolean-label",
  "Button owns the optional destination action",
  "no public slots are exposed",
  'id="website-sections-product-communication-product-announcement"',
  'figmaNodeId="840:384"',
  "ProductAnnouncementSection",
  'variant="launch"',
  'variant="promotion"',
  'variant="status"',
  "Launch composes exactly one canonical CalloutCard",
  "Promotion composes exactly one canonical NavBanner",
  "Status composes exactly one canonical Alert",
  "action labels contain one to eighteen characters",
  "Tone is semantic status content rather than a fourth section variant",
  "Hero & Headers",
  "Brand & Social Proof",
  "Features & Product Demo",
  "How It Works & Use Cases",
  "Stats & Customer Proof",
  "Pricing & Comparison",
  "Integrations & Security",
  "Conversion",
  "Company",
  "Content & Resources",
  "Product Communication"
]) {
  requireContract(docs, contract, docsPath);
}

const navigationPath = "src/data/designSystemNavigation.ts";
const navigation = read(navigationPath);
for (const contract of [
  'label: "Website Sections"',
  'href: "/design-system/sections"',
  'label: "Global Shell"',
  'label: "Announcement Bar"',
  "/design-system/sections#website-sections-global-shell-announcement-bar-title",
  'label: "Marketing Navigation"',
  "/design-system/sections#website-sections-global-shell-marketing-navigation-title",
  'label: "Subnavigation"',
  "/design-system/sections#website-sections-global-shell-subnavigation-title",
  'label: "Footer"',
  "/design-system/sections#website-sections-global-shell-footer-title",
  'label: "Cookie Consent"',
  "/design-system/sections#website-sections-global-shell-cookie-consent-title",
  'label: "Hero & Headers"',
  'label: "Hero"',
  "/design-system/sections#website-sections-hero-headers-hero-title",
  'label: "Page Header"',
  "/design-system/sections#website-sections-hero-headers-page-header-title",
  'label: "Brand & Social Proof"',
  'label: "Logo Cloud"',
  "/design-system/sections#website-sections-brand-social-proof-logo-cloud-title",
  'label: "Trust Signals"',
  "/design-system/sections#website-sections-brand-social-proof-trust-signals-title",
  'label: "Testimonials"',
  "/design-system/sections#website-sections-brand-social-proof-testimonials-title",
  'label: "Case Studies"',
  "/design-system/sections#website-sections-brand-social-proof-case-studies-title",
  'label: "Features"',
  "/design-system/sections#website-sections-features-product-demo-features-title",
  'label: "Product Demo"',
  "/design-system/sections#website-sections-features-product-demo-product-demo-title",
  'label: "How It Works & Use Cases"',
  'label: "Process"',
  "/design-system/sections#website-sections-how-it-works-use-cases-process-title",
  'label: "Use Cases"',
  "/design-system/sections#website-sections-how-it-works-use-cases-use-cases-title",
  'label: "Stats & Customer Proof"',
  'label: "Stats"',
  "/design-system/sections#website-sections-stats-customer-proof-stats-title",
  'label: "Data Story"',
  "/design-system/sections#website-sections-stats-customer-proof-data-story-title",
  'label: "Pricing & Comparison"',
  'label: "Pricing"',
  "/design-system/sections#website-sections-pricing-comparison-pricing-title",
  'label: "Pricing Comparison"',
  "/design-system/sections#website-sections-pricing-comparison-pricing-comparison-title",
  'label: "Pricing FAQ"',
  "/design-system/sections#website-sections-pricing-comparison-pricing-faq-title",
  'label: "Integrations & Security"',
  'label: "Integrations"',
  "/design-system/sections#website-sections-integrations-security-integrations-title",
  'label: "Developer"',
  "/design-system/sections#website-sections-integrations-security-developer-title",
  'label: "Trust"',
  "/design-system/sections#website-sections-integrations-security-trust-title",
  'label: "Conversion"',
  'label: "Call to Action"',
  "/design-system/sections#website-sections-conversion-call-to-action-title",
  'label: "Lead Capture"',
  "/design-system/sections#website-sections-conversion-lead-capture-title",
  'label: "Company Story"',
  "/design-system/sections#website-sections-company-company-story-title",
  'label: "Team"',
  "/design-system/sections#website-sections-company-team-title",
  'label: "Company Contact"',
  "/design-system/sections#website-sections-company-company-contact-title",
  'label: "FAQ"',
  "/design-system/sections#website-sections-content-resources-faq-title",
  'label: "Content Listing"',
  "/design-system/sections#website-sections-content-resources-content-listing-title",
  'label: "Resource Library"',
  "/design-system/sections#website-sections-content-resources-resource-library-title",
  'label: "Events"',
  "/design-system/sections#website-sections-content-resources-events-title",
  'label: "Changelog"',
  "/design-system/sections#website-sections-content-resources-changelog-title",
  'label: "Product Comparison"',
  "/design-system/sections#website-sections-product-communication-product-comparison-title"
]) {
  requireContract(navigation, contract, navigationPath);
}

const agenticRulePath = ".agentic-rules/components/sections.md";
const agenticRule = read(agenticRulePath);
for (const contract of [
  "Website Section Agentic Rules",
  "## 2. Section families",
  "12. Product Communication",
  'data-component-family="sections"',
  "## 5. AnnouncementBarSection",
  "## 6. MarketingNavigationSection",
  "## 7. SubnavigationSection",
  "## 8. FooterSection",
  "## 9. CookieConsentSection",
  "## 10. HeroSection",
  "## 11. PageHeaderSection",
  "## 12. LogoCloudSection",
  "## 13. TrustSignalsSection",
  "## 14. TestimonialSection",
  "## 15. CaseStudySection",
  "## 16. FeatureSection",
  "## 17. ProductDemoSection",
  "## 18. ProcessSection",
  "## 19. UseCasesSection",
  "## 20. StatsSection",
  "## 21. DataStorySection",
  "## 22. PricingSection",
  "## 23. PricingComparisonSection",
  "## 24. PricingFaqSection",
  "## 25. IntegrationsSection",
  "## 26. DeveloperSection",
  "## 27. TrustSection",
  "## 28. CtaSection",
  "## 29. LeadCaptureSection",
  "## 30. CompanyStorySection",
  "## 31. TeamSection",
  "## 32. CareersSection",
  "## 33. CompanyContactSection",
  "## 34. FaqSection",
  "## 35. ContentListingSection",
  "## 36. ResourceLibrarySection",
  "## 37. EventsSection",
  "## 38. ChangelogSection",
  "## 39. ProductComparisonSection",
  "## 40. ProductAnnouncementSection",
  "## 41. AI selection checklist",
  "Do not add a `status` variant.",
  "Do not add actions or media slots",
  "Do not expose separate actions or media slots.",
  "Do not add a `mobileItems` prop",
  "It composes exactly one canonical Subnavigation.",
  "Underline and Pills both remain URL-navigation presentations.",
  "renders the canonical Footer as its only root",
  "would no longer represent the page-level contentinfo landmark",
  "Do not infer newsletter, social, locale, consent, current year",
  "neutral decision surface, not a consent-management platform",
  "cookie-consent-choice",
  "Do not invent legal copy, policy URLs, cookie categories",
  "page's single logical `h1`",
  "Split requires one media slot",
  "Lead Capture requires one Form slot",
  "Launch Event requires one to three structured",
  "exactly one canonical PageHeader",
  "Article and Pricing describe content contexts",
  "`support` is the only slot",
  "one semantic list and one canonical Logo per item",
  'canonical Carousel with `variant="logos"`',
  "documentation fixture only",
  "Do not add autoplay, infinite looping, duplicated controls",
  "one canonical read-only Rating per item",
  "canonical TrustBadge",
  "Documentation values and claims",
  "Do not generate a trust signal when evidence is unavailable",
  "canonical TestimonialCard",
  "canonical Carousel",
  "canonical StatCard",
  "Do not add autoplay, infinite looping, copied Carousel controls",
  "canonical CaseStudyCard",
  "optional section-level destination composes canonical Button",
  "Do not add ProjectDrawer behavior",
  "Grid composes canonical Icon FeatureCard",
  "Tabs delegates peer-panel semantics",
  "Comparison delegates caption",
  "Do not duplicate FeatureCard, Tabs, Tab, ComparisonTable",
  "Screenshot composes canonical MediaRatio",
  "Interactive composes MediaRatio",
  "Video delegates native",
  "Before After delegates its range input",
  "Do not duplicate MediaRatio, VideoPlayer, BeforeAfterSlider",
  "same semantic ordered list",
  "family-owned step",
  "Workflow Diagram composes canonical PanelPatternVisualSystem",
  "Do not compose FeatureCard or the application Timeline",
  "Role Based renders a semantic list of canonical UseCaseCard Role",
  "Scenario Tabs delegates the complete peer-panel",
  "Do not duplicate UseCaseCard, Tabs, Tab, panel semantics",
  "Every item is one canonical StatCard",
  "Milestones preserves supplied source order as an ordered list",
  "Documentation values demonstrate the authoring contract only",
  "Do not duplicate StatCard internals",
  "Benchmark composes exactly one canonical ComparisonTable",
  "Every non-Benchmark metric is one canonical StatCard",
  "Documentation values are neutral fixtures",
  "Do not duplicate StatCard or ComparisonTable",
  "Every visible plan composes one canonical PricingCard",
  "Toggle composes one canonical SwitchButton",
  "Commercial values, units, periods",
  "Do not duplicate PricingCard or SwitchButton",
  "Feature Matrix composes exactly one canonical ComparisonTable",
  "Add Ons renders every supplied extension through canonical PricingCard",
  "Enterprise CTA renders one canonical PricingCard and one canonical Button",
  "Do not duplicate ComparisonTable, PricingCard, or Button",
  "PricingFaqSection composes exactly one canonical Accordion",
  "Accordion owns native button triggers",
  "data-section-variant=\"accordion\"",
  "Do not duplicate Accordion",
  "Every item is one canonical IntegrationCard",
  "Directory alone composes one canonical SearchInput",
  "Ecosystem composes one additional canonical Logo",
  "local case-insensitive filtering",
  "Do not duplicate IntegrationCard, Logo, Tag, or SearchInput",
  "The API composition uses one canonical ContentBlock",
  "canonical ContentBlock for its header",
  "Code values remain supplied escaped text",
  "Do not duplicate ContentBlock or add a parallel public code-snippet component",
  "Security maps every claim to canonical TrustBadge Security",
  "Trust Center and Architecture reject claim-list content",
  "ComparisonTable owns caption, column, row, boolean-label, and local",
  "TrustBadge selects generic iconography and treatment only",
  "Do not duplicate TrustBadge or ComparisonTable",
  "Banner, Card, and Full Bleed require a non-empty description",
  "Split maps to exactly one canonical CalloutCard",
  "action labels stay concise",
  "Do not add Actions, Media, Count, State, Desktop, Mobile, Short, or Long axes",
  "Newsletter, Lead Form, Contact Form, and Waitlist require structured form",
  "every form requires a supplied HTTPS or root-relative action",
  "ConsentField owns checkbox semantics and never preselects consent",
  "Do not add Form State, Count, Consent State, Desktop",
  "Contact requires the named `form` slot",
  "Locations and Press reject the `form` slot",
  "native list/address structure",
  "not add Map, Live Status, Directions, Geolocation",
  "Use CompanyStorySection when approved project context supplies a complete",
  "About requires two to four ordered narrative items",
  "Mission requires one to three commitment items",
  "Values requires three to six items and rejects item labels",
  "Timeline requires two to eight ordered milestone items",
  "project-scheduling Timeline is intentionally excluded",
  "repeated story item is private",
  "Do not add Count, Item State, Media, Action, Desktop",
  "Use TeamSection when approved project context supplies a complete compact team",
  "Team requires three to twelve members and rejects member descriptions",
  "Leadership requires two to six members",
  "TeamMemberCard owns portrait, identity, role, description",
  "intentionally excluded because it is not a people-directory presentation",
  "Do not add Culture, Count, Card State",
  "Use CareersSection when approved project context supplies a complete",
  "Overview requires one to four jobs",
  "Job List requires one to twelve jobs and rejects job descriptions",
  "JobCard owns the three-item",
  "application workflow, empty states, SEO, and live role availability",
  "Do not add Count, Card State,",
  "Use FaqSection when approved project context supplies at least two",
  "Use PricingFaqSection only for reviewed commercial-plan questions",
  "ContentBlock owns the shared introduction",
  "Accordion owns native",
  "Do not add Count, Open Item, State, Search, Category",
  "Use ContentListingSection when approved project context supplies complete",
  "Featured requires two to five articles",
  "Grid requires two to twelve articles",
  "List requires two to twenty articles",
  "Categories requires three to twenty articles",
  "ArticleCard owns the",
  "SearchInput owns search-field and clear",
  "Pagination owns page-link semantics",
  "Do not add Count, Search State, Page State, Card State",
  "Use ResourceLibrarySection when approved project context supplies complete",
  "Library requires three to eighteen resources",
  "Guides requires two to twelve Guide resources",
  "Ebooks requires two to twelve Ebook resources",
  "ResourceCard owns the complete-card link",
  "SearchInput owns the search field and clear control",
  "pagination is optional only for Guides and Ebooks",
  "Do not add Count, Search State, Page State, Access State",
  "Use EventsSection when approved project context supplies complete",
  "Webinars requires two to twelve items",
  "Events requires two to eight items",
  "Podcast requires two to twelve items",
  "Webinars maps every supplied",
  "Events maps the ordered collection",
  "Podcast maps it to canonical Carousel Single",
  "Carousel owns slide semantics",
  "Do not add Count,",
  "Schedule State, Availability, Registration, Playback, Carousel State",
  "Use ChangelogSection when approved project context supplies complete",
  "Changelog requires two to twenty entries",
  "Newsletter Archive requires two to twelve entries",
  "entries must be supplied newest first",
  "Changelog maps to canonical",
  "ArticleCard Compact",
  "Newsletter Archive maps to canonical ArticleCard",
  "Pagination owns page-link semantics",
  "not add Count, Page State, Entry State, Category",
  "parity and release remain blocked",
  "partial empty set",
  "Use ProductComparisonSection when approved project context supplies complete",
  "PricingComparisonSection only for reviewed commercial-plan relationships",
  "complete rectangular",
  "ComparisonTable owns `table`, caption, column headers",
  "one-to-eighteen-character label",
  "not add Columns, Rows, Highlighted, Selection, Filter, Sort, Calculator",
  "Use ProductAnnouncementSection when approved project context supplies one",
  "AnnouncementBarSection for a global-shell update",
  "Launch requires a non-empty eyebrow and one action",
  "Promotion accepts optional description, one action, and session dismissal",
  "Status requires a non-empty description",
  "CalloutCard owns Launch heading, action, media ratio, and visual internals",
  "NavBanner owns Promotion link, visible/dismissed state, session dismissal",
  "Alert owns Status role, tone, notification",
  "Do not add Tone, Dismissible, Action, Media, Desktop",
  "<AnnouncementBarSection"
]) {
  requireContract(agenticRule, contract, agenticRulePath);
}

const figmaRulePath =
  "Figma2Astro Agentic Rules/22-website-sections.md";
const figmaRule = read(figmaRulePath);
for (const contract of [
  "Astro code and CSS Variables remain the",
  "623:2",
  "623:3",
  "623:45",
  "623:8",
  "623:28",
  "623:9",
  "623:29",
  "360:213",
  "24 of 24 visible paint fields",
  "10 of 10 text nodes",
  "659:30",
  "659:173",
  "659:39",
  "659:40",
  "659:83",
  "659:84",
  "659:123",
  "659:124",
  "72 of 72 visible paint fields",
  "18 of 18 text nodes",
  "Global/background/canvas",
  "667:158",
  "667:199",
  "667:169",
  "667:170",
  "667:184",
  "667:185",
  "29 of 29 visible paint fields",
  "11 of 11 text nodes",
  "Pills never maps to",
  "678:2704",
  "678:430",
  "678:184",
  "678:185",
  "678:238",
  "678:239",
  "678:304",
  "678:305",
  "678:395",
  "678:396",
  "60 of 60 visible paint fields",
  "34 of 34 text nodes",
  "does not add a wrapping `section`",
  "682:2751",
  "682:2750",
  "682:422",
  "682:427",
  "682:470",
  "682:471",
  "682:476",
  "204:103",
  "32 of 32 visible paint fields",
  "15 of 15 text nodes",
  "cookie-consent-choice",
  "Do not add an IconButton",
  "685:461",
  "685:462",
  "685:625",
  "685:624",
  "685:467",
  "685:502",
  "685:527",
  "685:547",
  "685:558",
  "685:598",
  "685:475",
  "685:510",
  "685:535",
  "685:606",
  "685:524",
  "685:544",
  "685:548",
  "685:567",
  "97 of 97 visible paint fields",
  "41 of 41 text nodes",
  "Do not compose HeroSection from ContentBlock",
  "Do not add `status`",
  "691:115",
  "691:116",
  "691:137",
  "691:150",
  "691:156",
  "Show Breadcrumbs#691:0",
  "38 of 38 visible paint fields",
  "17 of 17 text nodes",
  "Do not add Article or Pricing variants",
  "Do not add Actions, Media, default, or breadcrumb-item slots",
  "694:2",
  "694:3",
  "694:155",
  "694:9",
  "694:54",
  "694:13",
  "694:20",
  "694:27",
  "694:34",
  "694:41",
  "694:48",
  "694:55",
  "571:206",
  "593:332",
  "88 of 88 visible paint fields",
  "20 of 20 text nodes",
  "Do not expose Count, State, Desktop, Mobile, Artwork, Actions, or Media",
  "698:131",
  "698:257",
  "698:137",
  "698:196",
  "698:228",
  "698:143",
  "698:173",
  "698:177",
  "698:202",
  "698:212",
  "698:222",
  "698:234",
  "698:244",
  "698:251",
  "526:155",
  "526:1706",
  "521:140",
  "521:146",
  "521:152",
  "84 of 84 visible paint fields",
  "24 of 24 text nodes",
  "Do not expose Count, Size, State, Desktop, Mobile, Official Seal",
  "703:218",
  "703:390",
  "703:224",
  "703:241",
  "703:266",
  "703:329",
  "703:228",
  "703:246",
  "703:256",
  "703:270",
  "703:334",
  "703:347",
  "703:360",
  "703:371",
  "703:381",
  "389:42",
  "389:20",
  "389:11",
  "593:212",
  "103 of 103 visible paint fields",
  "54 of 54 text nodes",
  "Do not expose Actions, Media, Avatar, Card, Results, Desktop, Mobile,",
  "714:342",
  "714:636",
  "714:348",
  "714:446",
  "714:364",
  "714:459",
  "714:530",
  "714:583",
  "714:353",
  "714:451",
  "710:337",
  "710:308",
  "190:51",
  "86 of 86 visible paint fields",
  "37 of 37 text nodes",
  "Do not expose Count, Client, Evidence, Destination, Metric, Media, Desktop,",
  "738:2",
  "738:420",
  "738:423",
  "738:3",
  "738:83",
  "738:120",
  "738:185",
  "738:263",
  "738:281",
  "738:8",
  "738:49",
  "738:66",
  "738:88",
  "738:102",
  "738:111",
  "738:126",
  "738:164",
  "738:191",
  "738:211",
  "738:229",
  "738:246",
  "738:267",
  "738:285",
  "723:326",
  "723:361",
  "723:381",
  "731:51",
  "252:140",
  "215 of 215 visible paint fields",
  "74 of 74 text nodes",
  "Do not expose arbitrary Actions, Media, Cards, Panels, Rows, Count, State,",
  "744:371",
  "744:474",
  "744:423",
  "744:430",
  "744:437",
  "744:455",
  "744:427",
  "744:434",
  "745:402",
  "745:414",
  "41 of 41 visible paint fields",
  "19 of 19 text nodes",
  "Do not expose Actions, Screenshot, Video, Before, After, default, Desktop,",
  "749:47",
  "749:48",
  "750:34",
  "750:19",
  "750:24",
  "750:29",
  "751:138",
  "751:2",
  "751:22",
  "751:42",
  "751:67",
  "751:92",
  "751:7",
  "751:12",
  "751:17",
  "751:27",
  "751:32",
  "751:37",
  "751:47",
  "751:52",
  "751:57",
  "751:62",
  "751:72",
  "751:77",
  "751:82",
  "751:87",
  "751:96",
  "751:123",
  "751:128",
  "751:133",
  "341:2",
  "147 of 147 visible paint fields",
  "72 of 72 text nodes",
  "Do not compose FeatureCard or the application Timeline",
  "761:97",
  "762:202",
  "762:2",
  "762:109",
  "762:180",
  "762:11",
  "762:61",
  "762:85",
  "762:118",
  "762:156",
  "762:188",
  "755:371",
  "755:391",
  "731:68",
  "60 of 60 visible paint fields Variable-bound",
  "28 of 28 text nodes using Text Styles",
  "Do not detach UseCaseCard Role",
  "769:6",
  "770:171",
  "770:170",
  "770:2",
  "770:53",
  "770:96",
  "770:129",
  "770:7",
  "770:20",
  "770:31",
  "770:40",
  "770:59",
  "770:68",
  "770:78",
  "770:87",
  "770:101",
  "770:111",
  "770:120",
  "770:137",
  "770:149",
  "770:161",
  "61 of 61 visible paint fields",
  "16 of 16 direct text nodes",
  "Every list item composes canonical StatCard",
  "Documentation fixtures are not evidence",
  "774:322",
  "774:321",
  "774:89",
  "774:229",
  "774:256",
  "774:293",
  "774:93",
  "774:238",
  "774:247",
  "774:264",
  "774:274",
  "774:283",
  "774:302",
  "774:311",
  "252:140",
  "57 of 57 visible paint fields",
  "22 of 22 direct text nodes",
  "Every non-Benchmark metric is one canonical StatCard",
  "ComparisonTable remains at its canonical 680-pixel",
  "779:62",
  "779:63",
  "780:4150",
  "779:108",
  "780:138",
  "780:251",
  "779:113",
  "779:150",
  "779:234",
  "780:143",
  "780:150",
  "780:187",
  "780:256",
  "780:292",
  "391:253",
  "391:319",
  "206:116",
  "21 of 21 direct visible paint fields",
  "12 of 12 direct text nodes",
  "Toggle documents the default period while Astro owns the alternate-price",
  "782:267",
  "783:4291",
  "783:267",
  "783:407",
  "783:485",
  "783:271",
  "783:412",
  "783:449",
  "783:490",
  "783:530",
  "27 of 27 direct visible paint fields",
  "16 of 16 direct text nodes",
  "ComparisonTable remains at its canonical",
  "785:503",
  "785:510",
  "785:514",
  "299:23",
  "13 of 13 direct visible paint fields",
  "8 of 8 direct text nodes",
  "no visual variant axis",
  "795:2",
  "795:254",
  "795:253",
  "795:3",
  "795:63",
  "795:138",
  "795:186",
  "795:67",
  "795:191",
  "788:408",
  "788:395",
  "223:65",
  "571:206",
  "15 of 15 direct paint fields",
  "9 of 9 direct text nodes",
  "local case-insensitive filtering",
  "801:211",
  "801:209",
  "801:210",
  "802:44",
  "803:4498",
  "804:5",
  "804:34",
  "805:5",
  "805:37",
  "287:20",
  "33 of 33 direct paint fields",
  "12 of 12 direct text nodes",
  "plus one family-private endpoint",
  "panels and step surfaces are family-private",
  "escaped non-executable code content",
  "810:255",
  "810:251",
  "810:252",
  "810:253",
  "810:254",
  "811:8",
  "811:19",
  "811:27",
  "812:7",
  "812:18",
  "812:4558",
  "813:10",
  "521:140",
  "521:146",
  "41 of 41 direct paint fields",
  "19 of 19",
  "Default ComparisonTable rows are linked Slot authoring examples",
  "generic iconography and treatment only",
  "816:2",
  "816:3",
  "816:10",
  "816:6",
  "816:7",
  "816:8",
  "816:9",
  "816:13",
  "816:19",
  "816:4705",
  "816:4711",
  "816:4719",
  "816:4764",
  "816:4770",
  "268:5",
  "204:88",
  "204:80",
  "391:194",
  "14 of 14 direct paint fields",
  "direct text nodes using Text Styles",
  "Action count, wording, destination",
  "No public slots exist",
  "821:437",
  "821:148",
  "821:199",
  "821:243",
  "821:287",
  "821:358",
  "821:395",
  "821:168",
  "821:226",
  "821:270",
  "821:307",
  "821:378",
  "821:422",
  "821:157",
  "821:208",
  "821:252",
  "821:296",
  "821:367",
  "821:404",
  "225:107",
  "226:380",
  "26 of 26 direct paint fields",
  "12 of 12 direct text nodes",
  "The nested Form instance documents the shared `Fields` Slot",
  "Field count, field type, form state",
  "846:110",
  "846:95",
  "846:100",
  "846:105",
  "846:220",
  "846:111",
  "846:137",
  "846:167",
  "846:194",
  "846:112",
  "846:138",
  "846:168",
  "846:195",
  "846:113",
  "846:139",
  "846:169",
  "846:196",
  "846:129",
  "846:133",
  "846:155",
  "846:159",
  "846:163",
  "846:185",
  "846:188",
  "846:191",
  "846:212",
  "846:216",
  "12 of 12 Variable-bound direct paint fields",
  "14 of 14 Variable-bound",
  "all 8 direct text nodes retain typography bindings",
  "project-scheduling Timeline",
  "866:5569",
  "866:136",
  "866:142",
  "866:137",
  "866:143",
  "866:138",
  "866:144",
  "866:139",
  "866:145",
  "866:5509",
  "866:5517",
  "866:5525",
  "866:5533",
  "866:5541",
  "866:5550",
  "866:5559",
  "TeamMemberCard Compact master `854:408`",
  "TeamMemberCard Profile master `854:416`",
  "6 of 6 Variable-bound direct paint fields",
  "canonical profile master has a 420 px intrinsic contract",
  "Culture is intentionally excluded",
  "877:228",
  "877:229",
  "877:237",
  "877:230",
  "877:238",
  "877:231",
  "877:239",
  "877:232",
  "877:240",
  "877:286",
  "877:316",
  "877:372",
  "877:398",
  "877:415",
  "Overview JobCard instances",
  "Job List instances",
  "Every JobCard instance remains exposed",
  "reviewed at 2528 × 1062",
  "Do not detach ContentBlock `287:20`, JobCard Detailed `872:419`",
  "826:308",
  "826:309",
  "826:366",
  "826:318",
  "826:336",
  "826:354",
  "826:531",
  "826:367",
  "826:427",
  "826:491",
  "826:387",
  "826:447",
  "826:511",
  "826:412",
  "826:417",
  "826:422",
  "826:464",
  "826:469",
  "826:474",
  "826:526",
  "21 of 21 Variable-bound direct paint fields",
  "private item set retains 18 of 18",
  "12 of 12 direct Text Styled nodes",
  "The private set exists only to preserve repeated family-owned item structure",
  "Contact alone requires",
  "Do not expose `_Parts/CompanyContactItem` as a public Astro component",
  "831:2",
  "831:3",
  "831:141",
  "831:6",
  "831:94",
  "831:7",
  "831:95",
  "831:8",
  "831:96",
  "831:35",
  "831:111",
  "6 of 6 Variable-bound direct paint fields",
  "zero direct text nodes",
  "Both variants map the supplied introduction to canonical ContentBlock",
  "closeSiblings",
  "Do not detach ContentBlock `287:20` or Accordion `299:23`",
  "884:119",
  "884:120",
  "884:122",
  "884:130",
  "887:336",
  "885:130",
  "885:5584",
  "886:248",
  "886:5676",
  "885:131",
  "885:5585",
  "886:249",
  "886:5677",
  "885:132",
  "885:5586",
  "886:250",
  "886:5678",
  "885:148",
  "885:163",
  "885:170",
  "885:5602",
  "885:5613",
  "885:5624",
  "885:5636",
  "886:266",
  "886:273",
  "886:280",
  "886:5693",
  "886:5701",
  "886:5718",
  "14 of 14 Variable-bound direct paint fields",
  "private category master retains one direct Text Styled node",
  "Featured maps one supplied editorial lead",
  "Do not expose `_Parts/ContentCategoryGroup` as a public Astro component",
  "896:5916",
  "896:305",
  "896:5817",
  "896:5876",
  "896:306",
  "896:5818",
  "896:5877",
  "896:307",
  "896:5819",
  "896:5878",
  "896:322",
  "896:330",
  "896:344",
  "896:358",
  "896:5835",
  "896:5846",
  "896:5858",
  "896:5894",
  "896:5905",
  "3 of 3 Variable-bound direct fill fields",
  "All 45 visible text nodes",
  "Library maps three to eighteen supplied",
  "Do not detach ContentBlock `287:20`, ResourceCard Guide `892:439`",
  "901:650",
  "901:626",
  "901:634",
  "901:642",
  "902:22",
  "902:5971",
  "903:99",
  "902:46",
  "902:5992",
  "903:123",
  "902:68",
  "902:82",
  "902:6013",
  "903:144",
  "3 of 3 Variable-bound direct fill fields",
  "All 31 visible text nodes",
  "The nested Carousel `Items` SLOT retains",
  "Webinars maps two to twelve supplied items",
  "Do not detach ContentBlock `287:20`, ResourceCard Webinar `892:450`",
  "907:567",
  "907:555",
  "907:561",
  "partial empty Component Set",
  "incomplete review evidence",
  "Do not use, publish, duplicate, or cite",
  "ArticleCard Compact",
  "ArticleCard Standard",
  "optional linked Pagination",
  "834:2",
  "834:3",
  "834:271",
  "834:6",
  "834:180",
  "834:7",
  "834:181",
  "834:8",
  "834:183",
  "834:45",
  "834:205",
  "834:35",
  "834:198",
  "14 of 14 Variable-bound direct paint fields",
  "full 680 px canonical",
  "Both variants map the introduction to canonical ContentBlock",
  "Do not detach ContentBlock `287:20`, ComparisonTable `252:140`",
  "840:384",
  "840:244",
  "840:325",
  "840:346",
  "840:245",
  "840:326",
  "840:347",
  "840:246",
  "840:327",
  "840:348",
  "9 of 9 Variable-bound direct paint fields",
  "The documentation set wraps its three wide",
  "Launch maps its required eyebrow, title, concise safe destination",
  "No public slots exist"
]) {
  requireContract(figmaRule, contract, figmaRulePath);
}

const roadmapPath = "src/data/design-system-roadmap.json";
const roadmap = JSON.parse(read(roadmapPath) || "{}");
const roadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.global-shell.announcement-bar"
);
if (!roadmapItem) {
  errors.push("Announcement Bar roadmap item is missing.");
} else {
  const axis = roadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "neutral|accent") {
    errors.push("Announcement Bar roadmap variants must equal neutral|accent.");
  }
  if (roadmapItem.target?.contract?.slots?.length !== 0) {
    errors.push("Announcement Bar roadmap must not expose actions or media slots.");
  }
}

const marketingRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.global-shell.marketing-navigation"
);
if (!marketingRoadmapItem) {
  errors.push("Marketing Navigation roadmap item is missing.");
} else {
  const axis = marketingRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "simple|centered|mega-enabled") {
    errors.push(
      "Marketing Navigation roadmap variants must equal simple|centered|mega-enabled."
    );
  }
  if (marketingRoadmapItem.target?.contract?.slots?.join("|") !== "brand") {
    errors.push("Marketing Navigation roadmap must expose only the brand slot.");
  }
  if (
    marketingRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "MarketingNavbar"
  ) {
    errors.push(
      "Marketing Navigation roadmap must depend on MarketingNavbar without duplicating nested dependencies."
    );
  }
}

const subnavigationRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.global-shell.subnavigation"
);
if (!subnavigationRoadmapItem) {
  errors.push("Subnavigation roadmap item is missing.");
} else {
  const axis = subnavigationRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "underline|pills") {
    errors.push(
      "Subnavigation roadmap variants must equal underline|pills."
    );
  }
  if (subnavigationRoadmapItem.target?.contract?.slots?.length !== 0) {
    errors.push("Subnavigation roadmap must not expose slots.");
  }
  if (
    subnavigationRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "Subnavigation"
  ) {
    errors.push(
      "Subnavigation roadmap must depend only on canonical Subnavigation."
    );
  }
}

const footerRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.global-shell.footer"
);
if (!footerRoadmapItem) {
  errors.push("Footer roadmap item is missing.");
} else {
  const axis = footerRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "simple|columns|cta|legal") {
    errors.push("Footer roadmap variants must equal simple|columns|cta|legal.");
  }
  if (footerRoadmapItem.target?.contract?.slots?.join("|") !== "brand") {
    errors.push("Footer roadmap must expose only the brand slot.");
  }
  if (
    footerRoadmapItem.target?.contract?.dependencies?.join("|") !== "Footer"
  ) {
    errors.push("Footer roadmap must depend only on canonical Footer.");
  }
}

const cookieConsentRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.global-shell.cookie-consent"
);
if (!cookieConsentRoadmapItem) {
  errors.push("Cookie Consent roadmap item is missing.");
} else {
  const axis = cookieConsentRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "banner|modal") {
    errors.push("Cookie Consent roadmap variants must equal banner|modal.");
  }
  if ((cookieConsentRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Cookie Consent roadmap must not expose slots.");
  }
  if (
    cookieConsentRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "Button|ButtonGroup"
  ) {
    errors.push(
      "Cookie Consent roadmap must depend on canonical Button and ButtonGroup."
    );
  }
  if (
    cookieConsentRoadmapItem.dependsOn?.join("|") !==
    "component.actions.button|component.actions.button-group"
  ) {
    errors.push(
      "Cookie Consent roadmap dependencies must reference Button and ButtonGroup."
    );
  }
}

const heroRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.hero-headers.hero"
);
if (!heroRoadmapItem) {
  errors.push("Hero roadmap item is missing.");
} else {
  const axis = heroRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (
    axis?.values?.join("|") !==
    "centered|split|product-mockup|media|lead-capture|launch-event"
  ) {
    errors.push("Hero roadmap variants drifted.");
  }
  if (heroRoadmapItem.target?.contract?.slots?.join("|") !== "media|form") {
    errors.push("Hero roadmap must expose only media and form slots.");
  }
  if (
    heroRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "Eyebrow|Button|ButtonGroup|MediaRatio|Form"
  ) {
    errors.push("Hero roadmap dependencies drifted.");
  }
  if (
    heroRoadmapItem.dependsOn?.join("|") !==
    "component.text.eyebrow|component.actions.button|component.actions.button-group|component.media.media-ratio|component.forms.form"
  ) {
    errors.push("Hero roadmap item references incorrect dependency IDs.");
  }
}

const pageHeaderRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.hero-headers.page-header"
);
if (!pageHeaderRoadmapItem) {
  errors.push("Page Header roadmap item is missing.");
} else {
  if (
    pageHeaderRoadmapItem.target?.variantMatrix?.required !== false ||
    (pageHeaderRoadmapItem.target?.variantMatrix?.axes?.length ?? 0) !== 0
  ) {
    errors.push("Page Header roadmap must not expose a public variant axis.");
  }
  if (
    pageHeaderRoadmapItem.target?.contract?.slots?.join("|") !== "support"
  ) {
    errors.push("Page Header roadmap must expose only the support slot.");
  }
  if (
    pageHeaderRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "PageHeader|Breadcrumbs"
  ) {
    errors.push("Page Header roadmap dependencies drifted.");
  }
  if (
    pageHeaderRoadmapItem.dependsOn?.join("|") !==
    "component.text.page-header|component.navigation.breadcrumbs"
  ) {
    errors.push("Page Header roadmap item references incorrect dependency IDs.");
  }
}

const logoCloudRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.brand-social-proof.logo-cloud"
);
if (!logoCloudRoadmapItem) {
  errors.push("Logo Cloud roadmap item is missing.");
} else {
  const axis = logoCloudRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "static|carousel") {
    errors.push("Logo Cloud roadmap variants must equal static|carousel.");
  }
  if ((logoCloudRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Logo Cloud roadmap must not expose slots.");
  }
  if (
    logoCloudRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "Logo|Carousel"
  ) {
    errors.push("Logo Cloud roadmap dependencies drifted.");
  }
  if (
    logoCloudRoadmapItem.dependsOn?.join("|") !==
    "component.media.logo|component.media.carousel"
  ) {
    errors.push("Logo Cloud roadmap item references incorrect dependency IDs.");
  }
}

const trustSignalsRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.brand-social-proof.trust-signals"
);
if (!trustSignalsRoadmapItem) {
  errors.push("Trust Signals roadmap item is missing.");
} else {
  const axis = trustSignalsRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "ratings|badges|awards") {
    errors.push("Trust Signals roadmap variants must equal ratings|badges|awards.");
  }
  if ((trustSignalsRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Trust Signals roadmap must not expose slots.");
  }
  if (
    trustSignalsRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "Rating|TrustBadge"
  ) {
    errors.push("Trust Signals roadmap dependencies drifted.");
  }
  if (
    trustSignalsRoadmapItem.dependsOn?.join("|") !==
    "component.data-display.rating|component.data-display.trust-badge"
  ) {
    errors.push("Trust Signals roadmap item references incorrect dependency IDs.");
  }
}

const testimonialRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.brand-social-proof.testimonials"
);
if (!testimonialRoadmapItem) {
  errors.push("Testimonials roadmap item is missing.");
} else {
  const axis = testimonialRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (
    axis?.values?.join("|") !==
    "single|grid|carousel|customer-results"
  ) {
    errors.push("Testimonials roadmap variants drifted.");
  }
  if ((testimonialRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Testimonials roadmap must not expose slots.");
  }
  if (
    testimonialRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "TestimonialCard|Carousel|StatCard"
  ) {
    errors.push("Testimonials roadmap dependencies drifted.");
  }
  if (
    testimonialRoadmapItem.dependsOn?.join("|") !==
    "component.cards.testimonial-card|component.media.carousel|component.cards.stat-card"
  ) {
    errors.push("Testimonials roadmap item references incorrect dependency IDs.");
  }
}

const caseStudyRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.brand-social-proof.case-studies"
);
if (!caseStudyRoadmapItem) {
  errors.push("Case Studies roadmap item is missing.");
} else {
  const axis = caseStudyRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "highlight|grid") {
    errors.push("Case Studies roadmap variants must equal highlight|grid.");
  }
  if ((caseStudyRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Case Studies roadmap must not expose slots.");
  }
  if (
    caseStudyRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "CaseStudyCard|Button"
  ) {
    errors.push("Case Studies roadmap dependencies drifted.");
  }
  if (
    caseStudyRoadmapItem.dependsOn?.join("|") !==
    "component.cards.case-study-card|component.actions.button"
  ) {
    errors.push("Case Studies roadmap item references incorrect dependency IDs.");
  }
}

const featureRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.features-product-demo.features"
);
if (!featureRoadmapItem) {
  errors.push("Features roadmap item is missing.");
} else {
  const axis = featureRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (
    axis?.values?.join("|") !==
    "grid|list|alternating|bento|tabs|comparison"
  ) {
    errors.push("Features roadmap variants drifted.");
  }
  if ((featureRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Features roadmap must not expose slots.");
  }
  if (
    featureRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "FeatureCard|Tabs|ComparisonTable"
  ) {
    errors.push("Features roadmap dependencies drifted.");
  }
  if (
    featureRoadmapItem.dependsOn?.join("|") !==
    "component.cards.feature-card|component.disclosure.tabs|component.data-display.comparison-table"
  ) {
    errors.push("Features roadmap item references incorrect dependency IDs.");
  }
}

const productDemoRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.features-product-demo.product-demo"
);
if (!productDemoRoadmapItem) {
  errors.push("Product Demo roadmap item is missing.");
} else {
  const axis = productDemoRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (
    axis?.values?.join("|") !==
    "screenshot|interactive|video|before-after"
  ) {
    errors.push("Product Demo roadmap variants drifted.");
  }
  if (productDemoRoadmapItem.target?.contract?.slots?.join("|") !== "media") {
    errors.push("Product Demo roadmap must expose only the media slot.");
  }
  if (
    productDemoRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "MediaRatio|VideoPlayer|BeforeAfterSlider"
  ) {
    errors.push("Product Demo roadmap dependencies drifted.");
  }
  if (
    productDemoRoadmapItem.dependsOn?.join("|") !==
    "component.media.media-ratio|component.media.video-player|component.media.before-after-slider"
  ) {
    errors.push("Product Demo roadmap item references incorrect dependency IDs.");
  }
}

const processRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.how-it-works-use-cases.process"
);
if (!processRoadmapItem) {
  errors.push("Process roadmap item is missing.");
} else {
  const axis = processRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (
    axis?.values?.join("|") !==
    "numbered-steps|cards|timeline|sticky|workflow-diagram"
  ) {
    errors.push("Process roadmap variants drifted.");
  }
  if ((processRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Process roadmap must not expose slots.");
  }
  if (
    processRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "Eyebrow|PanelPatternVisualSystem"
  ) {
    errors.push("Process roadmap dependencies drifted.");
  }
  if (
    processRoadmapItem.dependsOn?.join("|") !==
    "component.visual.panel-pattern-visual-system"
  ) {
    errors.push("Process roadmap item references incorrect dependency IDs.");
  }
}

const statsRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.stats-customer-proof.stats"
);
if (!statsRoadmapItem) {
  errors.push("Stats roadmap item is missing.");
} else {
  const axis = statsRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (
    axis?.values?.join("|") !==
    "kpi-band|grid|metric-cards|milestones"
  ) {
    errors.push("Stats roadmap variants drifted.");
  }
  if ((statsRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Stats roadmap must not expose slots.");
  }
  if (
    statsRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "StatCard"
  ) {
    errors.push("Stats roadmap dependencies drifted.");
  }
  if (
    statsRoadmapItem.dependsOn?.join("|") !==
    "component.cards.stat-card"
  ) {
    errors.push("Stats roadmap item references incorrect dependency IDs.");
  }
  if (
    statsRoadmapItem.status !== "ready" ||
    statsRoadmapItem.current?.registryRef !== "StatsSection" ||
    statsRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "769:6|770:171|770:170|770:2|770:53|770:96|770:129"
  ) {
    errors.push("Stats roadmap readiness or Figma evidence drifted.");
  }
}

const dataStoryRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.stats-customer-proof.data-story"
);
if (!dataStoryRoadmapItem) {
  errors.push("Data Story roadmap item is missing.");
} else {
  const axis = dataStoryRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (
    axis?.values?.join("|") !==
    "benchmark|data-story|customer-results|roi-result"
  ) {
    errors.push("Data Story roadmap variants drifted.");
  }
  if ((dataStoryRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Data Story roadmap must not expose slots.");
  }
  if (
    dataStoryRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "StatCard|ComparisonTable"
  ) {
    errors.push("Data Story roadmap dependencies drifted.");
  }
  if (
    dataStoryRoadmapItem.dependsOn?.join("|") !==
    "component.cards.stat-card|component.data-display.comparison-table"
  ) {
    errors.push("Data Story roadmap item references incorrect dependency IDs.");
  }
  if (
    dataStoryRoadmapItem.status !== "ready" ||
    dataStoryRoadmapItem.current?.registryRef !== "DataStorySection" ||
    dataStoryRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "769:6|774:322|774:321|774:89|774:229|774:256|774:293"
  ) {
    errors.push("Data Story roadmap readiness or Figma evidence drifted.");
  }
}

const pricingRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.pricing-comparison.pricing"
);
if (!pricingRoadmapItem) {
  errors.push("Pricing roadmap item is missing.");
} else {
  const axis = pricingRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "tiers|toggle|usage-based") {
    errors.push("Pricing roadmap variants drifted.");
  }
  if ((pricingRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Pricing roadmap must not expose slots.");
  }
  if (
    pricingRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "PricingCard|SwitchButton"
  ) {
    errors.push("Pricing roadmap dependencies drifted.");
  }
  if (
    pricingRoadmapItem.dependsOn?.join("|") !==
    "component.cards.pricing-card|component.actions.switch-button"
  ) {
    errors.push("Pricing roadmap item references incorrect dependency IDs.");
  }
  if (
    pricingRoadmapItem.status !== "ready" ||
    pricingRoadmapItem.current?.registryRef !== "PricingSection" ||
    pricingRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "779:62|779:63|780:4150|779:108|780:138|780:251"
  ) {
    errors.push("Pricing roadmap readiness or Figma evidence drifted.");
  }
}

const pricingComparisonRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.pricing-comparison.pricing-comparison"
);
if (!pricingComparisonRoadmapItem) {
  errors.push("Pricing Comparison roadmap item is missing.");
} else {
  const axis = pricingComparisonRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (
    axis?.values?.join("|") !==
    "feature-matrix|add-ons|enterprise-cta"
  ) {
    errors.push("Pricing Comparison roadmap variants drifted.");
  }
  if (
    (pricingComparisonRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0
  ) {
    errors.push("Pricing Comparison roadmap must not expose slots.");
  }
  if (
    pricingComparisonRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "ComparisonTable|PricingCard|Button"
  ) {
    errors.push("Pricing Comparison roadmap dependencies drifted.");
  }
  if (
    pricingComparisonRoadmapItem.dependsOn?.join("|") !==
    "component.data-display.comparison-table|component.cards.pricing-card|component.actions.button"
  ) {
    errors.push(
      "Pricing Comparison roadmap item references incorrect dependency IDs.",
    );
  }
  if (
    pricingComparisonRoadmapItem.status !== "ready" ||
    pricingComparisonRoadmapItem.current?.registryRef !==
      "PricingComparisonSection" ||
    pricingComparisonRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "779:62|782:267|783:4291|783:267|783:407|783:485"
  ) {
    errors.push("Pricing Comparison roadmap readiness or Figma evidence drifted.");
  }
}

const pricingFaqRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.pricing-comparison.pricing-faq"
);
if (!pricingFaqRoadmapItem) {
  errors.push("Pricing FAQ roadmap item is missing.");
} else {
  if (pricingFaqRoadmapItem.target?.variantMatrix?.required !== false) {
    errors.push("Pricing FAQ roadmap must not require a visual variant axis.");
  }
  if (
    (pricingFaqRoadmapItem.target?.variantMatrix?.axes?.length ?? 0) !== 0 ||
    (pricingFaqRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0
  ) {
    errors.push("Pricing FAQ roadmap axes or slots drifted.");
  }
  if (
    pricingFaqRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "Accordion"
  ) {
    errors.push("Pricing FAQ roadmap dependency drifted.");
  }
  if (
    pricingFaqRoadmapItem.dependsOn?.join("|") !==
    "component.disclosure.accordion"
  ) {
    errors.push("Pricing FAQ roadmap item references incorrect dependency IDs.");
  }
  if (
    pricingFaqRoadmapItem.status !== "ready" ||
    pricingFaqRoadmapItem.current?.registryRef !== "PricingFaqSection" ||
    pricingFaqRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "779:62|785:503|785:510|785:514"
  ) {
    errors.push("Pricing FAQ roadmap readiness or Figma evidence drifted.");
  }
}

const integrationsRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.integrations-security.integrations"
);
if (!integrationsRoadmapItem) {
  errors.push("Integrations roadmap item is missing.");
} else {
  const axis = integrationsRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "grid|directory|detail|ecosystem") {
    errors.push("Integrations roadmap variants drifted.");
  }
  if ((integrationsRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Integrations roadmap must not expose slots.");
  }
  if (
    integrationsRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "IntegrationCard|SearchInput|Logo"
  ) {
    errors.push("Integrations roadmap dependencies drifted.");
  }
  if (
    integrationsRoadmapItem.dependsOn?.join("|") !==
    "component.cards.integration-card|component.forms.search-input|component.media.logo"
  ) {
    errors.push("Integrations roadmap item references incorrect dependency IDs.");
  }
  if (
    integrationsRoadmapItem.status !== "ready" ||
    integrationsRoadmapItem.current?.registryRef !== "IntegrationsSection" ||
    integrationsRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "795:2|795:254|795:253|795:3|795:63|795:138|795:186|795:67|795:191"
  ) {
    errors.push("Integrations roadmap readiness or Figma evidence drifted.");
  }
}

const developerRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.integrations-security.developer"
);
if (!developerRoadmapItem) {
  errors.push("Developer roadmap item is missing.");
} else {
  const axis = developerRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "api|developer") {
    errors.push("Developer roadmap variants drifted.");
  }
  if ((developerRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Developer roadmap must not expose slots.");
  }
  if (
    developerRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "ContentBlock"
  ) {
    errors.push("Developer roadmap dependencies drifted.");
  }
  if (
    developerRoadmapItem.dependsOn?.join("|") !==
    "component.content.content-block"
  ) {
    errors.push("Developer roadmap item references incorrect dependency IDs.");
  }
  if (
    developerRoadmapItem.status !== "ready" ||
    developerRoadmapItem.current?.registryRef !== "DeveloperSection" ||
    developerRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "795:2|795:254|801:211|801:209|801:210|802:44|803:4498|804:5|804:34|805:5|805:37"
  ) {
    errors.push("Developer roadmap readiness or Figma evidence drifted.");
  }
  for (const check of Object.values(developerRoadmapItem.checks ?? {})) {
    if (check.required && check.status !== "done") {
      errors.push("Developer roadmap has an incomplete mandatory check.");
      break;
    }
  }
}

const trustRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.integrations-security.trust"
);
if (!trustRoadmapItem) {
  errors.push("Trust roadmap item is missing.");
} else {
  const axis = trustRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (
    axis?.values?.join("|") !==
    "security|compliance|trust-center|architecture"
  ) {
    errors.push("Trust roadmap variants drifted.");
  }
  if ((trustRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Trust roadmap must not expose slots.");
  }
  if (
    trustRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "TrustBadge|ComparisonTable"
  ) {
    errors.push("Trust roadmap dependencies drifted.");
  }
  if (
    trustRoadmapItem.dependsOn?.join("|") !==
    "component.data-display.trust-badge|component.data-display.comparison-table"
  ) {
    errors.push("Trust roadmap item references incorrect dependency IDs.");
  }
  if (
    trustRoadmapItem.status !== "ready" ||
    trustRoadmapItem.current?.registryRef !== "TrustSection" ||
    trustRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "795:2|795:254|810:255|810:251|810:252|810:253|810:254|811:8|811:19|811:27|812:7|812:18|812:4558|813:10"
  ) {
    errors.push("Trust roadmap readiness or Figma evidence drifted.");
  }
  for (const check of Object.values(trustRoadmapItem.checks ?? {})) {
    if (check.required && check.status !== "done") {
      errors.push("Trust roadmap has an incomplete mandatory check.");
      break;
    }
  }
}

const ctaRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.conversion.call-to-action"
);
if (!ctaRoadmapItem) {
  errors.push("Call to Action roadmap item is missing.");
} else {
  const axis = ctaRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "banner|card|split|full-bleed") {
    errors.push("Call to Action roadmap variants drifted.");
  }
  if ((ctaRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Call to Action roadmap must not expose slots.");
  }
  if (
    ctaRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "Eyebrow|ButtonGroup|Button|CalloutCard"
  ) {
    errors.push("Call to Action roadmap dependencies drifted.");
  }
  if (
    ctaRoadmapItem.dependsOn?.join("|") !==
    "component.text.eyebrow|component.actions.button-group|component.actions.button|component.cards.callout-card"
  ) {
    errors.push("Call to Action roadmap item references incorrect dependency IDs.");
  }
  if (
    ctaRoadmapItem.status !== "ready" ||
    ctaRoadmapItem.current?.registryRef !== "CtaSection" ||
    ctaRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "816:2|816:3|816:10|816:6|816:7|816:8|816:9|816:13|816:19|816:4705|816:4711|816:4719|816:4764|816:4770"
  ) {
    errors.push("Call to Action roadmap readiness or Figma evidence drifted.");
  }
  for (const check of Object.values(ctaRoadmapItem.checks ?? {})) {
    if (check.required && check.status !== "done") {
      errors.push("Call to Action roadmap has an incomplete mandatory check.");
      break;
    }
  }
}

const leadCaptureRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.conversion.lead-capture"
);
if (!leadCaptureRoadmapItem) {
  errors.push("Lead Capture roadmap item is missing.");
} else {
  const axis = leadCaptureRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (
    axis?.values?.join("|") !==
    "newsletter|lead-form|contact-form|demo-booking|waitlist|app-download"
  ) {
    errors.push("Lead Capture roadmap variants drifted.");
  }
  if ((leadCaptureRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Lead Capture roadmap must not expose slots.");
  }
  if (
    leadCaptureRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "Eyebrow|Form|FormField|Input|ConsentField|CalComEmbed|Button|ButtonGroup"
  ) {
    errors.push("Lead Capture roadmap dependencies drifted.");
  }
  if (
    leadCaptureRoadmapItem.dependsOn?.join("|") !==
    "component.text.eyebrow|component.forms.form|component.forms.form-field|component.forms.input|component.forms.consent-field|component.forms.cal-com-embed|component.actions.button|component.actions.button-group"
  ) {
    errors.push(
      "Lead Capture roadmap item references incorrect dependency IDs.",
    );
  }
  if (
    leadCaptureRoadmapItem.status !== "ready" ||
    leadCaptureRoadmapItem.current?.registryRef !== "LeadCaptureSection" ||
    leadCaptureRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "816:2|816:3|821:437|821:148|821:199|821:243|821:287|821:358|821:395|821:168|821:226|821:270|821:307|821:378|821:422|821:157|821:208|821:252|821:296|821:367|821:404"
  ) {
    errors.push("Lead Capture roadmap readiness or Figma evidence drifted.");
  }
  for (const check of Object.values(leadCaptureRoadmapItem.checks ?? {})) {
    if (check.required && check.status !== "done") {
      errors.push("Lead Capture roadmap has an incomplete mandatory check.");
      break;
    }
  }
}

const companyStoryRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.company.company-story"
);
if (!companyStoryRoadmapItem) {
  errors.push("Company Story roadmap item is missing.");
} else {
  const axis = companyStoryRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "about|mission|values|timeline") {
    errors.push("Company Story roadmap variants drifted.");
  }
  if ((companyStoryRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Company Story roadmap must not expose slots.");
  }
  if (
    companyStoryRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "ContentBlock"
  ) {
    errors.push("Company Story roadmap dependencies drifted.");
  }
  if (
    companyStoryRoadmapItem.dependsOn?.join("|") !==
    "component.content.content-block"
  ) {
    errors.push("Company Story roadmap item references incorrect dependency IDs.");
  }
  if (
    companyStoryRoadmapItem.status !== "ready" ||
    companyStoryRoadmapItem.current?.registryRef !== "CompanyStorySection" ||
    companyStoryRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "826:308|826:309|846:110|846:95|846:100|846:105|846:220|846:111|846:137|846:167|846:194|846:112|846:138|846:168|846:195|846:113|846:139|846:169|846:196|846:129|846:133|846:155|846:159|846:163|846:185|846:188|846:191|846:212|846:216"
  ) {
    errors.push("Company Story roadmap readiness or Figma evidence drifted.");
  }
  for (const check of Object.values(companyStoryRoadmapItem.checks ?? {})) {
    if (check.required && check.status !== "done") {
      errors.push("Company Story roadmap has an incomplete mandatory check.");
      break;
    }
  }
}

const teamRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.company.team"
);
if (!teamRoadmapItem) {
  errors.push("Team roadmap item is missing.");
} else {
  const axis = teamRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "team|leadership") {
    errors.push("Team roadmap variants drifted.");
  }
  if ((teamRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Team roadmap must not expose slots.");
  }
  if (
    teamRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "ContentBlock|TeamMemberCard"
  ) {
    errors.push("Team roadmap dependencies drifted.");
  }
  if (
    teamRoadmapItem.dependsOn?.join("|") !==
    "component.cards.team-member-card|component.content.content-block"
  ) {
    errors.push("Team roadmap item references incorrect dependency IDs.");
  }
  if (
    teamRoadmapItem.status !== "ready" ||
    teamRoadmapItem.current?.registryRef !== "TeamSection" ||
    teamRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "826:308|826:309|866:5569|866:136|866:142|866:137|866:143|866:138|866:144|866:139|866:145|866:5509|866:5517|866:5525|866:5533|866:5541|866:5550|866:5559"
  ) {
    errors.push("Team roadmap readiness or Figma evidence drifted.");
  }
  for (const check of Object.values(teamRoadmapItem.checks ?? {})) {
    if (check.required && check.status !== "done") {
      errors.push("Team roadmap has an incomplete mandatory check.");
      break;
    }
  }
}

const careersRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.company.careers"
);
if (!careersRoadmapItem) {
  errors.push("Careers roadmap item is missing.");
} else {
  const axis = careersRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "overview|job-list") {
    errors.push("Careers roadmap variants drifted.");
  }
  if ((careersRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Careers roadmap must not expose slots.");
  }
  if (
    careersRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "JobCard|ContentBlock"
  ) {
    errors.push("Careers roadmap dependencies drifted.");
  }
  if (
    careersRoadmapItem.dependsOn?.join("|") !==
    "component.cards.job-card|component.content.content-block"
  ) {
    errors.push("Careers roadmap item references incorrect dependency IDs.");
  }
  if (
    careersRoadmapItem.status !== "ready" ||
    careersRoadmapItem.current?.registryRef !== "CareersSection" ||
    careersRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "826:308|826:309|877:228|877:229|877:237|877:230|877:238|877:231|877:239|877:232|877:240|877:286|877:316|877:372|877:398|877:415|287:20|873:5438|872:419|872:414"
  ) {
    errors.push("Careers roadmap readiness or Figma evidence drifted.");
  }
  for (const check of Object.values(careersRoadmapItem.checks ?? {})) {
    if (check.required && check.status !== "done") {
      errors.push("Careers roadmap has an incomplete mandatory check.");
      break;
    }
  }
}

const companyContactRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.company.company-contact"
);
if (!companyContactRoadmapItem) {
  errors.push("Company Contact roadmap item is missing.");
} else {
  const axis = companyContactRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "locations|contact|press") {
    errors.push("Company Contact roadmap variants drifted.");
  }
  if (
    companyContactRoadmapItem.target?.contract?.slots?.join("|") !== "form"
  ) {
    errors.push("Company Contact roadmap must expose only the form slot.");
  }
  if (
    companyContactRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "ContentBlock|Form"
  ) {
    errors.push("Company Contact roadmap dependencies drifted.");
  }
  if (
    companyContactRoadmapItem.dependsOn?.join("|") !==
    "component.forms.form|component.content.content-block"
  ) {
    errors.push(
      "Company Contact roadmap item references incorrect dependency IDs.",
    );
  }
  if (
    companyContactRoadmapItem.status !== "ready" ||
    companyContactRoadmapItem.current?.registryRef !==
      "CompanyContactSection" ||
    companyContactRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "826:308|826:309|826:366|826:318|826:336|826:354|826:531|826:367|826:427|826:491|826:387|826:447|826:511|826:412|826:417|826:422|826:464|826:469|826:474|826:526"
  ) {
    errors.push("Company Contact roadmap readiness or Figma evidence drifted.");
  }
  for (const check of Object.values(companyContactRoadmapItem.checks ?? {})) {
    if (check.required && check.status !== "done") {
      errors.push(
        "Company Contact roadmap has an incomplete mandatory check.",
      );
      break;
    }
  }
}

const faqRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.content-resources.faq"
);
if (!faqRoadmapItem) {
  errors.push("FAQ roadmap item is missing.");
} else {
  const axis = faqRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "stacked|split") {
    errors.push("FAQ roadmap variants drifted.");
  }
  if ((faqRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("FAQ roadmap must not expose slots.");
  }
  if (
    faqRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "ContentBlock|Accordion"
  ) {
    errors.push("FAQ roadmap dependencies drifted.");
  }
  if (
    faqRoadmapItem.dependsOn?.join("|") !==
    "component.disclosure.accordion|component.content.content-block"
  ) {
    errors.push("FAQ roadmap item references incorrect dependency IDs.");
  }
  if (
    faqRoadmapItem.status !== "ready" ||
    faqRoadmapItem.current?.registryRef !== "FaqSection" ||
    faqRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "831:2|831:3|831:141|831:6|831:94|831:7|831:95|831:8|831:96|831:35|831:111"
  ) {
    errors.push("FAQ roadmap readiness or Figma evidence drifted.");
  }
  for (const check of Object.values(faqRoadmapItem.checks ?? {})) {
    if (check.required && check.status !== "done") {
      errors.push("FAQ roadmap has an incomplete mandatory check.");
      break;
    }
  }
}

const contentListingRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.content-resources.content-listing"
);
if (!contentListingRoadmapItem) {
  errors.push("Content Listing roadmap item is missing.");
} else {
  const axis =
    contentListingRoadmapItem.target?.variantMatrix?.axes?.find(
      (entry) => entry.name === "variant"
    );
  if (axis?.values?.join("|") !== "featured|grid|list|categories") {
    errors.push("Content Listing roadmap variants drifted.");
  }
  if ((contentListingRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Content Listing roadmap must not expose slots.");
  }
  if (
    contentListingRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "ContentBlock|ArticleCard|SearchInput|Pagination"
  ) {
    errors.push("Content Listing roadmap dependencies drifted.");
  }
  if (
    contentListingRoadmapItem.dependsOn?.join("|") !==
    "component.content.content-block|component.cards.article-card|component.forms.search-input|component.navigation.pagination"
  ) {
    errors.push(
      "Content Listing roadmap item references incorrect dependency IDs.",
    );
  }
  if (
    contentListingRoadmapItem.status !== "ready" ||
    contentListingRoadmapItem.current?.registryRef !==
      "ContentListingSection" ||
    contentListingRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "831:2|831:3|884:119|884:120|884:122|884:130|887:336|885:130|885:5584|886:248|886:5676|885:131|885:5585|886:249|886:5677|885:132|885:5586|886:250|886:5678|885:148|885:163|885:170|885:5602|885:5613|885:5624|885:5636|886:266|886:273|886:280|886:5693|886:5701|886:5718|287:20|881:490|881:499|881:508|223:65|350:382"
  ) {
    errors.push(
      "Content Listing roadmap readiness or Figma evidence drifted.",
    );
  }
  for (const check of Object.values(
    contentListingRoadmapItem.checks ?? {}
  )) {
    if (check.required && check.status !== "done") {
      errors.push(
        "Content Listing roadmap has an incomplete mandatory check.",
      );
      break;
    }
  }
}

const resourceLibraryRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.content-resources.resource-library"
);
if (!resourceLibraryRoadmapItem) {
  errors.push("Resource Library roadmap item is missing.");
} else {
  const axis =
    resourceLibraryRoadmapItem.target?.variantMatrix?.axes?.find(
      (entry) => entry.name === "variant"
    );
  if (axis?.values?.join("|") !== "library|guides|ebooks") {
    errors.push("Resource Library roadmap variants drifted.");
  }
  if ((resourceLibraryRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Resource Library roadmap must not expose slots.");
  }
  if (
    resourceLibraryRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "ContentBlock|ResourceCard|SearchInput|Pagination"
  ) {
    errors.push("Resource Library roadmap dependencies drifted.");
  }
  if (
    resourceLibraryRoadmapItem.dependsOn?.join("|") !==
    "component.content.content-block|component.cards.resource-card|component.forms.search-input|component.navigation.pagination"
  ) {
    errors.push(
      "Resource Library roadmap item references incorrect dependency IDs.",
    );
  }
  if (
    resourceLibraryRoadmapItem.status !== "ready" ||
    resourceLibraryRoadmapItem.current?.registryRef !==
      "ResourceLibrarySection" ||
    resourceLibraryRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "831:2|831:3|896:5916|896:305|896:5817|896:5876|896:306|896:5818|896:5877|896:307|896:5819|896:5878|896:322|896:330|896:344|896:358|896:5835|896:5846|896:5858|896:5894|896:5905|287:20|223:65|350:382|892:439|892:450|892:461"
  ) {
    errors.push(
      "Resource Library roadmap readiness or Figma evidence drifted.",
    );
  }
  for (const check of Object.values(
    resourceLibraryRoadmapItem.checks ?? {}
  )) {
    if (check.required && check.status !== "done") {
      errors.push(
        "Resource Library roadmap has an incomplete mandatory check.",
      );
      break;
    }
  }
}

const eventsRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.content-resources.events"
);
if (!eventsRoadmapItem) {
  errors.push("Events roadmap item is missing.");
} else {
  const axis = eventsRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "webinars|events|podcast") {
    errors.push("Events roadmap variants drifted.");
  }
  if ((eventsRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Events roadmap must not expose slots.");
  }
  if (
    eventsRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "ContentBlock|ResourceCard|Carousel"
  ) {
    errors.push("Events roadmap dependencies drifted.");
  }
  if (
    eventsRoadmapItem.dependsOn?.join("|") !==
    "component.content.content-block|component.cards.resource-card|component.media.carousel"
  ) {
    errors.push("Events roadmap item references incorrect dependency IDs.");
  }
  if (
    eventsRoadmapItem.status !== "ready" ||
    eventsRoadmapItem.current?.registryRef !== "EventsSection" ||
    eventsRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "831:2|831:3|901:650|901:626|901:634|901:642|902:22|902:5971|903:99|902:46|902:5992|903:123|902:68|902:82|902:6013|903:144|287:20|892:450|593:212|593:128"
  ) {
    errors.push("Events roadmap readiness or Figma evidence drifted.");
  }
  for (const check of Object.values(eventsRoadmapItem.checks ?? {})) {
    if (check.required && check.status !== "done") {
      errors.push("Events roadmap has an incomplete mandatory check.");
      break;
    }
  }
}

const changelogRoadmapItem = (roadmap.items ?? []).find(
  (entry) => entry.id === "section.content-resources.changelog"
);
if (!changelogRoadmapItem) {
  errors.push("Changelog roadmap item is missing.");
} else {
  const axis = changelogRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "changelog|newsletter-archive") {
    errors.push("Changelog roadmap variants drifted.");
  }
  if ((changelogRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0) {
    errors.push("Changelog roadmap must not expose slots.");
  }
  if (
    changelogRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "ContentBlock|ArticleCard|Pagination"
  ) {
    errors.push("Changelog roadmap dependencies drifted.");
  }
  if (
    changelogRoadmapItem.dependsOn?.join("|") !==
    "component.content.content-block|component.cards.article-card|component.navigation.pagination"
  ) {
    errors.push("Changelog roadmap item references incorrect dependency IDs.");
  }
  if (
    changelogRoadmapItem.status !== "blocked" ||
    changelogRoadmapItem.current?.registryRef !== "ChangelogSection" ||
    changelogRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "831:2|831:3|907:567|907:555|907:561"
  ) {
    errors.push("Changelog roadmap block or partial Figma evidence drifted.");
  }
  for (const [checkName, check] of Object.entries(
    changelogRoadmapItem.checks ?? {}
  )) {
    const expectedStatus = [
      "figmaRepresentation",
      "parity",
      "release",
    ].includes(checkName)
      ? "blocked"
      : "done";
    if (check.required && check.status !== expectedStatus) {
      errors.push(
        `Changelog roadmap mandatory check "${checkName}" must be ${expectedStatus}.`,
      );
    }
  }
}

const productComparisonRoadmapItem = (roadmap.items ?? []).find(
  (entry) =>
    entry.id === "section.product-communication.product-comparison"
);
if (!productComparisonRoadmapItem) {
  errors.push("Product Comparison roadmap item is missing.");
} else {
  const axis = productComparisonRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "comparison|alternatives") {
    errors.push("Product Comparison roadmap variants drifted.");
  }
  if (
    (productComparisonRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0
  ) {
    errors.push("Product Comparison roadmap must not expose slots.");
  }
  if (
    productComparisonRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "ContentBlock|ComparisonTable|Button"
  ) {
    errors.push("Product Comparison roadmap dependencies drifted.");
  }
  if (
    productComparisonRoadmapItem.dependsOn?.join("|") !==
    "component.data-display.comparison-table|component.actions.button|component.content.content-block"
  ) {
    errors.push(
      "Product Comparison roadmap item references incorrect dependency IDs.",
    );
  }
  if (
    productComparisonRoadmapItem.status !== "ready" ||
    productComparisonRoadmapItem.current?.registryRef !==
      "ProductComparisonSection" ||
    productComparisonRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "834:2|834:3|834:271|834:6|834:180|834:7|834:181|834:8|834:183|834:45|834:205|834:35|834:198"
  ) {
    errors.push(
      "Product Comparison roadmap readiness or Figma evidence drifted.",
    );
  }
  for (const check of Object.values(
    productComparisonRoadmapItem.checks ?? {}
  )) {
    if (check.required && check.status !== "done") {
      errors.push(
        "Product Comparison roadmap has an incomplete mandatory check.",
      );
      break;
    }
  }
}

const productAnnouncementRoadmapItem = (roadmap.items ?? []).find(
  (entry) =>
    entry.id === "section.product-communication.product-announcement"
);
if (!productAnnouncementRoadmapItem) {
  errors.push("Product Announcement roadmap item is missing.");
} else {
  const axis = productAnnouncementRoadmapItem.target?.variantMatrix?.axes?.find(
    (entry) => entry.name === "variant"
  );
  if (axis?.values?.join("|") !== "launch|promotion|status") {
    errors.push("Product Announcement roadmap variants drifted.");
  }
  if (
    (productAnnouncementRoadmapItem.target?.contract?.slots?.length ?? 0) !== 0
  ) {
    errors.push("Product Announcement roadmap must not expose slots.");
  }
  if (
    productAnnouncementRoadmapItem.target?.contract?.dependencies?.join("|") !==
    "CalloutCard|NavBanner|Alert"
  ) {
    errors.push("Product Announcement roadmap dependencies drifted.");
  }
  if (
    productAnnouncementRoadmapItem.dependsOn?.join("|") !==
    "component.navigation.nav-banner|component.cards.callout-card|component.data-display.alert"
  ) {
    errors.push(
      "Product Announcement roadmap item references incorrect dependency IDs.",
    );
  }
  if (
    productAnnouncementRoadmapItem.status !== "ready" ||
    productAnnouncementRoadmapItem.current?.registryRef !==
      "ProductAnnouncementSection" ||
    productAnnouncementRoadmapItem.evidence?.figmaNodeIds?.join("|") !==
      "834:2|834:3|840:384|840:244|840:325|840:346|840:245|840:326|840:347|840:246|840:327|840:348"
  ) {
    errors.push(
      "Product Announcement roadmap readiness or Figma evidence drifted.",
    );
  }
  for (const check of Object.values(
    productAnnouncementRoadmapItem.checks ?? {}
  )) {
    if (check.required && check.status !== "done") {
      errors.push(
        "Product Announcement roadmap has an incomplete mandatory check.",
      );
      break;
    }
  }
}

const globalRulesPath = "AGENTIC-RULES.json";
const globalRules = read(globalRulesPath);
for (const contract of [
  '"status": "active"',
  '"AnnouncementBarSection"',
  '"MarketingNavigationSection"',
  '"SubnavigationSection"',
  '"FooterSection"',
  '"CookieConsentSection"',
  '"HeroSection"',
  '"PageHeaderSection"',
  '"LogoCloudSection"',
  '"TrustSignalsSection"',
  '"TestimonialSection"',
  '"CaseStudySection"',
  '"FeatureSection"',
  '"ProductDemoSection"',
  '"ProcessSection"',
  '"UseCasesSection"',
  '"StatsSection"',
  '"DataStorySection"',
  '"PricingSection"',
  '"PricingComparisonSection"',
  '"PricingFaqSection"',
  '"IntegrationsSection"',
  '"DeveloperSection"',
  '"TrustSection"',
  '"CtaSection"',
  '"LeadCaptureSection"',
  '"CompanyStorySection"',
  '"TeamSection"',
  '"CareersSection"',
  '"CompanyContactSection"',
  '"FaqSection"',
  '"ContentListingSection"',
  '"ResourceLibrarySection"',
  '"EventsSection"',
  '"ChangelogSection"',
  '"ProductComparisonSection"',
  '"ProductAnnouncementSection"',
  '"Figma2Astro Agentic Rules/22-website-sections.md"'
]) {
  requireContract(globalRules, contract, globalRulesPath);
}

const polishPattern =
  /[ąćęłńóśźż]|\b(?:oraz|dla|jest|należy|brakuje|istnieje|użyj|kiedy|komponentów|stron|systemu|kolorów|gotowy)\b/iu;
for (const path of [docsPath, agenticRulePath, figmaRulePath]) {
  if (polishPattern.test(read(path))) {
    errors.push(`${path} contains authored Polish.`);
  }
}

if (errors.length) {
  console.error("Website Sections audit failed:");
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(
  "Website Sections audit passed: twelve families are documented; thirty-five sections are ready, and ChangelogSection code is in review with Figma parity explicitly blocked."
);
