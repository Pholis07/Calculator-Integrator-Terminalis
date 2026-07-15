import { sampleCurve, compileFunction } from './curve'

export function evalParabola(seg, x) {
  const { x0, x1, x2, y0, y1, y2 } = seg
  const l0 = ((x - x1) * (x - x2)) / ((x0 - x1) * (x0 - x2))
  const l1 = ((x - x0) * (x - x2)) / ((x1 - x0) * (x1 - x2))
  const l2 = ((x - x0) * (x - x1)) / ((x2 - x0) * (x2 - x1))
  return y0 * l0 + y1 * l1 + y2 * l2
}

export function simpson(funcion, a, b, n) {
  const f = compileFunction(funcion)
  const h = (b - a) / n

  let suma = f(a) + f(b)
  for (let i = 1; i < n; i++) {
    const x_i = a + i * h
    const coeficiente = (i % 2 === 0) ? 2 : 4
    suma += coeficiente * f(x_i)
  }

  const items = []
  for (let i = 0; i < n; i += 2) {
    const x0 = a + i * h
    const x1 = x0 + h
    const x2 = x0 + 2 * h
    const y0 = f(x0)
    const y1 = f(x1)
    const y2 = f(x2)
    const area = (h / 3) * (y0 + 4 * y1 + y2)
    items.push({ x0, x1, x2, y0, y1, y2, area })
  }

  return {
    value: (h / 3) * suma,
    curvePoints: sampleCurve(f, a, b),
    shapes: { type: 'parabolas', items },
  }
}
