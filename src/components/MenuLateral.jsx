import { IonIcon, useIonRouter } from '@ionic/react'
import { useLocation } from 'react-router-dom'
import {
  homeOutline,
  documentTextOutline,
  addCircleOutline,
  notificationsOutline,
  personOutline,
  helpCircleOutline,
  logOutOutline,
  swapHorizontalOutline
} from 'ionicons/icons'
import { usuario, funcionario } from '../data/datosPrueba'
import { useRol } from '../context/RolContext'
import './MenuLateral.css'

// Opciones exclusivas para vecino (ciudadano)
const opcionesVecino = [
  { nombre: 'Inicio', icono: homeOutline, ruta: '/inicio' },
  { nombre: 'Mis solicitudes', icono: documentTextOutline, ruta: '/mis-solicitudes' },
  { nombre: 'Nueva solicitud', icono: addCircleOutline },
  { nombre: 'Ingresar reclamo', iconoCustom: '/img/alerta-usuario.svg', ruta: '/ingreso-reclamo' }, 
  { nombre: 'Notificaciones', icono: notificationsOutline, badge: usuario.notificaciones },
  { nombre: 'Mi perfil', icono: personOutline },
  { nombre: 'Ayuda', icono: helpCircleOutline },
  { nombre: 'Cerrar Sesión', icono: logOutOutline, ruta: '/login' },
]

// Opciones exclusivas para funcionario (administrador) según Figma
const opcionesFuncionario = [
  { nombre: 'Inicio', icono: homeOutline, ruta: '/inicio' },
  { nombre: 'Revisar solicitudes', icono: documentTextOutline, ruta: '/revisar-solicitudes' },
  { nombre: 'Revisar reclamo', iconoCustom: '/img/alerta-usuario.svg', ruta: '/ingreso-reclamo' },
  { nombre: 'Notificaciones', icono: notificationsOutline, badge: funcionario.notificaciones },
  { nombre: 'Mi Perfil', icono: personOutline },
  { nombre: 'Cerrar Sesión', icono: logOutOutline, ruta: '/login' },
]

function MenuLateral({ tipo }) {
  const router = useIonRouter()
  const location = useLocation()
  const { esAdmin, cambiarRol } = useRol()

  // Determina si se muestra el menú de funcionario o de vecino
  const esFuncionario = tipo ? tipo === 'funcionario' : (esAdmin || location.pathname === '/revisar-solicitudes')
  const opciones = esFuncionario ? opcionesFuncionario : opcionesVecino

  const irA = (opcion) => {
    // cierra el menu del celular
    const menu = document.querySelector('ion-menu')
    if (menu) menu.close()
    if (opcion.ruta) {
      router.push(opcion.ruta)
    }
  }

  const alternarRol = () => {
    const siguiente = esFuncionario ? 'vecino' : 'administrador'
    cambiarRol(siguiente)
    const menu = document.querySelector('ion-menu')
    if (menu) menu.close()
    if (siguiente === 'administrador') {
      router.push('/revisar-solicitudes')
    } else {
      router.push('/inicio')
    }
  }

  return (
    <nav className="menu-lateral">
      <img className="menu-logo" src="/img/logo.png" alt="Municipalidad de Santo Domingo" />

      {opciones.map((opcion) => (
        <button
          key={opcion.nombre}
          className={location.pathname === opcion.ruta ? 'menu-item activo' : 'menu-item'}
          onClick={() => irA(opcion)}
        >
          {opcion.iconoCustom ? (
            <IonIcon src={opcion.iconoCustom} />
          ) : (
            <IonIcon icon={opcion.icono} />
          )}
          <span>{opcion.nombre}</span>
          {opcion.badge > 0 && <span className="badge">{opcion.badge}</span>}
        </button>
      ))}

      {/* Switch de rol disponible en el menú (útil para móvil) */}
      <div className="menu-switch-rol-movil">
        <button type="button" className="btn-switch-rol-movil" onClick={alternarRol}>
          <IonIcon icon={swapHorizontalOutline} />
          <span>{esFuncionario ? 'Cambiar a modo Vecino' : 'Cambiar a Administrador'}</span>
        </button>
      </div>
    </nav>
  )
}

export default MenuLateral