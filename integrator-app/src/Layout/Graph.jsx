import { useEffect, useRef } from 'react'
import { animate, createTimeline, stagger, svg as animeSvg } from 'animejs'
import { niceTicks, makeScale } from './chartMath'
import { evalParabola } from '../Formules/Simpson'
import { SvgTeX } from '../Components/TeX'

const WIDTH = 720
const HEIGHT = 420
const MARGIN = { top: 24, right: 28, bottom: 48, left: 60 }
const Y_PADDING_RATIO = 0.15
const PARABOLA_STEPS = 24

const METHOD_STYLES = {
  riemman: { curve: '#f5bde6', fill: 'rgba(198,160,246,0.45)', stroke: '#c6a0f6' },
  simpson: { curve: '#f5bde6', fill: 'rgba(245,189,230,0.40)', stroke: '#f5bde6' },
  trapecios: { curve: '#f5bde6', fill: 'rgba(180,167,230,0.45)', stroke: '#b4a7e6' },
}

const GRID_COLOR = '#313244'
const TICK_COLOR = '#585b70'
const AXIS_COLOR = '#7f849c'
const LABEL_COLOR = '#cdd6f4'
const BORDER_COLOR = '#45475a'

function formatNumber(v) {
  return String(Number(v.toFixed(4)))
}

function clampLabelPos(x, y, width, height, bounds) {
  const halfW = width / 2
  const halfH = height / 2
  return [
    Math.min(bounds.right - halfW, Math.max(bounds.left + halfW, x)),
    Math.min(bounds.bottom - halfH, Math.max(bounds.top + halfH, y)),
  ]
}

