import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private history: string[] = [];

    constructor(private router: Router) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.history.push(event.urlAfterRedirects);
            }
        });
    }

    back(): void {
        this.history.pop(); // remove current url
        if (this.history.length > 0) {
            this.router.navigateByUrl(this.history[this.history.length - 1]);
        }
    }
}
