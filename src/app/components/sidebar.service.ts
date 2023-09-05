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
        
      ]
    },
    {
      icono: 'nav-icon fas fa-users',
      titulo: "Asignación",
      submenu: [
        { titulo: 'POA', url: 'adm/asignacion-actividades/poa-actividad', icono: 'fas fa-check-square' },
        
      ]
    },
    {
      icono: 'nav-icon fas fa-file-signature',
      titulo: "Poas Enviados",
      submenu: [
        { titulo: 'Listado de Poas', url: 'adm/poasEnviadosAdmin', icono: 'fas fa-cubes' },
      ]
    },
  ]

  //LISTA DE ITEMS PARA SIDEBAR SUPERADMIN
  menu2: any[] = [
    {
      icono: 'nav-icon fas   fa-users',
      titulo: "Usuarios",
      submenu: [
        { titulo: 'Lista de Usuarios', url: 'sup/usuarios', icono: 'fas fa-list-ul ' },
      ]
    },
    {
      icono: 'nav-icon fas fa-solid fa-list',
      titulo: "Configurar Modelo",
      submenu: [
        { titulo: 'Modelo', url: 'sup/flujo-modelo/modelo', icono: 'fas fa-list-ul ' },
        { titulo: 'Indicador', url: 'sup/flujo_Componentes/componentesSuper', icono: 'fas fa-list-ul ' },
        { titulo: 'Programas', url: 'sup/crearpro', icono: 'fas fa-list-ul ' },
        { titulo: 'Componentes', url: 'sup/ejes/ejestabla', icono: 'fas fa-list-ul ' },
        { titulo: 'Competencia', url: 'sup/crearcompe', icono: 'fas fa-list-ul ' },
        { titulo: 'ODS', url: 'sup/objetivoods-lista', icono: 'fas fa-list-ul ' },


      ]
    },
    
 
    {
      icono: 'nav-icon fas fa-tasks',
      titulo: "POA",
      submenu: [
        { titulo: 'Poas Rechazados', url: 'sup/flujo-criterio/listarpoa', icono: 'fas fa-list-ul ' },
        { titulo: 'Poas Asignados', url: 'sup/flujo-criterio/listarpoausu', icono: 'fas fa-list-ul ' },
        { titulo: 'Reporte de POA', url: 'sup/reportePoa', icono: 'fas fa-list-ul ' }
        { titulo: 'Aprobación de POAS', url: 'sup/aprobacion-poa/lista-aprobar-poa', icono: 'fas fa-list-ul ' }


      ] 
    },
    {
      icono: 'nav-icon fas fa-solid fa-list',
      titulo: "Actividades",
      submenu: [
        { titulo: 'Presupuestos', url: 'sup/actividades-presupuestos/tabla-poas', icono: 'fas fa-list-ul ' },
        { titulo: 'Evidencias Rechazadas', url: 'sup/archivos-rechazados/Actividades_Evi_Rechazados', icono: 'fas fa-list-ul ' },
        { titulo: 'Lista de Actividades', url: 'sup/usuario-actividades/listar-actividades', icono: 'fas fa-list-ul ' },
        { titulo: 'Aprobar/Rechazar Evidencia', url: 'sup/aprobarEvidencias/listPoaAprobarEvidenciaSuper', icono: 'fas fa-file-contract' }

      ]
    },

    {
      icono: 'nav-icon fas fa-solid fa-list',
      titulo: "Reportes",
      submenu: [
        { titulo: 'Reporte Poa', url: 'sup/reportePoa', icono: 'fas fa-list-ul ' },

      ]
    },

    



  ]


  //LISTA DE ITEMS PARA SIDEBAR RESPONSABLE
  menu3: any[] = [
    {
      icono: 'nav-icon fas fa-tasks',
      titulo: "Actividades",
      submenu: [
        { titulo: 'Mis Actividades', url: 'res/activ/actividadesdesig', icono: 'fas fa-file-contract' },
        { titulo: 'Resumen Presupuestos', url: 'res/resumen-presupuestos/lista-actividades', icono: 'fas fa-list-ul ' },
      ]
    }

  ]

  //LISTA DE ITEMS PARA SIDEBAR AUTORIDAD
  menu4: any[] = [
  ]
}
