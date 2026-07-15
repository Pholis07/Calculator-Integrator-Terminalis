import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <section className="flex justify-center items-center h-screen flex-col bg-gradient-to-t from-pink-900 from-10% to-black h-screen">
            <h1 className="text-4xl text-fuchsia-400 font-bold "> Integrator-App </h1>

            <div className="w-4xl ml-20 mr-20 mt-20">
                <p className="text-center text-xs font-semibold text-white">
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
                    <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-white rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-200">
                        <span className="relative px-4 py-2.5 transition-all ease-in duration-75 bg-neutral-900 rounded-md group-hover:bg-transparent leading-5">
                            Ir a la calculadora
                        </span>
                    </button>
                </Link>
            </div>
        </section>
    );


}