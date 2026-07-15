import * as mathe from 'mathjs'

export const CURVE_SAMPLES = 900

// Wraps mathjs evaluation so expressions missing their argument (e.g. "sin"
// instead of "sin(x)") fail fast with a clear message instead of silently
// producing a non-number that turns into NaN downstream.
export function compileFunction(funcionStr) {
  return (x) => {
    const y = mathe.evaluate(funcionStr, { x })
    if (typeof y !== 'number') {
      throw new Error('La expresión debe evaluarse a un número. ¿Falta el argumento? Ej: sin(x)')
    }
    return y
  }
}

export function sampleCurve(f, a, b, samples = CURVE_SAMPLES) {
  const points = []
  for (let i = 0; i <= samples; i++) {
    const x = a + ((b - a) * i) / samples
    points.push({ x, y: f(x) })
  }
  return points
}
