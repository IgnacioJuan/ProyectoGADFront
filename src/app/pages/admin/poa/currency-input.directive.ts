import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCurrencyInput]'
})
export class CurrencyInputDirective {
  private regex: RegExp = /^\d+(\.\d{0,2})?$/; // Acepta números con hasta 2 decimales

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const inputValue: string = inputElement.value;
    if (this.regex.test(inputValue)) {
      return;
    } else {
      inputElement.value = inputValue.slice(0, -1); // Elimina el último carácter no válido
    }
  }
}
