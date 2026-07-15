import katex from 'katex'
import 'katex/dist/katex.min.css'

function renderTeX(math, displayMode) {
  try {
    return katex.renderToString(math, { throwOnError: false, displayMode })
  } catch {
    return math
  }
}

export default function TeX({ math, block = false, className = '' }) {
  const html = renderTeX(math, block)
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

// Embeds a KaTeX-rendered formula inside an SVG via foreignObject, centered on (x, y).
export function SvgTeX({ x, y, math, width = 64, height = 22, color = 'currentColor', fontSize = 11 }) {
  const html = renderTeX(math, false)
  return (
    <foreignObject
      x={x - width / 2}
      y={y - height / 2}
      width={width}
      height={height}
      style={{ overflow: 'visible', pointerEvents: 'none' }}
    >
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          color,
          fontSize,
          lineHeight: 1,
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </foreignObject>
  )
}
