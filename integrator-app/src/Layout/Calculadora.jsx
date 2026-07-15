import { useMemo, useState } from 'react'
import { parse } from 'mathjs'
import { metodos } from '../Formules/Index'
import Graph from './Graph'
import TeX from '../Components/TeX'

const METHOD_FORMULAS = {
    riemman: '\\int_a^b f(x)\\,dx \\approx \\sum_{i=0}^{n-1} f(x_i)\\,\\Delta x',
    simpson: '\\int_a^b f(x)\\,dx \\approx \\frac{h}{3}\\Big[f(x_0)+4\\!\\sum_{i\\,\\text{impar}}\\!f(x_i)+2\\!\\sum_{i\\,\\text{par}}\\!f(x_i)+f(x_n)\\Big]',
    trapecios: '\\int_a^b f(x)\\,dx \\approx \\frac{h}{2}\\sum_{i=0}^{n-1}\\big(f(x_i)+f(x_{i+1})\\big)',
}

function formatTexNumber(v) {
    return String(Number(v.toFixed(4)))
}

export default function Calculadora() {
    const [abierto, setAbierto] = useState(false)
    const [metodoActivo, setMetodoActivo] = useState('riemman')

    const [funcion, setFuncion] = useState('')
    const [inferior, setInferior] = useState('')
    const [superior, setSuperior] = useState('')
    const [intervalos, setIntervalos] = useState('')

    const [error, setError] = useState('')
    const [resultado, setResultado] = useState(null)
    const [limits, setLimits] = useState({ a: 0, b: 0 })
    const [triggerKey, setTriggerKey] = useState(0)
    const [invertirPendiente, setInvertirPendiente] = useState(false)

    const items = [
        { key: 'riemman', titulo: 'Metodo Riemann', desc: 'Metodo de triangulos y rectangulos.' },
        { key: 'simpson', titulo: 'Metodo Simpson', desc: 'Formula de simpson.' },
        { key: 'trapecios', titulo: 'Metodo Poligonos', desc: 'Metodo de trapecios.' }
    ]

    const metodoSeleccionado = items.find(item => item.key === metodoActivo)

    const funcionTex = useMemo(() => {
        if (!funcion.trim()) return ''
        try {
            return `f(x)=${parse(funcion).toTex()}`
        } catch {
            return ''
        }
    }, [funcion])

    const seleccionarMetodo = (key) => {
        setMetodoActivo(key)
        setAbierto(false)
        // Limpia resultado/errores al cambiar de método
        setResultado(null)
        setError('')
        setInvertirPendiente(false)
    }

    const calcular = (forzarOrden = null) => {
        setError('')

        const a0 = Number(inferior)
        const b0 = Number(superior)
        const n = Math.abs(Number(intervalos))
        const metodo = metodos[metodoActivo] // <- aquí está la magia: busca el método activo

        if (!funcion.trim()) {
            setError('Ingresa una función.')
            return
        }

        if (n === 0) {
            setError('El número de subintervalos debe ser mayor a 0.')
            return
        }

        if (metodo.requiereNPar && n % 2 !== 0) {
            setError('Este método requiere que el número de subintervalos sea par.')
            return
        }

        let a, b

        if (a0 === b0) {
            setError('Los límites son iguales. El área es 0.')
            setResultado({ value: 0, curvePoints: [], shapes: { type: null, items: [] } })
            setLimits({ a: a0, b: b0 })
            return
        }

        if (b0 > a0) {
            a = a0
            b = b0
        } else {
            if (forzarOrden === null) {
                setInvertirPendiente(true)
                return
            }
            if (forzarOrden === 'continuar') {
                a = a0
                b = b0
            } else {
                a = b0
                b = a0
            }
        }

        try {
            const r = metodo.fn(funcion, a, b, n) // <- llama al método activo, sea cual sea

            const allFinite =
                Number.isFinite(r.value) &&
                r.curvePoints.every((p) => Number.isFinite(p.y))

            if (!allFinite) {
                setError('La función no está definida en todo el intervalo [a, b].')
                setResultado(null)
                return
            }

            setResultado(r)
            setLimits({ a, b })
            setInvertirPendiente(false)
            setTriggerKey((k) => k + 1)
        } catch (e) {
            setError('Función inválida: ' + e.message)
            setResultado(null)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        calcular()
    }

    return (
        <section className="flex justify-center items-center h-screen flex-col bg-rose-950">
            <div className="size-3/5 bg-mauve-950 rounded-4xl shadow 2xl">
                <div className="flex flex-col items-center m-10 relative">
                    <h2 className='text-white font-semibold text-lg mb-5'>
                        Ingrese el metodo por el que quiere aproximar:
                    </h2>

                    <button
                        onClick={() => setAbierto(!abierto)}
                        className="relative p-3 inline-flex items-center justify-center gap-2 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-200"
                        type="button"
                    >
                        {metodoSeleccionado.titulo}
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${abierto ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                        </svg>
                    </button>

                    {abierto && (
                        <div className="absolute top-full mt-2 z-10 bg-[#000000] border border-[#ff0073] rounded-xl shadow-xl w-72 p-1">
                            <ul className="space-y-0.5" role="list">
                                {items.map(item => (
                                    <li key={item.key}>
                                        <button
                                            onClick={() => seleccionarMetodo(item.key)}
                                            className={`flex items-start gap-3 w-full p-3 rounded-lg cursor-pointer transition-colors text-left ${metodoActivo === item.key
                                                ? 'bg-mauve-950 border border-rose-800'
                                                : 'hover:bg-[#334155]/50'
                                                }`}
                                        >
                                            <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${metodoActivo === item.key ? 'bg-rose-800' : 'bg-[#475569]'
                                                }`} />
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-medium ${metodoActivo === item.key ? 'text-rose-600' : 'text-white'
                                                    }`}>
                                                    {item.titulo}
                                                </span>
                                                <span className="text-xs text-pink-700 mt-0.5">
                                                    {item.desc}
                                                </span>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mt-4 text-fuchsia-200 text-sm overflow-x-auto max-w-full">
                        <TeX math={METHOD_FORMULAS[metodoActivo]} block />
                    </div>
                </div>

                <div className="w-full px-10 pb-10">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="function" className="text-sm font-medium text-white">
                                Ingrese su función:
                            </label>
                            <input
                                type="text"
                                id="function"
                                value={funcion}
                                onChange={(e) => setFuncion(e.target.value)}
                                placeholder="por ejemplo sin(x)"
                                className="p-2.5 rounded-lg bg-white border border-[#ff0040] text-black placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#fc0000] w-full"
                            />
                            {funcionTex && (
                                <div className="text-fuchsia-300 text-sm px-1 overflow-x-auto">
                                    <TeX math={funcionTex} />
                                </div>
                            )}
                        </div>

                        <div className='flex flex-row gap-3'>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label htmlFor="inferior" className="text-sm font-medium text-white">
                                    Limite inferior:
                                </label>
                                <input
                                    type="number"
                                    id="inferior"
                                    value={inferior}
                                    onChange={(e) => setInferior(e.target.value)}
                                    placeholder="0"
                                    className="p-2.5 rounded-lg bg-white border border-[#ff0040] text-black placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#fc0000] w-full"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 flex-1">
                                <label htmlFor="superior" className="text-sm font-medium text-white">
                                    Limite superior:
                                </label>
                                <input
                                    type="number"
                                    id="superior"
                                    value={superior}
                                    onChange={(e) => setSuperior(e.target.value)}
                                    placeholder="4"
                                    className="p-2.5 rounded-lg bg-white border border-[#ff0040] text-black placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#fc0000] w-full"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 flex-1">
                                <label htmlFor="intervalos" className="text-sm font-medium text-white">
                                    Numero de intervalos:
                                </label>
                                <input
                                    type="number"
                                    id="intervalos"
                                    value={intervalos}
                                    onChange={(e) => setIntervalos(e.target.value)}
                                    placeholder="8"
                                    className="p-2.5 rounded-lg bg-white border border-[#ff0040] text-black placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#fc0000] w-full"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="p-3 rounded-lg text-sm font-medium text-white bg-gradient-to-br from-purple-500 to-pink-500 focus:ring-4 focus:outline-none focus:ring-purple-200"
                        >
                            Calcular
                        </button>

                        {invertirPendiente && (
                            <div className="p-3 rounded-lg bg-yellow-900/40 text-sm text-white">
                                El límite inferior es mayor al superior, esto genera un área negativa.
                                <div className="flex gap-2 mt-2">
                                    <button type="button" onClick={() => calcular('continuar')} className="px-3 py-1 bg-[#334155] rounded">
                                        Continuar (área negativa)
                                    </button>
                                    <button type="button" onClick={() => calcular('invertir')} className="px-3 py-1 bg-[#334155] rounded">
                                        Invertir límites
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        {resultado !== null && !invertirPendiente && (
                            <div className="text-green-400 text-sm overflow-x-auto">
                                <TeX
                                    math={`\\int_{${formatTexNumber(limits.a)}}^{${formatTexNumber(limits.b)}} f(x)\\,dx \\approx ${formatTexNumber(resultado.value)}`}
                                    block
                                />
                            </div>
                        )}
                    </form>

                    {resultado !== null && !invertirPendiente && (
                        <div className="mt-8">
                            <Graph metodo={metodoActivo} data={resultado} a={limits.a} b={limits.b} triggerKey={triggerKey} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
