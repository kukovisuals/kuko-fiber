const cells = Array.from({ length: 12 * 12 })

export function GridOfCellsSection() {
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
