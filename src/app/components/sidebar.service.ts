import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  //LISTA DE ITEMS PARA SIDEBAR ADMIN
  menu: any[] = [
    {
      icono: 'nav-icon fas fa-solid fa-list',
      titulo: "POA",
      submenu: [
        { titulo: 'Creacion', url: 'adm/poa/registrarpoa', icono: 'fas fa-check-square' },
        { titulo: 'Estados', url: 'adm/poasEnviadosAdmin', icono: 'fas fa-cubes' },
        { titulo: 'Avance Meta', url: 'adm/evaluar-poa/poas', icono: 'fas fa-list-ul ' },
      ]
    },

    {
      icono: 'nav-icon fas fa-users',
      titulo: "Responsables",
      submenu: [
        { titulo: 'Control Responsables', url: 'adm/create-responsables', icono: 'fas fa-check-square' },
        { titulo: 'Asignacion ', url: 'adm/asignacion-actividades/poa-actividad', icono: 'fas fa-check-square' },
      ]
    },

    {
      icono: 'nav-icon fas fa-file-invoice',
      titulo: "Presupuesto",
      submenu: [
        { titulo: 'Solicitudes', url: 'adm/poas-solicitudes/listarPoasSoli', icono: 'fas fa-list-ul ' },
        { titulo: 'Financiamiento', url: 'sup/actividades-presupuestos/tabla-poas', icono: 'fas fa-list-ul ' },
        { titulo: 'Ejecución Periodo', url: 'adm/presup-ejecut/tabla-poas', icono: 'fas fa-list-ul ' },

      ]
    },
    {
      icono: 'nav-icon fas fa-solid  fa-check',
      titulo: "Evaluación",
      submenu: [
        { titulo: 'Aprobación de Evidencias', url: 'sup/aprobarEvidencias/listPoaAprobarEvidenciaSuper', icono: 'fas fa-file-contract' }

      ]
    },
  ]

  //LISTA DE ITEMS PARA SIDEBAR SUPERADMIN
  menu2: any[] = [
    {
      icono: 'nav-icon fas   fa-users',
      titulo: "Usuarios",
      submenu: [
        { titulo: 'Control Usuarios', url: 'sup/crear-usuarios/usuarios', icono: 'fas fa-list-ul ' },
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-cog',
      titulo: "Configurar Modelo",
      submenu: [
        { titulo: 'Modelo', url: 'sup/flujo-modelo/modelo', icono: 'fas fa-list-ul ' },
        { titulo: 'Indicador', url: 'sup/flujo_Componentes/componentesSuper', icono: 'fas fa-list-ul ' },
        { titulo: 'Programas', url: 'sup/crearpro', icono: 'fas fa-list-ul ' },
        { titulo: 'Objetivos PND', url: 'sup/ejes/ejestabla', icono: 'fas fa-list-ul ' },
        { titulo: 'Competencia', url: 'sup/crearcompe', icono: 'fas fa-list-ul ' },
        { titulo: 'ODS', url: 'sup/objetivoods-lista', icono: 'fas fa-list-ul ' },
      ]
    },


    {
      icono: 'nav-icon fas fa-tasks',
      titulo: "POAS",
      submenu: [
        { titulo: 'Estados', url: 'sup/flujo-criterio/listaproyecto', icono: 'fas fa-list-ul ' },
        { titulo: 'Avance Meta', url: 'adm/evaluar-poa/poas', icono: 'fas fa-list-ul ' },

      ]
    },
    

    {
      icono: 'nav-icon fas fa-solid fa-list',
      titulo: "Actividades",
      submenu: [
        { titulo: 'Financiamiento', url: 'sup/actividades-presupuestos/tabla-poas', icono: 'fas fa-list-ul ' },
        { titulo: 'Asignaciones', url: 'sup/usuario-actividades/listar-actividades', icono: 'fas fa-list-ul ' },

      ]
    },
    {
      icono: 'nav-icon fas fa-file-invoice',
      titulo: "Evidencias",
      submenu: [
        { titulo: 'Estados', url: 'sup/resumen-evidencias-responsable/evidencias', icono: 'fas fa-list-ul ' },
        //{ titulo: 'Evidencias Rechazadas', url: 'sup/archivos-rechazados/Actividades_Evi_Rechazados', icono: 'fas fa-list-ul ' },

      ]
    },
    {
      icono: 'nav-icon fas fa-solid  fa-check',
      titulo: "Evaluación",
      submenu: [
        { titulo: 'Aprobación de POAS', url: 'sup/aprobacion-poa/lista-aprobar-poa', icono: 'fas fa-list-ul ' },
        { titulo: 'Aprobación de Actividades', url: 'sup/aprobar-actividades/poa-actividad', icono: 'fas fa-list-ul ' },
      ]
    },


    {
      icono: 'nav-icon fas fa-file-invoice',
      titulo: "Reporte",
      submenu: [
        { titulo: 'Metas', url: 'repor/reporte_metas', icono: 'fas fa-list-ul ' },
        { titulo: 'Competencia', url: 'repor/reporteECompetencia', icono: 'fas fa-list-ul ' },
        { titulo: 'Programa', url: 'repor/reporteProgramas', icono: 'fas fa-list-ul ' },
        { titulo: 'Presupuestos', url: 'sup/reporte-presupuesto/reporteproyecto', icono: 'fas fa-list-ul ' },
        { titulo: 'Periodos', url: 'adm/presup-ejecut/tabla-poas', icono: 'fas fa-list-ul ' },

      ]
    },




  ]


  //LISTA DE ITEMS PARA SIDEBAR RESPONSABLE
  menu3: any[] = [
    {
      icono: 'nav-icon fas fa-tasks',
      titulo: "Actividades",
      submenu: [
        { titulo: 'Mis Actividades', url: 'res/activ/poa_proyectos', icono: 'fas fa-file-contract' },
        { titulo: 'Solicitud de Presupuesto', url: 'res/solicitar-presupuestos/listSolicitudes', icono: 'fas fa-list-ul ' },

      ]
    }, {
      icono: 'nav-icon fas fa-file-invoice',
      titulo: "Evidencias",
      submenu: [
        { titulo: 'Estado de evidencias', url: 'sup/resumen-evidencias-responsable/evidencias', icono: 'fas fa-list-ul ' },

      ]
    },

  ]

  //LISTA DE ITEMS PARA SIDEBAR AUTORIDAD
  menu4: any[] = [
  ]
}
