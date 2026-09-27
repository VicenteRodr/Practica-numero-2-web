import React, { useState, useEffect, useRef } from 'react'
import { IonPage, IonContent, IonIcon, IonMenuButton, useIonRouter } from '@ionic/react'
import { personOutline, chevronDown, swapHorizontalOutline, logOutOutline, shieldCheckmarkOutline } from 'ionicons/icons'
import MenuLateral from './MenuLateral'
import Campana from './Campana'
import { usuario, funcionario } from '../data/datosPrueba'
import { useRol } from '../context/RolContext'
import './AppLayout.css'

// Layout principal que adapta el header, menú y perfil según el rol activo (vecino o administrador)
function AppLayout({
  children,
  tituloDesktop,
  subtituloDesktop,
  tituloMovil,
  nombreUsuario,
  cantNotificaciones,
  tipoMenu,
}) {
  const router = useIonRouter()
  const { esAdmin, cambiarRol } = useRol()
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false)
  const menuUsuarioRef = useRef(null)

  // Cerrar el menú desplegable si se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuUsuarioRef.current && !menuUsuarioRef.current.contains(event.target)) {
        setMenuUsuarioAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Valores predeterminados según el rol activo
  const tituloDesktopFinal =
    tituloDesktop ||
    (esAdmin ? (
      <>
        Panel de Gestion
        <br />
        Municipal
      </>
    ) : (
      <>
        Santo Domingo:
        <br />
        Responde
      </>
    ))

  const subtituloDesktopFinal =
    subtituloDesktop || (
      <>
        Gestión y seguimiento de
        <br />
        solicitudes ciudadanas
      </>
    )

  const tituloMovilFinal = tituloMovil || (esAdmin ? 'Panel de Gestion' : <>Santo Domingo:<br />Responde</>)
  const nombreUsuarioFinal = nombreUsuario || (esAdmin ? funcionario.nombre : usuario.nombre)
  const cantNotificacionesFinal = cantNotificaciones ?? (esAdmin ? funcionario.notificaciones : usuario.notificaciones)
  const tipoMenuFinal = tipoMenu || (esAdmin ? 'funcionario' : 'vecino')

  const cambiarAModo = (nuevoRol) => {
    cambiarRol(nuevoRol)
    setMenuUsuarioAbierto(false)
    if (nuevoRol === 'administrador') {
      router.push('/revisar-solicitudes')
    } else {
      router.push('/inicio')
    }
  }

  return (
    <IonPage>
      <IonContent>
        <div className="app-page">
          <div className="app-barra"></div>

          {/* Header azul visible en móvil */}
          <div className="header-movil">
            <IonMenuButton autoHide={false} />
            <p>{tituloMovilFinal}</p>
            <div className="header-movil-derecha">
              <Campana cantidad={cantNotificacionesFinal} />
            </div>
          </div>
          <div className="app-ola ola-movil-app"></div>

          <div className="app-cuerpo">
            <aside className="sidebar">
              <MenuLateral tipo={tipoMenuFinal} />
            </aside>

            <main className="app-main">
              <header className="app-header">
                <div className="app-titulos">
                  <h1>{tituloDesktopFinal}</h1>
                  <p>{subtituloDesktopFinal}</p>
                </div>
                <div className="app-ola"></div>

                <div className="header-acciones">
                  <Campana cantidad={cantNotificacionesFinal} />

                  {/* Menú de usuario con selector de rol */}
                  <div
                    className={`usuario ${menuUsuarioAbierto ? 'usuario-activo' : ''}`}
                    ref={menuUsuarioRef}
                    onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
                    title="Haz clic para cambiar entre modo Vecino y Administrador"
                  >
                    <div className="avatar">
                      <IonIcon icon={esAdmin ? shieldCheckmarkOutline : personOutline} />
                    </div>
                    <span>{nombreUsuarioFinal}</span>
                    <IonIcon
                      icon={chevronDown}
                      className={`flechita ${menuUsuarioAbierto ? 'flechita-rotada' : ''}`}
                    />

                    {/* Ventana desplegable al hacer clic en el usuario */}
                    {menuUsuarioAbierto && (
                      <div className="dropdown-usuario" onClick={(e) => e.stopPropagation()}>
                        <div className="dropdown-usuario-cabecera">
                          <span className="dropdown-usuario-etiqueta">Modo actual:</span>
                          <span className="dropdown-usuario-rol">
                            {esAdmin ? '🛡️ Administrador (Funcionario)' : '👤 Vecino (Ciudadano)'}
                          </span>
                        </div>

                        <div className="dropdown-usuario-separador"></div>

                        {esAdmin ? (
                          <button
                            type="button"
                            className="dropdown-usuario-btn-switch"
                            onClick={() => cambiarAModo('vecino')}
                          >
                            <div className="btn-switch-icono">
                              <IonIcon icon={swapHorizontalOutline} />
                            </div>
                            <div className="btn-switch-textos">
                              <span className="btn-switch-principal">Cambiar a Modo Vecino</span>
                              <span className="btn-switch-secundario">Ver portal como Juan López</span>
                            </div>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="dropdown-usuario-btn-switch"
                            onClick={() => cambiarAModo('administrador')}
                          >
                            <div className="btn-switch-icono icono-admin">
                              <IonIcon icon={swapHorizontalOutline} />
                            </div>
                            <div className="btn-switch-textos">
                              <span className="btn-switch-principal">Cambiar a Modo Administrador</span>
                              <span className="btn-switch-secundario">Acceder a Revisar Solicitudes</span>
                            </div>
                          </button>
                        )}

                        <div className="dropdown-usuario-separador"></div>

                        <button
                          type="button"
                          className="dropdown-usuario-btn-logout"
                          onClick={() => {
                            setMenuUsuarioAbierto(false)
                            router.push('/login')
                          }}
                        >
                          <IonIcon icon={logOutOutline} />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </header>

              {children}
            </main>
          </div>

          <footer className="app-footer">
            © 2026 Municipalidad de Santo Domingo.
            <br />
            Todos los derechos reservados
          </footer>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default AppLayout
