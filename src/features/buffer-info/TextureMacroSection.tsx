export function TextureMacroSection() {
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
