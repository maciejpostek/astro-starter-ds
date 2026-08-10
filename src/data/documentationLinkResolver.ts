import { materialSymbolNames } from "../lib/icons/materialSymbols";
import {
  architecture,
  documentationComponentHref,
  documentationPageHref,
  slugifyDocumentationValue,
} from "./documentationRegistry";
import {
  documentationFoundationDefinitions,
  type DocumentationFoundationKey,
} from "./documentationFoundationRegistry";
import {
  componentColorGroups,
  type DocumentationComponentColorGroupId,
} from "./documentationFoundationData";
import { documentationTokenHref, getDocumentationToken } from "./documentationTokenRegistry";

export type DocumentationLinkTarget =
  | { kind: "component"; id: string }
  | { kind: "foundation"; key: DocumentationFoundationKey; sectionId?: string }
  | { kind: "component-color-group"; id: DocumentationComponentColorGroupId }
  | { kind: "token"; name: string }
  | { kind: "icon"; name: string }
  | { kind: "rule"; componentId: string }
  | { kind: "external"; href: string; label: string };

export interface ResolvedDocumentationLink {
  href: string;
  label: string;
  copyValue: string;
}

export const resolveDocumentationLink = (
  target: DocumentationLinkTarget,
): ResolvedDocumentationLink => {
  if (target.kind === "external") {
    return { href: target.href, label: target.label, copyValue: target.href };
  }

  if (target.kind === "component" || target.kind === "rule") {
    const componentId = target.kind === "component" ? target.id : target.componentId;
    const component = architecture.components.find((record) => record.id === componentId);
    if (!component) throw new Error(`Documentation link references unknown component: ${componentId}`);
    const href = documentationComponentHref(component);
    return {
      href: target.kind === "rule" ? `${href}#component-rule` : href,
      label: target.kind === "rule" ? `${component.name} UX rule` : component.name,
      copyValue: component.name,
    };
  }

  if (target.kind === "foundation") {
    const definition = documentationFoundationDefinitions[target.key];
    if (!definition) throw new Error(`Documentation link references unknown Foundation: ${target.key}`);
    if (target.sectionId && !definition.sections.some((section) => section.id === target.sectionId)) {
      throw new Error(`Documentation link references unknown ${target.key} section: ${target.sectionId}`);
    }
    return {
      href: `${documentationPageHref("foundations", target.key)}${target.sectionId ? `#${target.sectionId}` : ""}`,
      label: target.sectionId
        ? definition.sections.find((section) => section.id === target.sectionId)?.title ?? definition.title
        : definition.title,
      copyValue: definition.title,
    };
  }

  if (target.kind === "component-color-group") {
    const group = componentColorGroups[target.id];
    if (!group) throw new Error(`Documentation link references unknown component color group: ${target.id}`);
    return {
      href: `${documentationPageHref("foundations", "color")}#colors-component-${target.id}`,
      label: group.title,
      copyValue: group.id,
    };
  }

  if (target.kind === "token") {
    const token = getDocumentationToken(target.name);
    return {
      href: documentationTokenHref(token),
      label: token.name,
      copyValue: token.name,
    };
  }

  if (!materialSymbolNames.includes(target.name as (typeof materialSymbolNames)[number])) {
    throw new Error(`Documentation link references unknown icon: ${target.name}`);
  }
  return {
    href: `/design-system/assets/icons#icon-${slugifyDocumentationValue(target.name)}`,
    label: target.name,
    copyValue: target.name,
  };
};
