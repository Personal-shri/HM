# Interactive main-floor walkthrough

An offline Three.js viewer derived from the saved architectural drawing and revision 03 furniture. Open outputs/model/interior-walkthrough.html in a WebGL-capable browser. No additional plugin or online model service is needed.

## Navigation

Drag to look around at eye level. Use WASD/arrows or press and hold the on-screen movement buttons. Room shortcuts and Previous/Next provide a manual room tour. Overview enables an orbit camera with scroll/pinch zoom. Return to walking or select a room to resume. A mini plan shows the current walk position.

The model uses wall/opening segments extracted from the main-floor drawing generator and furniture rectangles from the revision 03 study. Walking is limited to the main footprint, with collision boundaries around furniture, walls and the reserved stair zone. Windows remain collision boundaries. Door and open-connection passages are traversable; actual swinging door leaves are not modeled.

## Scope and assumptions

This is a scaled geometric exploration model, not a photoreal rendering, BIM, accessibility assessment or construction plan. Assumed wall thickness is 0.32 ft, wall height 9.5 ft and eye height 5.2 ft; window sills and furniture heights are approximate. The architectural source consists of nominal planning lines, so no inference of finished dimensions should be made. Source window/door widths and locations are used; countertop and appliance details remain placeholders.

The roof/ceiling is omitted to make Overview possible. Bathroom fixtures are not invented in the uncoordinated bathroom zones. The staircase remains a reserved footprint rather than an invented climbable flight. Upstairs exploration, door operation, sunlight/glare simulation, photoreal materials and approved ceiling/service layouts remain separate work. No image-to-geometry claim is made.

## Verification

Checked in desktop Chrome and a mobile-sized viewport: no page errors, all 14 room destinations clear of collision geometry, overview and room navigation functional, keyboard movement changes camera position, no horizontal mobile overflow. A half-foot grid flood-fill using the viewer's collision predicate found a route from entry to every room destination. This verifies connectivity in the simplified model only, not actual building clearances or code compliance.

## Rebuild

Run python3 outputs/model/extract-interior.py to refresh the geometry data from the drawing generator. Then run node outputs/model/build-interior.cjs to bundle the offline viewer using the existing Three.js and esbuild dependencies under outputs/model. Finally npm run build refreshes the website distribution. The viewer is linked from Interiors, Explore 3D and Downloads.