function buildLinePath(points, toPx) {
  return points
    .map((p, i) => {
      const [x, y] = toPx(p.x, p.y)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

function RectShapes({ items, toPx, style, bounds }) {
  return items.map((item, i) => {
    const [x0px, basePx] = toPx(item.x0, 0)
    const [x1px, topPx] = toPx(item.x1, item.height)
    const rx = Math.min(x0px, x1px)
    const rw = Math.max(1, Math.abs(x1px - x0px))
    const ry = Math.min(basePx, topPx)
    const rh = Math.max(1, Math.abs(topPx - basePx))
    const [labelX, labelY] = clampLabelPos((x0px + x1px) / 2, ry - 12, 108, 20, bounds)

    return (
      <g key={i} className="shape-item" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <rect x={rx} y={ry} width={rw} height={rh} fill={style.fill} stroke={style.stroke} strokeWidth={1.5} />
        <SvgTeX x={labelX} y={labelY} math={`A_{${i + 1}}=${formatNumber(item.area)}`} color={style.stroke} width={108} height={20} fontSize={10} />
      </g>
    )
  })
}

function TrapezoidShapes({ items, toPx, style, bounds }) {
  return items.map((item, i) => {
    const [x0Base, y0Base] = toPx(item.x0, 0)
    const [x0Top, y0Top] = toPx(item.x0, item.y0)
    const [x1Top, y1Top] = toPx(item.x1, item.y1)
    const [x1Base, y1Base] = toPx(item.x1, 0)
    const points = `${x0Base},${y0Base} ${x0Top},${y0Top} ${x1Top},${y1Top} ${x1Base},${y1Base}`
    const [midX, midY] = toPx((item.x0 + item.x1) / 2, (item.y0 + item.y1) / 2)
    const [labelX, labelY] = clampLabelPos(midX, midY - 14, 108, 20, bounds)

    return (
      <g key={i} className="shape-item" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <polygon points={points} fill={style.fill} stroke={style.stroke} strokeWidth={1.5} />
        <SvgTeX x={labelX} y={labelY} math={`A_{${i + 1}}=${formatNumber(item.area)}`} color={style.stroke} width={108} height={20} fontSize={10} />
      </g>
    )
  })
}

function ParabolaShapes({ items, toPx, style, bounds }) {
  return items.map((item, i) => {
    const curvePx = []
    for (let s = 0; s <= PARABOLA_STEPS; s++) {
      const x = item.x0 + ((item.x2 - item.x0) * s) / PARABOLA_STEPS
      const y = evalParabola(item, x)
      curvePx.push(toPx(x, y))
    }
    const [xStart, yBaseStart] = toPx(item.x0, 0)
    const [xEnd, yBaseEnd] = toPx(item.x2, 0)

    const fillD = [
      `M${xStart.toFixed(2)},${yBaseStart.toFixed(2)}`,
      ...curvePx.map(([x, y]) => `L${x.toFixed(2)},${y.toFixed(2)}`),
      `L${xEnd.toFixed(2)},${yBaseEnd.toFixed(2)}`,
      'Z',
    ].join(' ')

    const strokeD = curvePx.map(([x, y], s) => `${s === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ')

    const [peakX, peakY] = toPx(item.x1, item.y1)
    const [labelX, labelY] = clampLabelPos(peakX, peakY - 14, 108, 20, bounds)

    return (
      <g key={i} className="shape-item" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <path d={fillD} fill={style.fill} stroke="none" />
        <path d={strokeD} fill="none" stroke={style.stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <SvgTeX x={labelX} y={labelY} math={`A_{${i + 1}}=${formatNumber(item.area)}`} color={style.stroke} width={108} height={20} fontSize={10} />
      </g>
    )
  })
}

const SHAPE_RENDERERS = {
  rects: RectShapes,
  trapezoids: TrapezoidShapes,
  parabolas: ParabolaShapes,
}

export default function Graph({ metodo, data, a, b, triggerKey }) {
  const svgRef = useRef(null)
  const curvePathRef = useRef(null)

  const hasData = Boolean(data && Array.isArray(data.curvePoints) && data.curvePoints.length >= 2)

  useEffect(() => {
    if (!hasData || !svgRef.current || !curvePathRef.current) return undefined

    const root = svgRef.current
    const gridEl = root.querySelector('.chart-grid')
    const shapeEls = root.querySelectorAll('.shape-item')

    if (gridEl) gridEl.style.opacity = 0
    shapeEls.forEach((el) => {
      el.style.opacity = 0
    })

    const [drawable] = animeSvg.createDrawable(curvePathRef.current)

    const tl = createTimeline({ defaults: { ease: 'outQuad' } })
    if (gridEl) tl.add(gridEl, { opacity: [0, 1], duration: 350 })
    tl.add(drawable, { draw: ['0 0', '0 1'], duration: 1100 }, gridEl ? '-=150' : 0)
    if (shapeEls.length) {
      tl.add(
        shapeEls,
        { opacity: [0, 1], scale: [0.82, 1], duration: 380, delay: stagger(70) },
        '-=600'
      )
    }

    return () => tl.pause()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey, hasData])

  if (!hasData) return null

  const style = METHOD_STYLES[metodo] ?? METHOD_STYLES.riemman
  const ShapeRenderer = SHAPE_RENDERERS[data.shapes?.type]

  const ys = data.curvePoints.map((p) => p.y).concat(0)
  let yMin = Math.min(...ys)
  let yMax = Math.max(...ys)
  const span = yMax - yMin || 1
  yMin -= span * Y_PADDING_RATIO
  yMax += span * Y_PADDING_RATIO

  const xTicksInfo = niceTicks(a, b, 8)
  const yTicksInfo = niceTicks(yMin, yMax, 6)
  const xDomain = [xTicksInfo.domainMin, xTicksInfo.domainMax]
  const yDomain = [yTicksInfo.domainMin, yTicksInfo.domainMax]

  const { toPx, plotWidth, plotHeight } = makeScale(xDomain, yDomain, WIDTH, HEIGHT, MARGIN)
  const plotLeft = MARGIN.left
  const plotRight = WIDTH - MARGIN.right
  const plotTop = MARGIN.top
  const plotBottom = HEIGHT - MARGIN.bottom

  const curveD = buildLinePath(data.curvePoints, toPx)

  return (
    <div className="w-full max-w-3xl mx-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto rounded-2xl"
        style={{ background: '#181825' }}
      >
        <g className="chart-grid">
          {xTicksInfo.ticks.map((t) => {
            const [px] = toPx(t, yDomain[0])
            return (
              <g key={`xg-${t}`}>
                <line x1={px} y1={plotTop} x2={px} y2={plotBottom} stroke={GRID_COLOR} strokeWidth={1} />
                <line x1={px} y1={plotBottom} x2={px} y2={plotBottom + 6} stroke={TICK_COLOR} strokeWidth={1} />
                <SvgTeX x={px} y={plotBottom + 20} math={formatNumber(t)} color={LABEL_COLOR} width={48} height={18} fontSize={10} />
              </g>
            )
          })}
          {yTicksInfo.ticks.map((t) => {
            const [, py] = toPx(xDomain[0], t)
            return (
              <g key={`yg-${t}`}>
                <line x1={plotLeft} y1={py} x2={plotRight} y2={py} stroke={GRID_COLOR} strokeWidth={1} />
                <line x1={plotLeft - 6} y1={py} x2={plotLeft} y2={py} stroke={TICK_COLOR} strokeWidth={1} />
                <SvgTeX x={plotLeft - 26} y={py} math={formatNumber(t)} color={LABEL_COLOR} width={40} height={16} fontSize={10} />
              </g>
            )
          })}
          {yDomain[0] <= 0 && yDomain[1] >= 0 && (
            <line x1={plotLeft} y1={toPx(0, 0)[1]} x2={plotRight} y2={toPx(0, 0)[1]} stroke={AXIS_COLOR} strokeWidth={1.5} />
          )}
          {xDomain[0] <= 0 && xDomain[1] >= 0 && (
            <line x1={toPx(0, 0)[0]} y1={plotTop} x2={toPx(0, 0)[0]} y2={plotBottom} stroke={AXIS_COLOR} strokeWidth={1.5} />
          )}
          <rect x={plotLeft} y={plotTop} width={plotWidth} height={plotHeight} fill="none" stroke={BORDER_COLOR} strokeWidth={1} />
        </g>

        <g className="chart-shapes">
          {ShapeRenderer && (
            <ShapeRenderer
              items={data.shapes.items}
              toPx={toPx}
              style={style}
              bounds={{ left: plotLeft, right: plotRight, top: plotTop, bottom: plotBottom }}
            />
          )}
        </g>

        <path ref={curvePathRef} d={curveD} fill="none" stroke={style.curve} strokeWidth={2.5} strokeLinecap="round" />
      </svg>
    </div>
  )
}
