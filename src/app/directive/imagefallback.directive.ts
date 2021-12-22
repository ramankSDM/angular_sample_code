import { Directive, ElementRef, Input } from '@angular/core';
import {CommonService} from './../shared/services/common.service'
import { environment } from '../../environments/environment';
@Directive({
  selector: '[imageFallback]'
})
export class ImagefallbackDirective {
  @Input('original') original: string;
  @Input('loadTime') loadTime: string='100';
    constructor(private el: ElementRef, private common: CommonService) {
   //   this.getImage(this.original);   
      setTimeout(() => {
        setTimeout(() => {this.getImage(this.original)},parseInt(this.loadTime, 10));
      }, parseInt(this.loadTime,10));
      
    }

    getImage(path){
      this.common.getImage(path).subscribe(
        res => {
          var reader = new FileReader();
          reader.readAsDataURL(res); 
          reader.onloadend = () => {
            this.el.nativeElement.src = reader.result;
          }
        },
        err => {          
           this.el.nativeElement.src = `${environment.frontendURL}/assets/images/no-image.png`
           
        }
      );
    }
}