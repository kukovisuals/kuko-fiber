import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import './App.css'

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float iTime;
  uniform vec2 iResolution;

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0.0, 2.0, 4.0));
    gl_FragColor = vec4(col, 1.0);
  }
`

const gridFragmentShader = `
  uniform vec2 iResolution;
  uniform float uColumns;
  uniform float uRows;

  void main() {
    vec2 cellSize = iResolution / vec2(uColumns, uRows);
    vec2 pixelInCell = mod(gl_FragCoord.xy, cellSize);

    float lineWidth = 1.0;
    float lineX = step(pixelInCell.x, lineWidth) + step(cellSize.x - lineWidth, pixelInCell.x);
    float lineY = step(pixelInCell.y, lineWidth) + step(cellSize.y - lineWidth, pixelInCell.y);
    float line = min(lineX + lineY, 1.0);

    gl_FragColor = vec4(vec3(1.0), line * 0.6);
  }
`

function ShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()

  const uniforms = useMemo(
    () => ({
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [],
  )

  useFrame((state) => {
    const material = materialRef.current
    if (!material) return
    material.uniforms.iTime.value = state.clock.elapsedTime
    material.uniforms.iResolution.value.set(size.width, size.height)
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

function GridPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()

  const uniforms = useMemo(
    () => ({
      iResolution: { value: new THREE.Vector2(size.width, size.height) },
      uColumns: { value: 12 },
      uRows: { value: 12 },
    }),
    [],
  )

  useFrame(() => {
    const material = materialRef.current
    if (!material) return
    material.uniforms.iResolution.value.set(size.width, size.height)
  })

  return (
    <mesh renderOrder={1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={gridFragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

function ShaderContainer({ showGridOverlay }: { showGridOverlay: boolean }) {
  return (
    <section className="shader-container">
      <Canvas orthographic gl={{ antialias: false }}>
        <ShaderPlane />
        {showGridOverlay && <GridPlane />}
      </Canvas>
    </section>
  )
}

function GridOfCellsSection() {
  const cells = Array.from({ length: 12 * 12 })

  return (
    <section className="buffer-info__section">
      <div className="buffer-info__title-row">
        <h3>Grid of cells</h3>
        <span className="buffer-info__meta">R = iResolution.xy</span>
      </div>

      <div className="buffer-diagram">
        <div className="buffer-diagram__grid">
          {cells.map((_, i) => (
            <div key={i} className="buffer-diagram__cell" />
          ))}
        </div>

        <div className="buffer-diagram__cell-highlight buffer-diagram__cell-highlight--origin" />
        <div className="buffer-diagram__cell-highlight buffer-diagram__cell-highlight--far" />
        <div className="buffer-diagram__texel" />

        <span className="buffer-diagram__label buffer-diagram__label--origin">
          I = (0.5, 0.5)
        </span>
        <span className="buffer-diagram__label buffer-diagram__label--far">
          I = (539.5, 539.5)
        </span>
        <span className="buffer-diagram__label buffer-diagram__label--texel">
          one texel — one vec4
        </span>

        <span className="buffer-diagram__caption buffer-diagram__caption--right">
          ← 540 px →
        </span>
      </div>

      <div className="buffer-info__text">
        <p>
          The buffer is not an image you look at. It is a spreadsheet with{' '}
          <strong>291,600 rows</strong> (540 × 540), one row per pixel, four
          numbers per row. mainImage runs once per row, in parallel, and
          every row can only write itself.
        </p>

        <dl className="buffer-info__facts">
          <div>
            <dt>I</dt>
            <dd>fragCoord — pixel address</dd>
          </div>
          <div>
            <dt>R</dt>
            <dd>iResolution.xy = (540, 540)</dd>
          </div>
          <div>
            <dt>O</dt>
            <dd>fragColor — vec4 cell becomes next frame</dd>
          </div>
        </dl>

        <p>
          Because I is measured in pixels, every neighbour is one whole unit
          away: I + vec2(1,0) is exactly the cell to the east. That is why
          the code can write h = vec2(1,0) once and reuse it for all eight
          directions.
        </p>
      </div>
    </section>
  )
}

function TextureMacroSection() {
  return (
    <section className="buffer-info__section">
      <div className="buffer-info__title-row">
        <h3>texture() and the T macro</h3>
        <span className="buffer-info__meta">pixels → uv</span>
      </div>

      <div className="uv-diagram">
        <div className="uv-diagram__space">
          <span className="uv-diagram__label">pixel space</span>
          <div className="uv-diagram__box">
            <div className="uv-diagram__dot" style={{ left: '63%', top: '50%' }} />
            <span className="uv-diagram__dot-label" style={{ left: '63%', top: '50%' }}>
              (340, 270)
            </span>
          </div>
          <div className="uv-diagram__corners">
            <span>(0,0)</span>
            <span>(540,540)</span>
          </div>
        </div>

        <span className="uv-diagram__arrow">÷ R →</span>

        <div className="uv-diagram__space">
          <span className="uv-diagram__label">uv space</span>
          <div className="uv-diagram__box">
            <div className="uv-diagram__dot" style={{ left: '63%', top: '50%' }} />
            <span className="uv-diagram__dot-label" style={{ left: '63%', top: '50%' }}>
              (.63, .50)
            </span>
          </div>
          <div className="uv-diagram__corners">
            <span>(0,0)</span>
            <span>(1,1)</span>
          </div>
        </div>
      </div>

      <div className="buffer-info__text">
        <pre className="buffer-info__code">
          {'#define T(p) texture(iChannel0,\n  vec2(p)/vec2(R.x*1.001, R.y*1.002))'}
        </pre>

        <p>
          texture() does not take pixels. It takes <strong>uv</strong> — 0 to
          1 across the whole texture. So every read has to be converted:
          divide the pixel address by the resolution. T(p) is that division,
          wrapped once so the rest of the shader can stay in pixel units.
        </p>

        <p>
          The 1.001 and 1.002 are deliberate. Dividing by slightly more than
          R means each frame samples a fraction inside itself — a 0.1% zoom
          per frame that keeps the field creeping and stops the clamped
          border from freezing into a hard line.
        </p>

        <dl className="buffer-info__facts">
          <div>
            <dt>filter</dt>
            <dd>
              linear — a fractional uv blends the 4 nearest texels, this is
              what makes sub-pixel advection possible
            </dd>
          </div>
          <div>
            <dt>wrap</dt>
            <dd>
              clamp — uv outside 0–1 returns the edge texel, so loop() has to
              do the wrapping instead
            </dd>
          </div>
          <div>
            <dt>internal</dt>
            <dd>
              byte — 8 bits per channel, values live in 0–1 in steps of
              1/255, and anything above 1 is lost
            </dd>
          </div>
          <div>
            <dt>vflip</dt>
            <dd>true — y counts up from the bottom, matching I</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

function ChannelsSection() {
  return (
    <section className="buffer-info__section">
      <div className="buffer-info__title-row">
        <h3>What lives in x, y, z, w</h3>
        <span className="buffer-info__meta">one vec4 per cell</span>
      </div>

      <div className="xyzw-diagram">
        <div className="xyzw-diagram__axis-h" />
        <div className="xyzw-diagram__axis-v" />
        <div className="xyzw-diagram__origin" />
        <svg className="xyzw-diagram__arrow" viewBox="0 0 100 100">
          <line x1="50" y1="50" x2="78" y2="22" stroke="currentColor" strokeWidth="2" />
          <path d="M 78 22 L 70 24 M 78 22 L 76 30" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>

        <span className="xyzw-diagram__label xyzw-diagram__label--y">y ↑</span>
        <span className="xyzw-diagram__label xyzw-diagram__label--x">x →</span>
        <span className="xyzw-diagram__label xyzw-diagram__label--xy">x, y</span>
        <span className="xyzw-diagram__label xyzw-diagram__label--z">z = pressure</span>
        <span className="xyzw-diagram__label xyzw-diagram__label--w">w = the ink</span>
      </div>

      <div className="buffer-info__text">
        <p>
          RGBA is only a name. In a simulation buffer the four channels are
          four fields that happen to be stored in the same texture, and their
          meaning is whatever the update rule treats them as. Read the
          assignments at the bottom of Buffer A and the roles fall out:
        </p>

        <dl className="buffer-info__facts">
          <div>
            <dt>.x</dt>
            <dd>
              <strong>Velocity, horizontal</strong> — half of the advection
              offset. Also the Image pass's main colour input.
            </dd>
          </div>
          <div>
            <dt>.y</dt>
            <dd>
              <strong>Velocity, vertical</strong> — together .xy is the flow
              direction, pushed each frame by O.xy -= .2*g.
            </dd>
          </div>
          <div>
            <dt>.z</dt>
            <dd>
              <strong>Pressure / step length</strong> — O.z -= div drains it
              where flow spreads out. It also scales how far the advection
              sample reaches.
            </dd>
          </div>
          <div>
            <dt>.w</dt>
            <dd>
              <strong>The transported quantity</strong> — the visible
              substance. Its gradient g is what accelerates the velocity, so
              w and xy chase each other.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

function BufferInfo() {
  return (
    <div className="buffer-info">
      <GridOfCellsSection />
      <TextureMacroSection />
      <ChannelsSection />
    </div>
  )
}

function App() {
  const [showBufferInfo, setShowBufferInfo] = useState(false)

  return (
    <div className="flow-fields">
      <header className="flow-fields__header">
        <h1>Flow fields</h1>
      </header>

      <main className="flow-fields__main">
        <div className="content-column">
          <ShaderContainer showGridOverlay={showBufferInfo} />
        </div>

        {showBufferInfo && <BufferInfo />}

        <aside className="sidebar">
          <h2>Taxonomy</h2>
          <section
            className={`sidebar__panel sidebar__panel--taxonomy sidebar__panel--clickable${
              showBufferInfo ? ' sidebar__panel--active' : ''
            }`}
            role="button"
            tabIndex={0}
            aria-pressed={showBufferInfo}
            onClick={() => setShowBufferInfo((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setShowBufferInfo((v) => !v)
              }
            }}
          >
            <h2>Buffers</h2>
          </section>

          <section className="sidebar__panel sidebar__panel--buffers">
            <h2>Neighbors</h2>
          </section>

          <section className="sidebar__panel sidebar__panel--neighbors">
            <h2>Advect Velocity</h2>
          </section>

          <section className="sidebar__panel sidebar__panel--neighbors">
            <h2>Add Forces</h2>
          </section>

          <section className="sidebar__panel sidebar__panel--neighbors">
            <h2>Divergance</h2>
          </section>

          <section className="sidebar__panel sidebar__panel--neighbors">
            <h2>Pressure Solve</h2>
          </section>

          <section className="sidebar__panel sidebar__panel--neighbors">
            <h2>Subtract Gradient</h2>
          </section>

          <section className="sidebar__panel sidebar__panel--neighbors">
            <h2>Advect Dye</h2>
          </section>

        </aside>
      </main>
    </div>
  )
}

export default App
