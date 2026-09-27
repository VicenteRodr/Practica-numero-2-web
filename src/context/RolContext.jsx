/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react'

const RolContext = createContext()

export function RolProvider({ children }) {
  // rol puede ser 'vecino' o 'administrador'
  const [rol, setRol] = useState(() => {
    return localStorage.getItem('modo_rol') || 'vecino'
  })

  const cambiarRol = (nuevoRol) => {
    setRol(nuevoRol)
    localStorage.setItem('modo_rol', nuevoRol)
  }

  const toggleRol = () => {
    const siguiente = rol === 'administrador' ? 'vecino' : 'administrador'
    cambiarRol(siguiente)
    return siguiente
  }

  const esAdmin = rol === 'administrador'

  return (
    <RolContext.Provider value={{ rol, setRol, cambiarRol, toggleRol, esAdmin }}>
      {children}
    </RolContext.Provider>
  )
}

export function useRol() {
  const context = useContext(RolContext)
  if (!context) {
    throw new Error('useRol debe ser utilizado dentro de un RolProvider')
  }
  return context
}
