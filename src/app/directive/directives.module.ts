import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomValidatorsDirective } from './custom-validators.directive';
import { ImagefallbackDirective } from './imagefallback.directive';


@NgModule({
    imports: [CommonModule],
    declarations: [CustomValidatorsDirective,ImagefallbackDirective],
    providers: [CustomValidatorsDirective,ImagefallbackDirective],
    exports: [CustomValidatorsDirective,ImagefallbackDirective]
  })
  export class DirectivesModule { }