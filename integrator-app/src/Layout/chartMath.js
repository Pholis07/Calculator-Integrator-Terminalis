function niceNumber(range, round) {
  const exponent = Math.floor(Math.log10(range))
  const fraction = range / 10 ** exponent
  let niceFraction

  if (round) {
    if (fraction < 1.5) niceFraction = 1
    else if (fraction < 3) niceFraction = 2
    else if (fraction < 7) niceFraction = 5
    else niceFraction = 10
  } else {
    if (fraction <= 1) niceFraction = 1
    else if (fraction <= 2) niceFraction = 2
    else if (fraction <= 5) niceFraction = 5
    else niceFraction = 10
  }

  return niceFraction * 10 ** exponent
}

// "Nice numbers for graph labels" (Heckbert). Returns round tick values that
// cover [min, max], plus the (possibly widened) domain they span.
export function niceTicks(min, max, tickCount = 6) {
  if (min === max) {
    min -= 1
    max += 1
  }

  const range = niceNumber(max - min, false)
  const step = niceNumber(range / (tickCount - 1), true)
  const niceMin = Math.floor(min / step) * step
  const niceMax = Math.ceil(max / step) * step

  const ticks = []
  for (let v = niceMin; v <= niceMax + step / 2; v += step) {
    ticks.push(Math.round(v / step) * step)
  }

  return { ticks, domainMin: niceMin, domainMax: niceMax }
}

export function makeScale(xDomain, yDomain, width, height, margin) {
  const [x0, x1] = xDomain
  const [y0, y1] = yDomain
  const xSpan = x1 - x0 || 1
  const ySpan = y1 - y0 || 1
  const plotWidth = width - margin.left - margin.right
  const plotHeight = height - margin.top - margin.bottom

  const toPx = (x, y) => [
    margin.left + ((x - x0) / xSpan) * plotWidth,
    height - margin.bottom - ((y - y0) / ySpan) * plotHeight,
  ]

  return { toPx, plotWidth, plotHeight }
}
