import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './home/index/index.component';
import { NumeroAleatorioComponent } from './sorteos/numero-aleatorio/numero-aleatorio.component';
import { SorteoSimpleComponent } from './sorteos/sorteo-simple/sorteo-simple.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    
  },
  {
    path: 'sorteos/SorteoSimple',
    component: SorteoSimpleComponent,
    
  },
  {
    path: 'sorteos/NumerosAleatorios',
    component: NumeroAleatorioComponent,
    
  },
  {
    path: '**',
    redirectTo: ''
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
