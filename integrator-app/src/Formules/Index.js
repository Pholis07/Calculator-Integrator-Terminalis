import { simpson } from './Simpson'
import { riemann } from './Rieman'
import { poligonos } from './Poligonos'

export const metodos = {
  riemman: {
    fn: riemann,
    requiereNPar: false,
  },
  simpson: {
    fn: simpson,
    requiereNPar: true,
  },
  trapecios: {
    fn: poligonos, // <- antes decía 'trapecios' sin importar/definir nada
    requiereNPar: false,
  },
}