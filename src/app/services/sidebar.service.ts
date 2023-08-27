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

    {
      icono: 'nav-icon fas fa-exclamation-circle',
      titulo: "Revisión  ",
      submenu: [
        { titulo: 'Aprobar o rechazar evidencias', url: 'adm/apruebaAdmin', icono: 'fas fa-times-circle' },
        { titulo: 'Actividades Rechazadas', url: 'sup/actividad-rechazada', icono: 'fas fa-cubes' }

      ]
    },
  ]

  //LISTA DE ITEMS PARA SIDEBAR SUPERADMIN
  menu2: any[] = [
    {
      icono: 'nav-icon fas   fa-newspaper',
      titulo: "Dashboard",
      submenu: [
        { titulo: 'Ver Dashboard', url: 'sup/dashboard', icono: 'fas fa-list-ul ' }

      ]
    },
    {
      icono: 'nav-icon fas   fa-users',
      titulo: "Usuarios",
      submenu: [
        { titulo: 'Lista de Usuarios', url: 'sup/usuarios', icono: 'fas fa-list-ul ' }

      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-check-square',
      titulo: "Observación",
      submenu: [
        { titulo: ' Agregar observación ', url: 'sup/observaciones', icono: 'fas fa-cubes' }

      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-list',
      titulo: "Criterio",
      submenu: [
        { titulo: 'Lista de Criterios', url: 'sup/flujo-criterio/criterioSuper', icono: 'fas fa-cubes' },
        { titulo: 'Lista de Subcriterios', url: 'sup/subcriterioSuper', icono: 'fas fa-cubes' },
        { titulo: 'Lista de Indicadores', url: 'sup/indicadoreSuper', icono: 'fas fa-cubes' }
,    { titulo: 'Lista de Componentes', url: 'sup/flujo_Componentes/componentesSuper', icono: 'fas fa-cubes' },

        { titulo: 'Reporte de Criterios', url: 'sup/criterio_reporte', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-list',
      titulo: "Componentes",
      submenu: [
      { titulo: 'Lista de Componentes', url: 'sup/flujo_Componentes/componentesSuper', icono: 'fas fa-cubes' },
      ]
    },

    // {
    //   icono: 'nav-icon fas fas fa-star',
    //   titulo: "Evaluación",
    //   submenu: [
    //     { titulo: 'Evaluación de Actividades', url: 'evidenciaSuper', icono: 'fas fa-cubes' }

    //   ]
    // },

    {
      icono: 'nav-icon fas fa-solid fa-cube',
      titulo: "Modelo",
      submenu: [
        { titulo: 'Modelos', url: 'sup/modelo/modelo', icono: 'fas fa-cubes' }

      ]
    },

    {
      icono: 'nav-icon fas fa-superscript',
      titulo: "Fórmula",
      submenu: [
        { titulo: 'Lista de Fórmula', url: 'sup/formula/formula', icono: 'fas fa-cubes' },
        { titulo: 'Lista Cuantitativas', url: 'sup/formula/cuantitativa', icono: 'fas fa-cubes' },
        { titulo: 'Lista Cualitativas', url: 'sup/formula/cualitativa', icono: 'fas fa-cubes' },

      ]
    },
    {
      icono: 'nav-icon fas fa-exclamation-circle',
      titulo: "Revisión  ",
      submenu: [
        { titulo: 'Responsables de actividades', url: 'sup/actividad_responsable', icono: 'fas fa-times-circle' },
        { titulo: 'Actividades Rechazadas', url: 'sup/actividad-rechazada', icono: 'fas fa-cubes' }

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
    {
      icono: 'nav-icon fas fa-solid fa-running',
      titulo: "Actividades",
      submenu: [
        { titulo: 'Actividades Completadas', url: 'aut/consulta', icono: 'fas fa-cubes' }
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-list',
      titulo: "Responsable",
      submenu: [
        { titulo: 'Lista de Responsable', url: 'aut/actividad_auto', icono: 'fas fa-cubes' }

      ]
    }
  ,

    {
      icono: 'nav-icon fas fa-file-pdf',
      titulo: "Reportes",
      submenu: [
        { titulo: 'Lista de Modelos', url: 'aut/graficosAutor', icono: 'fas fa-cubes' },
        { titulo: 'Reporte de Criterios', url: 'sup/criterio_reporte', icono: 'fas fa-cubes' }
      ]
    }
  ]
}
