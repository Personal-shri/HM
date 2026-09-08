# Exterior appearance and interactive 3D

## Appearance proposal

Warm ivory walls, charcoal roof/window frames, oak-tone front door and balcony ceiling, restrained pale stone accents, dark metal railings and simple landscaping. Front-left covered upper balcony; front-right open upper terrace; front-left ground sitting patio and a rear patio.

- [Exterior perspective, front elevation and rear perspective](outputs/elevations/exterior-concept-v1.png)
- [Great-room and kitchen interior mood concept](outputs/elevations/interior-concept-v1.png)
- [Rotatable 3D model](outputs/model/house-3d.html)
- [3D model screenshot](outputs/model/3d-model-preview.png)

## Open the 3D model

Download `outputs/model/house-3d.html` from this private repository and open it in a modern browser. It is a standalone file with its viewing library included: no account, network requests, public hosting or web server is required after download. WebGL browser support is required. GitHub shows the file source rather than running HTML in its repository preview.

Drag to rotate, pinch/scroll to zoom, choose front/rear/above/perspective, try the three colour palettes, and hide/show the roof or upper story. Finish changes are temporary previews and are not automatically saved back to the design.

## Accuracy and limitations

The floor plan is the layout reference. The interactive model follows the 44 × 48 ft main footprint, upper recesses, two levels and patio locations, with approximately 10 ft story-height assumptions. It is an exterior massing model: windows are surface assemblies on solid blocks; it has no detailed interior walls, fitted interiors, plumbing or structural engineering. Roof height, pitch, canopy, columns, railings, glass and materials are proposals.

The AI-generated images explore appearance and furnishings and are **not exact matches to every opening in the plan**. In particular, the exterior board simplifies the great-room front windows and adds a broad rear glazed opening and patio canopy not established in the plan. The interior image is a mood study, not a furniture-clearance or room-layout drawing. These images should not replace the floor plan or the dimensioned opening schedule.

A fully accurate coordinated architectural 3D/BIM model requires finalized wall sections, story heights, window/door sill and head levels, roof geometry, structure and site levels. The present images do not make the scheme construction-ready or establish its final cost.

## Next exterior decisions

1. Warm ivory, soft sage, or sandstone exterior palette.
2. Pitched main roof versus a simpler roof treatment, with final drainage design.
3. Natural stone accent extent and balcony-ceiling material.
4. Entry-door design, window subdivisions and sun shading.
5. Patio furniture, garden layout and exterior lighting.

The roof and materials shown have not been separately quoted. Reconcile them with the preliminary cost estimate before fixing the finish budget.

## Source and checks

AI images used the built-in image-generation tool; exact prompts are saved in [PROMPTS.md](outputs/elevations/PROMPTS.md). The interactive model is generated from `outputs/model/house.js` and `model.html`; rebuild using `npm ci` in that directory followed by `node build.cjs`. The generated HTML includes Three.js under its MIT licence.

Verified in desktop Chrome: the standalone local HTML renders without page errors, preset cameras work, finish selection updates, and roof/upper-floor visibility switches work. The model is conceptual and was not validated for building codes.
