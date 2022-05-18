import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SorteoSimpleComponent } from './sorteo-simple/sorteo-simple.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NumeroAleatorioComponent } from './numero-aleatorio/numero-aleatorio.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SorteoSimpleComponent,
    NumeroAleatorioComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule
  ], exports: [
    SorteoSimpleComponent,
    NumeroAleatorioComponent
  ]
})
export class SorteosModule { }
