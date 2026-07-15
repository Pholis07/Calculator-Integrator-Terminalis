import { sampleCurve, compileFunction } from './curve'

export function riemann(funcion, a, b, n) {
  const f = compileFunction(funcion)
  const h = (b - a) / n

  const items = []
  let suma = 0

  for (let i = 0; i < n; i++) {
    const x0 = a + i * h
    const x1 = x0 + h
    const height = f(x0)
    const area = height * h
    suma += area
    items.push({ x0, x1, height, area })
  }

  return {
    value: suma,
    curvePoints: sampleCurve(f, a, b),
    shapes: { type: 'rects', items },
  }
}
