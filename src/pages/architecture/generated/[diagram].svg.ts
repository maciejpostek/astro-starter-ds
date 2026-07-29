import type { APIRoute, GetStaticPaths } from "astro";

const generatedDiagrams = import.meta.glob(
  "../../../../architecture/generated/*.svg",
  {
    eager: true,
    import: "default",
    query: "?raw"
  }
) as Record<string, string>;

export const getStaticPaths = (() =>
  Object.entries(generatedDiagrams).map(([sourcePath, source]) => ({
    params: {
      diagram: sourcePath.split("/").at(-1)?.replace(/\.svg$/, "")
    },
    props: { source }
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(props.source, {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Type": "image/svg+xml; charset=utf-8"
    }
  });
