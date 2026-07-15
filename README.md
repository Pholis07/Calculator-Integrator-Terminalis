# Integrator-App

Aplicación de escritorio para calcular integrales definidas mediante métodos de aproximación numérica, con gráficas animadas y renderizado en LaTeX.

## Métodos soportados

- **Riemann** — suma de rectángulos.
- **Simpson** — aproximación por parábolas (requiere un número par de subintervalos).
- **Trapecios (Polígonos)** — suma de trapecios.

## Características

- Gráficas SVG dibujadas a mano y animadas con [anime.js](https://animejs.com/), con revelado progresivo de la curva y de cada forma (rectángulo/trapecio/parábola) al calcular.
- Fórmulas, función ingresada y resultado renderizados en LaTeX con [KaTeX](https://katex.org/).
- Validación de dominio: si la función no está definida en todo el intervalo (o la expresión ingresada no evalúa a un número, p. ej. escribir `sin` en vez de `sin(x)`), se muestra un error claro en vez de un gráfico roto.
- Ejes con ticks automáticos ("nice numbers") y grilla de fondo.

## Stack

React 19 · Vite · Electron · Tailwind CSS v4 · [mathjs](https://mathjs.org/) · anime.js v4 · KaTeX

## Uso

```bash
cd integrator-app
npm install
npm run dev
```

Esto levanta el servidor de Vite y abre la ventana de Electron automáticamente.

### Build

```bash
cd integrator-app
npm run build
```
