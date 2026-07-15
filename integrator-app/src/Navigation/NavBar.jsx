import { Link } from 'react-router-dom'

export default function NavBar() {
    return (
        <nav className="bg-mist-950 fixed w-full z-20 top-0 start-0 border-b border-default">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div>
                    <Link to="/">
                        <span className="self-center text-fuchsia-400 text-xl text-heading font-semibold whitespace-nowrap">Integrator-App</span>
                    </Link>
                </div>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
                        <li>
                            <a href="#" className="block py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0" aria-current="page">Calcular Areas</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}