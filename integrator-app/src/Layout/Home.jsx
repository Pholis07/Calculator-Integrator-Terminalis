import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { animate, createTimeline } from 'animejs'

export default function Home() {
    const titleRef = useRef(null)
    const paraRef = useRef(null)
    const buttonRef = useRef(null)

    useEffect(() => {
        const tl = createTimeline({ defaults: { ease: 'outExpo' } })
        tl.add(titleRef.current, { opacity: [0, 1], translateY: [-24, 0], scale: [0.92, 1], duration: 700 })
        tl.add(paraRef.current, { opacity: [0, 1], translateY: [16, 0], duration: 600 }, '-=400')
        tl.add(buttonRef.current, { opacity: [0, 1], scale: [0.8, 1], duration: 500, ease: 'outBack' }, '-=300')

        const pulse = animate(buttonRef.current, {
            scale: [1, 1.04],
            duration: 1400,
            ease: 'inOutSine',
            loop: true,
            alternate: true,
            autoplay: false,
        })
        tl.then(() => pulse.play())

        return () => {
            tl.pause()
            pulse.pause()
        }
    }, [])

    return (
        <section className="flex justify-center items-center h-screen flex-col bg-gradient-to-t from-pink-900 from-10% to-black">
            <h1 ref={titleRef} className="text-4xl text-fuchsia-400 font-bold opacity-0"> Integrator-App </h1>

            <div className="w-4xl ml-20 mr-20 mt-20">
                <p ref={paraRef} className="text-center text-xs font-semibold text-white opacity-0">
                    Integrator App es una aplicación de escritorio diseñada para facilitar el cálculo
                    de integrales definidas mediante métodos numéricos, como la Regla de Simpson
                    y la Suma de Riemann. Su objetivo principal es ofrecer una
                    herramienta visual e interactiva que permita a estudiantes de cálculo integral
                    comprender y verificar sus resultados de forma rápida y precisa, evaluando
                    expresiones matemáticas ingresadas por el usuario y mostrando el proceso de aproximación
                    paso a paso. Construida con React, Electron y math.js, busca combinar el rigor matemático
                    con una interfaz moderna y accesible.
                </p>
            </div>

            <div className="mt-30">
                <Link to="calculadora">
                    <button ref={buttonRef} className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-[#ff0073] to-[#fc0000] group-hover:from-[#ff0073] group-hover:to-[#fc0000] hover:text-white focus:ring-4 focus:outline-none focus:ring-[#ff0073]/40 opacity-0">
                        <span className="relative px-4 py-2.5 transition-all ease-in duration-75 bg-neutral-900 rounded-md group-hover:bg-transparent leading-5">
                            Ir a la calculadora
                        </span>
                    </button>
                </Link>
            </div>
        </section>
    );
}