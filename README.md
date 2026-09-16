# Flow fields

An interactive explainer for a GPU fluid simulation. Built with React, react-three-fiber and raw GLSL.

```
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint
```

## Architecture

Four layers. Dependencies point **downward only** — a file may import from its own layer or any layer below it, never above.

```
┌─────────────────────────────────────────────────────────────┐
│  app/          entry · App · canvas-host                     │  wires
├─────────────────────────────────────────────────────────────┤
│  features/     shader-player · taxonomy · buffer-info        │  shows
│                (no cross-feature imports)                    │
├─────────────────────────────────────────────────────────────┤
│  runtime/      renderer/webgl/shaders                        │  renders
├─────────────────────────────────────────────────────────────┤
│  domain/       types · manifest                              │  describes
│                (imports nothing)                             │
└─────────────────────────────────────────────────────────────┘

   ui/           styles/global.css — side car, react + styles only
```

### `src/` map

```
src/
├── app/                          Composition root. Knows every feature; owns page state.
│   ├── entry/main.tsx            Mounts <App /> — referenced by index.html.
│   ├── App.tsx                   Holds `activeId` and decides what is on screen.
│   ├── App.css                   Page layout only (.flow-fields, .content-column).
│   └── canvas-host/              Wraps the R3F <Canvas>. Features render inside it.
│
├── features/                     One folder per thing a user can see. Each exports via index.ts.
│   ├── shader-player/            ShaderPlane (colour field) · GridPlane (grid overlay)
│   ├── taxonomy/                 TaxonomySidebar (full list) · TaxonomyFloat (collapsed card + outside-click)
│   └── buffer-info/              Documentation panel for the "Buffers" stage — three sections.
│
├── runtime/                      GPU-facing code. No React.
│   └── renderer/webgl/shaders/   *.vert / *.frag files + index.ts registry.
│
├── domain/                       Pure data and types. Imports nothing.
│   ├── types/taxonomy.ts         TaxonomyId · TaxonomyItem
│   └── manifest/taxonomy.ts      The eight pipeline stages, in order.
│
└── ui/
    └── styles/global.css         Design tokens, fonts, dark mode.
```

### How a click flows

```
user clicks "Buffers"
  → TaxonomySidebar calls onSelect('buffers')
  → App sets activeId = 'buffers'
  → App renders:  <TaxonomyFloat item=Buffers>   (sidebar hidden)
                  <BufferInfo />
                  <GridPlane />  inside <CanvasHost>

user clicks outside the float, or on it
  → TaxonomyFloat calls onDismiss()
  → App sets activeId = null
  → sidebar returns, panel and overlay unmount
```

`activeId` is the only piece of page state. Everything visible is derived from it.

## Working in the codebase

### Add a shader

1. Create `src/runtime/renderer/webgl/shaders/<name>.frag` (plain GLSL).
2. Register it in `shaders/index.ts`:
   ```ts
   import nameFrag from './<name>.frag?raw'
   export const shaders = { ..., nameFrag }
   ```
3. Use `shaders.nameFrag` from a feature component. `?raw` is typed as `string` via `vite/client`.

Group into subfolders (`shaders/sim/`, `shaders/display/`) once the list grows.

### Add a taxonomy stage panel (e.g. Neighbors)

1. Create `src/features/neighbors-info/` — mirror `buffer-info/`: sections, a stylesheet, an `index.ts`.
2. If it needs a canvas overlay, add a shader (above) and a plane component modelled on `GridPlane`.
3. Wire it in `App.tsx` — two lines:
   ```tsx
   const showNeighborsInfo = activeId === 'neighbors'
   {showNeighborsInfo && <NeighborsInfo />}
   ```

The stage is already in `domain/manifest/taxonomy.ts`, so the sidebar and float already handle it. Don't touch `taxonomy/` or other features.

### Add a new stage entirely

1. Add the id to `TaxonomyId` in `domain/types/taxonomy.ts`.
2. Add the entry to `domain/manifest/taxonomy.ts`.
3. Follow "Add a taxonomy stage panel".

## Rules

- **Downward imports only.** `features` may import `runtime` and `domain`; `runtime` may import `domain`; `domain` imports nothing.
- **No cross-feature imports.** If two features need the same thing, it belongs in `runtime`, `domain`, or `ui`.
- **Features export through `index.ts`.** `app/` imports `../features/taxonomy`, never `../features/taxonomy/TaxonomyFloat`.
- **Each feature owns its CSS.** `app/App.css` is layout only; `ui/styles/global.css` is tokens only.
- **`App.tsx` composes, it does not implement.** If it grows past wiring, the logic belongs in a feature.
