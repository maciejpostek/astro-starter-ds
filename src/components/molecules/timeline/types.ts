export interface TimelineStageData {
  id: string;
  number: string;
  name: string;
  category: string;
  detailedDescription: string;
  startWeek: number;
  durationWeeks: number;
  deliverables: string[];
  active?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}
