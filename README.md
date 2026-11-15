# SELENE — Vercel + Groq

A cleaner lunar mission-planning UI using real NASA/JPL LRO WAC image tiles (not an iframe). NASA/JPL tile service is referenced directly; internet access is required and tile coverage/availability is controlled by the provider.

## Deploy to Vercel
1. Upload this folder to GitHub, then import the repository in Vercel (or use Vercel CLI).
2. Add `GROQ_API_KEY` in Project Settings → Environment Variables.
3. Redeploy. API route is `/api/mission-advice`.
4. Optional `GROQ_MODEL` env var (default `llama-3.3-70b-versatile`).

## NASA imagery
The map requests LRO WAC global mosaic tiles from NASA/JPL Trek WMTS. Tile matrix zoom 0 begins with two global tiles; higher zooms request the corresponding matrix rows/columns. If NASA changes the service or tiles fail, use the source link to Moon Trek.

## Honest science boundary
This app does not yet query LOLA or Diviner point rasters. It labels these values unknown/not sampled. The AI is prompted not to invent measured data or certify a landing site. Moon Trek provides advanced interactive analyses at https://trek.nasa.gov/moon/ and tile service docs at https://api.nasa.gov/.

## Simulator
Educational simplified descent arithmetic only; not flight dynamics or mission software.
