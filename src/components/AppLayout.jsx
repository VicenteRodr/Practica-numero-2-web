import { IonPage, IonContent, IonIcon, IonMenuButton } from '@ionic/react'
import { personOutline, chevronDown } from 'ionicons/icons'
import MenuLateral from './MenuLateral'
import Campana from './Campana'
import { usuario } from '../data/datosPrueba'
import './AppLayout.css'

// layout para las paginas despues de iniciar sesion (menu, header y footer)
// asi las otras pantallas solo ponen su contenido adentro
function AppLayout({
  children,
  tituloDesktop = <>Santo Domingo:<br />Responde</>,
  subtituloDesktop = <>Gestión y seguimiento de<br />solicitudes ciudadanas</>,
  tituloMovil = <>Santo Domingo:<br />Responde</>,
  nombreUsuario = usuario.nombre,
  cantNotificaciones = usuario.notificaciones,
  tipoMenu = 'vecino',
}) {
  return (
    <IonPage>
      <IonContent>
        <div className="app-page">
          <div className="app-barra"></div>

          {/* header azul que solo sale en el celu */}
          <div className="header-movil">
            <IonMenuButton autoHide={false} />
            <p>{tituloMovil}</p>
            <Campana cantidad={cantNotificaciones} />
          </div>
          <div className="app-ola ola-movil-app"></div>

          <div className="app-cuerpo">
            <aside className="sidebar">
              <MenuLateral tipo={tipoMenu} />
            </aside>

            <main className="app-main">
              <header className="app-header">
                <div className="app-titulos">
                  <h1>{tituloDesktop}</h1>
                  <p>{subtituloDesktop}</p>
                </div>
                <div className="app-ola"></div>

                <div className="header-acciones">
                  <Campana cantidad={cantNotificaciones} />
                  <div className="usuario">
                    <div className="avatar"><IonIcon icon={personOutline} /></div>
                    <span>{nombreUsuario}</span>
                    <IonIcon icon={chevronDown} className="flechita" />
                  </div>
                </div>
              </header>

              {children}
            </main>
          </div>

          <footer className="app-footer">
            © 2026 Municipalidad de Santo Domingo.<br />
            Todos los derechos reservados
          </footer>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default AppLayout
