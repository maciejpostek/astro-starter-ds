# Figma Material Symbol master contract

Use `Icon/Material/arrow_forward` as a structural reference, but resolve its
node ID from the current project. Apply this contract to every glyph.

## Component

```text
Name: Icon/Material/<google_snake_case_name>
Type: Component, never a one-child ComponentSet
Size: opticalSize × opticalSize
Auto Layout: Horizontal
Alignment: Center / Center
Width: Fixed
Height: Fixed
Aspect Ratio: Locked 1:1
Padding: 0 on every edge
Gap: 0
Fill: none
Clip content: true
Component properties: none
```

Do not expose INSTANCE_SWAP, variants, icon-name text, or a glyph-selection
property. Consumer components own a fixed semantic glyph.

## Inner group

```text
Name: <google_snake_case_name>
Size: opticalSize × opticalSize
Width: Fill container
Height: Fixed, derived from locked 1:1 ratio
Aspect Ratio: Locked 1:1
Position: centered by the parent Auto Layout
Opacity: 100%
Visible: true
```

Set width fill only after the group is a child of the Auto Layout component.
Then lock the ratio. Do not set both width and height to Fill.

## Bounding box

```text
Name: Bounding box
Type: Rectangle
Order: first child of the group
Size: opticalSize × opticalSize
Position: 0, 0
Mask: Alpha
Visible: true
Opacity: 100%
```

The rectangle establishes the optical canvas and mask. It is not a consumer
background and must not receive the icon color Variable.

## Vector

```text
Name: <google_snake_case_name>
Geometry: exact official SVG path data
Position: optically centered inside the group
Constraints: Scale / Scale
Aspect Ratio: Locked to its own official bounds
Fill: bound to the project semantic icon-color Variable
Stroke: none unless present in the official source contract
```

Vector width and height vary by glyph. Center using actual bounds:

```js
vector.x = (group.width - vector.width) / 2;
vector.y = (group.height - vector.height) / 2;
```

## Safe in-place update

1. Resolve the existing Component, Group, mask, and Vector by manifest ID and
   exact name.
2. Import the official SVG only as a transient parsing node.
3. Copy its `vectorPaths` into the existing Vector.
4. Recenter the existing Vector.
5. Reapply Scale/Scale constraints, ratio lock, and semantic fill binding.
6. Reapply Component Center/Center and Group Fill-width plus 1:1 lock.
7. Remove the transient import.
8. Validate the preserved IDs and export the master to SVG for path parity.

Never delete and recreate a validated master merely to change family or axes.
