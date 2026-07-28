import type { MediaRatioValue } from "../../components/atoms/media/types";

export type MediaPlaceholderVariant =
  | "image"
  | "video"
  | "productPreview";

export interface MediaPlaceholderDefinition {
  variant: MediaPlaceholderVariant;
  title: string;
  label: string;
  ratio: MediaRatioValue;
  role: string;
  useWhen: string;
  avoidWhen: string;
  fixtureOnly: true;
}

export const mediaPlaceholderCatalog = [
  {
    variant: "image",
    title: "Image Fixture",
    label: "Neutral image fixture",
    ratio: "4:3",
    role: "Reserve image space while documenting crop, ratio, and composition.",
    useWhen: "A component example needs stable image geometry before project media exists.",
    avoidWhen: "The image itself provides evidence, identity, product detail, or editorial meaning.",
    fixtureOnly: true,
  },
  {
    variant: "video",
    title: "Video Poster Fixture",
    label: "Neutral video poster fixture",
    ratio: "16:9",
    role: "Reserve a poster frame while documenting video placement and playback context.",
    useWhen: "A documentation example needs video geometry without shipping a sample recording.",
    avoidWhen: "Playback behavior, captions, transcript quality, or real footage must be evaluated.",
    fixtureOnly: true,
  },
  {
    variant: "productPreview",
    title: "Product Preview Fixture",
    label: "Neutral product preview fixture",
    ratio: "16:9",
    role: "Represent a schematic product-preview area without inventing a product interface.",
    useWhen: "A section or card example needs a neutral product-media boundary.",
    avoidWhen: "A real feature, workflow, metric, or customer result must be shown.",
    fixtureOnly: true,
  },
] as const satisfies readonly MediaPlaceholderDefinition[];

export const mediaPlaceholderByVariant = Object.fromEntries(
  mediaPlaceholderCatalog.map((item) => [item.variant, item]),
) as Record<MediaPlaceholderVariant, MediaPlaceholderDefinition>;
