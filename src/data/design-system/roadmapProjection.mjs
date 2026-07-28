const priorityLabels = {
  1: "critical",
  2: "high",
  3: "medium",
  4: "low",
  5: "low"
};

const statusLabels = {
  planned: "not-started",
  partial: "in-progress",
  "in-progress": "in-progress",
  review: "in-progress",
  ready: "done",
  deprecated: "later",
  blocked: "blocked"
};

const titleFromId = (value) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const aggregateStatus = (items) => {
  if (items.some((item) => item.status === "blocked")) return "blocked";
  if (items.every((item) => item.status === "ready")) return "done";
  if (items.every((item) => item.status === "planned")) return "not-started";
  if (items.every((item) => item.status === "deprecated")) return "later";
  return "in-progress";
};

const aggregatePriority = (items) =>
  priorityLabels[Math.min(...items.map((item) => item.priority))];

const collectFamilyTitles = (taxonomy) => {
  const entries = [
    ...(taxonomy.componentFamilies ?? []),
    ...(taxonomy.websiteSectionFamilies ?? []),
    ...(taxonomy.pageTemplateGroups ?? [])
  ];

  return new Map(entries.map((entry) => [entry.id, entry.title]));
};

export const createPublicRoadmap = (roadmap) => {
  const familyTitles = collectFamilyTitles(roadmap.taxonomy);
  const publicItems = roadmap.items.filter((item) => item.visibility === "public");

  return roadmap.taxonomy.categories.flatMap((category) => {
    const categoryItems = publicItems.filter((item) => item.category === category.id);
    if (categoryItems.length === 0) return [];

    const familyIds = [...new Set(categoryItems.map((item) => item.family))];
    const familyRows = familyIds
      .map((familyId) => {
        const familyItems = categoryItems
          .filter((item) => item.family === familyId)
          .sort((left, right) =>
            left.priority - right.priority || left.title.localeCompare(right.title)
          );

        return {
          id: `roadmap-family-${category.id}-${familyId}`,
          title: familyTitles.get(familyId) ?? titleFromId(familyId),
          type: "roadmap-family",
          area: familyId,
          priority: aggregatePriority(familyItems),
          status: aggregateStatus(familyItems),
          children: familyItems.map((item) => ({
            id: item.id,
            title: item.title,
            type: item.kind,
            area: item.family,
            layer: item.layer,
            priority: priorityLabels[item.priority],
            status: statusLabels[item.status],
            description: item.publicSummary
          }))
        };
      })
      .sort((left, right) => left.title.localeCompare(right.title));

    return [
      {
        id: `roadmap-category-${category.id}`,
        title: category.title,
        type: "roadmap-category",
        area: category.id,
        priority: aggregatePriority(categoryItems),
        status: aggregateStatus(categoryItems),
        description: `Tracks ${category.title.toLowerCase()} across the code-first design-system workflow.`,
        children: familyRows
      }
    ];
  });
};
