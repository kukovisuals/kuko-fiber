export function ChannelsSection() {
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
