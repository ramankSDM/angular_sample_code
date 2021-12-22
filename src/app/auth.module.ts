import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneMaskDirective } from './phone-mask.directive';

@NgModule({
	exports: [PhoneMaskDirective],
	declarations: [PhoneMaskDirective],
	imports: [
	CommonModule
	]
})
export class AuthModule { }
