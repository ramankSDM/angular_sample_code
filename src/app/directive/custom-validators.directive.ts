import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInputRestriction]'
})
export class CustomValidatorsDirective {
  inputElement: ElementRef;

  @Input('appInputRestriction') appInputRestriction: string;
  arabicRegex = '[\u0600-\u06FF]';

  constructor(el: ElementRef) {
      this.inputElement = el;
  }

  @HostListener('keypress', ['$event']) onKeyPress(event) {
      if (this.appInputRestriction === 'integerOnly') {
          this.integerOnly(event);
      } else if (this.appInputRestriction === 'noSpecialChars') {
          this.noSpecialChars(event);
      } else if (this.appInputRestriction === 'specialCharsHyphen') {
        this.specialCharsHyphen(event);
    }
  }

  /** Directive for Integer only*/
  integerOnly(event) {
      const e = <KeyboardEvent>event;
      if (e.key === 'Tab' || e.key === 'TAB') {
          return;
      }
      if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
          (e.keyCode === 65 && e.ctrlKey === true) ||
          (e.keyCode === 67 && e.ctrlKey === true) ||
          (e.keyCode === 86 && e.ctrlKey === true) ||
          (e.keyCode === 88 && e.ctrlKey === true)) {
          return;
      }
      if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) === -1) {
          e.preventDefault();
      }
  }
  /** Directive for No Special character allowed*/
  noSpecialChars(event) {
      const e = <KeyboardEvent>event;
      if (e.key === 'Tab' || e.key === 'TAB') {
          return;
      }
      let k;
      k = event.keyCode;
      if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57)) {
          return;
      }
      const ch = String.fromCharCode(e.keyCode);
      const regEx = new RegExp(this.arabicRegex);
      if (regEx.test(ch)) {
          return;
      }
      e.preventDefault();
  }
   /** Directive for No Special character allowed*/
   specialCharsHyphen(event) {
    const e = <KeyboardEvent>event;
    if (e.key === 'Tab' || e.key === 'TAB') {
        return;
    }
    let k;
    k = event.keyCode;
    if(k!=45){
        if ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57)) {
            return;
        }
        const ch = String.fromCharCode(e.keyCode);
        const regEx = new RegExp(this.arabicRegex);
        if (regEx.test(ch)) {
            return;
        }
        e.preventDefault();
    }   
}

}