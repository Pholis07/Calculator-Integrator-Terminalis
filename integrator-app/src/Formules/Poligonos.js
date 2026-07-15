import { sampleCurve, compileFunction } from './curve'

export function poligonos(funcionStr, a, b, n) {
  const fReal = compileFunction(funcionStr)
  const f = (x) => Math.abs(fReal(x))
  const h = (b - a) / n

  const points = []
  for (let i = 0; i <= n; i++) {
    const x = a + i * h
    points.push({ x, y: f(x) })
  }

  const items = []
  let sum = 0
  for (let i = 0; i < n; i++) {
    const area = ((points[i].y + points[i + 1].y) / 2) * h
    sum += area
    items.push({ x0: points[i].x, x1: points[i + 1].x, y0: points[i].y, y1: points[i + 1].y, area })
  }

  return {
    value: sum,
    curvePoints: sampleCurve(fReal, a, b),
    shapes: { type: 'trapezoids', items },
  }
}
