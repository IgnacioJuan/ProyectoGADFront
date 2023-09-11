import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  get isLoading() {
    return this.loadingSubject.asObservable();
  }

  show() {
    console.log("hola");
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }
}
