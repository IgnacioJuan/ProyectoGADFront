import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  //LISTA DE ITEMS PARA SIDEBAR ADMIN
  menu: any[] = [
    {
      icono: 'nav-icon fas fa-users',
      titulo: "Asignación",
      submenu: [
        { titulo: 'Asignar Actividad', url: 'adm/asignacion-actividades/poa-actividad', icono: 'fas fa-check-square' },
        { titulo: 'Asignar Evidencia', url: 'adm/asignaEvidencia', icono: 'fas fa-check-square' }
      ]
    },
    {
      icono: 'nav-icon fas fa-eye',
      titulo: "Observación",
      submenu: [
        { titulo: ' Agregar observación ', url: 'sup/observaciones', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-list',
      titulo: "Criterio",
      submenu: [
        { titulo: 'Lista de Criterios', url: 'adm/criterios', icono: 'fas fa-cubes' },
        { titulo: 'Lista de Subcriterios', url: 'adm/subcriterios', icono: 'fas fa-cubes' },
        { titulo: 'Lista de Indicadores', url: 'adm/indicadores', icono: 'fas fa-cubes' },
        { titulo: 'Reporte de Criterios', url: 'sup/criterio_reporte', icono: 'fas fa-cubes' }
      ]
    },
  ]

  //LISTA DE ITEMS PARA SIDEBAR SUPERADMIN
  menu2: any[] = [
    {
      icono: 'nav-icon fas fa-solid fa-list',
      titulo: "Configurar Modelo",
      submenu: [
        { titulo: 'Modelo', url: 'sup/flujo-modelo/modelo', icono: 'fas fa-list-ul ' },
        { titulo: 'Indicador', url: 'sup/flujo_Componentes/componentesSuper', icono: 'fas fa-list-ul ' }
      ]
    },
    {
      icono: 'nav-icon fas   fa-users',
      titulo: "Usuarios",
      submenu: [
        { titulo: 'Lista de Usuarios', url: 'sup/usuarios', icono: 'fas fa-list-ul ' }

      ]
    },


  ]


  //LISTA DE ITEMS PARA SIDEBAR RESPONSABLE
  menu3: any[] = [
    {
      icono: 'nav-icon fas fa-file-alt',
      titulo: "Evidencias",
      submenu: [
        { titulo: 'Evidencias asignadas', url: 'res/eviTareaAsina', icono: 'fas fa-file-contract' }

      ]
    },
    {
      icono: 'nav-icon fas fa-tasks',
      titulo: "Criterios",
      submenu: [
        { titulo: 'Reporte Criterios', url: 'res/actividadCriterio', icono: 'fas fa-file-contract' }

      ]
    }

  ]

  //LISTA DE ITEMS PARA SIDEBAR AUTORIDAD
  menu4: any[] = [
  ]
}
