import type { APIRoute, GetStaticPaths } from "astro";
import systemMap from "../../../../architecture/system-map.json";
import { layoutArchitectureView } from "../../../lib/architecture/layoutArchitectureView";
import { projectArchitectureView } from "../../../lib/architecture/projectArchitectureView";
import type { ArchitectureSystemMap } from "../../../lib/architecture/types";

const model = systemMap as ArchitectureSystemMap;

export const getStaticPaths = (async () => {
  const presentableViews = model.views.filter((view) => view.presentation);

  return Promise.all(
    presentableViews.map(async (view) => {
      const projection = projectArchitectureView(model, view.id);
      const payload = await layoutArchitectureView(projection);

      return {
        params: { view: view.id.replace(/^view\./, "") },
        props: { payload }
      };
    })
  );
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(JSON.stringify(props.payload), {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Type": "application/json; charset=utf-8"
    }
  });
