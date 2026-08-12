import iconLibrary from "../../data/design-system/iconLibrary.json";

export const socialIcons = iconLibrary.social.platforms;

export type SocialIconPlatform = keyof typeof socialIcons;
export type SocialIconVariant = "brand" | "monochrome";

export const socialIconPlatforms = Object.keys(
  socialIcons
) as SocialIconPlatform[];

export const getSocialIcon = (
  platform: SocialIconPlatform,
  variant: SocialIconVariant = "brand"
) => socialIcons[platform]?.variants[variant];

export const getSocialIconLabel = (platform: SocialIconPlatform) =>
  socialIcons[platform]?.label ?? platform;

let socialIconInstance = 0;

export const namespaceSocialIconMarkup = (innerSvg: string) => {
  const suffix = `-instance-${socialIconInstance++}`;
  const ids = Array.from(
    innerSvg.matchAll(/\bid="([^"]+)"/g),
    (match) => match[1]
  );

  return ids.reduce(
    (markup, id) =>
      markup
        .replaceAll(`id="${id}"`, `id="${id}${suffix}"`)
        .replaceAll(`url(#${id})`, `url(#${id}${suffix})`)
        .replaceAll(`href="#${id}"`, `href="#${id}${suffix}"`)
        .replaceAll(`xlink:href="#${id}"`, `xlink:href="#${id}${suffix}"`),
    innerSvg
  );
};
