import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SorteoSimpleComponent } from './sorteo-simple/sorteo-simple.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SorteoSimpleComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ], exports: [
    SorteoSimpleComponent
  ]
})
export class SorteosModule { }
