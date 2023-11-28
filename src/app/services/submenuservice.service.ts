import { Injectable } from '@angular/core';

@Injectable()
export class SubmenuserviceService {
private submenuData: any;
private enviar= 'submenuData';
constructor() { }


setSubmenu(data: any) {
  //this.submenuData = data;
  localStorage.setItem(this.enviar, JSON.stringify(data));
}

getSubmenu() {
  //return this.submenuData;
  const submenu = localStorage.getItem(this.enviar);
    return submenu ? JSON.parse(submenu) : null;
}

limpiarSubmenu() {
  localStorage.removeItem(this.enviar);
}
}
