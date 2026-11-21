<!--portfolio
title: From three days to one click: automating the maps behind a spring-shed treatment report
dek: How I turned a manual GIS bottleneck into a repeatable pipeline, and the product decisions, trade-offs and limits along the way.
topics: Mapping, Product decisions, Automation
image: Map.png
-->

# From three days to one click: automating the maps behind a spring-shed treatment report

## The problem

A Detailed Treatment Report (DTR) is the document that decides what gets built in a spring-shed area. It consolidates the suitable interventions for that site, along with the evidence they rest on: rock orientation, soil type, vegetation index, slope, and the other parameters needed to sustain an intervention through rainfall and other calamities.

The maps in a DTR were made by hand in GIS software. One DTR could take up to three days to produce. That was tolerable when we handled a few sites. It stops being tolerable as the number of spring-sheds grows, because the maps become the bottleneck for the whole programme. Field teams finish surveys and then wait on cartography.

I framed it as a throughput problem, not a tooling problem. The question was not "which GIS software is better" but "which parts of this work are identical every time, and why is a person doing them?"

## What a person was actually doing

Before writing code, I listed the steps behind a DTR map set:

1. Get elevation data for the site.
2. Clip it to the village or spring-shed boundary.
3. Derive slope and aspect.
4. Add contours at a sensible interval.
5. Put it all over a satellite image, with a scale bar, north arrow and legend.
6. Export, check, repeat for each map.

Almost nothing in that list requires judgement. The judgement sits in what the maps are used for (choosing interventions), not in producing them. That made it a good candidate for automation: high repetition, a clear input (a boundary file), and a clear output (a map set).

## The solution

The tool takes one input, a KML boundary of the area, plus a few parameters, and produces three print-ready maps and the underlying rasters:

- **Elevation (DEM)** map
- **Slope** map with contours at a chosen interval
- **Aspect** map
- GeoTIFFs of each, so the analysts can still go further in GIS if needed

The pipeline is Python end to end. It downloads a DEM for the boundary from OpenTopography, upscales it, clips it to the exact boundary, computes slope and aspect with GDAL, fetches satellite imagery for the same extent, and renders the maps with the boundary overlaid.

As of this reporting period, map creation for the DTR is fully automated and runs with a single click.

## Decisions that mattered

**Download wider than the boundary, then clip.** Slope and aspect are computed from neighbouring cells, so cells on the edge of a clipped raster are unreliable. I download the DEM with a buffer around the boundary (200 m by default), do the processing on the larger area, and clip last. The maps stay clean right up to the boundary line.

**Upscale before clipping, not after.** Source elevation data is about 30 m per cell, which looks blocky on a village-scale map. Resampling the whole tile first and clipping afterwards avoids ragged edges and keeps the boundary shape accurate.

**Make parameters visible, not hidden.** The contour interval, buffer, DEM source, upscale factor and the spring name on the map titles are all inputs. In the manual process these were implicit choices that differed from person to person. Making them explicit means two people running the same site get the same maps.

**Fail loudly with useful messages.** A bad API key, a boundary file with no polygon, an area that is too large, or a contour interval that would draw thousands of lines each stop the run with a plain explanation. A tool that silently produces a wrong map is worse than a slow manual process.

**Guardrails on cost.** The area is capped at roughly 33 km per side, the upscale factor is bounded, and the satellite tile download automatically drops to a lower zoom if it would otherwise fetch too many tiles. These are the kind of limits that are easy to skip in a prototype and expensive to discover in production.

## From script to a page anyone can use

A script that only I can run is a prototype, not a product. The next step was a small web interface: upload the KML, enter the spring name, API key and contour interval, press generate, watch progress, then download each map or everything as one ZIP.

Two design choices worth noting:

- The API key is used for that run only. It is never stored or written to a log, and it is stripped from error messages.
- Jobs run one at a time in the background with a visible queue state. The processing is memory-heavy, and a predictable queue is better than a crashed server.

## What this does not do, and what I would not claim

This is where I would rather be accurate than impressive.

- **Resolution is the real limit.** The elevation data is 30 m, with vertical error on the order of 10 to 16 m. Upscaling makes the maps smooth and readable, but it adds no real detail. Contours finer than roughly 5 m show interpolation, not terrain. For ground-truth decisions, field surveys or drone-derived models should override these maps.
- **The satellite basemap needs a licensing decision.** The current prototype pulls imagery from a source whose terms do not permit this kind of use at scale. For internal use it is a known risk; for anything shared or public it must move to a licensed provider.
- **It automates maps, not the DTR.** Rock orientation, soil interpretation and the choice of interventions still need people with field knowledge. The tool removes the cartography, so those people spend their time on the analysis.
- **No access control yet.** It is built for a trusted network. Exposing it publicly would need authentication and HTTPS first.

## How I would measure success

Time saved is the headline, but it is not the only metric I would track:

- **Time per DTR map set:** from up to 3 days manually to [measured time, to be filled from real runs].
- **Rework rate:** how often maps are regenerated because of a wrong parameter or boundary.
- **Throughput:** number of DTRs completed per month, and whether map production is still the limiting step.
- **Adoption:** share of DTRs whose maps come from the tool rather than manual GIS.

## What I learned

The most useful product move was not the code. It was separating the repeatable work from the judgement work, and being honest about where the tool's accuracy ends. Automation earns trust when its limits are stated up front, because the people relying on the maps are making decisions about land, water and money.

Next, I want to extend the same pipeline to the other DTR inputs, such as vegetation index and water indices from satellite data, so that more of the report is generated from the same single boundary file.