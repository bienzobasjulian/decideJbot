import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SorteosService {

  constructor() { }

  getSorteosOfLocal(){

   return JSON.parse(localStorage.getItem('sorteos') || "") ;

  }
}
