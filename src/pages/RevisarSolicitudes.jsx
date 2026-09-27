import React, { useState } from 'react'
import { IonIcon } from '@ionic/react'
import { ellipsisHorizontal, chevronDown } from 'ionicons/icons'
import AppLayout from '../components/AppLayout'
import EstadoBadge from '../components/EstadoBadge'
import { solicitudesFuncionario } from '../data/datosPrueba'
import './RevisarSolicitudes.css'

function RevisarSolicitudes() {
  const [solicitudes, setSolicitudes] = useState(solicitudesFuncionario)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [menuActivoId, setMenuActivoId] = useState(null)

  // Filtrado reactivo por folio, ciudadano, tipo o detalle y por estado
  const solicitudesFiltradas = solicitudes.filter((item) => {
    const termino = busqueda.toLowerCase().trim()
    const coincideTexto =
      !termino ||
      item.folio.toLowerCase().includes(termino) ||
      item.ciudadano.toLowerCase().includes(termino) ||
      item.tipo.toLowerCase().includes(termino) ||
      item.detalle.toLowerCase().includes(termino)

    const coincideEstado = !filtroEstado || item.estado === filtroEstado

    return coincideTexto && coincideEstado
  })

  // Permite cambiar el estado de una solicitud interactivamente
  const cambiarEstado = (id, nuevoEstado) => {
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s))
    )
    setMenuActivoId(null)
  }

  return (
    <AppLayout
      tituloDesktop={<>Panel de Gestion<br />Municipal</>}
      subtituloDesktop={<>Gestión y seguimiento de<br />solicitudes ciudadanas</>}
      tituloMovil="Panel de Gestion"
      nombreUsuario="Administrador"
      cantNotificaciones={3}
      tipoMenu="funcionario"
    >
      <div className="panel-revisar-solicitudes">
        <h1 className="revisar-titulo">Revisar solicitudes</h1>

        {/* ---------- Filtros Desktop ---------- */}
        <div className="revisar-filtros-desktop">
          <div className="campo-filtro">
            <label className="etiqueta-filtro" htmlFor="filtro-busqueda">
              Busqueda
            </label>
            <input
              id="filtro-busqueda"
              type="text"
              className="control-input"
              placeholder="Buscar por #Folio o ciudadano..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="campo-filtro">
            <label className="etiqueta-filtro" htmlFor="filtro-estado">
              Filtrar
            </label>
            <div className="select-contenedor">
              <select
                id="filtro-estado"
                className="control-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Filtrar por Estado:</option>
                <option value="En revisión">En revisión</option>
                <option value="En proceso">En proceso</option>
                <option value="Resuelto">Resuelto</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>
          </div>
        </div>

        {/* ---------- Tabla Desktop ---------- */}
        <div className="tabla-funcionario-wrapper">
          <table className="tabla-funcionario">
            <thead>
              <tr>
                <th className="th-col-folio"># Folio</th>
                <th className="th-col-fecha">Fecha</th>
                <th className="th-col-ciudadano">Ciudadano</th>
                <th className="th-col-tipo">Tipo</th>
                <th className="th-col-estado">Estado</th>
                <th className="th-col-acciones"></th>
              </tr>
            </thead>
            <tbody>
              {solicitudesFiltradas.length > 0 ? (
                solicitudesFiltradas.map((item) => (
                  <tr key={item.id}>
                    <td className="td-col-folio">{item.folio}</td>
                    <td className="td-col-fecha">{item.fecha}</td>
                    <td className="td-col-ciudadano">{item.ciudadano}</td>
                    <td className="td-col-tipo">{item.detalle}</td>
                    <td className="td-col-estado">
                      <EstadoBadge estado={item.estado} />
                    </td>
                    <td className="td-col-acciones">
                      <div className="acciones-menu-contenedor">
                        <button
                          type="button"
                          className="btn-acciones"
                          aria-label="Opciones de solicitud"
                          onClick={() =>
                            setMenuActivoId(menuActivoId === item.id ? null : item.id)
                          }
                        >
                          <IonIcon icon={ellipsisHorizontal} />
                        </button>
                        {menuActivoId === item.id && (
                          <div className="dropdown-acciones">
                            <span className="dropdown-titulo">Cambiar estado:</span>
                            <button onClick={() => cambiarEstado(item.id, 'En revisión')}>
                              En revisión
                            </button>
                            <button onClick={() => cambiarEstado(item.id, 'En proceso')}>
                              En proceso
                            </button>
                            <button onClick={() => cambiarEstado(item.id, 'Resuelto')}>
                              Resuelto
                            </button>
                            <button onClick={() => cambiarEstado(item.id, 'Rechazado')}>
                              Rechazado
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="td-sin-resultados">
                    No se encontraron solicitudes con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ---------- Vista Móvil ---------- */}
        <div className="seccion-movil-funcionario">
          <div className="campo-movil-busqueda">
            <label className="etiqueta-movil-solicitudes">Solicitudes:</label>
            <input
              type="text"
              className="control-input-movil"
              placeholder="Buscar por #Folio o ciudadano..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="lista-tarjetas-movil">
            {solicitudesFiltradas.length > 0 ? (
              solicitudesFiltradas.map((item) => (
                <div className="tarjeta-funcionario" key={item.id}>
                  <div className="tarjeta-encabezado-folio">
                    FOLIO {item.folio.toUpperCase()}
                  </div>
                  <div className="tarjeta-fila">
                    <span className="tarjeta-etiqueta">Ciudadano:</span> {item.ciudadano}
                  </div>
                  <div className="tarjeta-fila">
                    <span className="tarjeta-etiqueta">Tipo:</span> {item.tipo}
                  </div>

                  <div className="tarjeta-badge-posicion">
                    <div className="dropdown-estado-movil-wrapper">
                      <select
                        className="select-estado-movil"
                        value={item.estado}
                        onChange={(e) => cambiarEstado(item.id, e.target.value)}
                      >
                        <option value="En revisión">En revisión</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Resuelto">Resuelto</option>
                        <option value="Rechazado">Rechazado</option>
                      </select>
                      <div className="badge-movil-visual">
                        <EstadoBadge estado={item.estado} />
                        <IonIcon icon={chevronDown} className="flecha-dropdown" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="tarjeta-sin-resultados">
                No se encontraron solicitudes.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default RevisarSolicitudes
